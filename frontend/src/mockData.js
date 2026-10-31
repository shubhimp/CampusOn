// CampusOn Mock Data Store - MITS Gwalior Edition
// Department of Electrical & Computer Engineering

export const INITIAL_USER = {
  id: 'usr_student_01',
  role: 'student', // 'student' | 'faculty' | 'admin' | 'parent'
  name: 'Shubhi Mathur',
  enrollmentNo: 'BTEC25O1060',
  department: 'Electrical & Computer Engineering',
  semester: '3rd Semester',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'shubhi.btec25o1060@mitsgwalior.in',
  rfidTag: 'RFID-9A-4F-2C-11',
  parentName: 'R. K. Mathur',
  parentContact: '+91 98260 12345',
};

export const USERS = {
  student: {
    id: 'usr_student_01',
    role: 'student',
    name: 'Shubhi Mathur',
    enrollmentNo: 'BTEC25O1060',
    department: 'Electrical & Computer Engineering',
    semester: '3rd Semester',
    email: 'shubhi.btec25o1060@mitsgwalior.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rfidTag: 'RFID-9A-4F-2C-11'
  },
  faculty: {
    id: 'usr_faculty_01',
    role: 'faculty',
    name: 'Dr. Murli Manohar',
    designation: 'Associate Professor & IoT Mentor',
    department: 'Electrical & Computer Engineering',
    email: 'murli.manohar@mitsgwalior.in',
    cabin: 'Faculty Block B - Cabin 208',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedResponsibility: 'Centre for Internet of Things Coordinator'
  },
  admin: {
    id: 'usr_admin_01',
    role: 'admin',
    name: 'Dean of Academic & Campus Infrastructure',
    department: 'Central Administration',
    email: 'dean.infra@mitsgwalior.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    accessLevel: 'Super Administrator'
  },
  parent: {
    id: 'usr_parent_01',
    role: 'parent',
    name: 'Mr. R. K. Mathur',
    linkedStudent: 'Shubhi Mathur (BTEC25O1060)',
    relationship: 'Father',
    email: 'rkmathur.gwalior@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_CLASSROOMS = [
  {
    id: 'AB-204',
    name: 'IoT & Embedded Systems Laboratory',
    building: 'Academic Block B',
    floor: '2nd Floor',
    capacity: 45,
    type: 'Laboratory',
    hasCamera: true,
    cameraStreamUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    status: 'Occupied – Open Use', // 'Class in Session – Unavailable' | 'Occupied – Open Use' | 'Available' | 'Status Unknown'
    currentCourse: null,
    temperature: 24.2,
    humidity: 48,
    gasLevel: 42, // ppm
    pirDetected: true,
    ultrasonicDistance: 135, // cm
    rfidLastScan: 'Shubhi Mathur (10:14 AM)',
    demoLockState: 'Locked'
  },
  {
    id: 'AB-101',
    name: 'Smart Lecture Hall 1',
    building: 'Academic Block A',
    floor: '1st Floor',
    capacity: 65,
    type: 'Smart Classroom',
    hasCamera: true,
    cameraStreamUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    status: 'Class in Session – Unavailable',
    currentCourse: 'ECE-301: Microcontrollers & Interfacing',
    faculty: 'Dr. Murli Manohar',
    temperature: 23.0,
    humidity: 50,
    gasLevel: 38,
    pirDetected: true,
    ultrasonicDistance: 80,
    rfidLastScan: 'Faculty In-Charge (09:00 AM)',
    demoLockState: 'Unlocked'
  },
  {
    id: 'AB-102',
    name: 'ECE Seminar Hall',
    building: 'Academic Block A',
    floor: '1st Floor',
    capacity: 120,
    type: 'Auditorium / Seminar',
    hasCamera: true,
    cameraStreamUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    status: 'Available',
    currentCourse: null,
    temperature: 25.1,
    humidity: 45,
    gasLevel: 35,
    pirDetected: false,
    ultrasonicDistance: 380,
    rfidLastScan: 'None (Cleaned at 08:00 AM)',
    demoLockState: 'Locked'
  },
  {
    id: 'AB-205',
    name: 'Computer Networks & Simulation Lab',
    building: 'Academic Block B',
    floor: '2nd Floor',
    capacity: 40,
    type: 'Laboratory',
    hasCamera: false,
    status: 'Available',
    currentCourse: null,
    temperature: 23.8,
    humidity: 47,
    gasLevel: 40,
    pirDetected: false,
    ultrasonicDistance: 400,
    rfidLastScan: 'Lab Assistant (08:30 AM)',
    demoLockState: 'Locked'
  },
  {
    id: 'AB-301',
    name: 'Digital Signal Processing Research Suite',
    building: 'Academic Block B',
    floor: '3rd Floor',
    capacity: 35,
    type: 'Specialized Lab',
    hasCamera: true,
    cameraStreamUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    status: 'Status Unknown',
    currentCourse: null,
    temperature: null,
    humidity: null,
    gasLevel: null,
    pirDetected: false,
    ultrasonicDistance: null,
    rfidLastScan: 'Node Offline',
    demoLockState: 'Failsafe Locked'
  }
];

export const INITIAL_TIMETABLE = [
  { id: 1, day: 'Monday', time: '09:00 AM - 10:00 AM', course: 'ECE-301: Microcontrollers', room: 'AB-101', faculty: 'Dr. Murli Manohar', type: 'Lecture', attendance: 'Present' },
  { id: 2, day: 'Monday', time: '10:00 AM - 11:00 AM', course: 'ECE-303: Signals & Systems', room: 'AB-101', faculty: 'Prof. A. Saxena', type: 'Lecture', attendance: 'Present' },
  { id: 3, day: 'Monday', time: '11:15 AM - 01:15 PM', course: 'ECE-305P: IoT & Embedded Lab', room: 'AB-204', faculty: 'Dr. Murli Manohar', type: 'Practical', attendance: 'Present' },
  { id: 4, day: 'Monday', time: '02:00 PM - 03:00 PM', course: 'ECE-307: Electronic Devices', room: 'AB-102', faculty: 'Dr. R. Verma', type: 'Lecture', attendance: 'Upcoming' },
  
  { id: 5, day: 'Tuesday', time: '09:00 AM - 10:00 AM', course: 'ECE-303: Signals & Systems', room: 'AB-101', faculty: 'Prof. A. Saxena', type: 'Lecture', attendance: 'Scheduled' },
  { id: 6, day: 'Tuesday', time: '10:00 AM - 11:00 AM', course: 'ECE-301: Microcontrollers', room: 'AB-101', faculty: 'Dr. Murli Manohar', type: 'Lecture', attendance: 'Scheduled' },
  { id: 7, day: 'Tuesday', time: '11:15 AM - 01:15 PM', course: 'CS-309P: Data Structures Lab', room: 'AB-205', faculty: 'Prof. N. Sharma', type: 'Practical', attendance: 'Scheduled' },

  { id: 8, day: 'Wednesday', time: '09:00 AM - 11:00 AM', course: 'ECE-305P: Smart Campus Project', room: 'AB-204', faculty: 'Dr. Murli Manohar', type: 'Project Work', attendance: 'Scheduled' },
  { id: 9, day: 'Wednesday', time: '11:30 AM - 12:30 PM', course: 'ECE-307: Electronic Devices', room: 'AB-101', faculty: 'Dr. R. Verma', type: 'Lecture', attendance: 'Scheduled' },
  
  { id: 10, day: 'Thursday', time: '10:00 AM - 11:00 AM', course: 'ECE-301: Microcontrollers', room: 'AB-101', faculty: 'Dr. Murli Manohar', type: 'Lecture', attendance: 'Scheduled' },
  { id: 11, day: 'Thursday', time: '11:15 AM - 01:15 PM', course: 'ECE-311: Digital Electronics Lab', room: 'AB-204', faculty: 'Dr. Murli Manohar', type: 'Practical', attendance: 'Scheduled' },

  { id: 12, day: 'Friday', time: '09:00 AM - 10:00 AM', course: 'ECE-303: Signals & Systems', room: 'AB-101', faculty: 'Prof. A. Saxena', type: 'Lecture', attendance: 'Scheduled' },
  { id: 13, day: 'Friday', time: '10:00 AM - 11:00 AM', course: 'ECE-307: Electronic Devices', room: 'AB-102', faculty: 'Dr. R. Verma', type: 'Lecture', attendance: 'Scheduled' },
  { id: 14, day: 'Friday', time: '02:00 PM - 04:00 PM', course: 'ECE-399: IoT Prototyping Workshop', room: 'AB-204', faculty: 'Dr. Murli Manohar', type: 'Workshop', attendance: 'Scheduled' }
];

export const SUBJECTS_ATTENDANCE = [
  { code: 'ECE-301', name: 'Microcontrollers & Embedded Systems', faculty: 'Dr. Murli Manohar', attended: 26, total: 28, percentage: 92.8, color: '#8b1e3f' },
  { code: 'ECE-303', name: 'Signals and Systems', faculty: 'Prof. A. Saxena', attended: 22, total: 27, percentage: 81.4, color: '#f97316' },
  { code: 'ECE-305P', name: 'IoT Systems & Hardware Lab', faculty: 'Dr. Murli Manohar', attended: 14, total: 14, percentage: 100.0, color: '#10b981' },
  { code: 'ECE-307', name: 'Electronic Devices & Circuits', faculty: 'Dr. R. Verma', attended: 21, total: 26, percentage: 80.7, color: '#6366f1' },
  { code: 'CS-309P', name: 'Data Structures & Algorithms Lab', faculty: 'Prof. N. Sharma', attended: 13, total: 15, percentage: 86.6, color: '#ec4899' }
];

export const COURSE_NOTES = [
  {
    id: 'note-01',
    courseCode: 'ECE-301',
    courseName: 'Microcontrollers & Embedded Systems',
    unit: 'Unit 3: ESP32 Architecture & FreeRTOS',
    title: 'ESP32 Dual-Core Architecture, GPIO Mappings and FreeRTOS Queues',
    faculty: 'Dr. Murli Manohar',
    uploadDate: '24 Oct 2026',
    fileSize: '3.4 MB',
    summary: 'Covers ESP32 Xtensa LX6 dual-core processor, pin multiplexing, ADC2 WiFi conflict precautions, and task scheduling using FreeRTOS primitives.',
    content: `ESP32 Architecture Overview:
1. Dual-Core Xtensa 32-bit LX6 microprocessor with clock speed up to 240 MHz.
2. Built-in 802.11 b/g/n Wi-Fi and Bluetooth v4.2 BR/EDR and BLE.
3. Memory: 520 KB SRAM, 448 KB ROM, and external SPI Flash (typically 4MB).
4. Pin Constraints: ADC2 pins (GPIO 0, 2, 4, 12-15, 25-27) cannot be read while Wi-Fi driver is active. Use ADC1 (GPIO 32-39) for continuous analog reads such as MQ-2 gas sensor.
5. SPI Communication for RFID RC522: Default VSPI pins are MOSI: GPIO 23, MISO: GPIO 19, SCK: GPIO 18, and CS/SDA: GPIO 5.`
  },
  {
    id: 'note-02',
    courseCode: 'ECE-305P',
    courseName: 'IoT Systems & Hardware Lab',
    unit: 'Unit 2: Sensor Interfacing & Signal Conditioning',
    title: 'PIR, HC-SR04 Ultrasonic & MQ-2 Gas Sensor Signal Processing',
    faculty: 'Dr. Murli Manohar',
    uploadDate: '20 Oct 2026',
    fileSize: '4.8 MB',
    summary: 'Detailed circuit schematics, 5V to 3.3V voltage divider calculation for HC-SR04 Echo pin, and calibration of MQ-2 smoke/gas threshold.',
    content: `Sensor Interfacing Guidelines for Campus Node:
1. HC-SR04 Ultrasonic: Operates at 5V VCC. The ECHO pulse returns 5V logic. ESP32 GPIOs tolerate maximum 3.6V. A voltage divider consisting of 1kΩ and 2kΩ resistors drops 5V to 3.33V safe level on GPIO 14.
2. PIR Motion Sensor (HC-SR501): Connect OUT pin to GPIO 27. Set jumper to repetitive trigger (H) with 3-second hold delay.
3. MQ-2 Gas/Smoke Sensor: Requires 24-48 hours preheating for stable baseline readings. Digital DO connected to GPIO 35, Analog AO connected to GPIO 34.`
  },
  {
    id: 'note-03',
    courseCode: 'ECE-303',
    courseName: 'Signals and Systems',
    unit: 'Unit 1: Continuous and Discrete Time Signals',
    title: 'Fourier Transform, Convolution and LTI System Responses',
    faculty: 'Prof. A. Saxena',
    uploadDate: '15 Oct 2026',
    fileSize: '5.1 MB',
    summary: 'Mathematical formulations for continuous Fourier transform, impulse response integration, and discrete convolution sums.',
    content: `LTI Systems and Convolution:
1. An LTI system is completely characterized by its unit impulse response h(t).
2. The response y(t) of any continuous LTI system to input x(t) is given by convolution integral: y(t) = integral(x(tau) * h(t - tau) dtau).
3. In discrete systems, y[n] = sum(x[k] * h[n - k]).`
  }
];

export const SUPPORT_CATEGORIES = [
  { id: 'scholarship', title: 'Scholarships & Financial Aid', officer: 'Prof. V. Agrawal', email: 'scholarships@mitsgwalior.in', confidential: false, description: 'State post-matric, merit scholarships, fee concessions.' },
  { id: 'sports', title: 'Sports & Extracurricular Activities', officer: 'Dr. Sunil Jain (Sports Officer)', email: 'sports@mitsgwalior.in', confidential: false, description: 'Inter-college tournaments, sports attendance leaves, gymnasium access.' },
  { id: 'mental_health', title: 'Counseling & Mental Well-being', officer: 'Dr. P. Sharma (Designated Counselor)', email: 'welfare@mitsgwalior.in', confidential: true, description: 'Strictly confidential emotional support, academic stress, personal difficulties. (AI provides guidance only, not medical treatment).' },
  { id: 'grievance', title: 'Student Grievance Redressal Cell', officer: 'Dean of Student Welfare', email: 'grievance@mitsgwalior.in', confidential: true, description: 'Hostel concerns, harassment, grading discrepancies, administrative assistance.' },
  { id: 'placement', title: 'Career Guidance & Placements', officer: 'Training & Placement Cell', email: 'tnp@mitsgwalior.in', confidential: false, description: 'Internship approvals, campus drive preparation, resume reviews.' }
];

export const RECENT_SAFETY_ALERTS = [
  { id: 'alt-01', room: 'AB-204', type: 'Environmental Warning', message: 'Temperature reached 31.5°C in Server Rack corner', time: '12 mins ago', severity: 'warning', resolved: false },
  { id: 'alt-02', room: 'AB-301', type: 'Device Heartbeat Offline', message: 'ESP32 Node 301 failed 3 consecutive telemetry pings', time: '45 mins ago', severity: 'info', resolved: false },
  { id: 'alt-03', room: 'AB-101', type: 'Occupancy Mismatch', message: 'Scheduled class ended but PIR still senses high motion', time: '1 hr ago', severity: 'info', resolved: true }
];

export const ACCESS_REQUESTS = [
  { id: 'req-01', studentName: 'Shubhi Mathur', enrollment: 'BTEC25O1060', room: 'AB-204', reason: 'Smart Campus IoT Milestone 4 Prototype Testing', date: '30 Oct 2026', timeSlot: '03:00 PM - 05:00 PM', status: 'Approved', pin: '8492' },
  { id: 'req-02', studentName: 'Tamanna Sharma', enrollment: 'BTEC25O1063', room: 'AB-204', reason: 'Circuit Soldering and Breadboard Assembly', date: '30 Oct 2026', timeSlot: '03:00 PM - 05:00 PM', status: 'Approved', pin: '8492' },
  { id: 'req-03', studentName: 'Rahul Verma', enrollment: 'BTEC25O1045', room: 'AB-205', reason: 'Network Packet Sniffing Practice', date: '31 Oct 2026', timeSlot: '04:00 PM - 06:00 PM', status: 'Pending Review', pin: null }
];
