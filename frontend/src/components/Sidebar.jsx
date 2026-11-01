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
  Lock
} from 'lucide-react';

export default function Sidebar({ currentUser, activeTab, setActiveTab, onSignOut }) {
  const studentNav = [
    { id: 'overview', label: 'Daily Timetable', icon: Calendar },
    { id: 'digital_id', label: 'Digital Student ID', icon: QrCode },
    { id: 'rooms', label: 'Classroom Availability', icon: Layers },
    { id: 'navigation', label: 'Indoor Navigation', icon: Compass },
    { id: 'ai_mentor', label: 'AI Course Notes (RAG)', icon: BookOpen },
    { id: 'support', label: 'Welfare & Mentorship', icon: LifeBuoy },
  ];

  const facultyNav = [
    { id: 'schedule', label: 'My Teaching Schedule', icon: Calendar },
    { id: 'preferences', label: 'Timetable Preferences', icon: Settings },
    { id: 'notes', label: 'Course Notes Manager', icon: BookOpen },
    { id: 'cameras', label: 'Authorized Classroom Feeds', icon: ShieldCheck },
    { id: 'requests', label: 'Assigned Student Queries', icon: LifeBuoy },
  ];

  const adminNav = [
    { id: 'overview', label: 'Campus Control Tower', icon: Activity },
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
    <aside className="w-64 bg-[#fdf3ed] border-r border-[#edd5c6] flex flex-col h-screen select-none shrink-0 transition-all">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#ebd3c3] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b1e3f] to-[#b83252] flex items-center justify-center text-white shadow-md">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#8b1e3f]">CampusOn</h1>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">MITS Gwalior OS</p>
        </div>
      </div>

      {/* Role Access Section: Strictly Confined to Single Authorized Dashboard */}
      <div className="p-3.5 border-b border-[#ebd3c3]/70 bg-[#faebe0]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Assigned Dashboard
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
            <Lock className="w-2.5 h-2.5" />
            <span>ROLE LOCKED</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#edd7ca] shadow-2xs">
          <div className="p-2 rounded-lg bg-[#8b1e3f] text-white shrink-0">
            {effectiveRole === 'student' && <GraduationCap className="w-4 h-4" />}
            {effectiveRole === 'faculty' && <BookOpen className="w-4 h-4" />}
            {effectiveRole === 'admin' && <ShieldCheck className="w-4 h-4" />}
            {effectiveRole === 'parent' && <Users className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate uppercase">
              {effectiveRole === 'student' ? 'Student Dashboard' :
               effectiveRole === 'faculty' ? 'Teacher Dashboard' :
               effectiveRole === 'admin' ? 'Admin Dashboard' :
               effectiveRole === 'parent' ? 'Parent Dashboard' : 'Campus Dashboard'}
            </p>
            <p className="text-[10px] text-slate-500 truncate font-mono">
              {currentUser?.enrollmentNo || currentUser?.employeeCode || currentUser?.adminCode || currentUser?.email}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 px-0.5">
          Account access is strictly confined to this dashboard.
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          {effectiveRole.toUpperCase()} SERVICES
        </p>
        {getNavItems().map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-[#8b1e3f] text-white shadow-sm font-semibold'
                  : 'text-slate-700 hover:bg-[#fae5d8] hover:text-[#8b1e3f]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8b1e3f]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Global IoT Simulator Shortcut */}
        <div className="pt-4 mt-3 border-t border-[#edd5c6]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            HARDWARE LAB
          </p>
          <button
            onClick={() => setActiveTab('iot_simulator')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'iot_simulator'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-amber-700" />
              <span>Virtual IoT ESP32</span>
            </div>
            <span className="text-[9px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
              LIVE
            </span>
          </button>
        </div>

        {/* Master Guidebook Download */}
        <div className="pt-3 mt-2 border-t border-[#edd5c6]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            PROJECT VIVA DOCS
          </p>
          <a
            href="/CampusOn_Master_Guidebook.pdf"
            download="CampusOn_Master_Guidebook.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-[#8b1e3f]" />
              <span>Download PDF Guide</span>
            </div>
            <span className="text-[9px] bg-rose-200 text-[#8b1e3f] px-1.5 py-0.5 rounded font-mono font-bold">
              PDF
            </span>
          </a>
        </div>

        {/* Sign Out / Switch Role Button */}
        {onSignOut && (
          <div className="pt-2">
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch / Sign Out</span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer / Institution Info */}
      <div className="p-3.5 bg-[#f7e6db] border-t border-[#edd5c6] text-[11px] text-slate-600 flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <div className="truncate">
          <p className="font-semibold text-slate-800 truncate">Centre for IoT</p>
          <p className="text-[10px] text-slate-500 truncate">Dept. of Electrical & Computer Engg.</p>
        </div>
      </div>
    </aside>
  );
}
