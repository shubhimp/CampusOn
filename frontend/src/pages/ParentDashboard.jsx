import React from 'react';
import { 
  Users, 
  CheckCircle, 
  BookOpen, 
  Bell, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  GraduationCap, 
  FileText 
} from 'lucide-react';
import HexagonBadge from '../components/HexagonBadge';

export default function ParentDashboard({ user, subjects }) {
  const announcements = [
    {
      id: 'ann-01',
      title: 'Mid-Semester Examination Schedule Announced',
      date: '28 Oct 2026',
      department: 'Office of the Controller of Examinations',
      summary: 'Mid-term evaluations commence from 15th November 2026. Hall tickets available on student portal.'
    },
    {
      id: 'ann-02',
      title: 'Annual TechFest & IoT Hardware Exhibition',
      date: '22 Oct 2026',
      department: 'Centre for Internet of Things',
      summary: 'Parents are cordially invited to witness student smart campus prototypes at the Central Auditorium.'
    }
  ];

  const feeHistory = [
    { sem: '3rd Semester (Academic Year 2026-27)', amount: '₹ 54,000', status: 'Paid', receipt: 'REC-2026-8921', date: '05 Aug 2026' },
    { sem: '2nd Semester (Academic Year 2025-26)', amount: '₹ 52,000', status: 'Paid', receipt: 'REC-2025-4102', date: '10 Jan 2026' },
    { sem: '1st Semester (Academic Year 2025-26)', amount: '₹ 52,000', status: 'Paid', receipt: 'REC-2025-1089', date: '20 Jul 2025' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Linked Student Details */}
      <div className="bg-gradient-to-r from-white dark:from-[#121217] via-[#FEF9C3]/20 dark:via-[#18181E] to-[#FFFDF0] dark:to-[#08080A] p-6 rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="Shubhi Mathur"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FFD000] shadow-[0_0_15px_rgba(255,208,0,0.3)]"
          />
          <div>
            <span className="text-[10px] font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-2 py-0.5 rounded">
              Linked Student Profile
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">Shubhi Mathur</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono">
              Enrolment: BTEC25O1060 • B.Tech Electrical & Computer Engineering (3rd Sem)
            </p>
          </div>
        </div>

        {/* Confidentiality Privacy Assurance Pill */}
        <div className="bg-white dark:bg-[#18181E] p-3 rounded-xl border border-purple-200 dark:border-purple-900/40 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-zinc-200">Student Privacy Shield Active</p>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
              Personal counseling conversations & sensitive grievance files are protected by institutional policy.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HexagonBadge
          icon={CheckCircle}
          label="Cumulative Attendance"
          value="88.3%"
          subtext="Good Standing (≥ 75% required)"
          statusColor="emerald"
        />
        <HexagonBadge
          icon={GraduationCap}
          label="Previous SGPA"
          value="8.74 / 10"
          subtext="Class Rank: Top 5%"
          statusColor="yellow"
        />
        <HexagonBadge
          icon={CreditCard}
          label="Tuition Fees Due"
          value="₹ 0.00"
          subtext="All Dues Cleared for 3rd Sem"
          statusColor="blue"
        />
        <HexagonBadge
          icon={Bell}
          label="Official Notices"
          value="2 Unread"
          subtext="Exam Circular Published"
          statusColor="amber"
        />
      </div>

      {/* Attendance & Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Subject-wise Academic Attendance Records
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
            Verified by RFID classroom check-in and dynamic QR reader terminals.
          </p>

          <div className="space-y-4">
            {subjects.map((sub) => (
              <div key={sub.code} className="p-3.5 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E]">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#713F12] dark:text-[#FFD000] bg-[#FEF9C3] dark:bg-[#222228] border border-[#FDE047]/50 dark:border-[#2C2C34] px-1.5 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 ml-2">{sub.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#713F12] dark:text-[#FFD000]">{sub.percentage}%</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-[#222228] rounded-full h-2 my-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${sub.percentage}%`,
                      backgroundColor: sub.percentage >= 85 ? '#FFD000' : sub.percentage >= 75 ? '#f97316' : '#ef4444'
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                  <span>Attended {sub.attended} out of {sub.total} conducted sessions</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">Faculty: {sub.faculty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official College Notices */}
        <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FFD000]" />
              Official Announcements
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Verified notices issued by the Dean's office
            </p>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E] text-xs">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{ann.date}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-0.5">{ann.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1">{ann.summary}</p>
                  <p className="text-[10px] text-[#713F12] dark:text-[#FFD000] font-bold mt-2">{ann.department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Payment Confirmation */}
          <div className="mt-5 pt-4 border-t border-[#ebd7cc]">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Latest Fee Transaction
            </h4>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <div className="flex justify-between font-bold text-emerald-900">
                <span>3rd Sem Tuition Fee</span>
                <span>₹ 54,000 (PAID)</span>
              </div>
              <p className="text-[10px] text-emerald-700 mt-1">Receipt No: REC-2026-8921</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
