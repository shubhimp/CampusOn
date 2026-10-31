# 📖 CampusOn Hardware Master Doc Book
## IoT Edge Node Implementation & Assembly Guide
**Madhav Institute of Technology & Science (MITS), Gwalior**  
*Department of Electrical & Computer Engineering | Centre for Internet of Things*  
**Authors**: Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)  
**Mentor**: Dr. Murli Manohar

---

## 1. System Overview & Working Principle

The **CampusOn Classroom Edge Node** is an intelligent embedded system mounted in each classroom/laboratory (e.g. **AB-204 IoT Lab**). 
It solves a critical campus problem: **distinguishing whether a classroom is merely empty, occupied for open study, or unavailable due to a scheduled lecture**.

```
   ┌────────────────────────────────────────────────────────┐
   │             PHYSICAL CLASSROOM SENSORS                 │
   │  [PIR Motion]  [HC-SR04 Ultrasonic]  [MQ-2 Gas/Smoke]  │
   │  [DHT22 Climate]  [RFID-RC522 ID]    [Buzzer & LEDs]   │
   └───────────────────────────┬────────────────────────────┘
                               │ GPIO / SPI / ADC
                               ▼
               ┌──────────────────────────────┐
               │    ESP32 MICROCONTROLLER     │
               │   Dual-Core 240MHz + Wi-Fi   │
               └───────────────┬──────────────┘
                               │ HTTPS / JSON Telemetry
                               ▼
               ┌──────────────────────────────┐
               │     CAMPUSON CLOUD OS        │
               │  FastAPI + React Dashboard   │
               └──────────────────────────────┘
```

---

## 2. Complete Bill of Materials (Components List)

| S.No. | Component Name | Quantity | Purpose in CampusOn |
| :---: | :--- | :---: | :--- |
| **1** | **ESP32 Dev Board (30/38 Pin)** | 1 | Central edge processor & Wi-Fi transmitter |
| **2** | **HC-SR04 Ultrasonic Sensor** | 1 | Proximity & desk occupancy measurement |
| **3** | **PIR Motion Sensor (HC-SR501)** | 1 | Infrared detection of human movement |
| **4** | **MQ-2 Smoke/Gas Sensor** | 1 | Fire, LPG, and volatile gas hazard detection |
| **5** | **DHT22 / DHT11 Sensor** | 1 | Ambient temperature and humidity monitoring |
| **6** | **RFID-RC522 Reader + Tags** | 1 | Digital ID badge scanning & attendance check-in |
| **7** | **Active Piezo Buzzer** | 1 | Local audio alarm for hazardous conditions |
| **8** | **5mm LEDs (Red, Yellow, Green)**| 3 | Visual occupancy & emergency state indicators |
| **9** | **220Ω Resistors** | 3 | Current limiting for LEDs |
| **10**| **1kΩ & 2kΩ Resistors** | 1 each | 5V to 3.3V voltage divider for Ultrasonic Echo pin |
| **11**| **Full-size Solderless Breadboard**| 1 | Component mounting & wiring |
| **12**| **Male-to-Male & Male-to-Female Wires**| ~25 | Circuit connections |
| **13**| **Micro-USB Data Cable** | 1 | Power supply and code flashing from PC |

---

## 3. Master Wiring & Pin Connection Table

> [!CAUTION]
> **CRITICAL VOLTAGE RULE**:
> * **RFID-RC522 MUST be connected to 3.3V only!** Connecting it to 5V will burn the chip.
> * Always disconnect the USB cable before altering any breadboard wires.

| Component | Pin Label | Connects To | Signal Type / Function |
| :--- | :--- | :--- | :--- |
| **Power Rails** | **Breadboard Red (+)** | **ESP32 VIN (5V)** | 5V Power bus for sensors |
| | **Breadboard Blue (-)**| **ESP32 GND** | Common Ground bus |
| **PIR Sensor** | VCC | Breadboard 5V (+) | Power |
| | GND | Breadboard GND (-) | Ground |
| | OUT | **GPIO 27** | Digital Input (HIGH = Motion) |
| **HC-SR04** | VCC | Breadboard 5V (+) | 5V Power |
| | GND | Breadboard GND (-) | Ground |
| | TRIG | **GPIO 12** | 10µs trigger pulse output |
| | ECHO | **GPIO 14** *(via 1k/2k Divider)*| Safe 3.3V pulse duration input |
| **MQ-2 Gas** | VCC | Breadboard 5V (+) | 5V Power (Internal heater) |
| | GND | Breadboard GND (-) | Ground |
| | AO (Analog) | **GPIO 34** | ADC1 Channel (Read analog gas ppm) |
| **DHT22** | VCC | **ESP32 3.3V Pin** | Power |
| | GND | Breadboard GND (-) | Ground |
| | DATA | **GPIO 15** | Single-wire digital data |
| **RFID-RC522** | **3.3V** | **ESP32 3.3V Pin ONLY** | ⚠️ Never connect to 5V! |
| | GND | Breadboard GND (-) | Ground |
| | RST | **GPIO 4** | Reset |
| | SDA (SS) | **GPIO 5** | SPI Chip Select |
| | SCK | **GPIO 18** | SPI Clock |
| | MISO | **GPIO 19** | SPI Master In / Slave Out |
| | MOSI | **GPIO 23** | SPI Master Out / Slave In |
| **Status LEDs** | Green LED (+) | **GPIO 21** (via 220Ω resistor) | "Room Available" indicator |
| | Yellow LED (+) | **GPIO 13** (via 220Ω resistor) | "Room Occupied" indicator |
| | Red LED (+) | **GPIO 2** (via 220Ω resistor) | "Hazard Alert" indicator |
| | All LEDs (-) | Breadboard GND (-) | Common ground |
| **Buzzer** | Positive (+) | **GPIO 26** | Alarm output |
| | Negative (-) | Breadboard GND (-) | Common ground |

---

## 4. Software Setup & Code Flashing Guide

The Arduino sketch is located at:  
📂 [`iot/esp32_classroom_node/esp32_classroom_node.ino`](file:///c:/Users/admin/Downloads/Shubhi%20Project/iot/esp32_classroom_node/esp32_classroom_node.ino)

### Step 1: Install Arduino IDE & Libraries
1. Download Arduino IDE 2.x from [arduino.cc/en/software](https://www.arduino.cc/en/software).
2. Go to **Tools** $\rightarrow$ **Manage Libraries...** and install:
   * **`MFRC522`** by GithubCommunity
   * **`DHT sensor library`** by Adafruit
   * **`Adafruit Unified Sensor`** by Adafruit
   * **`LiquidCrystal I2C`** by Frank de Brabander

### Step 2: Configure Wi-Fi Credentials
Open `esp32_classroom_node.ino` and update lines 30-33:
```cpp
const char* WIFI_SSID = "YOUR_WIFI_OR_HOTSPOT_NAME";
const char* WIFI_PASS = "YOUR_PASSWORD";

// Your laptop's local IP address (or cloud backend URL):
const char* BACKEND_API_URL = "http://10.86.214.31:8000/api/iot/telemetry";
```

### Step 3: Flash the ESP32
1. Plug your ESP32 into your laptop with a micro-USB data cable.
2. Under **Tools** $\rightarrow$ **Board**, choose **ESP32 Dev Module**.
3. Under **Tools** $\rightarrow$ **Port**, choose the corresponding COM port (e.g. `COM3`).
4. Click the **Upload (➡️)** button.
5. Once uploaded, open **Tools** $\rightarrow$ **Serial Monitor** (set baud rate to **115200**).

---

## 5. Live Demonstration & Viva Script (For Your Professors)

When showing the hardware model to **Dr. Murli Manohar** or your project evaluators:

1. **Step 1: The Idle State (Available)**
   * Place the model on the desk with no one touching it.
   * Point out the **Green LED** is ON.
   * Explain: *"The ESP32 reads ultrasonic distance > 200cm and PIR motion is LOW. Since no lecture is scheduled right now, the system classifies the room as **Available** for open student study."*

2. **Step 2: Human Presence (Occupied – Open Use)**
   * Wave your hand in front of the PIR sensor or hold a notebook 50cm in front of the Ultrasonic sensor.
   * The **Yellow LED** turns ON.
   * Show the web dashboard: *"Notice how the room instantly transitions to **Occupied – Open Use**, signaling to students that project work is ongoing."*

3. **Step 3: RFID Smart Attendance & Door Access**
   * Tap your RFID card on the RC522 reader.
   * The buzzer gives a short confirmation beep (`chirp`) and the green LED blinks.
   * Point to the dashboard: *"Shubhi Mathur's attendance is verified and logged without paper registers."*

4. **Step 4: Safety & Hazard Alarm**
   * Use an unlit lighter (or press the simulator smoke button) near the MQ-2 sensor.
   * The **Red LED** turns ON and the **Buzzer sounds continuous alarm**.
   * Show the admin dashboard: *"An instant environmental warning is raised in the central control room with approximate occupancy estimates for immediate evacuation."*
