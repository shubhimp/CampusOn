import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Cpu, 
  Calendar, 
  Bell, 
  Compass, 
  QrCode, 
  LifeBuoy, 
  Settings,
  Activity,
  Layers,
  FileDown,
  Download,
  LogOut,
  Lock,
  ScanFace,
  Wifi,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentUser, activeTab, setActiveTab, onSignOut }) {
  const studentNav = [
    { id: 'overview', label: 'Daily Timetable', icon: Calendar },
    { id: 'face_attendance', label: 'ESP32 3D Face Attendance', icon: ScanFace },
    { id: 'digital_id', label: 'Digital Student ID', icon: QrCode },
    { id: 'rooms', label: 'Classroom Availability', icon: Layers },
    { id: 'navigation', label: 'Indoor Navigation', icon: Compass },
    { id: 'ai_mentor', label: 'AI Course Notes (RAG)', icon: BookOpen },
    { id: 'support', label: 'Welfare & Mentorship', icon: LifeBuoy },
  ];

  const facultyNav = [
    { id: 'schedule', label: 'My Teaching Schedule', icon: Calendar },
    { id: 'face_attendance', label: 'ESP32 3D Face Attendance', icon: ScanFace },
    { id: 'preferences', label: 'Timetable Preferences', icon: Settings },
    { id: 'notes', label: 'Course Notes Manager', icon: BookOpen },
    { id: 'cameras', label: 'Authorized Classroom Feeds', icon: ShieldCheck },
    { id: 'requests', label: 'Assigned Student Queries', icon: LifeBuoy },
  ];

  const adminNav = [
    { id: 'overview', label: 'Campus Control Tower', icon: Activity },
    { id: 'face_attendance', label: 'ESP32 3D Face Attendance', icon: ScanFace },
    { id: 'hardware_mesh', label: 'ESP32 & Hardware Mesh', icon: Wifi },
    { id: 'timetable_solver', label: 'AI Timetable Optimizer', icon: Calendar },
    { id: 'occupancy', label: 'Live IoT Room Matrix', icon: Layers },
    { id: 'users', label: 'Campus Users Directory', icon: Users },
    { id: 'safety', label: 'Safety & Hazard Alerts', icon: Bell },
    { id: 'analytics', label: 'Campus Analytics', icon: ShieldCheck },
  ];

  const parentNav = [
    { id: 'overview', label: 'Academic & Attendance', icon: Activity },
    { id: 'fees', label: 'Fee Ledger & Accounts', icon: BookOpen },
    { id: 'notices', label: 'College Notices', icon: Bell },
  ];

  // Strictly enforce single dashboard navigation based exclusively on authenticated account role
  const effectiveRole = currentUser?.role || 'student';

  const getNavItems = () => {
    switch (effectiveRole) {
      case 'faculty': return facultyNav;
      case 'admin': return adminNav;
      case 'parent': return parentNav;
      case 'student':
      default: return studentNav;
    }
  };

  return (
    <aside className="w-64 bg-[#FFFDF0] dark:bg-[#08080A] border-r border-[#E9E9E7] dark:border-[#222228] flex flex-col h-screen select-none shrink-0 transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E9E9E7] dark:border-[#222228] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FFD000] text-black flex items-center justify-center shadow-[0_0_18px_rgba(255,208,0,0.38)] shrink-0 font-bold">
          <Cpu className="w-5 h-5 text-black animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
            <span>Campus</span>
            <span className="text-[#CA8A04] dark:text-[#FFD000]">On</span>
            <span className="font-mono text-[9px] font-bold text-black bg-[#FFD000] px-1 py-0.2 rounded ml-1">
              v2.0
            </span>
          </h1>
          <p className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider">
            MITS Gwalior OS
          </p>
        </div>
      </div>

      {/* Role Access Section: Strictly Confined to Single Authorized Dashboard */}
      <div className="p-3.5 border-b border-[#E9E9E7] dark:border-[#222228] bg-white/60 dark:bg-[#0D0D11]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA]">
            Assigned Dashboard
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#FFD000]/15 border border-[#FDE047] dark:border-[#FFD000]/35 px-2 py-0.5 rounded-full">
            <Lock className="w-2.5 h-2.5" />
            <span>ROLE LOCKED</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-2 bg-white dark:bg-[#121217] rounded-xl border border-[#E9E9E7] dark:border-[#222228] shadow-2xs">
          <div className="p-2 rounded-lg bg-[#FFD000] text-black shrink-0 font-bold shadow-xs">
            {effectiveRole === 'student' && <GraduationCap className="w-4 h-4 text-black" />}
            {effectiveRole === 'faculty' && <BookOpen className="w-4 h-4 text-black" />}
            {effectiveRole === 'admin' && <ShieldCheck className="w-4 h-4 text-black" />}
            {effectiveRole === 'parent' && <Users className="w-4 h-4 text-black" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate uppercase">
              {effectiveRole === 'student' ? 'Student Dashboard' :
               effectiveRole === 'faculty' ? 'Teacher Dashboard' :
               effectiveRole === 'admin' ? 'Admin Dashboard' :
               effectiveRole === 'parent' ? 'Parent Dashboard' : 'Campus Dashboard'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-[#A1A1AA] truncate font-mono">
              {currentUser?.enrollmentNo || currentUser?.employeeCode || currentUser?.adminCode || currentUser?.email}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-[#71717A] mt-1.5 px-0.5">
          Account access is strictly confined to this dashboard.
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A] px-3 py-1">
          {effectiveRole.toUpperCase()} SERVICES
        </p>
        {getNavItems().map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-[#FFD000] text-black font-bold shadow-[0_0_18px_rgba(255,208,0,0.32)] border border-[#FFD000]'
                  : 'text-slate-700 dark:text-[#A1A1AA] hover:bg-[#FEF9C3] dark:hover:bg-[#141419] hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#CA8A04] dark:text-[#FFD000]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Global IoT Simulator Shortcut */}
        <div className="pt-4 mt-3 border-t border-[#E9E9E7] dark:border-[#222228]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A] px-3 py-1">
            HARDWARE LAB
          </p>
          <button
            onClick={() => setActiveTab('iot_simulator')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'iot_simulator'
                ? 'bg-[#FFD000] text-black shadow-[0_0_18px_rgba(255,208,0,0.32)] border border-[#FFD000]'
                : 'bg-white dark:bg-[#121217] text-slate-800 dark:text-slate-200 hover:border-[#FFD000] border border-[#E9E9E7] dark:border-[#27272A]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-[#CA8A04] dark:text-[#FFD000]" />
              <span>Virtual IoT ESP32</span>
            </div>
            <span className="text-[9px] bg-[#FEF9C3] dark:bg-[#FFD000]/20 text-[#713F12] dark:text-[#FFD000] border border-[#FDE047] dark:border-[#FFD000]/40 px-1.5 py-0.5 rounded font-mono font-bold">
              LIVE
            </span>
          </button>
        </div>

        {/* Master Guidebook Download */}
        <div className="pt-3 mt-2 border-t border-[#E9E9E7] dark:border-[#222228]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A] px-3 py-1">
            PROJECT VIVA DOCS
          </p>
          <a
            href="/CampusOn_Master_Guidebook.pdf"
            download="CampusOn_Master_Guidebook.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#FEF9C3] dark:bg-[#121217] text-slate-900 dark:text-white hover:border-[#FFD000] border border-[#FDE047] dark:border-[#27272A] transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-[#CA8A04] dark:text-[#FFD000]" />
              <span>Download PDF Guide</span>
            </div>
            <span className="text-[9px] bg-[#FFD000] text-black px-1.5 py-0.5 rounded font-mono font-bold">
              PDF
            </span>
          </a>
        </div>

        {/* Sign Out / Switch Role Button */}
        {onSignOut && (
          <div className="pt-2">
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#A1A1AA] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch / Sign Out</span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer / Institution Info */}
      <div className="p-3.5 bg-white/70 dark:bg-[#050507] border-t border-[#E9E9E7] dark:border-[#222228] text-[11px] text-slate-600 dark:text-[#A1A1AA] flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <div className="truncate">
          <p className="font-bold text-slate-900 dark:text-white truncate">Centre for IoT</p>
          <p className="text-[10px] text-slate-500 dark:text-[#71717A] truncate font-medium">Dept. of Electrical & Computer Engg.</p>
        </div>
      </div>
    </aside>
  );
}
