import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  UploadCloud, 
  Video, 
  ShieldCheck, 
  CheckCircle, 
  Eye, 
  Settings, 
  FileText, 
  AlertCircle, 
  LifeBuoy,
  Plus,
  ScanFace,
  Users
} from 'lucide-react';
import HexagonBadge from '../components/HexagonBadge';
import ESP32CamFaceAttendance from '../components/ESP32CamFaceAttendance';
import { COURSE_NOTES, ACCESS_REQUESTS } from '../mockData';

export default function FacultyDashboard({ 
  user, 
  timetable, 
  classrooms, 
  activeTab, 
  setActiveTab 
}) {
  const [notesList, setNotesList] = useState(COURSE_NOTES);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('ECE-301');
  const [newUnit, setNewUnit] = useState('Unit 4');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Timetable Preferences State
  const [preferredSlot, setPreferredSlot] = useState('Morning (09:00 AM - 01:00 PM)');
  const [unavailableSlot, setUnavailableSlot] = useState('Friday Post 03:00 PM');
  const [preferredRoom, setPreferredRoom] = useState('AB-204');
  const [maxConsecutive, setMaxConsecutive] = useState('2');
  const [prefSaved, setPrefSaved] = useState(false);

  // Camera Audit Log
  const [selectedCameraRoom, setSelectedCameraRoom] = useState(classrooms[0]);
  const [selectedClassRoom, setSelectedClassRoom] = useState('AB-204');
  const [selectedCourseName, setSelectedCourseName] = useState('ECE-305P: IoT Systems Lab');
  const [cameraAuditLogs, setCameraAuditLogs] = useState([
    { user: 'Dr. Murli Manohar', room: 'AB-204', reason: 'Pre-lecture Lab Equipment Check', timestamp: '10:05 AM' },
    { user: 'Campus Security Office', room: 'AB-101', reason: 'Routine Egress Verification', timestamp: '09:20 AM' }
  ]);

  // Student requests assigned to this faculty
  const [assignedRequests, setAssignedRequests] = useState(ACCESS_REQUESTS);

  const lastName = user?.name ? user.name.split(' ').slice(-1)[0] : '';
  const matchedSchedule = timetable.filter(
    (t) => (lastName && t.faculty.toLowerCase().includes(lastName.toLowerCase()))
  );
  const facultyTimetable = matchedSchedule.length > 0 ? matchedSchedule : timetable.filter(
    (t) => t.faculty.includes('Murli Manohar') || t.faculty.includes('Manohar')
  );

  const handleUploadNotes = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newEntry = {
      id: `note-${Date.now()}`,
      courseCode: newCourse,
      courseName: newCourse === 'ECE-301' ? 'Microcontrollers & Embedded Systems' : 'IoT Systems & Hardware Lab',
      unit: newUnit,
      title: newTitle,
      faculty: user.name,
      uploadDate: 'Today',
      fileSize: '2.8 MB',
      summary: 'Uploaded course material ready for automated Gemini RAG vector indexing.',
      content: 'This document contains newly published syllabus notes for the upcoming exam review.'
    };

    setNotesList([newEntry, ...notesList]);
    setNewTitle('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2500);
  };

  const handleAuditCameraView = (room) => {
    setSelectedCameraRoom(room);
    setCameraAuditLogs((prev) => [
      {
        user: user.name,
        room: room.id,
        reason: 'Authorized Occupancy & Safety Check',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  const handleApproveRequest = (id) => {
    setAssignedRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Approved', pin: '8492' } : req))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HexagonBadge
          icon={Calendar}
          label="Assigned Classes"
          value={`${facultyTimetable.length} Lectures`}
          subtext="Weekly Teaching Workload"
          statusColor="yellow"
        />
        <HexagonBadge
          icon={BookOpen}
          label="Published Course Notes"
          value={`${notesList.length} Units`}
          subtext="Indexed in AI RAG Engine"
          statusColor="emerald"
        />
        <HexagonBadge
          icon={Video}
          label="Authorized CCTV Feeds"
          value="2 Rooms"
          subtext="AB-204 & AB-101 Access"
          statusColor="blue"
        />
        <HexagonBadge
          icon={LifeBuoy}
          label="Assigned Responsibilities"
          value="Centre for IoT"
          subtext="3 Pending Student Requests"
          statusColor="amber"
        />
      </div>

      {/* Tab: Teaching Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#222228]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Faculty Teaching Schedule</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Official assigned hours adhering to the 3-hour free faculty period policy
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#18181E] border border-[#FDE047]/50 dark:border-[#2C2C34] px-3 py-1 rounded-xl">
              Cabin: {user.cabin || 'Block B - 208'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyTimetable.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-2">
                  <span className="font-bold text-[#713F12] dark:text-[#FFD000]">{slot.day}</span>
                  <span className="font-mono bg-[#FEF9C3] dark:bg-[#222228] text-[#713F12] dark:text-[#FFD000] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2 py-0.5 rounded text-[10px] font-bold">
                    {slot.room}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{slot.course}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 mt-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{slot.time}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#222228] flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 dark:text-zinc-400">{slot.type}</span>
                  <button
                    onClick={() => {
                      setSelectedClassRoom(slot.room);
                      setSelectedCourseName(slot.course);
                      setActiveTab('face_attendance');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FFD000] hover:bg-[#F0C400] text-black shadow-xs transition-all cursor-pointer"
                  >
                    <ScanFace className="w-3 h-3 text-black" />
                    Take Face Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: ESP32-CAM 3D Face Recognition Attendance */}
      {activeTab === 'face_attendance' && (
        <ESP32CamFaceAttendance 
          roomId={selectedClassRoom || "AB-204"} 
          roomName={selectedCourseName || "IoT & Embedded Systems Laboratory"} 
        />
      )}

      {/* Tab: Timetable Preferences Submission */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6 max-w-3xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Submit Timetable Scheduling Preferences
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            These preferences are directly fed into the Google OR-Tools CP-SAT mathematical constraint solver before final administrative publishing.
          </p>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Teaching Hours
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebd7cc] text-xs bg-[#fdf3ed] focus:bg-white outline-none"
                >
                  <option value="Morning (09:00 AM - 01:00 PM)">Morning (09:00 AM - 01:00 PM)</option>
                  <option value="Mid-day (11:00 AM - 03:00 PM)">Mid-day (11:00 AM - 03:00 PM)</option>
                  <option value="Afternoon (01:00 PM - 05:00 PM)">Afternoon (01:00 PM - 05:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Unavailable Time Slot / Research Hours
                </label>
                <input
                  type="text"
                  value={unavailableSlot}
                  onChange={(e) => setUnavailableSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebd7cc] text-xs bg-[#fdf3ed] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Classroom or Lab
                </label>
                <select
                  value={preferredRoom}
                  onChange={(e) => setPreferredRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebd7cc] text-xs bg-[#fdf3ed] focus:bg-white outline-none"
                >
                  <option value="AB-204">AB-204 (IoT & Embedded Systems Lab)</option>
                  <option value="AB-101">AB-101 (Smart Lecture Hall 1)</option>
                  <option value="AB-102">AB-102 (ECE Seminar Hall)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Max Consecutive Teaching Periods (Rule: ≤ 2)
                </label>
                <select
                  value={maxConsecutive}
                  onChange={(e) => setMaxConsecutive(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebd7cc] text-xs bg-[#fdf3ed] focus:bg-white outline-none"
                >
                  <option value="1">1 Period (with break after)</option>
                  <option value="2">2 Periods (Maximum allowed by policy)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-[#222228] flex items-center justify-between">
              {prefSaved ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Preferences submitted to OR-Tools Solver Queue!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Mandatory: Solver guarantees ≥ 3 free hours daily for research & break.
                </span>
              )}

              <button
                type="submit"
                className="bg-[#FFD000] hover:bg-[#F0C400] text-black px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,208,0,0.25)] cursor-pointer"
              >
                Save & Submit Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Course Notes Manager */}
      {activeTab === 'notes' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#222228]">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Course Notes & AI RAG Repository</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Uploaded notes are converted into text vectors for the student AI mentor
              </p>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUploadNotes} className="bg-[#FEF9C3]/30 dark:bg-[#18181E] p-5 rounded-xl border border-[#FDE047]/50 dark:border-[#2C2C34]">
            <h4 className="text-xs font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-[#FFD000]" /> Upload New Course Document
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 block mb-1">Subject</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-[#2C2C34] text-xs bg-white dark:bg-[#121217] text-slate-900 dark:text-white outline-none focus:border-[#FFD000]"
                >
                  <option value="ECE-301">ECE-301: Microcontrollers</option>
                  <option value="ECE-305P">ECE-305P: IoT Systems Lab</option>
                  <option value="ECE-303">ECE-303: Signals & Systems</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 block mb-1">Unit / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 4: FreeRTOS Queues"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-[#2C2C34] text-xs bg-white dark:bg-[#121217] text-slate-900 dark:text-white outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESP32 Pinout & Interrupts Guide"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-[#2C2C34] text-xs bg-white dark:bg-[#121217] text-slate-900 dark:text-white outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              {uploadSuccess && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> File indexed and ready for AI Q&A!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto bg-[#FFD000] hover:bg-[#F0C400] text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,208,0,0.25)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Index Material
              </button>
            </div>
          </form>

          {/* List of Published Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Currently Active Knowledge Sources</h4>
            {notesList.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2 py-0.5 rounded text-[10px]">
                      {n.courseCode}
                    </span>
                    <span className="text-slate-500 dark:text-zinc-400 font-semibold">{n.unit}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{n.title}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{n.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    RAG Vectorized
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">{n.fileSize}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Authorized Classroom CCTV Feeds */}
      {activeTab === 'cameras' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FFD000]" />
                Authorized Classroom Security Feeds
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Restricted to assigned faculty and administration. All camera access is audited.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('face_attendance')}
              className="px-3.5 py-2 rounded-xl bg-[#FFD000] hover:bg-[#F0C400] text-black text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,208,0,0.25)] transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>⚡ Launch 3D Face Biometric Attendance</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Camera Player */}
            <div className="lg:col-span-2 space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border-2 border-slate-800 shadow-md flex items-center justify-center">
                {selectedCameraRoom?.hasCamera ? (
                  <img
                    src={selectedCameraRoom.cameraStreamUrl}
                    alt={selectedCameraRoom.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                ) : (
                  <div className="text-slate-400 text-center text-xs">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No camera node assigned to this space.
                  </div>
                )}

                {/* Live Camera Overlay Banner */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>LIVE FEED: {selectedCameraRoom.id}</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs">
                  <span>Occupancy Status: </span>
                  <span className="font-bold text-[#FFD000]">{selectedCameraRoom.status}</span>
                </div>
              </div>

              {/* Room Selector Pills */}
              <div className="flex gap-2">
                {classrooms.filter((c) => c.hasCamera).map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleAuditCameraView(room)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCameraRoom.id === room.id
                        ? 'bg-[#FFD000] text-black shadow-[0_0_12px_rgba(255,208,0,0.3)]'
                        : 'bg-slate-100 dark:bg-[#18181E] text-slate-700 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-[#222228]'
                    }`}
                  >
                    View {room.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Log Box */}
            <div className="bg-[#FEF9C3]/20 dark:bg-[#18181E] p-4 rounded-xl border border-slate-200 dark:border-[#222228] text-xs flex flex-col h-[340px]">
              <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Compliance Audit Trail
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3">
                Every camera view is recorded in institutional access logs to prevent privacy misuse.
              </p>

              <div className="flex-1 overflow-y-auto space-y-2">
                {cameraAuditLogs.map((log, i) => (
                  <div key={i} className="p-2.5 bg-white dark:bg-[#121217] rounded-lg border border-slate-200 dark:border-[#2C2C34] text-[11px]">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-zinc-200">
                      <span>{log.room}</span>
                      <span className="font-mono text-slate-400 dark:text-zinc-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-400 mt-0.5">{log.user}</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic">{log.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Assigned Student Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Student Requests</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Review classroom access requests and student project authorizations
            </p>
          </div>

          <div className="space-y-3">
            {assignedRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2 py-0.5 rounded text-[10px]">
                      {req.room}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{req.studentName}</span>
                    <span className="text-slate-500 dark:text-zinc-400">({req.enrollment})</span>
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300 mt-1 font-medium">Reason: {req.reason}</p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Requested Slot: {req.date} • {req.timeSlot}</p>
                </div>

                <div className="flex items-center gap-3">
                  {req.status === 'Approved' ? (
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                        Approved
                      </span>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 mt-1">Unlock PIN: {req.pin}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="bg-[#FFD000] hover:bg-[#F0C400] text-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,208,0,0.25)] cursor-pointer"
                    >
                      Authorize Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
