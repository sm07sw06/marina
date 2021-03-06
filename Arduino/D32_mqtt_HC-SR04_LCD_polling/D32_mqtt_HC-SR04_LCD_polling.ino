#include <Time.h>
#include <TimeLib.h>

#include <WiFi.h>
#include "PubSubClient.h"
#include <LiquidCrystal_I2C.h>
#include <WiFiUdp.h>
#include <DS3231.h>

char ssid[]="A1CommAP";
char pass[]="topwifi7000";
byte server1[]={192, 168, 123, 105}; // MQTT Server IP
int status = WL_IDLE_STATUS;     // the Wifi radio's status
int port = 1883;
int LEDPin4 = 4;
int LEDPin5 = 5;

const char* ntpServer = "192, 168, 123, 105";
const long  gmtOffset_sec = 9 * 3600;
const int   daylightOffset_sec = 0;

char gMac[20];
char gIp[20];
char gTopicPub[256];
char gTopicSub[256];
String stIp = "000.000.000.000";

#define PERIOD 10 * 1000   //10초
unsigned long prev_millis;

struct tm timeinfo; 

// HC-SR04 핀 정의
#define triggerPin 13
#define echoPin 12

// I2C CLCD address 및 사양 정보 정의
#define lcdAddress 0x27
#define lcdColumns 16
#define lcdRows 2

LiquidCrystal_I2C lcd(lcdAddress, lcdColumns, lcdRows);
RTClib myRTC;

// 거리 데이터 저장 mm, inch 단위
double distanceMm;
double distanceInch;

// CLCD 에 출력할 문자열 변수
String mm;
String inch;

char sCurrentTime[18]; 

WiFiClient client;
WiFiUDP ntpUDP;

void msgReceived(char *topic, byte *payload, unsigned int uLen){
    char sMsg[uLen+1];
    char sTopicDevice[30];
    char sDevice[20][2];
    char* sDevices = strtok(topic,"/");
    int i;
    int k = 0;

//    Serial.println("Queue into ....");
    Serial.print("topic:");  Serial.println(topic);
    for(i=0;i<uLen;i++){
        sMsg[i]=payload[i];
    }
    sMsg[i]='\0';
    sprintf(sTopicDevice , "%-s/%s", "COMMAND", gMac);
    Serial.print("sTopicDevice:");    Serial.println(sTopicDevice);

    while(sDevices!=NULL){
        strcpy(sDevice[k] , sDevices);
        sDevices = strtok(NULL,"/");
    k++;
    }

    Serial.print("sDevice:");    Serial.println(sDevice[1]);
    Serial.print("sMsg:");    Serial.println(sMsg);
    lcd.setCursor(0, 1);   // set the cursor to column 0, line 1
    lcd.print("                "); //Display a intro message
    lcd.setCursor(0, 1);   // set the cursor to column 0, line 1
    lcd.print(sDevice[1]); //Display a intro message
    lcd.print("->"); //Display a intro message
    lcd.print(sMsg[0]); //Display a ammonia in ppm

    if (strcmp("60CA47C40A24",sDevice[1])==0){
        Serial.println("In process1");
        if(sMsg[0]=='1'){
            digitalWrite(LEDPin4, HIGH);
        }else {
            digitalWrite(LEDPin4, LOW);
        }
    }
    if (strcmp("10812E286F24",sDevice[1])==0){
        Serial.println("In process2");
        if(sMsg[0]=='1'){
            digitalWrite(LEDPin5, HIGH);
        }else {
            digitalWrite(LEDPin5, LOW);
        }
    }
    if (strcmp("2462ABBA5A2C",sDevice[1])==0){
        Serial.println("In process3");
        if(sMsg[0]=='1'){
            digitalWrite(LEDPin5, HIGH);
        }else {
            digitalWrite(LEDPin5, LOW);
        }
    }
}

PubSubClient mqttClient(server1, port, msgReceived, client);

void printWifiStatus() {
    // print the SSID of the network you're attached to
    Serial.print("SSID: ");    Serial.println(WiFi.SSID());

    // print your WiFi shield's IP address
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");    Serial.println(ip);
    stIp = toStringIp(ip);
    stIp.toCharArray(gIp, stIp.length()+1);

    byte mac[6]={0,0,0,0,0,0};
    WiFi.macAddress(mac);
    sprintf(gMac, "%02X%02X%02X%02X%02X%02X", mac[5], mac[4], mac[3], mac[2], mac[1], mac[0]);
    Serial.print("MAC address: ");    Serial.println(gMac);
    sprintf(gTopicPub, "%-s", "common" );
    Serial.print("gTopicPub: ");    Serial.println(gTopicPub);
    sprintf(gTopicSub, "%-s/#", "COMMAND");
    Serial.print("gTopicSub: ");    Serial.println(gTopicSub);
    Serial.print("delay sec: ");    Serial.println(PERIOD/1000);
}

String toStringIp(IPAddress ip) {
    // 32비트 ip 주소를 스트링으로 변환하는 함수
    String res = "";
    for (int i = 0; i < 3; i++) {
        res += String((ip >> (8 * i)) & 0xFF) + ".";
    }
    res += String(((ip >> 8 * 3)) & 0xFF);
    return res;
}

void checkWifiStatus() {
    // attempt to connect to WiFi network
    while ( WiFi.status() != WL_CONNECTED) {
        Serial.print("Attempting to connect to WPA SSID: ");    Serial.println(ssid);
        // Connect to WPA/WPA2 network
        status = WiFi.begin(ssid, pass);
        delay(50);
    }
}

void mqttReconnect() {
  // Loop until we're reconnected
  while (!mqttClient.connected()) {
    Serial.println("Attempting MQTT connection...");
    // Attempt to connect
    if (mqttClient.connect(gMac)) {
      Serial.println("MQTT Broker ReConnected!");
      mqttClient.subscribe(gTopicSub);
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 1 seconds");
      // Wait 1 seconds before retrying
      delay(1000);
    }
    delay(50);
  }
}

void connectWiFi(){
    Serial.println("Connecting Wifi....");
    int i = 0;
    while (WiFi.status() != WL_CONNECTED){
        Serial.print("Attempting to connect to WPA SSID: ");
        Serial.println(ssid);
        WiFi.begin(ssid, pass);
        delay(500);
    }
    // Display a notification that the connection is successful.
    Serial.println("");
    Serial.println("Connected");
    printWifiStatus();
    //Serial.println(WiFi.localIP());
}

void setup() {
    pinMode(LEDPin4, OUTPUT);
    pinMode(LEDPin5, OUTPUT);

    pinMode(triggerPin, OUTPUT);
    pinMode(echoPin, INPUT);

    Serial.begin(115200);
    delay(10);

    lcd.begin(); //We are using a 16*2 LCD display
    lcd.backlight();
    lcd.print("MQTT for Marina"); //Display a intro message
    lcd.setCursor(0, 1);   // set the cursor to column 0, line 1
    lcd.print("starting....."); //Display a intro message
    delay(3000);
    lcd.clear(); //Then clean it

    Serial.println();
    Serial.print("Connecting to ~ ");
    Serial.println(ssid);
    connectWiFi();

    // Serial1.begin(9600, SERIAL_8N1, 17, 16);

    //MQTT Server 접속
    mqttClient.setServer(server1, 1883);
    //  if(mqttClient.connect("Arduino")){
    if(mqttClient.connect(gMac)){
        Serial.println("MQTT Broker Connected!");
        mqttClient.subscribe(gTopicSub); //led 구독자를 등록(데이터를 읽어갈 구독자 등록)
    }

    prev_millis = millis();

       // 표준시와 한국시간이 -9시간 차이
//   configTime(-9 * 3600, 0, "pool.ntp.org", "time.nist.gov"); 
   //configTime(9 * 3600, 0, ntpServer); 
   configTime( gmtOffset_sec, daylightOffset_sec, ntpServer); 
  
   
}

void printLocalTime() { 
  if(!getLocalTime(&timeinfo)){ 
    Serial.println("Failed to obtain time"); 
    return; 
  } 
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S"); 
}


String getRtcTime() {

    int h = myRTC.now().hour();
    int m = myRTC.now().minute();
    int s = myRTC.now().second();
    int d = myRTC.now().day();
    int mo = myRTC.now().month();
    int yr = myRTC.now().year();
    
    // make a String for printing:
    String dateTime = "";
    if (yr < 10) dateTime += "0";
    dateTime += yr;
    if (mo < 10) dateTime += "0";
    dateTime += mo;
    if (d < 10) dateTime += "0";
    dateTime += d;

    if (h < 10) dateTime += "0";
    dateTime += h;
    if (m < 10) dateTime += "0";
    dateTime += m;
    if (s < 10) dateTime += "0";
    dateTime += s;

    return dateTime;
}

void loop() {

    // In each loop, make sure there is an Internet connection.
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
    }

    mqttReconnect();

    mqttClient.loop();

    // HC-SR04 거리 측정
    ///////////////getDistance();
    // 측정한 거리 CLCD 출력
   // printDistanceLCD();

  //  Serial.println("dtostrf");
    char message[1024]="", pDistBuf[16];
    dtostrf(distanceMm , 5,2, pDistBuf);
    
    //Serial.println(sCurrentTime);
    if( ( millis() - prev_millis ) > PERIOD ) {
        printLocalTime();
//    getRtcTime().toCharArray(sCurrentTime, getRtcTime().length()+1);  // RTC 
        strftime(sCurrentTime, sizeof(sCurrentTime), "%Y%m%d%H%M%S", &timeinfo);  //NTP
        sprintf(message, "{\"boatData\":\"%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\"}",sCurrentTime,"Cordinatior",gMac,"0000,100B,XBEE3,Highest",gMac,"aduino_0",gMac,"4B3A,100B,424C,04,R", sCurrentTime, "23,13,04,04,$GPGGA,074615.00,101,,51,,0,00,99.99,,,,,,*67,");
        mqttClient.publish(gTopicPub, message);
        Serial.print("push.......");
        Serial.println(message);
        prev_millis = millis();
    }

    lcd.setCursor(0, 0);   // set the cursor to column 0, line 1
    lcd.print("                "); //Display a ammonia in ppm
    lcd.setCursor(0, 0);   // set the cursor to column 0, line 1
    lcd.print(gMac); //Display a ammonia in ppm
    lcd.setCursor(0, 1);   // set the cursor to column 0, line 1
    lcd.print("                "); //Display a ammonia in ppm
    lcd.setCursor(0, 1);   // set the cursor to column 0, line 1
    lcd.print(sCurrentTime); //Display a ammonia in ppm
    
}

void getDistance(){
    again:
        // goto
        static int count;

        // Tigger High 지속 시간 10us
        digitalWrite(triggerPin, LOW);
        delayMicroseconds(2);
        digitalWrite(triggerPin, HIGH);
        delayMicroseconds(10);
        digitalWrite(triggerPin, LOW);

        //echoPin High 유지 시간 측정
        double Duration = 0;
        Duration = pulseIn(echoPin, HIGH);

        distanceMm = (Duration / 10 )/ 5.8;
        distanceInch = Duration / 148;

        // 거리 측정 값이 유효하지 않을 때, 거리를 다시 측정
        if ((distanceMm > 4000) && (count < 10)){
            count++;
            goto again;
        }
        // 거리 측정 값이 유효하지 않을 때 goto문 무한 루프를 방지
        else if(count >= 10){
            distanceMm = 9999;
            distanceInch = 9999;
        }
        count = 0;
}

void printDistanceLCD(){
    // LCD Clear()를 하지 않기 위해, 공백칸 숫자 입력 변수
    // LCD Clear()를 하면 LCD 가 깜빡임..
    int mmBlank;
    int inchBlank;

    // CLCD 에 출력할 데이터를 문자열로 변경
    mm = "cm   : " + String(distanceMm);
    inch = "inch : " + String(distanceInch);

    // 문자열의 공백 저장
    mmBlank = lcdColumns - mm.length();
    inchBlank = lcdColumns - inch.length();

    //CLCD 첫번째 줄
    lcd.setCursor(0,0);
    lcd.print(mm);
    for(int i = 0 ; i < mmBlank ; i++){
        lcd.print(" ");
    }
    //CLCD 2번째 줄
    lcd.setCursor(0,1);
    lcd.print(inch);
    for(int i = 0 ; i < inchBlank ; i++){
        lcd.print(" ");
    }
}
