#include <Wire.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>

// ================= WIFI CONFIG =================
// ================= WIFI CONFIG =================
const char* ssid = "AndroidAP_4175";
const char* password = "jash46666";

// ================= BACKEND CONFIG =================
// REPLACE THIS WITH YOUR LAPTOP'S IP ADDRESS PRINTED BY THE BACKEND
String backendIP = "10.12.128.192"; 
const int backendPort = 3000;

// ================= WEB SERVER =================
WebServer server(80);

// ================= PIN DEFINITIONS =================
#define LED_PIN        25
#define BUZZER_PIN     26
#define REED_PIN       27
#define RESET_PIN      32
#define LIGHT_PIN      33
#define VOLTAGE_PIN    34
#define SDA_PIN        21
#define SCL_PIN        22
#define MPU_ADDR       0x68

// ================= SYSTEM STATE =================
bool tamper = false;
bool systemArmed = false;

unsigned long bootTime;
unsigned long lastBuzz = 0;
bool buzzState = false;

long baseMagnitude = 0;
int baseVoltage = 0;

// ================= THRESHOLDS =================
#define MOTION_THRESHOLD    5000
#define VOLTAGE_THRESHOLD   400

// ================= HTTP SENDER =================
void sendTamperAlert(String eventType, String status) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + backendIP + ":" + String(backendPort) + "/log";
    
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    String payload = "{\"event\":\"" + eventType + "\",\"status\":\"" + status + "\"}";
    
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

// ================= CHECK REMOTE RESET =================
void checkRemoteReset() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    // Ask the backend if we are allowed to reset
    // We reuse the /status endpoint or a specific check. 
    // Ideally backend should have a polling endpoint, but for simplicity:
    // We check if the backend reports "locked=false".
    String url = "http://" + backendIP + ":" + String(backendPort) + "/status"; // This endpoint requires Auth usually, but for ESP we might need a public one or simplier check.
    // WAIT: The backend requires Auth for /status. 
    // The ESP doesn't have a token. 
    // We need a public endpoint on backend for ESP to check status OR we assume simple public access for ESP.
    // Let's use a new public endpoint /esp/status on backend for this.
    
    // For now, let's assume we add /esp/status to backend which is public.
    url = "http://" + backendIP + ":" + String(backendPort) + "/esp/status";

    http.begin(url);
    int httpCode = http.GET();
    
    if (httpCode > 0) {
      String payload = http.getString();
      // Payload is JSON: {"locked":false,...}
      // Simple string check
      if (payload.indexOf("\"locked\":false") > 0) {
         Serial.println("✅ REMOTE RESET RECEIVED");
         ESP.restart();
      }
    }
    http.end();
  }
}

// ================= NON-BLOCKING LOCKDOWN =================
void lockdownMode() {
  digitalWrite(LED_PIN, HIGH);

  // Poll for reset command every 2 seconds
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 2000) {
    checkRemoteReset();
    lastCheck = millis();
  }

  if (millis() - lastBuzz > 200) {
    buzzState = !buzzState;
    digitalWrite(BUZZER_PIN, buzzState);
    lastBuzz = millis();
  }
}

// ================= WIFI RESET HANDLER =================
void handleReset() {
  server.send(200, "text/plain", "ESP32 RESETTING...");
  delay(500);
  ESP.restart();
}

// ================= HEARTBEAT =================
unsigned long lastHeartbeatTime = 0;

void sendHeartbeat() {
  if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String url = "http://" + backendIP + ":" + String(backendPort) + "/heartbeat";
      
      Serial.println("💓 Sending Heartbeat..."); 
      
      http.begin(url);
      int httpCode = http.POST(""); 
      
      if (httpCode > 0) {
        Serial.printf("💓 Heartbeat sent. Code: %d\n", httpCode);
      } else {
        Serial.printf("❌ Heartbeat Failed. Error: %s\n", http.errorToString(httpCode).c_str());
      }
      
      http.end();
  } else {
    Serial.println("⚠️ Heartbeat skipped (WiFi lost)");
  }
}

// ================= SETUP =================
void setup() {
  Serial.begin(9600);
  delay(3000);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(REED_PIN, INPUT_PULLUP);
  pinMode(RESET_PIN, INPUT_PULLUP);
  pinMode(LIGHT_PIN, INPUT);

  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  // ===== MPU INIT =====
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0x00);

  if (Wire.endTransmission() != 0) {
    Serial.println("❌ MPU NOT FOUND");
    while (1);
  }

  bootTime = millis();

  // ===== WIFI INIT =====
  Serial.println("\n\n===================================");
  Serial.println("🚀 FIRMWARE: HOTSPOT_V3_FIXED");
  Serial.println("===================================");

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  // ===== WIFI INIT =====
  Serial.print("📡 Connecting to: ");
  Serial.println(ssid);
  // WiFi.begin(ssid, password); // Use this for password protected
  if (password == NULL) {
      WiFi.begin(ssid);
  } else {
      WiFi.begin(ssid, password);
  }

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\n❌ Failed to connect.");
    Serial.print("Status Code: "); // 255=No Shield, 1=No SSID, 4=Connect Failed
    Serial.println(WiFi.status());
    // Continue anyway to let the loop run (though limited functionality)
  } else {
    Serial.println("\n✅ WIFI CONNECTED");
    Serial.print("🌐 IP: ");
    Serial.println(WiFi.localIP());
  }

  // ===== WEB ROUTE =====
  server.on("/reset", handleReset);
  server.begin();
  Serial.println("🌐 WEB SERVER STARTED");

  Serial.println("⏳ SYSTEM CALIBRATING...");
}

// ================= LOOP =================
void loop() {

  server.handleClient();   // 🔥 MUST ALWAYS RUN

  // HEARTBEAT (Every 5 seconds)
  if (millis() - lastHeartbeatTime > 5000) {
    lastHeartbeatTime = millis();
    sendHeartbeat();
  }

  // ================= LOCKDOWN =================
  if (tamper) {
    lockdownMode();
    return;
  }

  // ================= CALIBRATION =================
  if (!systemArmed) {
    if (millis() - bootTime < 5000) {
      Serial.println("Calibrating...");
      delay(500);
      return;
    }

    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x3B);
    Wire.endTransmission(false);
    Wire.requestFrom(MPU_ADDR, 6, true);

    int16_t ax = Wire.read() << 8 | Wire.read();
    int16_t ay = Wire.read() << 8 | Wire.read();
    int16_t az = Wire.read() << 8 | Wire.read();

    baseMagnitude = abs(ax) + abs(ay) + abs(az);
    baseVoltage = analogRead(VOLTAGE_PIN);

    systemArmed = true;
    Serial.println("✅ HSM ARMED");
    return;
  }

  // ================= REED SENSOR =================
  if (digitalRead(REED_PIN) == HIGH) {
    Serial.println("🚨 TAMPER: ENCLOSURE OPENED");
    sendTamperAlert("ENCLOSURE_OPENED", "LOCKED");
    tamper = true;
  }

  // ================= LIGHT SENSOR =================
  if (digitalRead(LIGHT_PIN) == LOW) {
    Serial.println("🚨 TAMPER: LIGHT INTRUSION");
    sendTamperAlert("LIGHT_INTRUSION", "LOCKED");
    tamper = true;
  }

  // ================= MPU MOTION =================
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6, true);

  int16_t ax = Wire.read() << 8 | Wire.read();
  int16_t ay = Wire.read() << 8 | Wire.read();
  int16_t az = Wire.read() << 8 | Wire.read();

  long magnitude = abs(ax) + abs(ay) + abs(az);
  long deltaM = abs(magnitude - baseMagnitude);

  if (deltaM > MOTION_THRESHOLD) {
    Serial.println("🚨 TAMPER: PHYSICAL MOVEMENT");
    sendTamperAlert("PHYSICAL_MOVEMENT", "LOCKED");
    tamper = true;
  }

  // ================= VOLTAGE =================
  int voltageRaw = analogRead(VOLTAGE_PIN);
  int deltaV = abs(voltageRaw - baseVoltage);

  if (deltaV > VOLTAGE_THRESHOLD) {
    Serial.println("🚨 TAMPER: VOLTAGE GLITCH");
    sendTamperAlert("VOLTAGE_GLITCH", "LOCKED");
    tamper = true;
  }

  // ================= STATUS =================
  Serial.print("SAFE | ADC=");
  Serial.print(voltageRaw);
  Serial.print(" | REED=");
  Serial.print(digitalRead(REED_PIN));
  Serial.print(" | LIGHT=");
  Serial.print(digitalRead(LIGHT_PIN));
  Serial.print(" | ΔM=");
  Serial.println(deltaM);

  delay(500);
}
