#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

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

// api URL
const char *serverURL = "http://192.168.2.3:8085";

// Set server port
WiFiServer server(80);

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

// Start Wi-Fi and HTTP server
String startHttp()
{
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  server.begin();
  return WiFi.localIP().toString();
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
  String ip = startHttp();
  setLed(READY);
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop()
{
  WiFiClient client = server.available();
  if (client)
  {
    currentTime = millis();
    previousTime = currentTime;
    String header = "";
    String currentLine = "";

    while (client.connected() && currentTime - previousTime <= timeoutTime)
    {
      if (client.available())
      {
        char c = client.read();
        header += c;

        if (c == '\n')
        {
          if (currentLine.length() == 0)
          {
            // the test type is received as a parameter in the URL for example http://192.168.128.5/?test=footing
            String testType = header.substring(header.indexOf("test=") + 5, header.indexOf("HTTP") - 1);
            if (testType == "footing" || testType == "heeling") {
              Serial.println(testType);
              client.println("HTTP/1.1 200 OK");
              client.println("Content-type:application/json");
              client.println("Connection: close");
              client.println();

              // Read and send MPU data
              JsonDocument doc;
              doc["type"] = testType;
              JsonArray data = doc["data"].to<JsonArray>();
              long time = millis();
              while (millis() - time < measurementTime)
              {
                data.add(readMpu());
                delay(100);
              }

              sendJSON(doc);
            }
            else
            {
              client.println("HTTP/1.1 400 Bad Request");
            }
            break;
          }
          else
          {
            currentLine = "";
          }
        }
        else if (c != '\r')
        {
          currentLine += c;
        }
      }
    }
    client.stop();
    setLed(READY);
  }
}
