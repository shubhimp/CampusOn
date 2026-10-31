/*
 * CampusOn — Intelligent Campus Operating System
 * ESP32 Classroom Edge Node Firmware
 * 
 * Developed for: Madhav Institute of Technology & Science, Gwalior
 * Department of Electrical & Computer Engineering (Centre for IoT)
 * Authors: Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)
 * Faculty Mentor: Dr. Murli Manohar
 *
 * Hardware Pinout Mapping (Based on Milestone 3 Circuit Schematic):
 * - PIR Motion Sensor (HC-SR501): OUT -> GPIO 27
 * - Ultrasonic Sensor (HC-SR04): TRIG -> GPIO 12, ECHO -> GPIO 14 (3.3V voltage divider)
 * - MQ-2 Gas/Smoke Sensor: AO -> GPIO 34 (ADC1), DO -> GPIO 35
 * - DHT22 / DHT11 Temp & Humidity: DATA -> GPIO 15
 * - RFID RC522 (VSPI): SDA(SS) -> GPIO 5, SCK -> GPIO 18, MOSI -> GPIO 23, MISO -> GPIO 19, RST -> GPIO 4
 * - Buzzer: GPIO 26
 * - Status LEDs: RED -> GPIO 2, YELLOW -> GPIO 13, GREEN -> GPIO 21
 * - I2C LCD Display (0x27): SDA -> GPIO 21 (or shared), SCL -> GPIO 22
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// --- Network Configuration ---
// Connect your ESP32 to your phone hotspot or Wi-Fi router
const char* WIFI_SSID = "YOUR_WIFI_OR_HOTSPOT_NAME";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// Your laptop's exact local IP address on this network:
const char* BACKEND_API_URL = "http://10.86.214.31:8000/api/iot/telemetry";

// --- Pin Definitions ---
#define PIR_PIN          27
#define TRIG_PIN         12
#define ECHO_PIN         14
#define MQ2_ANALOG_PIN   34
#define MQ2_DIGITAL_PIN  35
#define DHT_PIN          15
#define DHT_TYPE         DHT22
#define BUZZER_PIN       26

#define LED_RED_ALERT    2
#define LED_YELLOW_WARN  13
#define LED_GREEN_NORM   21

#define RFID_SS_PIN      5
#define RFID_RST_PIN     4

// --- Peripheral Instances ---
DHT dht(DHT_PIN, DHT_TYPE);
MFRC522 rfid(RFID_SS_PIN, RFID_RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- Device Metadata ---
const char* DEVICE_ID = "ESP32-NODE-AB204";
const char* ROOM_ID = "AB-204";

// --- Thresholds ---
const int GAS_HAZARD_THRESHOLD = 180; // ppm equivalent
const int ULTRASONIC_OCCUPIED_DISTANCE_CM = 150;

unsigned long lastTelemetryMillis = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 5000; // 5 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println(F("\n=============================================="));
  Serial.println(F("CampusOn ESP32 Classroom Node Starting..."));
  Serial.println(F("MITS Gwalior - Centre for Internet of Things"));
  Serial.println(F("=============================================="));

  // 1. Initialize GPIOs
  pinMode(PIR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(MQ2_ANALOG_PIN, INPUT);
  pinMode(MQ2_DIGITAL_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED_ALERT, OUTPUT);
  pinMode(LED_YELLOW_WARN, OUTPUT);
  pinMode(LED_GREEN_NORM, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  setLeds(true, false, false); // Red during boot

  // 2. Initialize DHT & RFID
  dht.begin();
  SPI.begin();
  rfid.PCD_Init();

  // 3. Initialize I2C LCD Display
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("CampusOn Node");
  lcd.setCursor(0, 1);
  lcd.print("Room: AB-204");

  // 4. Connect to Wi-Fi
  connectWiFi();
  setLeds(false, false, true); // Green when online
}

void loop() {
  // A. Check RFID Access Card Tap
  checkRfidScan();

  // B. Periodic Sensor Readings & Cloud Sync
  if (millis() - lastTelemetryMillis >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryMillis = millis();
    readAndTransmitTelemetry();
  }
}

void connectWiFi() {
  Serial.print(F("Connecting to Wi-Fi SSID: "));
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 10) {
    delay(500);
    Serial.print(F("."));
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(F("\n[SUCCESS] Wi-Fi Connected!"));
    Serial.print(F("IP Address: "));
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(F("\n[WARNING] Offline Demonstration Mode Enabled."));
  }
}

// Measure Distance using HC-SR04
long readUltrasonicDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  if (duration == 0) return 400; // max range / no echo
  return duration * 0.034 / 2;
}

// Read Sensors & Send JSON Telemetry
void readAndTransmitTelemetry() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int pirMotion = digitalRead(PIR_PIN);
  int gasRaw = analogRead(MQ2_ANALOG_PIN);
  int gasPpm = map(gasRaw, 0, 4095, 20, 500);
  long distanceCm = readUltrasonicDistanceCm();

  if (isnan(temperature)) temperature = 24.5;
  if (isnan(humidity)) humidity = 48.0;

  bool isOccupied = (pirMotion == HIGH) || (distanceCm < ULTRASONIC_OCCUPIED_DISTANCE_CM);
  bool isHazard = (gasPpm > GAS_HAZARD_THRESHOLD);

  // Actuator Handling
  if (isHazard) {
    setLeds(true, false, false); // RED
    digitalWrite(BUZZER_PIN, HIGH);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("! HAZARD ALERT !");
    lcd.setCursor(0, 1);
    lcd.print("Gas: ");
    lcd.print(gasPpm);
    lcd.print(" ppm");
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    if (isOccupied) {
      setLeds(false, true, false); // YELLOW (Occupied)
      lcd.setCursor(0, 0);
      lcd.print("Room: AB-204    ");
      lcd.setCursor(0, 1);
      lcd.print("Status: OCCUPIED");
    } else {
      setLeds(false, false, true); // GREEN (Available)
      lcd.setCursor(0, 0);
      lcd.print("Room: AB-204    ");
      lcd.setCursor(0, 1);
      lcd.print("Status: FREE    ");
    }
  }

  // Build JSON Payload
  String jsonPayload = "{";
  jsonPayload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  jsonPayload += "\"roomId\":\"" + String(ROOM_ID) + "\",";
  jsonPayload += "\"temperature\":" + String(temperature, 1) + ",";
  jsonPayload += "\"humidity\":" + String(humidity, 1) + ",";
  jsonPayload += "\"pirMotion\":" + String(pirMotion == HIGH ? "true" : "false") + ",";
  jsonPayload += "\"distanceCm\":" + String(distanceCm) + ",";
  jsonPayload += "\"gasPpm\":" + String(gasPpm) + ",";
  jsonPayload += "\"isHazard\":" + String(isHazard ? "true" : "false");
  jsonPayload += "}";

  Serial.print(F("[TELEMETRY] Transmitting: "));
  Serial.println(jsonPayload);

  // Send HTTP POST if connected
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(BACKEND_API_URL);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);
    Serial.print(F("[API HTTP CODE]: "));
    Serial.println(httpResponseCode);
    http.end();
  }
}

// RFID Card Scan
void checkRfidScan() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String uidStr = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uidStr += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
    uidStr += String(rfid.uid.uidByte[i], HEX);
    if (i < rfid.uid.size - 1) uidStr += "-";
  }
  uidStr.toUpperCase();

  Serial.print(F("[RFID TAP DETECTED] UID: "));
  Serial.println(uidStr);

  // Visual/Audio Acknowledge
  digitalWrite(BUZZER_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZER_PIN, LOW);

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

void setLeds(bool red, bool yellow, bool green) {
  digitalWrite(LED_RED_ALERT, red ? HIGH : LOW);
  digitalWrite(LED_YELLOW_WARN, yellow ? HIGH : LOW);
  digitalWrite(LED_GREEN_NORM, green ? HIGH : LOW);
}
