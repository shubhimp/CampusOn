import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  CheckCircle, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Layers, 
  LifeBuoy, 
  QrCode, 
  Compass, 
  ArrowRight, 
  Lock, 
  Unlock,
  AlertTriangle,
  FileText,
  HelpCircle
} from 'lucide-react';
import HexagonBadge from '../components/HexagonBadge';
import DynamicStudentCard from '../components/DynamicStudentCard';
import CampusFloorMap from '../components/CampusFloorMap';
import ESP32CamFaceAttendance from '../components/ESP32CamFaceAttendance';
import { COURSE_NOTES, SUPPORT_CATEGORIES } from '../mockData';
import { askNotesAI, submitWelfareQuery } from '../services/api';

export default function StudentDashboard({ 
  user, 
  timetable, 
  classrooms, 
  subjects, 
  activeTab, 
  setActiveTab,
  onRequestAccess 
}) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [searchRoom, setSearchRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // AI Course Notes QA State
  const [selectedCourseNote, setSelectedCourseNote] = useState(COURSE_NOTES[0]);
  const [studentQuestion, setStudentQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'Student'}! I am your AI Course Mentor. Ask me any question about your ECE-301 Microcontrollers or IoT course materials, and I will cite exact notes.`,
      citation: 'Course Syllabus Unit 3'
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Student Welfare Chat State
  const [welfareCategory, setWelfareCategory] = useState(SUPPORT_CATEGORIES[0].id);
  const [welfareMessage, setWelfareMessage] = useState('');
  const [welfareHistory, setWelfareHistory] = useState([
    {
      sender: 'bot',
      text: 'Welcome to Campus Welfare Support. How can we assist you today? Conversations regarding personal counseling and grievances remain strictly confidential.',
      actionPrompt: null
    }
  ]);

  // Request Access Modal
  const [requestModalRoom, setRequestModalRoom] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [latestBiometricStatus, setLatestBiometricStatus] = useState(() => {
    try {
      const studentKey = user?.enrollmentNo || user?.allottedId || 'BTEC25O1060';
      const item = localStorage.getItem(`campuson_attendance_${studentKey}`);
      if (item) return JSON.parse(item);
      const records = JSON.parse(localStorage.getItem('campuson_attendance_records') || '[]');
      const match = records.find(r => r.studentId === studentKey || (studentKey.includes('SH60') && r.studentId.includes('1060')));
      if (match) return match;
    } catch (e) {}
    return {
      timestamp: '09:02 AM',
      roomId: 'AB-204',
      status: 'Verified Present',
      courseCode: 'ECE-305P'
    };
  });

  useEffect(() => {
    const handler = (e) => {
      const rec = e.detail;
      const myId = user?.enrollmentNo || user?.allottedId || 'BTEC25O1060';
      if (rec && (rec.studentId === myId || (myId.includes('SH60') && rec.studentId.includes('1060')) || (myId.includes('TA63') && rec.studentId.includes('1063')))) {
        setLatestBiometricStatus(rec);
      }
    };
    window.addEventListener('campuson_attendance_updated', handler);
    return () => window.removeEventListener('campuson_attendance_updated', handler);
  }, [user]);

  const filteredTimetable = timetable.filter((t) => t.day === selectedDay);

  const filteredClassrooms = classrooms.filter((r) => {
    const matchesSearch = r.id.toLowerCase().includes(searchRoom.toLowerCase()) || 
                          r.name.toLowerCase().includes(searchRoom.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle asking AI Course Notes Assistant via Real FastAPI Backend
  const handleAskNotesAI = async (e) => {
    e.preventDefault();
    if (!studentQuestion.trim()) return;

    const query = studentQuestion;
    setChatLog((prev) => [...prev, { sender: 'student', text: query }]);
    setStudentQuestion('');
    setIsAiThinking(true);

    try {
      const data = await askNotesAI(selectedCourseNote.courseCode, query);
      if (data && data.answer) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer,
            citation: data.sourceCitation
          }
        ]);
        setIsAiThinking(false);
        return;
      }
    } catch (err) {
      console.warn('API call failed, using local response:', err);
    }

    // Local fallback response if backend is offline
    setTimeout(() => {
      let responseText = '';
      let citation = '';

      if (query.toLowerCase().includes('pin') || query.toLowerCase().includes('adc') || query.toLowerCase().includes('gpio')) {
        responseText = 'According to Dr. Murli Manohar\'s Unit 3 notes: ADC2 pins (GPIO 0, 2, 4, 12-15, 25-27) cannot be used for analog reads when Wi-Fi is active. You must connect analog sensors like MQ-2 to ADC1 pins (GPIO 32 to 39).';
        citation = `${selectedCourseNote.courseCode} - Unit 3: Section 4`;
      } else if (query.toLowerCase().includes('rfid') || query.toLowerCase().includes('spi')) {
        responseText = 'For RFID-RC522 SPI integration on ESP32: Standard VSPI pins are MOSI: GPIO 23, MISO: GPIO 19, SCK: GPIO 18, and CS/SDA: GPIO 5.';
        citation = `${selectedCourseNote.courseCode} - Unit 3: Section 5`;
      } else {
        responseText = `From ${selectedCourseNote.title}: This topic focuses on ${selectedCourseNote.summary}`;
        citation = `${selectedCourseNote.courseCode} Reference Repository`;
      }

      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: responseText,
          citation: citation
        }
      ]);
      setIsAiThinking(false);
    }, 700);
  };

  // Handle Welfare Support Routing via Backend
  const handleSendWelfare = async (e) => {
    e.preventDefault();
    if (!welfareMessage.trim()) return;

    const userMsg = welfareMessage;
    setWelfareHistory((prev) => [...prev, { sender: 'student', text: userMsg }]);
    setWelfareMessage('');

    try {
      const res = await submitWelfareQuery(welfareCategory, userMsg, user.enrollmentNo);
      if (res && res.message) {
        setWelfareHistory((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.message,
            actionPrompt: `Assigned: ${res.assignedOfficer}`
          }
        ]);
        return;
      }
    } catch (err) {
      console.warn('Welfare API failed, using fallback:', err);
    }

    setTimeout(() => {
      const activeCat = SUPPORT_CATEGORIES.find((c) => c.id === welfareCategory);
      let reply = `Thank you for reaching out. Based on your concern regarding ${activeCat.title}, your query has been confidentially registered for ${activeCat.officer} (${activeCat.email}).`;
      
      if (activeCat.confidential) {
        reply += ' 🔒 This ticket is tagged as CONFIDENTIAL. It is isolated from parents and general staff, and accessible only by designated counseling personnel.';
      }

      setWelfareHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          actionPrompt: `Contact Officer: ${activeCat.officer}`
        }
      ]);
    }, 700);
  };

  const handleRoomAccessSubmit = (e) => {
    e.preventDefault();
    if (onRequestAccess && requestModalRoom) {
      onRequestAccess({
        room: requestModalRoom.id,
        reason: requestReason || 'Academic Study Session',
        student: user.name,
        enrollment: user.enrollmentNo
      });
    }
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestModalRoom(null);
      setRequestReason('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Stat Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HexagonBadge
          icon={Calendar}
          label="Today's Classes"
          value="4 Sessions"
          subtext="Next: ECE-305P IoT Lab"
          statusColor="yellow"
        />
        <HexagonBadge
          icon={CheckCircle}
          label="Aggregate Attendance"
          value="88.3%"
          subtext="Eligible for End-Sem Exam"
          statusColor="emerald"
        />
        <HexagonBadge
          icon={Layers}
          label="Available Study Rooms"
          value="2 Classrooms"
          subtext="AB-102 & AB-205 Open"
          statusColor="amber"
        />
        <HexagonBadge
          icon={QrCode}
          label="Digital ID Status"
          value="Verified"
          subtext="RFID Tag: 9A-4F-2C-11"
          statusColor="blue"
        />
      </div>

      {/* Main Tab Navigation Container */}
      {activeTab === 'face_attendance' && (
        <ESP32CamFaceAttendance roomId="AB-204" roomName="IoT & Embedded Systems Lab" />
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Daily Schedule Section */}
          <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#222228]">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Timetable</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Real-time schedule generated by Google OR-Tools optimization engine
                </p>
              </div>

              {/* Day Filter Pills */}
              <div className="flex items-center gap-1 bg-[#FEF9C3]/30 dark:bg-[#18181E] p-1 rounded-xl border border-[#FDE047]/50 dark:border-[#2C2C34] overflow-x-auto">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedDay === d
                        ? 'bg-[#FFD000] text-black font-bold shadow-[0_0_12px_rgba(255,208,0,0.35)]'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#222228]'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {filteredTimetable.length > 0 ? (
                filteredTimetable.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-all relative overflow-hidden group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-2">
                      <span className="flex items-center gap-1 text-[#713F12] dark:text-[#FFD000] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </span>
                      <span className="bg-[#FEF9C3] dark:bg-[#222228] text-[#713F12] dark:text-[#FFD000] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                        {item.room}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#CA8A04] dark:group-hover:text-[#FFD000] transition-colors">
                      {item.course}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">{item.faculty}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#222228] flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-zinc-400 font-medium">{item.type}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> 
                        {(latestBiometricStatus && item.course?.includes(latestBiometricStatus.courseCode)) ? 'Face Verified (Present)' : item.attendance}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400 dark:text-zinc-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">No scheduled lectures for {selectedDay}.</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject-Wise Attendance Breakdown */}
          <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Attendance Analytics & Requirements</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Minimum 75% attendance mandatory for semester end examination.
                </p>
              </div>

              {/* Live ESP32-CAM 3D Face Biometric Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Faculty Cam 3D Face Verified: <strong>Room {latestBiometricStatus?.roomId || 'AB-204'} ({latestBiometricStatus?.timestamp || '10:14 AM'}) — {latestBiometricStatus?.status || 'Present'}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <div key={sub.code} className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2 py-0.5 rounded">
                        {sub.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">{sub.name}</h4>
                    </div>
                    <span className="text-base font-extrabold text-[#713F12] dark:text-[#FFD000]">{sub.percentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-[#222228] rounded-full h-2 my-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sub.percentage}%`,
                        backgroundColor: sub.percentage >= 85 ? '#FFD000' : sub.percentage >= 75 ? '#f97316' : '#ef4444'
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-2 font-medium">
                    <span>Attended: {sub.attended}/{sub.total} classes</span>
                    <span className="text-slate-700 dark:text-zinc-300 font-semibold">{sub.faculty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Digital Student ID */}
      {activeTab === 'digital_id' && (
        <div className="py-4">
          <DynamicStudentCard user={user} />
        </div>
      )}

      {/* Tab: Classroom Availability & Access Request */}
      {activeTab === 'rooms' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Classroom & Lab Availability</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Live sensor fusion combines official schedule with ESP32 PIR & Ultrasonic telemetry
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search room number..."
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2C2C34] text-xs bg-[#FEF9C3]/20 dark:bg-[#18181E] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#18181E] focus:outline-none focus:border-[#FFD000] focus:ring-1 focus:ring-[#FFD000] w-48"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-[#FEF9C3]/30 dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34] px-3 py-1.5 rounded-xl outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Available">Available (Unused)</option>
                <option value="Occupied – Open Use">Occupied – Open Use</option>
                <option value="Class in Session – Unavailable">Class in Session</option>
                <option value="Status Unknown">Status Unknown</option>
              </select>
            </div>
          </div>

          {/* Classroom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClassrooms.map((room) => {
              const isAvailable = room.status === 'Available';
              const isOpenUse = room.status === 'Occupied – Open Use';
              return (
                <div
                  key={room.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] hover:border-[#FFD000] dark:hover:border-[#FFD000] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2.5 py-0.5 rounded">
                        {room.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : isOpenUse
                            ? 'bg-[#FEF9C3] dark:bg-amber-950/40 text-[#713F12] dark:text-amber-300'
                            : room.status === 'Class in Session – Unavailable'
                            ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{room.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{room.building} • {room.floor}</p>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 font-medium">Capacity: {room.capacity} desks</p>

                    {/* Sensor snapshot */}
                    <div className="mt-3 bg-slate-50 dark:bg-[#121217] p-2.5 rounded-lg border border-slate-200 dark:border-[#222228] grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 dark:text-zinc-400">PIR Motion: </span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{room.pirDetected ? 'Active' : 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-zinc-400">Temp: </span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{room.temperature ? `${room.temperature}°C` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Access Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#222228]">
                    <button
                      onClick={() => setRequestModalRoom(room)}
                      disabled={room.status === 'Class in Session – Unavailable'}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        room.status === 'Class in Session – Unavailable'
                          ? 'bg-slate-100 dark:bg-[#121217] text-slate-400 dark:text-zinc-600 cursor-not-allowed'
                          : 'bg-[#FFD000] hover:bg-[#F0C400] text-black shadow-[0_0_15px_rgba(255,208,0,0.25)]'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {room.status === 'Class in Session – Unavailable' ? 'Session In Progress' : 'Request Smart Room Access'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Indoor Campus Navigation */}
      {activeTab === 'navigation' && (
        <CampusFloorMap
          classrooms={classrooms}
          onSelectRoom={(room) => setRequestModalRoom(room)}
        />
      )}

      {/* Tab: AI Course Notes (RAG) */}
      {activeTab === 'ai_mentor' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes Selector Panel */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD000]" />
                Course Knowledge Base
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Official notes uploaded by faculty for automated RAG indexing
              </p>
            </div>

            <div className="space-y-2.5">
              {COURSE_NOTES.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedCourseNote(note)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedCourseNote.id === note.id
                      ? 'bg-[#FEF9C3]/40 dark:bg-[#18181E] border-[#FFD000] shadow-[0_0_12px_rgba(255,208,0,0.15)]'
                      : 'border-slate-200 dark:border-[#222228] hover:bg-slate-50 dark:hover:bg-[#18181E]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[#713F12] dark:text-[#FFD000] text-[10px] bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-1.5 py-0.5 rounded">
                      {note.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">{note.fileSize}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{note.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">{note.summary}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2 font-medium">By {note.faculty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Interactive View */}
          <div className="lg:col-span-2 bg-[#FEF9C3]/20 dark:bg-[#08080A] rounded-xl border border-slate-200 dark:border-[#222228] p-4 flex flex-col h-[520px]">
            {/* Active Document Header */}
            <div className="pb-3 border-b border-slate-200 dark:border-[#222228] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider">
                  Indexed Context:
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                  {selectedCourseNote.courseCode}: {selectedCourseNote.unit}
                </p>
              </div>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Gemini RAG Active
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'student'
                        ? 'bg-[#FFD000] text-black font-semibold rounded-br-none shadow-[0_0_12px_rgba(255,208,0,0.2)]'
                        : 'bg-white dark:bg-[#18181E] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-[#222228] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    {msg.citation && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#2C2C34] text-[10px] text-slate-500 dark:text-zinc-400 font-mono flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#713F12] dark:text-[#FFD000]" />
                        <span>Source Citation: {msg.citation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 italic bg-white dark:bg-[#18181E] p-2.5 rounded-xl border border-slate-200 dark:border-[#222228] w-fit">
                  <Sparkles className="w-4 h-4 text-[#FFD000] animate-spin" />
                  Searching indexed document embeddings & generating response...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleAskNotesAI} className="pt-3 border-t border-slate-200 dark:border-[#222228] flex gap-2">
              <input
                type="text"
                placeholder="Ask about GPIOs, ADC2 pins, or formulas from this unit..."
                value={studentQuestion}
                onChange={(e) => setStudentQuestion(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34] text-slate-900 dark:text-white focus:outline-none focus:border-[#FFD000] focus:ring-1 focus:ring-[#FFD000]"
              />
              <button
                type="submit"
                className="bg-[#FFD000] hover:bg-[#F0C400] text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,208,0,0.25)] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Ask AI
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Welfare & Mentorship */}
      {activeTab === 'support' && (
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-[#FFD000]" />
              Institutional Support Cells
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Connect directly with designated faculty officers and counselors.
            </p>

            <div className="space-y-2.5">
              {SUPPORT_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setWelfareCategory(cat.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    welfareCategory === cat.id
                      ? 'bg-[#FEF9C3]/40 dark:bg-[#18181E] border-[#FFD000] shadow-[0_0_12px_rgba(255,208,0,0.15)]'
                      : 'border-slate-200 dark:border-[#222228] hover:bg-slate-50 dark:hover:bg-[#18181E]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white">{cat.title}</h4>
                    {cat.confidential && (
                      <span className="text-[9px] font-bold bg-[#FEF9C3] dark:bg-[#222228] text-[#713F12] dark:text-[#FFD000] border border-[#FDE047]/50 dark:border-[#2C2C34] px-1.5 py-0.5 rounded">
                        CONFIDENTIAL
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{cat.description}</p>
                  <p className="text-[10px] text-[#713F12] dark:text-[#FFD000] font-bold mt-2">Officer: {cat.officer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#FEF9C3]/20 dark:bg-[#08080A] rounded-xl border border-slate-200 dark:border-[#222228] p-4 flex flex-col h-[500px]">
            <div className="pb-3 border-b border-slate-200 dark:border-[#222228]">
              <span className="text-[10px] font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider">
                Support Channel:
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                {SUPPORT_CATEGORIES.find((c) => c.id === welfareCategory)?.title}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {welfareHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${item.sender === 'student' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      item.sender === 'student'
                        ? 'bg-[#FFD000] text-black font-semibold rounded-br-none shadow-[0_0_12px_rgba(255,208,0,0.2)]'
                        : 'bg-white dark:bg-[#18181E] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-[#222228] rounded-bl-none shadow-sm'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendWelfare} className="pt-3 border-t border-slate-200 dark:border-[#222228] flex gap-2">
              <input
                type="text"
                placeholder="Describe your query or request assistance..."
                value={welfareMessage}
                onChange={(e) => setWelfareMessage(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34] text-slate-900 dark:text-white focus:outline-none focus:border-[#FFD000] focus:ring-1 focus:ring-[#FFD000]"
              />
              <button
                type="submit"
                className="bg-[#FFD000] hover:bg-[#F0C400] text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,208,0,0.25)] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Access Request Dialog Modal */}
      {requestModalRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Request Temporary Access to {requestModalRoom.id}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              {requestModalRoom.name} ({requestModalRoom.floor})
            </p>

            {requestSubmitted ? (
              <div className="py-8 text-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                <p className="font-bold text-sm">Access Request Granted!</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Temporary Unlock PIN: <span className="font-mono font-bold text-slate-800 dark:text-zinc-100">8492</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleRoomAccessSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Purpose of Access:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Smart Campus IoT Milestone 4 testing and circuit soldering..."
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#2C2C34] bg-white dark:bg-[#18181E] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#FFD000] focus:ring-1 focus:ring-[#FFD000]"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setRequestModalRoom(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-[#2C2C34] text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-[#18181E] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FFD000] text-black text-xs font-bold hover:bg-[#F0C400] shadow-[0_0_15px_rgba(255,208,0,0.25)] cursor-pointer"
                  >
                    Confirm Access Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
