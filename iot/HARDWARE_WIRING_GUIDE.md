# CampusOn Hardware Wiring & Assembly Guide
### Madhav Institute of Technology & Science, Gwalior
**Department of Electrical & Computer Engineering (Centre for IoT)**  
**Authors**: Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)  
**Mentor**: Dr. Murli Manohar

---

## ⚠️ Important Safety Rules Before You Begin
1. **Never wire components while the ESP32 is plugged into USB!** Always unplug the USB cable first before making or changing any wire connections.
2. **ESP32 is a 3.3V logic device**:
   * Connecting 5V directly into an ESP32 GPIO pin can permanently damage the pin.
   * Power pins: The ESP32 has a `3.3V` pin (regulated output) and a `VIN` / `5V` pin (power from USB).
   * The **RFID-RC522 reader MUST be connected to 3.3V only** (connecting it to 5V will burn the RFID chip).

---

## 📌 Master Pin-to-Pin Connection Table

| Hardware Component | Component Pin | Connects to ESP32 Pin | Wire / Note |
| :--- | :--- | :--- | :--- |
| **Power Rails** | **Breadboard (+) Red Rail** | **ESP32 VIN (5V)** | Provides 5V for sensors |
| | **Breadboard (-) Blue Rail** | **ESP32 GND** | Common Ground for all parts |
| **1. PIR Motion Sensor** | VCC | **5V (VIN)** | |
| | GND | **GND** | |
| | OUT / DATA | **GPIO 27** | Digital motion signal |
| **2. HC-SR04 Ultrasonic** | VCC | **5V (VIN)** | |
| | GND | **GND** | |
| | TRIG | **GPIO 12** | Trigger pulse output |
| | ECHO | **GPIO 14** *(via Resistor Divider)* | 1kΩ & 2kΩ resistors to make 3.3V safe |
| **3. MQ-2 Gas / Smoke** | VCC | **5V (VIN)** | |
| | GND | **GND** | |
| | AO (Analog Out) | **GPIO 34** | Uses ADC1 channel |
| | DO (Digital Out) | **GPIO 35** | (Optional digital trigger) |
| **4. DHT22 / DHT11 Temp** | VCC | **3.3V** | |
| | GND | **GND** | |
| | DATA | **GPIO 15** | Digital 1-wire data |
| **5. RFID-RC522 Reader** | 3.3V | **3.3V ONLY** | ⚠️ DO NOT CONNECT TO 5V |
| | GND | **GND** | |
| | RST | **GPIO 4** | Reset pin |
| | SDA (SS) | **GPIO 5** | SPI Chip Select |
| | SCK | **GPIO 18** | SPI Clock |
| | MISO | **GPIO 19** | SPI Master In |
| | MOSI | **GPIO 23** | SPI Master Out |
| **6. Status LEDs** | Green LED (+) | **GPIO 21** (via 220Ω resistor) | Room Available indicator |
| | Yellow LED (+) | **GPIO 13** (via 220Ω resistor) | Room Occupied indicator |
| | Red LED (+) | **GPIO 2** (via 220Ω resistor) | Safety / Hazard Alert |
| | All LEDs (-) Short Leg | **GND Rail** | Connected to common ground |
| **7. Piezo Buzzer** | Positive (+) Long Leg | **GPIO 26** | Alarm output |
| | Negative (-) Short Leg | **GND Rail** | |
| **8. Optional 16x2 I2C LCD** | VCC | **5V (VIN)** | |
| | GND | **GND** | |
| | SDA | **GPIO 21** (or designated I2C) | |
| | SCL | **GPIO 22** | |

---

## ⚡ How the HC-SR04 Voltage Divider Works (Echo Pin Protection)
1. The HC-SR04 Echo pin outputs **5 Volts**.
2. ESP32 pins only tolerate up to **3.3 Volts**.
3. **The simple solution**:
   * Connect Echo pin to a **1kΩ resistor**.
   * Connect the other leg of the 1kΩ resistor to **GPIO 14** AND to a **2kΩ resistor**.
   * Connect the other leg of the 2kΩ resistor to **GND**.
   * Voltage at GPIO 14 = $5\text{V} \times \frac{2\text{k}\Omega}{1\text{k}\Omega + 2\text{k}\Omega} = 3.33\text{V}$ (100% Safe!).

---

## 💻 Step-by-Step: How to Upload Code to ESP32

### Step 1: Install Arduino IDE (if not installed)
1. Download the free **Arduino IDE 2.x** from [arduino.cc/en/software](https://www.arduino.cc/en/software).
2. Install it on your computer.

### Step 2: Add ESP32 Board Support
1. In Arduino IDE, click **File** -> **Preferences**.
2. In the field *"Additional Boards Manager URLs"*, paste this URL:  
   `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
3. Click **OK**.
4. Go to **Tools** -> **Board** -> **Boards Manager**.
5. Search for **`esp32`** by Espressif Systems and click **Install**.

### Step 3: Install Required Arduino Libraries
In Arduino IDE, click **Tools** -> **Manage Libraries...** (or press Ctrl+Shift+I):
Search and install these 4 libraries:
1. **`MFRC522`** (by GithubCommunity) — For RFID reading.
2. **`DHT sensor library`** (by Adafruit) — For temperature and humidity.
3. **`Adafruit Unified Sensor`** — Required by DHT library.
4. **`LiquidCrystal I2C`** (by Frank de Brabander) — For the LCD screen.

### Step 4: Open Our CampusOn Code
1. In Arduino IDE, click **File** -> **Open**.
2. Open the file:  
   `c:\Users\admin\Downloads\Shubhi Project\iot\esp32_classroom_node\esp32_classroom_node.ino`

### Step 5: Configure Your Wi-Fi & PC IP Address
Inside the sketch (around lines 30-33), look for:
```cpp
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";
const char* BACKEND_API_URL = "http://192.168.1.100:8000/api/iot/telemetry";
```
1. Enter your Wi-Fi name and password.
2. Replace `192.168.1.100` with your laptop's local IP address (you can find it by opening Command Prompt and typing `ipconfig`).

### Step 6: Connect ESP32 and Upload!
1. Plug the ESP32 into your computer using a micro-USB cable.
2. In Arduino IDE, select **Tools** -> **Board** -> **ESP32 Dev Module**.
3. In **Tools** -> **Port**, select your COM port (e.g. `COM3` or `COM4`).
4. Click the **Upload Arrow (➡️)** button!
5. Open **Tools** -> **Serial Monitor** (set baud rate to **115200**).
6. You will see:
   ```
   CampusOn ESP32 Classroom Node Starting...
   Wi-Fi Connected!
   [TELEMETRY] Transmitting: {"temperature":24.5, "pirMotion":true...}
   ```
7. Look at your **CampusOn Dashboard** in your browser — the live sensor data from your physical breadboard will update automatically!
