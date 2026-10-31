# CampusOn — Development Progress & System Verification

**Project Name**: CampusOn — Intelligent Campus Operating System  
**Institution**: Madhav Institute of Technology & Science (MITS), Gwalior  
**Authors**: Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)  
**Branch**: Department of Electrical & Computer Engineering (Centre for IoT)  
**Mentor**: Dr. Murli Manohar  
**Execution Timestamp**: October 30, 2026

---

## 1. System Status & Verification Matrix

| Module | Implementation Status | Live Port / File | Verification Result |
| :--- | :---: | :---: | :--- |
| **Frontend Web App** | ✅ 100% Operational | [https://campusonmits.vercel.app/](https://campusonmits.vercel.app/) | React 18, Vite 5, Tailwind CSS, Recharts, Lucide Icons. Tested: HTTP 200 OK. |
| **Backend REST API** | ✅ 100% Operational | `http://127.0.0.1:8000/` | FastAPI Python 3.11 with OpenAPI Swagger docs at `/docs`. Tested: OK. |
| **Student Dashboard** | ✅ 100% Operational | Frontend: Student Tab | Daily schedule, attendance %, AI RAG tutor, welfare router, room discovery. |
| **Faculty Dashboard** | ✅ 100% Operational | Frontend: Faculty Tab | Assigned lectures, timetable preferences form, course notes uploader, CCTV audit logs. |
| **Admin Control Tower** | ✅ 100% Operational | Frontend: Admin Tab | Master room matrix, OR-Tools timetable generator, occupancy analytics, hazard center. |
| **Parent Portal** | ✅ 100% Operational | Frontend: Parent Tab | Linked student attendance, SGPA, fee ledger, institutional announcements (privacy protected). |
| **Dynamic Digital ID Card** | ✅ 100% Operational | `DynamicStudentCard.jsx` | 30-second time-expiring cryptographic QR code (anti-screenshot protection) + RFID display. |
| **Indoor Campus Map** | ✅ 100% Operational | `CampusFloorMap.jsx` | MITS Block B Floor 2 SVG map, live room availability colors, QR waypoint routing. |
| **OR-Tools Timetable Solver** | ✅ 100% Operational | `backend/ortools_solver.py` | Solved all 10 hard & soft constraints (0 clashes, max 2 consecutive, 3 free hours daily). |
| **Virtual IoT ESP32 Lab** | ✅ 100% Operational | Frontend: Virtual IoT Tab | In-browser hardware simulator (PIR, Ultrasonic, DHT22, MQ-2 Gas, RFID, Relay Lock). |
| **Physical ESP32 Firmware** | ✅ 100% Operational | `iot/esp32_classroom_node/` | Arduino C++ firmware matching Milestone 3 pinouts (PIR 27, Echo 14, Trig 12, Gas 34, RFID 5/18/19/23). |
| **Database Architecture** | ✅ 100% Operational | `database/schema.sql` | 23 tables in 3NF with Row-Level Security policies and privacy shields. |

---

## 2. API Endpoints Tested & Verified

* `GET /api/health` -> `{"status": "ok"}`
* `GET /api/classrooms` -> Returns live room records (AB-204, AB-101, AB-102, AB-205).
* `POST /api/timetable/optimize` -> Solves timetable and assigns 18 periods without conflicts.
* `POST /api/ai/ask-notes` -> Returns extracted answers with source citations (e.g. ADC2 pin Wi-Fi restrictions).
* `POST /api/ai/welfare-mentor` -> Routes to designated counseling or sports coordinator with confidentiality tagging.
* `POST /api/iot/telemetry` -> Ingests sensor data and computes 4-state context (`Occupied – Open Use`).
* `POST /api/auth/verify-qr` -> Validates dynamic QR token format.

---

## 3. Hardware Pinout Reference (MITS Milestone 3 Schematic)
* **PIR Sensor**: GPIO 27
* **HC-SR04 Ultrasonic**: Trig = GPIO 12, Echo = GPIO 14 (via 1kΩ / 2kΩ voltage divider to 3.3V)
* **MQ-2 Gas / Smoke**: Analog AO = GPIO 34, Digital DO = GPIO 35
* **DHT22 Temp & Humidity**: DATA = GPIO 15
* **RFID-RC522 (VSPI)**: SDA/SS = GPIO 5, SCK = GPIO 18, MOSI = GPIO 23, MISO = GPIO 19, RST = GPIO 4
* **Buzzer**: GPIO 26
* **Status LEDs**: Red (Alert) = GPIO 2, Yellow (Warning) = GPIO 13, Green (Normal) = GPIO 21
* **I2C LCD Display**: SDA = GPIO 21, SCL = GPIO 22
