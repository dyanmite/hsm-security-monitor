#include <Wire.h>

// ================= PIN DEFINITIONS =================
#define VOLTAGE_PIN    34
#define SDA_PIN        21
#define SCL_PIN        22
#define MPU_ADDR       0x68

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  while (!Serial);
  
  // ===== MPU INIT =====
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0x00);
  if (Wire.endTransmission() != 0) {
    Serial.println("Error: MPU not found");
    while (1);
  }

  // Header for CSV
  Serial.println("ax,ay,az,voltage");
}

// ================= LOOP =================
void loop() {
  // 1. Read MPU
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6, true);

  int16_t ax = Wire.read() << 8 | Wire.read();
  int16_t ay = Wire.read() << 8 | Wire.read();
  int16_t az = Wire.read() << 8 | Wire.read();

  // 2. Read Voltage
  int voltageRaw = analogRead(VOLTAGE_PIN);

  // 3. Print CSV
  Serial.print(ax);
  Serial.print(",");
  Serial.print(ay);
  Serial.print(",");
  Serial.print(az);
  Serial.print(",");
  Serial.println(voltageRaw);

  // 4. Sample Rate (50Hz = 20ms)
  delay(20); 
}
