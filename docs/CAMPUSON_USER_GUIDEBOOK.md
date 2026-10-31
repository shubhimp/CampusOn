# 📚 CampusOn System Operator & Demonstration Guidebook
### The Complete Platform Manual for Evaluators, Faculty & Students
**Madhav Institute of Technology & Science (MITS), Gwalior**  
*Department of Electrical & Computer Engineering | Centre for Internet of Things*  
**Student Developers**: Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)  
**Faculty Mentor**: Dr. Murli Manohar  
**Live Application**: [https://campusonmits.vercel.app/](https://campusonmits.vercel.app/)

---

## 1. What is CampusOn?

CampusOn is an integrated **AI & IoT-Powered Intelligent Campus Operating System (OS)**. 
Unlike fragmented college ERPs, CampusOn bridges physical infrastructure (classrooms, laboratories, environmental sensors, door locks) with academic workflows (timetables, course materials, attendance) and human stakeholders (students, faculty, parents, administrators).

---

## 2. Platform Navigation Walkthrough

### 🎓 1. Student Dashboard (Shubhi Mathur — BTEC25O1060)
* **Access**: Top-left sidebar $\rightarrow$ Click **"Student"**.
* **Key Features**:
  1. **Daily Timetable**: Click *Mon*, *Tue*, *Wed*, *Thu*, *Fri* to inspect lecture schedules, course codes, and assigned rooms.
  2. **Subject Attendance**: Real-time progress bars showing percentage against the university's 75% end-semester examination criteria.
  3. **Digital Student ID**: 
     * Features a rotating cryptographic QR code that regenerates every **30 seconds**.
     * **Demonstration Point**: Explain to evaluators: *"If a student screenshots this QR code and sends it via WhatsApp, the code expires within seconds, preventing unauthorized proxy attendance!"*
  4. **Classroom Availability Finder**: Live search of all academic blocks with status filters and one-click temporary access requests.
  5. **Indoor Campus Map**: 2D interactive floor plan of MITS Academic Block B (2nd floor) with QR waypoint pathfinding.
  6. **AI Course Notes Assistant (RAG)**:
     * Select a course (e.g. `ECE-301: Microcontrollers`).
     * Type a question: *"What are the restrictions on ADC2 pins during Wi-Fi operation?"*
     * The AI extracts the exact excerpt from faculty notes and provides a source citation!
  7. **Student Welfare & Mentorship**: Direct routing to designated faculty officers for scholarships, sports, or mental health. Personal counseling tickets are tagged as **CONFIDENTIAL** and shielded from parent view.

---

### 👨‍🏫 2. Faculty Dashboard (Dr. Murli Manohar — Centre for IoT)
* **Access**: Top-left sidebar $\rightarrow$ Click **"Faculty"**.
* **Key Features**:
  1. **Teaching Schedule**: View weekly workload adhering to the university's policy guaranteeing at least 3 free hours daily for research.
  2. **Timetable Preferences**: Faculty submit their preferred teaching slots, unavailable research hours, and lab preferences. These are fed directly into the Google OR-Tools constraint satisfaction solver.
  3. **Course Notes Manager**: Upload new PDF/document notes for automated AI RAG indexing.
  4. **Authorized Classroom Cameras**: Gated CCTV snapshot viewer into assigned labs (**AB-204** & **AB-101**) with an automatic **Audit Trail Log** recording timestamps and reasons to prevent privacy misuse.
  5. **Student Access Requests**: Review and authorize student laboratory booking requests.

---

### 🏛️ 3. Administration Dashboard (Control Tower)
* **Access**: Top-left sidebar $\rightarrow$ Click **"Administration"**.
* **Key Features**:
  1. **Master Room Occupancy Matrix**: Real-time operational status table of all classrooms showing live PIR motion, temperature, humidity, and MQ-2 gas ppm.
  2. **Google OR-Tools AI Timetable Optimizer**:
     * Click **"Execute OR-Tools Solver"**.
     * Solves university timetables mathematically using Constraint Satisfaction Programming (CSP).
     * Proves zero double-booking, max 2 consecutive periods, and 3 free faculty hours.
     * Click **"Approve & Publish Timetable"** to push to all student portals.
  3. **Environmental Safety Command**: Live hazard alert feed with an interactive **"Test Emergency Siren / Buzzer"** button.
  4. **Campus Analytics**: Modern Recharts visualizing hourly classroom occupancy curves and department attendance comparisons.

---

### 👨‍👩‍👧 4. Parent Portal (Mr. R. K. Mathur)
* **Access**: Top-left sidebar $\rightarrow$ Click **"Parent Portal"**.
* **Key Features**:
  1. Verified student attendance percentages per subject.
  2. Academic marks and previous SGPA (8.74 / 10).
  3. Fee ledger confirming 3rd semester tuition receipt.
  4. Official administrative announcements.
  5. **Student Privacy Shield**: Private counseling conversations, medical inquiries, and student grievance tickets are completely hidden from parents.

---

### ⚡ 5. Virtual IoT Hardware Node Simulator
* **Access**: Click the amber **"Virtual IoT ESP32"** button in the sidebar.
* **Key Features**:
  1. Allows 100% functional demonstration without physical wires.
  2. Slide the **Ultrasonic Distance** or toggle **PIR Motion** to watch the operational state switch between *Available*, *Occupied – Open Use*, and *Class in Session*.
  3. Click **"Trigger Smoke Condition"** to simulate an MQ-2 fire alarm.
  4. Click **"Valid Card"** under RFID to simulate an ID scan and trigger the **Electronic Demo Lock**!

---

## 3. Top 10 Viva Questions & Model Answers

### Q1: What makes CampusOn different from standard ERPs?
> **Answer**: Standard college ERPs are merely static database forms. CampusOn is an *operating system* that integrates physical infrastructure (IoT sensors, smart door locks, cameras) with academic management (OR-Tools scheduling, dynamic QR identity, AI RAG course tutors) into a single unified platform.

### Q2: How does the AI Timetable Generator work?
> **Answer**: It uses **Google OR-Tools CP-SAT (Constraint Programming - Satisfiability)**. Scheduling is treated as a mathematical constraint satisfaction problem where hard rules (no room double-booking, no faculty overlap, lab room requirements) must be satisfied simultaneously with soft preferences (preferred hours, minimizing student gaps).

### Q3: Why is the Digital Student ID QR code dynamic?
> **Answer**: Static QR codes can be screenshotted and shared on WhatsApp to mark fake proxy attendance. CampusOn's QR code rotates every 30 seconds with a time-limited cryptographic hash verified by the backend. Once expired, a screenshot is completely useless.

### Q4: How does CampusOn classify classroom occupancy into 4 states?
> **Answer**: By combining timetable schedule data with real-time sensor telemetry:
> 1. **Class in Session – Unavailable**: Scheduled lecture is active in the timetable.
> 2. **Occupied – Open Use**: No scheduled class, but PIR or ultrasonic sensors detect human presence (students studying/doing projects).
> 3. **Available**: No scheduled class and sensors detect an empty room.
> 4. **Status Unknown**: Sensor node is offline or readings are stale.

### Q5: What is RAG in the AI Course Notes module?
> **Answer**: RAG stands for **Retrieval-Augmented Generation**. Instead of letting an AI hallucinate answers, faculty-uploaded documents are indexed into text chunks. When a student asks a question, the system retrieves only the relevant course paragraphs, passes them to Gemini AI, and answers with the exact source citation.

### Q6: How does CampusOn protect student privacy regarding counseling?
> **Answer**: The system uses **Row-Level Security (RLS)** in PostgreSQL. Support tickets tagged as *Confidential* (mental health, sensitive grievances) are isolated. Parents and general staff cannot query or view them—only designated, qualified counseling officers hold decryption access.

### Q7: Why can't ADC2 pins on the ESP32 be used for the gas sensor?
> **Answer**: On the ESP32, ADC2 pins (GPIO 0, 2, 4, 12-15, 25-27) share internal hardware with the Wi-Fi driver. When Wi-Fi is active, analog reads on ADC2 fail. Therefore, our circuit connects the MQ-2 analog output to ADC1 (GPIO 34), which operates continuously without Wi-Fi conflicts.

### Q8: Why did you use a voltage divider for the HC-SR04 ultrasonic sensor?
> **Answer**: The HC-SR04 operates at 5V, so its Echo output is 5V logic. ESP32 GPIO pins tolerate a maximum of 3.6V. We use a 1kΩ and 2kΩ resistor voltage divider to step the 5V signal down to 3.33V, protecting the microcontroller from overvoltage damage.

### Q9: What happens if internet connectivity fails on campus?
> **Answer**: The ESP32 edge nodes feature local autonomous failsafes. If Wi-Fi drops, the node continues local LED indication, buzzer alarming, and RFID access logging on internal flash memory, syncing back to the cloud as soon as connectivity resumes.

### Q10: How was this project validated?
> **Answer**: Validated across 4 milestones at the Centre for Internet of Things, MITS Gwalior, including architectural design (Milestones 1 & 2), circuit schematic design (Milestone 3), and physical cardboard classroom prototype testing with live sensor telemetry (Milestone 4).
