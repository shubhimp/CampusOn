"""
CampusOn Publication-Grade PDF Generator
Generates a complete, multi-page, styled Master Guidebook PDF
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "CampusOn — Intelligent Campus Operating System | MITS Gwalior")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "Centre for Internet of Things — Dept. of Electrical & Computer Engg.")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def create_guidebook_pdf(output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Palette
    MAROON = colors.HexColor("#8b1e3f")
    PEACH_BG = colors.HexColor("#fdf3ed")
    DARK_SLATE = colors.HexColor("#0f172a")
    MUTED_TEXT = colors.HexColor("#475569")
    BORDER_COLOR = colors.HexColor("#ebd7cc")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=MAROON,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=MUTED_TEXT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=MAROON,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=DARK_SLATE,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=DARK_SLATE,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletPoint',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=body_style,
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#831843")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=DARK_SLATE
    )

    story = []

    # --- COVER BANNER ---
    story.append(Paragraph("CampusOn: System Operator & Master Guidebook", title_style))
    story.append(Paragraph("An AI & IoT-Powered Intelligent Campus Operating System<br/><b>Madhav Institute of Technology & Science (MITS), Gwalior</b> (Centre for Internet of Things)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=MAROON, spaceAfter=12))

    # Meta Info Box
    meta_data = [
        [
            Paragraph("<b>Student Developers:</b> Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063)<br/><b>Branch:</b> B.Tech Electrical & Computer Engineering (3rd Semester)", body_style),
            Paragraph("<b>Faculty Mentor:</b> Dr. Murli Manohar<br/><b>Official Live URL:</b> https://campusonmits.vercel.app/<br/><b>Repository:</b> https://github.com/shubhimp/CampusOn", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PEACH_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # --- SECTION 1: SYSTEM OVERVIEW ---
    story.append(Paragraph("1. Executive Overview & 4-State Room Context Logic", h1_style))
    story.append(Paragraph(
        "CampusOn bridges physical infrastructure (classrooms, edge IoT sensors, smart door locks) with academic management (OR-Tools conflict-free scheduling, dynamic QR attendance, AI course notes RAG) into a unified platform. Its central innovation is combining official timetable records with live sensor telemetry to classify classroom operations into <b>4 context states</b>:",
        body_style
    ))

    states_data = [
        [Paragraph("Operational State", table_header_style), Paragraph("Sensor / Timetable Condition", table_header_style), Paragraph("System Meaning", table_header_style)],
        [Paragraph("<b>State 1: Class in Session – Unavailable</b>", table_body_style), Paragraph("Scheduled Lecture Active + Motion Detected", table_body_style), Paragraph("Official lecture in progress. Room unavailable for open student booking.", table_body_style)],
        [Paragraph("<b>State 2: Occupied – Open Use</b>", table_body_style), Paragraph("No Scheduled Class + Motion Detected (PIR / Ultrasonic)", table_body_style), Paragraph("Room is being used by students for study or project work.", table_body_style)],
        [Paragraph("<b>State 3: Available</b>", table_body_style), Paragraph("No Scheduled Class + No Motion (PIR quiet, Dist > 200cm)", table_body_style), Paragraph("Classroom is completely free. Students can request authorized smart access.", table_body_style)],
        [Paragraph("<b>State 4: Status Unknown</b>", table_body_style), Paragraph("ESP32 Edge Node Offline / Stale Readings", table_body_style), Paragraph("Sensor communication interrupted. Failsafe locks room; do not assume empty.", table_body_style)]
    ]
    states_table = Table(states_data, colWidths=[130, 184, 190])
    states_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), MAROON),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(states_table)
    story.append(Spacer(1, 12))

    # --- SECTION 2: THE FOUR DASHBOARDS ---
    story.append(Paragraph("2. Walkthrough of the Four Portals", h1_style))

    story.append(Paragraph("A. Student Dashboard (Shubhi Mathur — BTEC25O1060)", h2_style))
    story.append(Paragraph("• <b>Academic Timetable:</b> Real-time daily/weekly view with period badges and room allocations.", bullet_style))
    story.append(Paragraph("• <b>Digital Student ID:</b> Generates a rotating cryptographic QR code with a 30-second countdown bar. If screenshotted, the token expires automatically to prevent proxy attendance.", bullet_style))
    story.append(Paragraph("• <b>AI Course Notes (RAG):</b> Queries uploaded course materials with source citations (e.g. ADC2 Wi-Fi pin conflicts).", bullet_style))
    story.append(Paragraph("• <b>Indoor Campus Map:</b> Interactive 2D floor plan of MITS Block B (Floor 2) with real-time availability colors and turn-by-turn waypoint routing.", bullet_style))
    story.append(Paragraph("• <b>Student Welfare:</b> Routes requests for scholarships, sports, and counseling. Personal mental health files are tagged as <i>Strictly Confidential</i>.", bullet_style))

    story.append(Paragraph("B. Faculty Dashboard (Dr. Murli Manohar — Centre for IoT)", h2_style))
    story.append(Paragraph("• <b>Teaching Schedule:</b> Weekly assigned lectures adhering to the mandatory university policy of >= 3 free daily hours.", bullet_style))
    story.append(Paragraph("• <b>Timetable Preferences:</b> Faculty submit preferred slots and lab preferences directly to the Google OR-Tools solver.", bullet_style))
    story.append(Paragraph("• <b>Course Notes Repository:</b> Upload and publish new syllabus units for automated AI vectorization.", bullet_style))
    story.append(Paragraph("• <b>Classroom Cameras:</b> Permission-gated CCTV snapshot viewer into assigned labs (AB-204) with an automated compliance audit log.", bullet_style))

    story.append(Paragraph("C. Administration Dashboard (Control Tower)", h2_style))
    story.append(Paragraph("• <b>Master Room Matrix:</b> Real-time table of all monitored rooms with PIR motion, temperature, humidity, and MQ-2 gas ppm.", bullet_style))
    story.append(Paragraph("• <b>Google OR-Tools Timetable Optimizer:</b> Constraint Satisfaction solver enforcing zero teacher/room collisions, max 2 consecutive periods, and lab room matching.", bullet_style))
    story.append(Paragraph("• <b>Campus Safety & Sirens:</b> Incident logging with a functional emergency siren / buzzer toggle for evacuation drills.", bullet_style))
    story.append(Paragraph("• <b>Analytics:</b> Recharts visualizing hourly classroom utilization curves and departmental attendance percentages.", bullet_style))

    story.append(Paragraph("D. Parent Portal (Mr. R. K. Mathur)", h2_style))
    story.append(Paragraph("• Verified student attendance records, semester marks, fee receipts, and official circulars.", bullet_style))
    story.append(Paragraph("• <b>Student Privacy Shield:</b> Personal student counseling conversations and sensitive grievance files are isolated from parental view via database Row-Level Security (RLS).", bullet_style))
    story.append(Spacer(1, 10))

    # --- SECTION 3: HARDWARE WIRING & PINOUTS ---
    story.append(PageBreak())
    story.append(Paragraph("3. Hardware Edge Node Wiring & Pinout Guide", h1_style))
    story.append(Paragraph(
        "The classroom edge node uses an <b>ESP32 microcontroller</b> connected to breadboard sensors as defined in the MITS Milestone 3 schematic:",
        body_style
    ))

    hw_data = [
        [Paragraph("Hardware Sensor / Actuator", table_header_style), Paragraph("Component Pins", table_header_style), Paragraph("ESP32 Pin Connection", table_header_style), Paragraph("Role in System", table_header_style)],
        [Paragraph("<b>PIR Motion Sensor (HC-SR501)</b>", table_body_style), Paragraph("VCC, GND, OUT", table_body_style), Paragraph("5V, GND, <b>GPIO 27</b>", table_body_style), Paragraph("Detects infrared from human movement", table_body_style)],
        [Paragraph("<b>Ultrasonic Sensor (HC-SR04)</b>", table_body_style), Paragraph("VCC, GND, TRIG, ECHO", table_body_style), Paragraph("5V, GND, <b>GPIO 12</b> (Trig), <b>GPIO 14</b> (Echo via 1k/2k divider)", table_body_style), Paragraph("Desk proximity and occupancy distance", table_body_style)],
        [Paragraph("<b>MQ-2 Smoke & Gas Sensor</b>", table_body_style), Paragraph("VCC, GND, AO, DO", table_body_style), Paragraph("5V, GND, <b>GPIO 34</b> (ADC1 Channel)", table_body_style), Paragraph("Monitors fire, LPG, and volatile gas hazard", table_body_style)],
        [Paragraph("<b>DHT22 Temp & Humidity</b>", table_body_style), Paragraph("VCC, GND, DATA", table_body_style), Paragraph("3.3V, GND, <b>GPIO 15</b>", table_body_style), Paragraph("Ambient classroom climate measurement", table_body_style)],
        [Paragraph("<b>RFID-RC522 Card Reader</b>", table_body_style), Paragraph("3.3V, GND, RST, SDA, SCK, MISO, MOSI", table_body_style), Paragraph("<b>3.3V ONLY</b>, GND, <b>GPIO 4, 5, 18, 19, 23</b>", table_body_style), Paragraph("Student identity badge & digital attendance", table_body_style)],
        [Paragraph("<b>Status LEDs (Green, Yellow, Red)</b>", table_body_style), Paragraph("Anode (+), Cathode (-)", table_body_style), Paragraph("<b>GPIO 21, 13, 2</b> (via 220Ω) to GND", table_body_style), Paragraph("Visual state (Green=Free, Yellow=In Use, Red=Alert)", table_body_style)],
        [Paragraph("<b>Active Piezo Buzzer</b>", table_body_style), Paragraph("Positive (+), Negative (-)", table_body_style), Paragraph("<b>GPIO 26</b> to GND", table_body_style), Paragraph("Audio alarm for hazard and RFID tap chirp", table_body_style)]
    ]
    hw_table = Table(hw_data, colWidths=[130, 114, 135, 125])
    hw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), MAROON),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(hw_table)
    story.append(Spacer(1, 10))

    # Warning Box
    warn_text = [
        [Paragraph("<b>⚠️ CRITICAL VOLTAGE NOTICE FOR ASSEMBLY:</b><br/>1. <b>Never connect RFID-RC522 to 5V!</b> It is a 3.3V logic device. Connecting to 5V burns the chip.<br/>2. <b>Voltage Divider on Echo:</b> HC-SR04 outputs 5V. Use 1kΩ and 2kΩ resistors to safely drop it to 3.33V on GPIO 14.", callout_style)]
    ]
    warn_table = Table(warn_text, colWidths=[504])
    warn_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fdf2f4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f43f5e")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(warn_table)
    story.append(Spacer(1, 12))

    # --- SECTION 4: TOP 10 VIVA QUESTIONS ---
    story.append(Paragraph("4. Top 10 Viva Questions & Model Answers", h1_style))

    viva_qas = [
        ("Q1: What makes CampusOn an Operating System rather than an ERP?",
         "Standard college ERPs are passive web forms. CampusOn is an active operating system that connects edge IoT hardware (sensors, smart locks, cameras) with academic management (OR-Tools scheduling, dynamic QR attendance, AI RAG tutors) to make campus operations context-aware and automated."),
        ("Q2: What mathematical algorithm generates the timetable?",
         "We use Google OR-Tools CP-SAT (Constraint Programming - Satisfiability). Scheduling is modeled as an exact mathematical constraint satisfaction problem where hard constraints (no room or faculty clashes, lab allocation) and soft constraints (faculty preferences, minimizing gaps) are optimized simultaneously."),
        ("Q3: Why is the QR code dynamic with a 30-second expiry?",
         "Static QR codes can be screenshotted and shared on WhatsApp to mark fake proxy attendance. CampusOn's QR token regenerates every 30 seconds with a cryptographic hash verified by the backend. Once expired, a screenshot cannot be reused."),
        ("Q4: How does CampusOn classify room occupancy into 4 states?",
         "By fusing timetable data with real-time sensor telemetry: 1. Class in Session (timetable lecture active), 2. Occupied – Open Use (no lecture, but PIR/ultrasonic detect occupants), 3. Available (no lecture, sensors confirm empty), 4. Status Unknown (node offline)."),
        ("Q5: What is RAG in the AI Course Notes system?",
         "RAG stands for Retrieval-Augmented Generation. Faculty notes are indexed into text chunks. When a student asks a technical question, the system retrieves only the relevant course paragraphs, passes them to Gemini AI, and answers with the exact source citation without hallucinating."),
        ("Q6: How is student privacy protected regarding counseling?",
         "The system uses Row-Level Security (RLS) in PostgreSQL. Support tickets tagged as Confidential (mental health, sensitive grievances) are isolated. Parents and general staff cannot query or view them—only designated, qualified counseling officers hold decryption access."),
        ("Q7: Why can't ADC2 pins on ESP32 be used for the gas sensor?",
         "On the ESP32, ADC2 pins (GPIO 0, 2, 4, 12-15, 25-27) share internal hardware with the Wi-Fi radio. When Wi-Fi is active, analog reads on ADC2 fail. Therefore, our circuit connects the MQ-2 analog output to ADC1 (GPIO 34), which operates continuously without Wi-Fi conflicts."),
        ("Q8: Why did you use a voltage divider for the HC-SR04 ultrasonic sensor?",
         "The HC-SR04 operates at 5V, so its Echo output is 5V logic. ESP32 GPIO pins tolerate a maximum of 3.6V. We use a 1kΩ and 2kΩ resistor voltage divider to step the 5V signal down to 3.33V, protecting the microcontroller from overvoltage damage."),
        ("Q9: What happens if campus internet goes down?",
         "The ESP32 edge nodes feature local autonomous failsafes. If Wi-Fi drops, the node continues local LED indication, buzzer alarming, and RFID access logging on internal flash memory, syncing back to the cloud as soon as connectivity resumes."),
        ("Q10: How was this project validated?",
         "Validated across 4 milestones at the Centre for Internet of Things, MITS Gwalior, including architectural design (Milestones 1 & 2), circuit schematic design (Milestone 3), and physical cardboard classroom prototype testing with live sensor telemetry (Milestone 4).")
    ]

    for q, a in viva_qas:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(f"<i>Answer:</i> {a}", body_style))
        story.append(Spacer(1, 3))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[PDF GENERATION SUCCESS] Created {output_filename}")

if __name__ == '__main__':
    create_guidebook_pdf("c:\\Users\\admin\\Downloads\\Shubhi Project\\CampusOn_Master_Guidebook.pdf")
    create_guidebook_pdf("c:\\Users\\admin\\Downloads\\Shubhi Project\\frontend\\public\\CampusOn_Master_Guidebook.pdf")
