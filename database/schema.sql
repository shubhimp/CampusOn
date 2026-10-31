-- ====================================================================
-- CampusOn — Intelligent Campus Operating System Database Schema
-- Designed for Supabase / PostgreSQL (3NF Normal Form & RLS Security)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE USERS & ROLES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'admin', 'parent')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DEPARTMENTS & ACADEMIC STRUCTURE
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    head_of_department VARCHAR(255)
);

CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enrollment_number VARCHAR(100) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    semester VARCHAR(50) NOT NULL,
    rfid_card_uid VARCHAR(100) UNIQUE,
    current_cgpa NUMERIC(4, 2) DEFAULT 8.50
);

CREATE TABLE faculty (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(100) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation VARCHAR(150) NOT NULL,
    cabin_location VARCHAR(150),
    additional_responsibility VARCHAR(255)
);

CREATE TABLE parents (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    linked_student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL,
    emergency_contact VARCHAR(50) NOT NULL
);

-- 4. CAMPUS PHYSICAL INFRASTRUCTURE
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    total_floors INT DEFAULT 4
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INT NOT NULL,
    floor_map_svg_url TEXT
);

CREATE TABLE classrooms (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'AB-204'
    name VARCHAR(255) NOT NULL,
    floor_id UUID REFERENCES floors(id),
    capacity INT NOT NULL,
    room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('Lecture Hall', 'Smart Classroom', 'Laboratory', 'Seminar Auditorium')),
    current_status VARCHAR(50) DEFAULT 'Available' CHECK (current_status IN ('Class in Session – Unavailable', 'Occupied – Open Use', 'Available', 'Status Unknown')),
    has_camera BOOLEAN DEFAULT FALSE,
    camera_stream_url TEXT,
    demo_lock_state VARCHAR(50) DEFAULT 'Locked'
);

-- 5. COURSES & ENROLLMENTS
CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'ECE-301'
    name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    faculty_id UUID REFERENCES faculty(id),
    is_laboratory BOOLEAN DEFAULT FALSE,
    required_weekly_hours INT DEFAULT 3
);

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    attendance_percentage NUMERIC(5, 2) DEFAULT 0.00
);

-- 6. AI COURSE NOTES & RAG INDEX
CREATE TABLE course_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    unit_name VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url TEXT,
    extracted_text TEXT,
    summary TEXT,
    uploaded_by UUID REFERENCES faculty(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TIMETABLE & OR-TOOLS SCHEDULING
CREATE TABLE timetable_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
    preferred_hours VARCHAR(150),
    unavailable_slots TEXT,
    preferred_classroom_id VARCHAR(50) REFERENCES classrooms(id),
    max_consecutive_periods INT DEFAULT 2 CHECK (max_consecutive_periods <= 2),
    min_daily_free_hours INT DEFAULT 3
);

CREATE TABLE timetable_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
    period_index INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_id VARCHAR(50) REFERENCES courses(id),
    faculty_id UUID REFERENCES faculty(id),
    classroom_id VARCHAR(50) REFERENCES classrooms(id),
    is_approved_by_admin BOOLEAN DEFAULT FALSE
);

-- 8. SMART ATTENDANCE SESSIONS & AUDIT LOGS
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_entry_id UUID REFERENCES timetable_entries(id) ON DELETE CASCADE,
    active_date DATE NOT NULL,
    dynamic_qr_secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    verification_method VARCHAR(50) CHECK (verification_method IN ('Dynamic QR', 'RFID Tap', 'NFC', 'Manual Override')),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    UNIQUE(session_id, student_id)
);

-- 9. IOT HARDWARE NODES & SENSOR TELEMETRY
CREATE TABLE devices (
    id VARCHAR(100) PRIMARY KEY, -- e.g. 'ESP32-NODE-AB204'
    classroom_id VARCHAR(50) REFERENCES classrooms(id),
    mac_address VARCHAR(100) UNIQUE,
    ip_address VARCHAR(50),
    firmware_version VARCHAR(50),
    is_online BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) REFERENCES devices(id) ON DELETE CASCADE,
    temperature NUMERIC(4, 1),
    humidity NUMERIC(4, 1),
    pir_motion BOOLEAN DEFAULT FALSE,
    ultrasonic_distance_cm NUMERIC(6, 1),
    mq2_gas_ppm INT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE occupancy_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id VARCHAR(50) REFERENCES classrooms(id) ON DELETE CASCADE,
    operational_state VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SMART ROOM ACCESS & AUDIT
CREATE TABLE room_access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    classroom_id VARCHAR(50) REFERENCES classrooms(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    requested_slot VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Expired')),
    temporary_pin VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id VARCHAR(50) REFERENCES classrooms(id),
    user_id UUID REFERENCES users(id),
    access_type VARCHAR(50) CHECK (access_type IN ('RFID Unlock', 'PIN Code', 'Remote Faculty Override', 'Emergency Master')),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CAMPUS SAFETY & NOTIFICATIONS
CREATE TABLE safety_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classroom_id VARCHAR(50) REFERENCES classrooms(id),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    description TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. STUDENT WELFARE & MENTORSHIP (CONFIDENTIAL PRIVACY PROTECTION)
CREATE TABLE support_departments (
    id VARCHAR(50) PRIMARY KEY, -- 'scholarship', 'mental_health', etc.
    name VARCHAR(255) NOT NULL,
    officer_in_charge VARCHAR(255) NOT NULL,
    is_strictly_confidential BOOLEAN DEFAULT FALSE
);

CREATE TABLE faculty_responsibilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
    department_key VARCHAR(50) REFERENCES support_departments(id),
    role_description VARCHAR(255)
);

CREATE TABLE support_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    department_key VARCHAR(50) REFERENCES support_departments(id),
    concern_text TEXT NOT NULL,
    is_confidential BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Escalated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Rule: Parents CANNOT read confidential student counseling requests
CREATE POLICY parent_privacy_shield ON support_requests
    FOR SELECT
    USING (
        is_confidential = FALSE
    );

-- Rule: Students can only read their own support requests
CREATE POLICY student_own_requests ON support_requests
    FOR ALL
    USING (
        student_id = auth.uid()
    );
