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
  Plus
} from 'lucide-react';
import HexagonBadge from '../components/HexagonBadge';
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
  const [cameraAuditLogs, setCameraAuditLogs] = useState([
    { user: 'Dr. Murli Manohar', room: 'AB-204', reason: 'Pre-lecture Lab Equipment Check', timestamp: '10:05 AM' },
    { user: 'Campus Security Office', room: 'AB-101', reason: 'Routine Egress Verification', timestamp: '09:20 AM' }
  ]);

  // Student requests assigned to this faculty
  const [assignedRequests, setAssignedRequests] = useState(ACCESS_REQUESTS);

  const facultyTimetable = timetable.filter(
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
          statusColor="maroon"
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
        <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ebd7cc]">
            <div>
              <h3 className="text-base font-bold text-slate-900">Faculty Teaching Schedule</h3>
              <p className="text-xs text-slate-500">
                Official assigned hours adhering to the 3-hour free faculty period policy
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#8b1e3f] bg-[#ffd8be] px-3 py-1 rounded-xl">
              Cabin: {user.cabin || 'Block B - 208'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyTimetable.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-[#ebd7cc] bg-[#fffaf7] hover:border-[#8b1e3f] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-bold text-[#8b1e3f]">{slot.day}</span>
                  <span className="font-mono bg-[#ffd8be] text-[#8b1e3f] px-2 py-0.5 rounded text-[10px]">
                    {slot.room}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{slot.course}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{slot.time}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#ebd7cc] flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">{slot.type}</span>
                  <span className="text-emerald-700 font-bold">Classroom Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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

            <div className="pt-4 border-t border-[#ebd7cc] flex items-center justify-between">
              {prefSaved ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Preferences submitted to OR-Tools Solver Queue!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Mandatory: Solver guarantees ≥ 3 free hours daily for research & break.
                </span>
              )}

              <button
                type="submit"
                className="bg-[#8b1e3f] hover:bg-[#6c1b31] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Save & Submit Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Course Notes Manager */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#ebd7cc]">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Notes & AI RAG Repository</h3>
              <p className="text-xs text-slate-500">
                Uploaded notes are converted into text vectors for the student AI mentor
              </p>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUploadNotes} className="bg-[#fff7f2] p-5 rounded-xl border border-[#ebd7cc]">
            <h4 className="text-xs font-bold text-[#8b1e3f] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" /> Upload New Course Document
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#ebd7cc] text-xs bg-white"
                >
                  <option value="ECE-301">ECE-301: Microcontrollers</option>
                  <option value="ECE-305P">ECE-305P: IoT Systems Lab</option>
                  <option value="ECE-303">ECE-303: Signals & Systems</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Unit / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 4: FreeRTOS Queues"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#ebd7cc] text-xs bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESP32 Pinout & Interrupts Guide"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#ebd7cc] text-xs bg-white"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              {uploadSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> File indexed and ready for AI Q&A!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto bg-[#8b1e3f] hover:bg-[#6c1b31] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Index Material
              </button>
            </div>
          </form>

          {/* List of Published Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700">Currently Active Knowledge Sources</h4>
            {notesList.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl border border-[#ebd7cc] bg-white hover:bg-[#fffcf9] transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#8b1e3f] bg-[#ffd8be] px-2 py-0.5 rounded text-[10px]">
                      {n.courseCode}
                    </span>
                    <span className="text-slate-500 font-semibold">{n.unit}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mt-1">{n.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{n.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    RAG Vectorized
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{n.fileSize}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Authorized Classroom CCTV Feeds */}
      {activeTab === 'cameras' && (
        <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#8b1e3f]" />
              Authorized Classroom Security Feeds
            </h3>
            <p className="text-xs text-slate-500">
              Restricted to assigned faculty and administration. All camera access is audited.
            </p>
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
                  <span className="font-bold text-amber-300">{selectedCameraRoom.status}</span>
                </div>
              </div>

              {/* Room Selector Pills */}
              <div className="flex gap-2">
                {classrooms.filter((c) => c.hasCamera).map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleAuditCameraView(room)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCameraRoom.id === room.id
                        ? 'bg-[#8b1e3f] text-white shadow-sm'
                        : 'bg-[#fdf3ed] text-slate-700 hover:bg-[#fae5d8]'
                    }`}
                  >
                    View {room.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Log Box */}
            <div className="bg-[#fff7f2] p-4 rounded-xl border border-[#ebd7cc] text-xs flex flex-col h-[340px]">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Compliance Audit Trail
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Every camera view is recorded in institutional access logs to prevent privacy misuse.
              </p>

              <div className="flex-1 overflow-y-auto space-y-2">
                {cameraAuditLogs.map((log, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-[#ebd7cc] text-[11px]">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{log.room}</span>
                      <span className="font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{log.user}</p>
                    <p className="text-[10px] text-slate-400 italic">{log.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Assigned Student Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned Student Requests</h3>
            <p className="text-xs text-slate-500">
              Review classroom access requests and student project authorizations
            </p>
          </div>

          <div className="space-y-3">
            {assignedRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-[#ebd7cc] bg-white hover:bg-[#fffaf7] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#8b1e3f] bg-[#ffd8be] px-2 py-0.5 rounded text-[10px]">
                      {req.room}
                    </span>
                    <span className="font-bold text-slate-900">{req.studentName}</span>
                    <span className="text-slate-500">({req.enrollment})</span>
                  </div>
                  <p className="text-slate-700 mt-1 font-medium">Reason: {req.reason}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Requested Slot: {req.date} • {req.timeSlot}</p>
                </div>

                <div className="flex items-center gap-3">
                  {req.status === 'Approved' ? (
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                        Approved
                      </span>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">Unlock PIN: {req.pin}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="bg-[#8b1e3f] hover:bg-[#6c1b31] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
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
