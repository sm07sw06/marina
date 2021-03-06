#include <DS3231.h>
#include <SPI.h>
#include <Wire.h>
#include <WiFiNINA.h>
#include <LiquidCrystal_I2C.h>
#include "PubSubClient.h"

char ssid[]="A1CommAP";
char pass[]="topwifi7000";
byte server1[]={192, 168, 123, 166}; // MQTT Server IP
int status = WL_IDLE_STATUS;     // the Wifi radio's status
int port = 1883;
int LEDPin4 = 4;
int LEDPin5 = 5;

char gMac[20];
char gIp[20];
char gTopicPub[256];
char gTopicSub[256];
String stIp = "000.000.000.000";

#define PERIOD 5 * 1000   //5초
unsigned long prev_millis;

char  sCurrentTime[18] = {0} ;

LiquidCrystal_I2C lcd(0x27, 20, 4);
WiFiClient client;

RTClib myRTC;

void msgReceived(char *topic, byte *payload, unsigned int uLen){
    char sMsg[uLen+1];
    char sTopicDevice[30];
    char sDevice[20][2];
    char* sDevices = strtok(topic,"/");
    int i;
    int k = 0;

    Serial.println("Queue into ....");
    Serial.print("topic:");
    Serial.println(topic);
    for(i=0;i<uLen;i++){
        sMsg[i]=payload[i];
    }
    sMsg[i]='\0';
    sprintf(sTopicDevice , "%-s/%s", "COMMAND", gMac);
    Serial.print("sTopicDevice:");
    Serial.println(sTopicDevice);

    while(sDevices!=NULL){
        strcpy(sDevice[k] , sDevices);
        sDevices = strtok(NULL,"/");
        k++;
    }

    Serial.print("sDevice:");
    Serial.println(sDevice[1]);
    Serial.print("sMsg:");
    Serial.println(sMsg);

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
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your WiFi shield's IP address
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);
    stIp = toStringIp(ip);
    stIp.toCharArray(gIp, stIp.length()+1);

    byte mac[6]={0,0,0,0,0,0};
    WiFi.macAddress(mac);
    sprintf(gMac, "%02X%02X%02X%02X%02X%02X", mac[5], mac[4], mac[3], mac[2], mac[1], mac[0]);
    Serial.print("MAC address: ");
    Serial.println(gMac);

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
        Serial.print("Attempting to connect to WPA SSID: ");
        Serial.println(ssid);
        // Connect to WPA/WPA2 network
        status = WiFi.begin(ssid, pass);
        delay(50);
    }
}

void connectWiFi(){
    Serial.println("Connecting Wifi....");
    int i = 0;

    // check for the WiFi module:
    if (WiFi.status() == WL_NO_MODULE) {
        Serial.println("Communication with WiFi module failed!");
        // don't continue
        while (true);
    }

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

void setup() {
    pinMode(LEDPin4, OUTPUT);
    pinMode(LEDPin5, OUTPUT);
    Serial.begin(115200);
    delay(10);
    Wire.begin();
    
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

    //MQTT Server 접속
    mqttClient.setServer(server1, 1883);
    //  if(mqttClient.connect("Arduino")){
    if(mqttClient.connect(gMac)){
        Serial.println("MQTT Broker Connected!");
        mqttClient.subscribe(gTopicSub); //led 구독자를 등록(데이터를 읽어갈 구독자 등록)
    }

    prev_millis = millis();

    getRtcTime3231().toCharArray(sCurrentTime, getRtcTime3231().length()+1);
    Serial.print("DS3231-time:");
    Serial.println(sCurrentTime);

}

String getRtcTime3231() {

 // Serial.println("getRtcTime3231 starting ~ ");
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

    char message[1024]="", pDistBuf[1024];
    getRtcTime3231().toCharArray(sCurrentTime, getRtcTime3231().length()+1);
    //sprintf(message, "{\"anchorData\":\"%s,%d,%d,%s,%s\"}", gMac, 20, 10, 22, sCurrentTime);

    if( ( millis() - prev_millis ) > PERIOD ) {
        sprintf(message, "{\"lidarData\":\"%s,1,20,100,200,10,10,0,0,%s,20,0,20,0,1,1,1,1\"}", gMac, sCurrentTime);
/**      
        sprintf(message, "{\"rssiData\":\"%s0,%s,device1,11111,10812E286F24,%s,20\"}", gMac, sCurrentTime, sCurrentTime);
        mqttClient.publish(gTopicPub, message);
        Serial.println(message);
        sprintf(message, "{\"rssiData\":\"%s1,%s,device2,11111,10812E286F24,%s,20\"}", gMac, sCurrentTime, sCurrentTime);
        mqttClient.publish(gTopicPub, message);
        Serial.println(message);
        sprintf(message, "{\"rssiData\":\"%s2,%s,device3,11111,10812E286F24,%s,20\"}", gMac, sCurrentTime, sCurrentTime);
        **/
        mqttClient.publish(gTopicPub, message);
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
