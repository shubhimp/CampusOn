import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Cpu, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Hash, 
  Building, 
  Radio, 
  KeyRound, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  Shield,
  Smartphone,
  RefreshCw,
  Key
} from 'lucide-react';
import { 
  registerAccount, 
  loginAccount, 
  requestOtpCode, 
  verifyOtpCode, 
  loginWithOtp 
} from '../services/supabaseClient';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Verification Modal / Step State
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTargetEmail, setOtpTargetEmail] = useState('');
  const [activeOtpCode, setActiveOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpActionType, setOtpActionType] = useState('signup'); // 'signup' | 'signin'

  const inputRefs = useRef([]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (showOtpScreen && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpScreen, otpTimer]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'shubhi.btec25o1060@mitsgwalior.in',
    password: '',
    // Student
    enrollmentNo: '',
    department: 'Electrical & Computer Engineering',
    semester: '3rd Semester',
    rfidTag: 'RFID-9A-4F-2C-11',
    // Faculty / Professor
    employeeCode: '',
    designation: 'Associate Professor & IoT Mentor',
    cabin: 'Faculty Block B - Cabin 208',
    // Administrator
    adminCode: '',
    adminDivision: 'Central Administration & Campus Infra',
    adminPasscode: 'CAMPUS-MITS-2026',
    // Parent
    linkedStudent: 'Shubhi Mathur (BTEC25O1060)',
    relationship: 'Father',
    emergencyContact: '+91 98260 12345'
  });

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      tagline: 'Access Digital ID, Timetable & Notes',
      defaultEmail: 'shubhi.btec25o1060@mitsgwalior.in'
    },
    {
      id: 'faculty',
      label: 'Faculty / Professor',
      icon: BookOpen,
      tagline: 'Manage Teaching Schedule & Labs',
      defaultEmail: 'murli.manohar@mitsgwalior.in'
    },
    {
      id: 'admin',
      label: 'Administrator',
      icon: ShieldCheck,
      tagline: 'Campus Controls, OR-Tools & Security',
      defaultEmail: 'dean.infra@mitsgwalior.in'
    },
    {
      id: 'parent',
      label: 'Parent Portal',
      icon: Users,
      tagline: 'Attendance, Ledgers & Ward Progress',
      defaultEmail: 'rkmathur.gwalior@gmail.com'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    setSuccessMsg('');
    setShowOtpScreen(false);
    const r = roles.find(item => item.id === roleId);
    if (r && mode === 'signin') {
      setFormData(prev => ({ ...prev, email: r.defaultEmail }));
    }
  };

  // Quick 1-Click Examiner / Demo Login
  const handleQuickDemoLogin = async (roleId) => {
    setLoading(true);
    setErrorMsg('');
    setShowOtpScreen(false);
    try {
      const demoAccounts = {
        student: { email: 'shubhi.btec25o1060@mitsgwalior.in', pass: 'MITS@2026' },
        faculty: { email: 'murli.manohar@mitsgwalior.in', pass: 'MITS@2026' },
        admin: { email: 'dean.infra@mitsgwalior.in', pass: 'MITS@2026' },
        parent: { email: 'rkmathur.gwalior@gmail.com', pass: 'MITS@2026' }
      };
      const creds = demoAccounts[roleId];
      const res = await loginAccount(creds.email, creds.pass, roleId);
      if (res.success) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Trigger OTP Dispatch
  const handleInitiateOtp = async (targetEmail, action) => {
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg('Please provide a valid institute or personal email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await requestOtpCode(targetEmail);
      setOtpTargetEmail(targetEmail);
      setActiveOtpCode(res.otpCode);
      setOtpActionType(action);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimer(60);
      setShowOtpScreen(true);
      setSuccessMsg(`6-Digit Verification Code dispatched to ${targetEmail}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Box Change Handler
  const handleDigitChange = (index, value) => {
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto advance
    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Auto Fill Demo OTP
  const handleAutoFillOtp = () => {
    const code = activeOtpCode || '123456';
    const parts = code.split('').slice(0, 6);
    setOtpDigits(parts);
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  // Verify OTP and complete authentication
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (otpActionType === 'signup') {
        // Validate OTP
        verifyOtpCode(otpTargetEmail, entered);

        // Register profile
        const res = await registerAccount({
          ...formData,
          role: selectedRole,
          status: '2FA OTP Verified'
        });

        if (res.success) {
          setSuccessMsg('Email & OTP verified successfully! Activating your campus portal...');
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 800);
        }
      } else {
        // Sign In via OTP
        const res = await loginWithOtp(otpTargetEmail, entered, selectedRole);
        if (res.success) {
          setSuccessMsg('2FA OTP verified! Access authorized.');
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 600);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!formData.fullName || !formData.email || !formData.password) {
        setErrorMsg('Please fill in your Full Name, Email, and Password.');
        return;
      }
      // Require 2FA OTP verification for account creation
      await handleInitiateOtp(formData.email, 'signup');
    } else {
      // Sign In
      if (!formData.email) {
        setErrorMsg('Please enter your Institute Email.');
        return;
      }

      if (authMethod === 'otp') {
        // Passwordless OTP Login
        await handleInitiateOtp(formData.email, 'signin');
      } else {
        // Standard Password Login
        if (!formData.password) {
          setErrorMsg('Please enter your Password.');
          return;
        }
        setLoading(true);
        try {
          const res = await loginAccount(formData.email, formData.password, selectedRole);
          if (res.success) {
            setSuccessMsg('Credentials verified! Welcome to CampusOn.');
            setTimeout(() => {
              onLoginSuccess(res.user);
            }, 500);
          }
        } catch (err) {
          setErrorMsg(err.message || 'Invalid credentials. Please verify your email & password or use OTP.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf7f4] via-[#f7e6db] to-[#f4dcd0] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Campus Branding */}
      <div className="max-w-4xl mx-auto w-full text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#edd5c6] shadow-xs mb-3">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-semibold text-[#8b1e3f] uppercase tracking-wider">
            MITS Gwalior Secure Identity Gateway • Strict Access Control
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8b1e3f] text-white flex items-center justify-center shadow-md">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8b1e3f] tracking-tight">
              CampusOn OS
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Department of Electrical & Computer Engg. | Centre for Internet of Things
            </p>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-[#ebd7cc] overflow-hidden">
        {/* Mode Selector Tabs (Sign In vs Create Account) */}
        <div className="grid grid-cols-2 border-b border-[#ebd7cc] bg-[#fbf3ee]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setShowOtpScreen(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-4 text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'signin'
                ? 'bg-white text-[#8b1e3f] border-b-2 border-[#8b1e3f] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setShowOtpScreen(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-4 text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-white text-[#8b1e3f] border-b-2 border-[#8b1e3f] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Create New Account</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Role Selection Grid */}
          {!showOtpScreen && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Select Your Campus Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#8b1e3f] bg-[#fdf3ed] ring-2 ring-[#8b1e3f]/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#8b1e3f] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8b1e3f]" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? 'text-[#8b1e3f]' : 'text-slate-800'}`}>
                          {r.label}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {r.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* If In Sign-In Mode, offer Password vs OTP toggle */}
          {mode === 'signin' && !showOtpScreen && (
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-5 w-fit">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  authMethod === 'otp'
                    ? 'bg-[#8b1e3f] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>6-Digit OTP Login</span>
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* --- OTP VERIFICATION STEP MODAL / VIEW --- */}
          {showOtpScreen ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Simulated 2FA Delivery Banner for seamless evaluation */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-3 shadow-inner">
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">MITS 2FA Security Gateway</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      OTP generated for <span className="font-semibold underline">{otpTargetEmail}</span>:
                      <span className="ml-1.5 px-2 py-0.5 rounded bg-amber-200 font-mono font-extrabold text-amber-950 tracking-wider">
                        {activeOtpCode || '123456'}
                      </span>
                    </p>
                    <p className="text-[10px] text-amber-600 mt-1">
                      (Or test with backup examiner passkey: <span className="font-mono font-bold">123456</span>)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-2.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer"
                >
                  Auto-Fill OTP
                </button>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 text-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Enter 6-Digit Verification Code</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Please type the one-time passcode sent to authenticate your identity.
                  </p>
                </div>

                {/* 6 Individual Digit Boxes */}
                <div className="flex justify-center items-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-extrabold text-slate-900 border-2 rounded-xl focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none transition-all shadow-xs bg-slate-50"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-2">
                  <span className="font-medium">
                    {otpTimer > 0 ? (
                      `Resend code in ${otpTimer}s`
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleInitiateOtp(otpTargetEmail, otpActionType)}
                        className="text-[#8b1e3f] font-bold hover:underline"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="text-slate-400 hover:text-slate-600 underline"
                  >
                    Change Email / Details
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#8b1e3f] hover:bg-[#721832] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm OTP & Access Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* --- NORMAL AUTH FORM (Sign In / Sign Up) --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={
                        selectedRole === 'student' ? 'e.g. Shubhi Mathur' :
                        selectedRole === 'faculty' ? 'e.g. Dr. Murli Manohar' :
                        selectedRole === 'admin' ? 'e.g. Prof. R. C. Gupta' : 'e.g. Mr. R. K. Mathur'
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none text-xs text-slate-800"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email & Password / OTP Mode */}
              <div className={`grid grid-cols-1 ${mode === 'signup' || authMethod === 'password' ? 'sm:grid-cols-2' : ''} gap-4`}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institute / Personal Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@mitsgwalior.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none text-xs text-slate-800"
                      required
                    />
                  </div>
                </div>

                {(mode === 'signup' || authMethod === 'password') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none text-xs text-slate-800"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* --- Role Specific Fields for Sign Up --- */}
              {mode === 'signup' && selectedRole === 'student' && (
                <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                  <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student Academic Credentials</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Enrollment Number
                      </label>
                      <div className="relative">
                        <Hash className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          name="enrollmentNo"
                          value={formData.enrollmentNo}
                          onChange={handleInputChange}
                          placeholder="e.g. BTEC25O1060"
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Current Semester
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                      >
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="3rd Semester">3rd Semester (Current)</option>
                        <option value="4th Semester">4th Semester</option>
                        <option value="5th Semester">5th Semester</option>
                        <option value="6th Semester">6th Semester</option>
                        <option value="7th Semester">7th Semester</option>
                        <option value="8th Semester">8th Semester</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                      >
                        <option value="Electrical & Computer Engineering">Electrical & Computer Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="AI & Data Science">AI & Data Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        RFID Smart Card UID
                      </label>
                      <div className="relative">
                        <Radio className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          name="rfidTag"
                          value={formData.rfidTag}
                          onChange={handleInputChange}
                          placeholder="RFID-9A-4F-2C-11"
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'signup' && selectedRole === 'faculty' && (
                <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                  <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Faculty & Professor Profile</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Employee Code / Faculty ID
                      </label>
                      <input
                        type="text"
                        name="employeeCode"
                        value={formData.employeeCode}
                        onChange={handleInputChange}
                        placeholder="e.g. FAC-ECE-208"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Designation
                      </label>
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                      >
                        <option value="Associate Professor & IoT Mentor">Associate Professor & IoT Mentor</option>
                        <option value="Professor & Head of Department">Professor & Head of Department</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Laboratory Coordinator">Laboratory Coordinator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Cabin Location
                      </label>
                      <input
                        type="text"
                        name="cabin"
                        value={formData.cabin}
                        onChange={handleInputChange}
                        placeholder="e.g. Faculty Block B - Cabin 208"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'signup' && selectedRole === 'admin' && (
                <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                  <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Campus Administrator Authorization</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Admin Staff ID
                      </label>
                      <input
                        type="text"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={handleInputChange}
                        placeholder="e.g. ADM-MITS-01"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Administrative Division
                      </label>
                      <input
                        type="text"
                        name="adminDivision"
                        value={formData.adminDivision}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'signup' && selectedRole === 'parent' && (
                <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                  <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Parent & Ward Information</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Linked Student
                      </label>
                      <input
                        type="text"
                        name="linkedStudent"
                        value={formData.linkedStudent}
                        onChange={handleInputChange}
                        placeholder="e.g. Shubhi Mathur (BTEC25O1060)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Relationship
                      </label>
                      <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Local Guardian">Local Guardian</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="+91 98260 12345"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#8b1e3f] hover:bg-[#721832] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'signup'
                        ? 'Proceed & Verify with 6-Digit OTP'
                        : authMethod === 'otp'
                        ? 'Send 6-Digit Login OTP'
                        : 'Authorize & Launch Workspace'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick 1-Click Evaluation / Viva Test Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                One-Click Viva & Faculty Demo Logins
              </span>
              <span className="text-[10px] text-slate-400">Pre-seeded accounts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs cursor-pointer"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Student</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">Shubhi Mathur</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('faculty')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs cursor-pointer"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Faculty</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">Dr. M. Manohar</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs cursor-pointer"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Admin</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">Dean Infra</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('parent')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs cursor-pointer"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Parent</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">R. K. Mathur</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Specs */}
      <div className="max-w-4xl mx-auto w-full text-center mt-6 text-[11px] text-slate-500">
        <p>
          Integrated with <span className="font-semibold text-slate-700">Supabase Cloud 2FA & PostgreSQL Database</span> | Google OR-Tools CP-SAT Timetable Engine
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Developed by Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063) | Mentor: Dr. Murli Manohar
        </p>
      </div>
    </div>
  );
}
