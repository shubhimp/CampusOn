/**
 * =========================================================================================
 *   CampusOn — Intelligent Campus Operating System (MITS Gwalior)
 *   ESP32-CAM 3D Biometric Face Recognition & Door Relay Controller
 *   Target Hardware: AI-Thinker ESP32-CAM (OV2640 2MP Camera Sensor)
 * =========================================================================================
 * 
 * Flow:
 * 1. Boots OV2640 camera with DMA/PSRAM support for high-throughput JPEG capture.
 * 2. Connects to campus Wi-Fi network.
 * 3. Takes snapshots on an interval (or motion trigger) and POSTs binary JPEG frames
 *    to CampusOn Backend: http://<SERVER_IP>:8000/api/biometrics/verify-frame?roomId=AB-204
 * 4. The backend compares against enrolled 3D angles (Left -35°, Front 0°, Right +35°).
 * 5. On {"authenticated": true}:
 *    - Fires Onboard Flash LED (GPIO 4)
 *    - Actuates Solenoid Door Lock Relay (GPIO 12/13) for 3 seconds
 *    - Logs attendance in CampusOn Real-Time Dashboard
 * =========================================================================================
 */

#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

// =================== Wi-Fi & Backend Network Settings ===================
const char* ssid = "YOUR_WIFI_SSID";             // Replace with your Wi-Fi name
const char* password = "YOUR_WIFI_PASSWORD";     // Replace with your Wi-Fi password

// IP address of the laptop / server running CampusOn Backend (Port 8000)
// Example: "http://192.168.1.100:8000/api/biometrics/verify-frame?roomId=AB-204"
const char* serverUrl = "http://192.168.1.100:8000/api/biometrics/verify-frame?roomId=AB-204";

// =================== AI-Thinker ESP32-CAM Pin Definitions ===================
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// Actuators
#define FLASH_LED_PIN      4   // Onboard high-brightness flash LED
#define RELAY_DOOR_PIN    12   // 5V Optocoupler Relay controlling 12V Solenoid Door Lock

// Biometric Polling interval (milliseconds)
const unsigned long CAPTURE_INTERVAL_MS = 2500; 
unsigned long lastCaptureTimestamp = 0;

void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer   = LEDC_TIMER_0;
  config.pin_d0       = Y2_GPIO_NUM;
  config.pin_d1       = Y3_GPIO_NUM;
  config.pin_d2       = Y4_GPIO_NUM;
  config.pin_d3       = Y5_GPIO_NUM;
  config.pin_d4       = Y6_GPIO_NUM;
  config.pin_d5       = Y7_GPIO_NUM;
  config.pin_d6       = Y8_GPIO_NUM;
  config.pin_d7       = Y9_GPIO_NUM;
  config.pin_xclk     = XCLK_GPIO_NUM;
  config.pin_pclk     = PCLK_GPIO_NUM;
  config.pin_vsync    = VSYNC_GPIO_NUM;
  config.pin_href     = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn     = PWDN_GPIO_NUM;
  config.pin_reset    = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if (psramFound()) {
    // High-resolution with PSRAM (SVGA 800x600 or VGA 640x480)
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10; // 0-63, lower means higher quality
    config.fb_count = 2;
  } else {
    // Fallback without external PSRAM
    config.frame_size = FRAMESIZE_CIF;
    config.jpeg_quality = 14;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("[ERROR] Camera initialization failed with code 0x%x\n", err);
    return;
  }
  Serial.println("[SUCCESS] OV2640 Biometric Camera Online.");
}

void unlockDoorAndIndicate(const String& studentName) {
  Serial.printf("\n[ACCESS GRANTED] Verified Student: %s\n", studentName.c_str());
  Serial.println("[ACTUATION] Solenoid Door Relay -> UNLOCKED (3.0s)");
  
  // Flash indication & unlock relay
  digitalWrite(FLASH_LED_PIN, HIGH);
  digitalWrite(RELAY_DOOR_PIN, HIGH);
  delay(3000); // Hold door open for 3 seconds
  
  // Relock
  digitalWrite(RELAY_DOOR_PIN, LOW);
  digitalWrite(FLASH_LED_PIN, LOW);
  Serial.println("[ACTUATION] Solenoid Door Relay -> RELOCKED\n");
}

void captureAndVerify() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[!] Wi-Fi disconnected. Reconnecting...");
    WiFi.reconnect();
    return;
  }

  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("[!] Frame buffer capture failed!");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "image/jpeg");
  http.setTimeout(4000); // 4 second network timeout

  Serial.printf("[HTTP POST] Sending frame (%d bytes) to backend...\n", fb->len);
  int httpCode = http.POST(fb->buf, fb->len);

  if (httpCode == 200) {
    String payload = http.getString();
    Serial.println("[BACKEND RESPONSE] " + payload);

    if (payload.indexOf("\"authenticated\":true") >= 0 || payload.indexOf("\"authenticated\": true") >= 0) {
      // Extract student name if present
      String studentName = "Authorized Student";
      int nameIdx = payload.indexOf("\"studentName\":\"");
      if (nameIdx >= 0) {
        int start = nameIdx + 15;
        int end = payload.indexOf("\"", start);
        if (end > start) {
          studentName = payload.substring(start, end);
        }
      }
      unlockDoorAndIndicate(studentName);
    } else {
      Serial.println("[-] Biometric mismatch or no face detected.");
    }
  } else {
    Serial.printf("[HTTP FAIL] Status code: %d\n", httpCode);
  }

  http.end();
  esp_camera_fb_return(fb); // Release frame buffer back to camera driver
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n==============================================");
  Serial.println("  CampusOn ESP32-CAM Biometric Attendance Edge");
  Serial.println("  Madhav Institute of Technology & Science");
  Serial.println("==============================================\n");

  pinMode(FLASH_LED_PIN, OUTPUT);
  pinMode(RELAY_DOOR_PIN, OUTPUT);
  digitalWrite(FLASH_LED_PIN, LOW);
  digitalWrite(RELAY_DOOR_PIN, LOW); // Locked by default

  setupCamera();

  // Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("[CONNECTING] Wi-Fi SSID: ");
  Serial.println(ssid);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 25) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[CONNECTED] Wi-Fi link established!");
    Serial.printf("ESP32-CAM Local IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WARNING] Wi-Fi connection timeout. Node will retry in loop.");
  }
}

void loop() {
  if (millis() - lastCaptureTimestamp >= CAPTURE_INTERVAL_MS) {
    lastCaptureTimestamp = millis();
    captureAndVerify();
  }
}
