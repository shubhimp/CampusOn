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
  Key,
  Send,
  ArrowLeft,
  Check,
  ChevronDown,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { 
  registerAccount, 
  loginAccount, 
  requestOtpCode, 
  verifyOtpCode, 
  loginWithOtp,
  requestPasswordResetOtp,
  confirmPasswordReset
} from '../services/supabaseClient';
import { EXAMINER_CREDENTIALS, SAMPLE_CREDENTIALS } from '../mockData';

export default function AuthPage({ onLoginSuccess }) {
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [authMethod, setAuthMethod] = useState('password'); // 'password' | 'otp'
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Security & Concealed Credentials State
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedCredId, setCopiedCredId] = useState(null);
  const [credRoleFilter, setCredRoleFilter] = useState('ALL'); // 'ALL' | 'student' | 'faculty' | 'admin' | 'parent'
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const togglePasswordVisibility = (credId) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [credId]: !prev[credId]
    }));
  };

  const handleCopySecurePassword = (password, credId, e) => {
    e?.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(password);
      setCopiedCredId(credId);
      setTimeout(() => setCopiedCredId(null), 2000);
    }
  };

  // Password Reset Specific State
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify'
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtpDigits, setResetOtpDigits] = useState(['', '', '', '', '', '']);
  const [activeResetCode, setActiveResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);

  // OTP Verification Modal / Step State (for Sign Up & OTP Sign In)
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTargetEmail, setOtpTargetEmail] = useState('');
  const [activeOtpCode, setActiveOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpActionType, setOtpActionType] = useState('signup'); // 'signup' | 'signin'
  const [isEmailRateLimited, setIsEmailRateLimited] = useState(false);
  const [showPasskeyHelper, setShowPasskeyHelper] = useState(false);

  const inputRefs = useRef([]);
  const resetInputRefs = useRef([]);

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
      defaultEmail: 'shubhimp13@gmail.com'
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

  // Auto-Fill Examiner Dummy Credentials into Form
  const handleAutoFillExaminer = (cred) => {
    setFormData(prev => ({
      ...prev,
      email: cred.email,
      password: cred.password
    }));
    setAuthMethod('password');
    setSuccessMsg(`Auto-filled ${cred.roleLabel} credentials (${cred.email}). Click "Authenticate Smart Tag & Launch Portal" to sign in.`);
  };

  // 1-Click Direct Launch for Examiner
  const handleLaunchExaminerCred = async (cred) => {
    setLoading(true);
    setErrorMsg('');
    setShowOtpScreen(false);
    try {
      const res = await loginAccount(cred.email, cred.password);
      if (res.success) {
        setSuccessMsg(`Verified: Welcome, ${res.user.name}! Loading ${res.user.role.toUpperCase()} Dashboard...`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 400);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Examiner / Demo Login (Supports RFID Tag tap)
  const handleQuickDemoLogin = async (roleId) => {
    setLoading(true);
    setErrorMsg('');
    setShowOtpScreen(false);
    try {
      const demoAccounts = {
        student: { email: '25ec1sh60@mitgwl.ac.in', pass: 'Priya@456' },
        faculty: { email: 'murlimanohar@mitsgwalior.in', pass: 'Murli@789' },
        admin: { email: 'shubhimathur2006@gmail.com', pass: 'Shubhim@789' },
        parent: { email: 'vibhamathur13@gmail.com', pass: 'Vibha@789' }
      };
      const creds = demoAccounts[roleId];
      const res = await loginAccount(creds.email, creds.pass);
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
      setIsEmailRateLimited(!!res.isRateLimited);
      setShowOtpScreen(true);
      if (res.isRateLimited) {
        setErrorMsg('Notice: Supabase free mail queue reached hourly limit (max 3/hr). For viva testing, enter Master Passkey 123456 or click "Didn\'t receive email?" below.');
        setShowPasskeyHelper(true);
      } else {
        setSuccessMsg(`6-Digit Verification Code dispatched to ${targetEmail}`);
      }
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
      // Sign In via OTP (Auto-detects role and dashboard)
      const res = await loginWithOtp(otpTargetEmail, entered);
      if (res.success) {
        setSuccessMsg(`OTP Verified: Welcome, ${res.user.name}! Loading ${res.user.role.toUpperCase()} Dashboard...`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Password Reset Handlers ---
  const handleRequestResetOtp = async (e) => {
    if (e) e.preventDefault();
    const target = (resetEmail || formData.email || '').trim();
    if (!target || !target.includes('@')) {
      setErrorMsg('Please enter a valid institute or personal email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await requestPasswordResetOtp(target);
      setActiveResetCode(res.resetCode);
      setResetEmail(target);
      setForgotStep('verify');
      setResetOtpDigits(['', '', '', '', '', '']);
      setIsEmailRateLimited(!!res.isRateLimited);
      if (res.isRateLimited) {
        setErrorMsg('Supabase Free Mailer rate limit exceeded (max 3/hr). For evaluation, use Master Reset Code 123456 or click Auto-Fill.');
      } else {
        setSuccessMsg(`6-digit password reset code sent to ${target}`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch password reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetLink = async () => {
    const target = (resetEmail || formData.email || '').trim();
    if (!target || !target.includes('@')) {
      setErrorMsg('Please enter a valid institute or personal email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await requestPasswordResetOtp(target);
      setResetLinkSent(true);
      setSuccessMsg(`Supabase password reset link and 6-digit OTP dispatched to ${target}!`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDigitChange = (index, value) => {
    const char = value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newDigits = [...resetOtpDigits];
    newDigits[index] = char;
    setResetOtpDigits(newDigits);

    if (char && index < 5 && resetInputRefs.current[index + 1]) {
      resetInputRefs.current[index + 1].focus();
    }
  };

  const handleResetDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !resetOtpDigits[index] && index > 0 && resetInputRefs.current[index - 1]) {
      resetInputRefs.current[index - 1].focus();
    }
  };

  const handleAutoFillResetOtp = () => {
    const code = activeResetCode || '123456';
    setResetOtpDigits(code.split('').slice(0, 6));
  };

  const handleConfirmResetSubmit = async (e) => {
    e.preventDefault();
    const code = resetOtpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your password reset code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await confirmPasswordReset(resetEmail, code, newPassword);
      setSuccessMsg('Password updated successfully in Supabase! Redirecting to Sign In...');
      setTimeout(() => {
        setFormData(prev => ({ ...prev, email: resetEmail, password: newPassword }));
        setMode('signin');
        setForgotStep('request');
        setNewPassword('');
        setConfirmNewPassword('');
        setResetLinkSent(false);
        setSuccessMsg('Your password has been updated. Please sign in now.');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit Handler (Allotted Smart Tag & ID Authentication)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.email) {
      setErrorMsg('Please enter your Allotted RFID Tag UID, Institute ID, or Email.');
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
        const res = await loginAccount(formData.email, formData.password);
        if (res.success) {
          setSuccessMsg(`Smart Tag Verified: Welcome, ${res.user.name}! Loading ${res.user.role.toUpperCase()} Dashboard...`);
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 500);
        }
      } catch (err) {
        setErrorMsg(err.message || 'Invalid credentials or unrecognized tag.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] dark:bg-[#08080A] bg-pixel-grid flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      {/* Top Campus Branding & Theme Toggle */}
      <div className="max-w-4xl mx-auto w-full text-center mb-6">
        <div className="flex items-center justify-between gap-3 mb-3 max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#121217] border border-[#FEF08A] dark:border-[#222228] shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-[#FFD000]" />
            <span className="text-xs font-mono font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider">
              MITS Gwalior Secure Identity Gateway
            </span>
          </div>

          {/* Pro Skilll Direct Theme Switcher Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#121217] border border-[#E9E9E7] dark:border-[#27272A] text-xs font-bold text-[#191919] dark:text-[#FFD000] shadow-xs hover:border-[#FFD000] dark:hover:border-[#FFD000] cursor-pointer transition-all"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme (or open with ?theme=${isDark ? 'light' : 'dark'})`}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FFD000]" />
                <span className="font-mono text-[11px] font-bold text-white">Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#191919]" />
                <span className="font-mono text-[11px] font-bold text-[#191919]">Dark Theme</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD000] text-black flex items-center justify-center shadow-[0_0_22px_rgba(255,208,0,0.38)] font-bold">
            <Cpu className="w-7 h-7 text-black animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>Campus</span>
              <span className="text-[#CA8A04] dark:text-[#FFD000]">On</span>
              <span className="font-mono text-xs font-bold text-black bg-[#FFD000] px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </h1>
            <p className="text-xs font-semibold text-slate-600 dark:text-[#A1A1AA]">
              Department of Electrical & Computer Engg. | Centre for Internet of Things
            </p>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-3xl mx-auto w-full bg-white dark:bg-[#121217] rounded-3xl shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-[#FEF08A] dark:border-[#222228] overflow-hidden transition-colors">
        {/* Institutional Sign-In Header Banner */}
        <div className="px-6 py-4 border-b border-[#FEF08A] dark:border-[#222228] bg-[#FEFDF8] dark:bg-[#0D0D11] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFD000] text-black flex items-center justify-center shadow-xs font-bold">
              <Lock className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider">
                {mode === 'forgot' ? 'Account Password Recovery' : 'Institutional Single Sign-On'}
              </h2>
              <p className="text-[11px] font-medium text-slate-500 dark:text-[#A1A1AA]">
                {mode === 'forgot'
                  ? 'Verify via 6-digit email OTP to set a new password'
                  : 'Auto-provisioned student, faculty, admin & parent accounts'}
              </p>
            </div>
          </div>
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#181820] border border-slate-200 dark:border-[#27272A] hover:border-[#FFD000] text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {/* Allotted Smart Tag Identity Notice */}
          {!showOtpScreen && mode !== 'forgot' && (
            <div className="mb-5 p-4 rounded-2xl bg-[#FEF9C3] dark:bg-[#0D0D11] border border-[#FDE047] dark:border-[#222228] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD000] text-black flex items-center justify-center shadow-xs font-bold">
                  <Radio className="w-5 h-5 text-black animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider">
                    Allotted Campus Smart Tag & ID Gateway
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-[#A1A1AA] mt-0.5">
                    Enter your allotted RFID Smart Tag UID, Institute ID, or Email. Your single authorized dashboard will be loaded automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* If In Sign-In Mode, offer Password vs OTP toggle */}
          {mode === 'signin' && !showOtpScreen && (
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-[#0D0D11] border border-slate-200 dark:border-[#222228] rounded-xl mb-5 w-fit">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-[#FFD000] text-black shadow-xs'
                    : 'text-slate-600 dark:text-[#A1A1AA] hover:text-black dark:hover:text-white'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  authMethod === 'otp'
                    ? 'bg-[#FFD000] text-black shadow-xs'
                    : 'text-slate-600 dark:text-[#A1A1AA] hover:text-black dark:hover:text-white'
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

          {/* --- FORGOT / RESET PASSWORD VIEW (OTP & Direct Link) --- */}
          {mode === 'forgot' ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                  title="Return to Sign In"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Reset Your Campus Account Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose between a 6-digit OTP code or direct Supabase password reset email link.
                  </p>
                </div>
              </div>

              {/* Step 1: Request Code or Link */}
              {forgotStep === 'request' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Registered Institute or Personal Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="e.g. shubhi.btec25o1060@mitsgwalior.in"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#141419] focus:border-[#FFD000] focus:ring-2 focus:ring-[#FFD000]/25 outline-none text-xs text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  {resetLinkSent && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Password reset link has been dispatched to your email via Supabase Auth! Please check your inbox.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Method A: 6-Digit OTP */}
                    <button
                      type="button"
                      onClick={handleRequestResetOtp}
                      disabled={loading}
                      className="py-3 px-4 rounded-xl bg-[#FFD000] hover:bg-[#F0C400] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(255,208,0,0.32)] transition-all disabled:opacity-50 cursor-pointer border border-[#FFD000]"
                    >
                      <Smartphone className="w-4 h-4 text-black" />
                      <span>Reset via 6-Digit OTP</span>
                    </button>

                    {/* Method B: Direct Supabase Email Link */}
                    <button
                      type="button"
                      onClick={handleSendResetLink}
                      disabled={loading}
                      className="py-3 px-4 rounded-xl bg-white dark:bg-[#121217] hover:bg-slate-50 dark:hover:bg-[#181820] border-2 border-slate-200 dark:border-[#27272A] hover:border-[#FFD000] text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                      <span>Send Email Magic Link</span>
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                    >
                      Remembered your password? Return to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Verify OTP and Set New Password */}
              {forgotStep === 'verify' && (
                <form onSubmit={handleConfirmResetSubmit} className="space-y-4">
                  {/* Clean Password Reset Email Notice (No OTP displayed on screen) */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-300 text-xs flex items-center gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Reset Code Sent to Your Email</p>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                        A 6-digit password reset code has been sent to <span className="font-bold underline">{resetEmail}</span>.
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Please check your inbox (and spam folder) and enter the 6 digits below to set a new password.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#A1A1AA] text-center mb-2">
                      Enter 6-Digit Password Reset Code
                    </label>
                    <div className="flex justify-center items-center gap-2 sm:gap-3">
                      {resetOtpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (resetInputRefs.current[idx] = el)}
                          type="text"
                          maxLength={1}
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleResetDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleResetDigitKeyDown(idx, e)}
                          className="w-10 h-12 sm:w-11 sm:h-13 text-center font-mono text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white border-2 rounded-xl focus:border-[#FFD000] focus:ring-2 focus:ring-[#FFD000]/25 outline-none shadow-xs bg-slate-50 dark:bg-[#141419] dark:border-[#27272A]"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
                      <button
                        type="button"
                        onClick={handleAutoFillResetOtp}
                        className="text-[#CA8A04] dark:text-[#FFD000] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Didn't receive code? Auto-Fill Master Code (123456)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestResetOtp}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-[#A1A1AA] mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#141419] text-xs focus:border-[#FFD000] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-[#A1A1AA] mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#141419] text-xs focus:border-[#FFD000] outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FFD000] hover:bg-[#F0C400] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,208,0,0.35)] transition-all disabled:opacity-50 cursor-pointer border border-[#FFD000]"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Update Password & Enter Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                    >
                      ← Back to Change Email
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : showOtpScreen ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Clean Email Delivery Notice (No OTP displayed on screen) */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-emerald-900 text-sm">6-Digit Verification Code Sent to Email</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    We have dispatched your one-time verification passcode to <span className="font-bold text-emerald-950 underline">{otpTargetEmail}</span>.
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Please check your email inbox (and spam/junk folder) and type the 6 digits below.
                  </p>
                </div>
              </div>

              {/* Rate Limit Alert if Supabase free tier email throttled */}
              {isEmailRateLimited && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs flex items-start gap-3 shadow-xs text-left">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900">Supabase Free Mail Rate Limit Active (Max 3/hr)</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      Supabase free-tier projects limit automated emails to 3 per hour, so external delivery may be delayed. For viva testing, use Master Passkey <span className="font-mono font-bold bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950">123456</span> or use the 1-click helper below.
                    </p>
                  </div>
                </div>
              )}

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
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white border-2 rounded-xl focus:border-[#FFD000] focus:ring-2 focus:ring-[#FFD000]/25 outline-none transition-all shadow-xs bg-slate-50 dark:bg-[#141419] dark:border-[#27272A]"
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
                        className="text-[#CA8A04] dark:text-[#FFD000] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white underline cursor-pointer"
                  >
                    Change Email / Details
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#FFD000] hover:bg-[#F0C400] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,208,0,0.35)] transition-all disabled:opacity-50 cursor-pointer border border-[#FFD000]"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm OTP & Access Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Expandable Fallback Helper: "Didn't receive email?" */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasskeyHelper(prev => !prev)}
                    className="text-xs text-slate-500 hover:text-[#CA8A04] dark:hover:text-[#FFD000] inline-flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>Didn't receive the email within 1 minute?</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPasskeyHelper ? 'rotate-180' : ''}`} />
                  </button>

                  {showPasskeyHelper && (
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-[#141419] rounded-2xl border border-slate-200 dark:border-[#27272A] text-left space-y-3 animate-in fade-in">
                      <div className="flex items-start gap-2.5">
                        <Key className="w-4 h-4 text-[#CA8A04] dark:text-[#FFD000] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">
                            Viva & Testing Passkey Bypass
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] mt-0.5 leading-relaxed">
                            Supabase Free Tier limits automated emails to 3 per hour. If your email was delayed or throttled, enter master test passkey <span className="font-mono font-bold text-black bg-[#FFD000] px-1 py-0.5 rounded">123456</span> or use the 1-click button below:
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleAutoFillOtp}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#181820] border border-[#FFD000]/40 hover:bg-[#FEF9C3] dark:hover:bg-[#222228] text-slate-900 dark:text-[#FFD000] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                          <span>Auto-Fill Passcode (123456)</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const res = await loginAccount(otpTargetEmail, 'MITS@2026', selectedRole);
                              if (res.success) onLoginSuccess(res.user);
                            } catch (e) {
                              setErrorMsg(e.message || 'Direct bypass failed');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FFD000] hover:bg-[#F0C400] text-black text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer border border-[#FFD000]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-black" />
                          <span>Direct Instant Launch</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          ) : (
            /* --- INSTITUTIONAL SINGLE SIGN-ON FORM --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Allotted Smart Tag / ID / Email & Password */}
              <div className={`grid grid-cols-1 ${authMethod === 'password' ? 'sm:grid-cols-2' : ''} gap-4`}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#A1A1AA] mb-1">
                    Allotted RFID Smart Tag UID / Institute ID / Email
                  </label>
                  <div className="relative">
                    <Radio className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. RFID-9A-4F-2C-11, BTEC25O1060, FAC-ECE-208, or shubhimp13@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#141419] focus:border-[#FFD000] focus:ring-2 focus:ring-[#FFD000]/25 outline-none text-xs text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {authMethod === 'password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-[#A1A1AA]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setResetEmail(formData.email);
                          setForgotStep('request');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-[11px] font-semibold text-[#CA8A04] dark:text-[#FFD000] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#141419] focus:border-[#FFD000] focus:ring-2 focus:ring-[#FFD000]/25 outline-none text-xs text-slate-800 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                        title={showSignInPassword ? 'Conceal Password' : 'Show Password'}
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FFD000] hover:bg-[#F0C400] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,208,0,0.35)] hover:shadow-[0_0_30px_rgba(255,208,0,0.55)] border border-[#FFD000] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {authMethod === 'otp'
                        ? 'Send 6-Digit Login OTP'
                        : 'Authenticate Smart Tag & Launch Portal'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              {/* Institutional Notice for Auto-Generated Accounts */}
              <div className="text-center pt-3 border-t border-slate-100 dark:border-[#222228] mt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF9C3] dark:bg-[#0D0D11] border border-[#FDE047] dark:border-[#222228] text-slate-800 dark:text-[#A1A1AA] text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                  <span>MITS Smart Campus OS: All user profiles are pre-allotted with dedicated IoT tags & IDs.</span>
                </div>
              </div>
            </form>
          )}

          {/* 🎓 Authorized Sample Credentials (13 Profiles - Passwords Masked for Presentation Security) */}
          <div className="mt-8 pt-6 border-t border-[#FEF08A] dark:border-[#222228]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#FFD000] text-black font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                </span>
                <span className="text-xs font-mono font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider">
                  CampusOn Sample Credentials ({SAMPLE_CREDENTIALS.length} Authorized Profiles)
                </span>
              </div>
              <span className="text-[10px] bg-[#FEF9C3] dark:bg-[#FFD000]/15 text-[#713F12] dark:text-[#FFD000] border border-[#FDE047] dark:border-[#FFD000]/30 px-2 py-0.5 rounded font-mono font-bold self-start sm:self-auto flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#CA8A04] dark:text-[#FFD000]" />
                <span>PASSWORDS CONCEALED FOR SECURITY</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] mb-3">
              Passwords are automatically masked for public presentation & viva evaluations. Click <strong>1-Click Launch</strong> to enter directly, <strong>Auto-Fill</strong> to test, or click the <strong>Eye icon</strong> to reveal.
            </p>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              {[
                { id: 'ALL', label: `All Profiles (${SAMPLE_CREDENTIALS.length})` },
                { id: 'student', label: `Students (${SAMPLE_CREDENTIALS.filter(c => c.role === 'student').length})` },
                { id: 'faculty', label: `Faculty (${SAMPLE_CREDENTIALS.filter(c => c.role === 'faculty').length})` },
                { id: 'admin', label: `Admins (${SAMPLE_CREDENTIALS.filter(c => c.role === 'admin').length})` },
                { id: 'parent', label: `Parents (${SAMPLE_CREDENTIALS.filter(c => c.role === 'parent').length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCredRoleFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    credRoleFilter === tab.id
                      ? 'bg-[#FFD000] text-black shadow-xs'
                      : 'bg-[#FEF9C3]/50 dark:bg-[#181820] text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {SAMPLE_CREDENTIALS
                .filter(cred => credRoleFilter === 'ALL' || cred.role === credRoleFilter)
                .map((cred) => {
                  const isRevealed = !!revealedPasswords[cred.id];
                  const isCopied = copiedCredId === cred.id;
                  return (
                    <div
                      key={cred.id}
                      className="p-3.5 rounded-2xl bg-[#FEFDF8] dark:bg-[#0D0D11] border border-[#FEF08A] dark:border-[#222228] hover:border-[#FFD000] dark:hover:border-[#FFD000] transition-all shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            cred.role === 'student' ? 'bg-[#FFD000] text-black' :
                            cred.role === 'faculty' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800' :
                            cred.role === 'admin' ? 'bg-amber-400 text-black font-extrabold' :
                            'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            {cred.role.toUpperCase()}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 dark:text-[#71717A] font-bold">
                            {cred.allottedId}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{cred.name}</h4>
                        <p className="text-[10px] text-slate-600 dark:text-[#A1A1AA] font-mono mt-0.5 truncate select-all" title={cred.email}>
                          {cred.email}
                        </p>

                        {/* Masked Password Container */}
                        <div className="mt-2 p-2 rounded-lg bg-slate-100/70 dark:bg-[#141419] border border-slate-200/80 dark:border-[#27272A] flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <span className="text-[10px] text-slate-400 select-none">Pass:</span>
                            <span className={`font-bold tracking-wider select-all ${isRevealed ? 'text-slate-900 dark:text-white text-xs' : 'text-slate-500 dark:text-zinc-500 text-sm'}`}>
                              {isRevealed ? cred.password : '••••••••'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Toggle Reveal */}
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(cred.id)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#222228] text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
                              title={isRevealed ? 'Hide Password' : 'Show Password (Private)'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>

                            {/* Copy Password */}
                            <button
                              type="button"
                              onClick={(e) => handleCopySecurePassword(cred.password, cred.id, e)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#222228] text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
                              title="Copy password without displaying"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#222228] flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLaunchExaminerCred(cred)}
                          disabled={loading}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-[#FFD000] hover:bg-[#F0C400] text-black font-bold text-[10px] flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50 border border-[#FFD000]"
                        >
                          <span>1-Click Launch</span>
                          <ArrowRight className="w-3 h-3 text-black" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAutoFillExaminer(cred)}
                          disabled={loading}
                          className="py-1.5 px-2 rounded-lg bg-white dark:bg-[#181820] hover:bg-[#FEF9C3] text-slate-800 dark:text-slate-200 font-bold text-[10px] border border-slate-200 dark:border-[#27272A] transition-all cursor-pointer"
                          title="Auto-fill email and masked password into Sign In form"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Simulated Smart Card Tap */}
          <div className="mt-6 pt-5 border-t border-[#FEF08A] dark:border-[#222228]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-700 dark:text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000] animate-pulse" />
                Simulate Smart Card Tap (Pre-Allotted Hardware Tags)
              </span>
              <span className="text-[10px] bg-[#FEF9C3] dark:bg-[#FFD000]/15 text-[#713F12] dark:text-[#FFD000] border border-[#FDE047] dark:border-[#FFD000]/30 px-2 py-0.5 rounded font-mono font-bold">
                AUTO-IDENTIFY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                disabled={loading}
                className="px-2.5 py-2.5 rounded-xl bg-white dark:bg-[#0D0D11] hover:bg-[#FEF9C3] dark:hover:bg-[#181820] border border-[#FEF08A] dark:border-[#222228] hover:border-[#FFD000] dark:hover:border-[#FFD000] text-left transition-all text-xs cursor-pointer shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                  <span>Tap Student Tag</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono mt-0.5 truncate">25EC1SH60</p>
                <p className="text-[9px] text-[#CA8A04] dark:text-[#FFD000] font-semibold truncate">Shubhi (3rd Sem)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('faculty')}
                disabled={loading}
                className="px-2.5 py-2.5 rounded-xl bg-white dark:bg-[#0D0D11] hover:bg-[#FEF9C3] dark:hover:bg-[#181820] border border-[#FEF08A] dark:border-[#222228] hover:border-[#FFD000] dark:hover:border-[#FFD000] text-left transition-all text-xs cursor-pointer shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                  <span>Tap Faculty Tag</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono mt-0.5 truncate">FAC-ECE-208</p>
                <p className="text-[9px] text-[#CA8A04] dark:text-[#FFD000] font-semibold truncate">Dr. Murli Manohar</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
                className="px-2.5 py-2.5 rounded-xl bg-white dark:bg-[#0D0D11] hover:bg-[#FEF9C3] dark:hover:bg-[#181820] border border-[#FEF08A] dark:border-[#222228] hover:border-[#FFD000] dark:hover:border-[#FFD000] text-left transition-all text-xs cursor-pointer shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                  <span>Tap Admin Tag</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono mt-0.5 truncate">ADM-MITS-02</p>
                <p className="text-[9px] text-[#CA8A04] dark:text-[#FFD000] font-semibold truncate">Shubhi Mathur</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('parent')}
                disabled={loading}
                className="px-2.5 py-2.5 rounded-xl bg-white dark:bg-[#0D0D11] hover:bg-[#FEF9C3] dark:hover:bg-[#181820] border border-[#FEF08A] dark:border-[#222228] hover:border-[#FFD000] dark:hover:border-[#FFD000] text-left transition-all text-xs cursor-pointer shadow-2xs"
              >
                <p className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" />
                  <span>Tap Parent Tag</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono mt-0.5 truncate">PRT-98261</p>
                <p className="text-[9px] text-[#CA8A04] dark:text-[#FFD000] font-semibold truncate">Vibha Mathur</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Specs */}
      <div className="max-w-4xl mx-auto w-full text-center mt-6 text-[11px] text-slate-500 dark:text-[#71717A]">
        <p>
          Integrated with <span className="font-semibold text-slate-700 dark:text-slate-300">Supabase Cloud 2FA & PostgreSQL Database</span> | Google OR-Tools CP-SAT Timetable Engine
        </p>
        <p className="text-[10px] text-slate-400 dark:text-[#52525B] mt-1 font-mono">
          Developed by Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063) | Mentor: Dr. Murli Manohar
        </p>
      </div>
    </div>
  );
}
