#include <WiFi.h>
#include "PubSubClient.h"
#include <LiquidCrystal_I2C.h>

char ssid[]="A1CommAP";
char pass[]="topwifi7000";
byte server1[]={192, 168, 123, 105}; // MQTT Server IP
int status = WL_IDLE_STATUS;     // the Wifi radio's status
int port = 1883;
int count = 0;
int totalCount = 0;
int delaytime = 10;
int LEDPin4 = 4;
int LEDPin5 = 5;

char gMac[20];
char gIp[20];
char gTopicPub[256];
char gTopicSub[256];
String stIp = "000.000.000.000";

LiquidCrystal_I2C lcd(0x27, 20, 4);
WiFiClient client;

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
  Serial.println();

  sprintf(gTopicPub, "%-s", "common" );
  sprintf(gTopicSub, "%-s/#", "COMMAND");
  Serial.print("gTopicSub: ");
  Serial.println(gTopicSub);
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

void mqttReconnect() {
  // Loop until we're reconnected
  while (!mqttClient.connected()) {
    Serial.println("Attempting MQTT connection...");
    // Attempt to connect
    if (mqttClient.connect("arduinoClient")) {
      Serial.println("connected");
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
  Serial.begin(115200);
  delay(10);

  lcd.begin(); //We are using a 16*2 LCD display
  lcd.backlight();
  lcd.print("MQTT for Marina"); //Display a intro message
  lcd.setCursor(0, 1);   // set the cursor to column 0, line 1
  lcd.print("starting....."); //Display a intro message 
  delay(100);
  lcd.clear(); //Then clean it
  
  Serial.println();
  Serial.print("Connecting to ~ ");  
  Serial.println(ssid);
  connectWiFi();

 // Serial1.begin(9600, SERIAL_8N1, 17, 16);  

  //MQTT Server 접속
  mqttClient.setServer(server1, 1883);  
  if(mqttClient.connect("Arduino")){
    Serial.println("MQTT Broker Connected!");
    mqttClient.subscribe(gTopicSub); //led 구독자를 등록(데이터를 읽어갈 구독자 등록)
  }
}

void loop() {
  // In each loop, make sure there is an Internet connection.
   if (WiFi.status() != WL_CONNECTED) { 
     connectWiFi();
   }
  mqttClient.loop();
  
    char message[1024]="", pDistBuf[1024];
//    dtostrf(distance_sum / count , 5,2, pDistBuf);
    sprintf(message, "{\"larva\":\"%s,%s,%d\"}", gMac, gIp, totalCount);   
    if( count == delaytime)  {
      mqttClient.publish(gTopicPub, message); 
      count = 0;
      Serial.print("push.......");
      Serial.println(message);
    }
    count++;
  totalCount++;    
  if ( totalCount < 0 ) totalCount = 0;

  lcd.setCursor(0, 0);   // set the cursor to column 0, line 1
  lcd.print("                "); //Display a ammonia in ppm
  lcd.setCursor(0, 0);   // set the cursor to column 0, line 1
  lcd.print(gMac); //Display a ammonia in ppm
  lcd.print(","); //Display a ammonia in ppm
  lcd.print(count); //Display a ammonia in ppm
  
  delay(500); 
}
