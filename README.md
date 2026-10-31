# CampusOn — An AI & IoT-Powered Intelligent Campus Operating System

> **Developed for Madhav Institute of Technology & Science (MITS), Gwalior**  
> *Department of Electrical & Computer Engineering | Centre for Internet of Things*  
> **Student Developers**: Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)  
> **Faculty Mentor**: Dr. Murli Manohar  
> **Live Web Application**: [https://campusonmits.vercel.app/](https://campusonmits.vercel.app/)

---

## 🏛️ Project Overview

**CampusOn** is a unified, intelligent campus operating system designed to eliminate fragmented college management systems. It connects:
1. **Students** (Timetable, Dynamic Anti-Screenshot QR ID, AI Course Notes, Support Routing, Indoor Navigation)
2. **Faculty** (Workload management, Timetable preference submission, Course notes repository, Authorized CCTV classroom check)
3. **Administration** (Master Control Tower, Google OR-Tools timetable generator, Live IoT occupancy matrix, Environmental hazard center, Analytics)
4. **Parents** (Verified attendance, academic marks, fee ledger, institutional announcements with student counseling privacy protection)
5. **Physical Infrastructure** (ESP32-based smart classroom edge nodes with PIR, Ultrasonic, DHT22, MQ-2 Gas, and RFID RC522).

---

## 🚀 How to Run the Prototype

Both the Frontend and Backend are already running in your workspace!

### 1. View the Application in Your Browser
* Open your browser and navigate to:  
  👉 **`http://127.0.0.1:5173/`**
* You will see the **CampusOn OS** with the custom **Light Peach Sidebar (`#fdf3ed`)**, **Maroon Accent (`#8b1e3f`)**, and **Hexagonal Status Cards**.

### 2. View Backend API & Swagger Documentation
* Open:  
  👉 **`http://127.0.0.1:8000/docs`** (Interactive FastAPI documentation)

---

## 🎯 How to Demonstrate the 4 Dashboards & IoT

1. **Role Switcher (Sidebar Top)**:
   * Click **Student**: Explore Shubhi Mathur's timetable, click **Digital Student ID** to see the 30-second rotating anti-screenshot QR code, try the **AI Course Notes (RAG)** tab to ask questions about ESP32 pinouts with citations, or view the **Indoor Campus Navigation** floor plan.
   * Click **Faculty**: View Dr. Murli Manohar's schedule, submit timetable preferences for OR-Tools, upload course notes, or view authorized classroom camera feeds with audit logging.
   * Click **Administration**: View the master classroom matrix, test the **AI Timetable Optimizer (Google OR-Tools)** button to resolve conflicts with zero clashes, and view real-time analytics charts.
   * Click **Parent Portal**: View verified attendance and marks, while private counseling and grievance records remain securely shielded.

2. **Virtual IoT Hardware Simulator**:
   * Click **Virtual IoT ESP32** in the sidebar.
   * Toggle **PIR Motion**, slide the **Ultrasonic Distance** slider, or toggle **Smoke Condition**.
   * Notice how the room immediately switches between:
     * `Class in Session – Unavailable`
     * `Occupied – Open Use`
     * `Available`
     * `Status Unknown`
   * Click **Valid Card** to simulate an RFID badge tap, unlocking the electronic demo lock.
   * Switch back to the **Student** or **Admin** dashboard to see the live updates reflected in real time!

---

## 🔌 Hardware Circuit & Pinout Reference (ESP32 Node)

The Arduino firmware sketch is available at `iot/esp32_classroom_node/esp32_classroom_node.ino`.

| Component | Pin on ESP32 | Description |
| :--- | :--- | :--- |
| **PIR Motion Sensor** | **GPIO 27** | Detects human movement |
| **HC-SR04 Ultrasonic** | **Trig: GPIO 12, Echo: GPIO 14** | Measures distance (use 1k/2k voltage divider on Echo) |
| **MQ-2 Gas / Smoke** | **AO: GPIO 34, DO: GPIO 35** | Analog smoke/gas level (ADC1 channel) |
| **DHT22 Temp & Humidity** | **DATA: GPIO 15** | Ambient classroom climate monitoring |
| **RFID-RC522 (VSPI)** | **SDA: 5, SCK: 18, MOSI: 23, MISO: 19, RST: 4** | Student identity & access badge tap |
| **Status LEDs** | **Red: GPIO 2, Yellow: GPIO 13, Green: GPIO 21** | Visual occupancy & safety indicators |
| **Buzzer** | **GPIO 26** | Audio alarm on gas or emergency alert |
| **I2C LCD Display** | **SDA: GPIO 21, SCL: GPIO 22** | Local status display (0x27 address) |
