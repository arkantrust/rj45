#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <Arduino_JSON.h>
#include <HTTPClient.h>
#include <PubSubClient.h>

// Constants
const unsigned long MEASUREMENT_TIME = 5000;
const unsigned long WIFI_TIMEOUT = 30000; // 30 seconds timeout for WiFi connection
const unsigned long MQTT_RETRY_DELAY = 5000;
const unsigned long LED_BLINK_INTERVAL = 75;
const int MEASUREMENTS_COUNT = 210;
const int LED_PIN = 16;

// Wi-Fi and MQTT configuration
const char *WIFI_SSID = "LABREDES";
const char *WIFI_PASSWORD = "F0rmul4-1";
const char *MQTT_BROKER = "broker.emqx.io";
const char *MQTT_TOPIC = "test/start";
const char *MQTT_USER = "A00395404Esp";
const int MQTT_PORT = 1883;

// Server configuration
const char *SERVER_URL = "http://192.168.130.119:8080/tests";

// Global objects
Adafruit_MPU6050 mpu;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Enum for LED states
enum State
{
  READY,
  READING,
  NOT_READY,
  ERROR
};

// Function declarations
void setLed(State state);
JSONVar readMpu();
bool connectWiFi();
void connectMQTT();
bool initializeMPU();
void sendJSON(const JSONVar &jsonDoc);
void mqttCallback(char *topic, byte *msg, unsigned int length);

void setLed(State state)
{
  static unsigned long lastBlink = 0;
  static bool ledState = false;

  switch (state)
  {
  case READY:
    digitalWrite(LED_PIN, HIGH);
    break;
  case NOT_READY:
    digitalWrite(LED_PIN, LOW);
    break;
  case READING:
    if (millis() - lastBlink >= LED_BLINK_INTERVAL)
    {
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState);
      lastBlink = millis();
    }
    break;
  case ERROR:
    // Fast blink for error state
    if (millis() - lastBlink >= LED_BLINK_INTERVAL / 2)
    {
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState);
      lastBlink = millis();
    }
    break;
  }
}

JSONVar readMpu() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  JSONVar reading;
  reading["accel"]["x"] = a.acceleration.x;
  reading["accel"]["y"] = a.acceleration.y;
  reading["accel"]["z"] = a.acceleration.z;
  reading["gyro"]["x"] = g.gyro.x;
  reading["gyro"]["y"] = g.gyro.y;
  reading["gyro"]["z"] = g.gyro.z;
  reading["timestamp"] = millis();

  return reading;
}

bool connectWiFi()
{
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startAttemptTime = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_TIMEOUT)
  {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("\nFailed to connect to WiFi");
    return false;
  }

  Serial.println("\nConnected to WiFi");
  Serial.println("IP address: " + WiFi.localIP().toString());
  return true;
}

void connectMQTT()
{
  while (!mqttClient.connected())
  {
    Serial.println("Connecting to MQTT...");

    if (mqttClient.connect(MQTT_USER))
    {
      Serial.println("Connected to MQTT broker");
      mqttClient.subscribe(MQTT_TOPIC);
    }
    else
    {
      Serial.print("Failed to connect to MQTT, rc=");
      Serial.println(mqttClient.state());
      setLed(ERROR);
      delay(MQTT_RETRY_DELAY);
    }
  }
}

bool initializeMPU()
{
  Serial.println("Initializing MPU6050...");

  if (!mpu.begin())
  {
    Serial.println("Failed to find MPU6050 chip");
    return false;
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  Serial.println("MPU6050 initialized successfully");
  return true;
}

void sendJSON(const JSONVar &jsonDoc)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Error: WiFi not connected");
    setLed(ERROR);
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  String jsonString = JSON.stringify(jsonDoc);
  Serial.println(jsonString);
  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode > 0)
  {
    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  }
  else
  {
    Serial.printf("Error sending HTTP POST: %d\n", httpResponseCode);
    setLed(ERROR);
  }

  http.end();
}

void mqttCallback(char *topic, byte *msg, unsigned int length)
{
  String testType = "";
  for (int i = 0; i < length; i++)
  {
    testType += (char)msg[i];
  }
  testType.trim();

  Serial.println("Received test request: " + testType + " from topic: " + String(topic));

  if (testType.equalsIgnoreCase("heeling") || testType.equalsIgnoreCase("footing"))
  {
    setLed(READING);

    JSONVar testData;
    testData["type"] = testType;

    for (int i = 0; i < MEASUREMENTS_COUNT; i++) {
      JSONVar reading = readMpu();
      testData["measurements"][i] = reading;
      delay(19); // 24ms delay between measurements for stability
    }

    Serial.println("Sending measurements to server...");
    sendJSON(testData);
    setLed(READY);
  }
  else
  {
    Serial.println("Invalid test type! Must be 'footing' or 'heeling'");
    setLed(ERROR);
  }
}

void setup()
{
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  setLed(NOT_READY);

  if (!initializeMPU())
  {
    setLed(ERROR);
    while (1)
      delay(100); // Halt if MPU initialization fails
  }

  if (!connectWiFi())
  {
    setLed(ERROR);
    while (1)
      delay(100); // Halt if WiFi connection fails
  }

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  setLed(READY);
}

void loop()
{
  if (!mqttClient.connected())
  {
    setLed(NOT_READY);
    connectMQTT();
    setLed(READY);
  }

  mqttClient.loop();

  // Monitor WiFi connection
  if (WiFi.status() != WL_CONNECTED)
  {
    setLed(NOT_READY);
    if (connectWiFi())
    {
      setLed(READY);
    }
  }
}