#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <PubSubClient.h>

// Enum for LED state
enum State
{
  READY,
  READING,
  NOT_READY
};

const int measurementTime = 5000;

// Wi-Fi credentials
const char *ssid = "";
const char *password = "";
const char *mqtt_broker = "ac06a2aefe134c358a51669006339d38.s1.eu.hivemq.cloud";
const char *mqtt_topic = "test/start";

// api URL
const char *serverURL = "http://192.168.2.3:8085";

// Set server port
WiFiClient espClient;
PubSubClient client(espClient);

// Timeout settings
unsigned long currentTime = millis();
unsigned long previousTime = 0;
const long timeoutTime = 60000;

const int ledPin = 16; // Move LED to pin 16

Adafruit_MPU6050 mpu;

// LED state handler
void setLed(State state)
{
  switch (state)
  {
  case READY:
    digitalWrite(ledPin, HIGH);
    break;
  case NOT_READY:
    digitalWrite(ledPin, LOW);
    break;
  case READING:
    digitalWrite(ledPin, HIGH);
    delay(75);
    digitalWrite(ledPin, LOW);
    delay(75);
    break;
  }
}

void connectMQTT(){

    while(!client.connected()){

        Serial.print("Connecting to MQTT");
        if(client.connect("ESP32Client")){

            Serial.print("Connected.");
            client.subscribe(mqtt_topic);
        }
        else{

            Serial.print("Failed: ");
            Serial.print(client.state());
            delay(5000);
        }
    }
}
void mqttCallback(char* topic, char* msg, unsigned int length){

    Serial.print("Message recieved [ ");
    Serial.print(topic);
    Serial.print(" ]");
    String testType = "";

    for(int i=0; i < length; i++){
        testType += (msg[i]);
    }

    if(testType == "footing" || testType == "heeling"){

        setLed(READING);

        JsonDocument doc;
        doc["type"] = testType;
        JsonArray data = doc["data"].to<JsonArray>();
        long time = millis();
        while(millis() - time < measurementTime){
            data.add(readMpu());
            delay(100);
        }

        sendJSON(doc);
        setLed(READY);
    }
    else{
        Serial.println("Type must be either footing or heeling!");
    }

}


void sendJSON(JsonDocument jsonDoc) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Specify the URL
    http.begin(serverURL);

    // Set the content type as JSON
    http.addHeader("Content-Type", "application/json");

    // Serialize JSON to a string
    String jsonString;
    serializeJson(jsonDoc, jsonString);

    // Send the POST request with the JSON data
    int httpResponseCode = http.POST(jsonString);

    // Check the response
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response:");
      Serial.println(response);
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(httpResponseCode);
    }

    // End the connection
    http.end();
  } else {
    Serial.println("Error: Not connected to Wi-Fi");
  }
}
*/

// Start Wi-Fi and HTTP server
String startWiFiMQTT()
{
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  client.setServer(mqtt_broker, 1883);
  client.setCallback(mqttCallback);

}

// Initialize MPU6050
void startMpu()
{
  Serial.println("Connecting to MPU6050");
  if (!mpu.begin())
  {
    Serial.println("Failed to find MPU6050 chip");
    while (true)
    {
      delay(10);
    }
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
}

// Read MPU data and return JSON
JsonDocument readMpu()
{
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  JsonDocument doc;
  doc["accel"]["x"] = a.acceleration.x;
  doc["accel"]["y"] = a.acceleration.y;
  doc["accel"]["z"] = a.acceleration.z;
  doc["gyro"]["x"] = g.gyro.x;
  doc["gyro"]["y"] = g.gyro.y;
  doc["gyro"]["z"] = g.gyro.z;

  return doc;
}

void setup()
{
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  delay(2000);
  startMpu();
  startWiFiMQTT();
  setLed(READY);

}

void loop()
{
  if(!client.connected()){

    connectMQTT();
  }
  client.loop();

}
