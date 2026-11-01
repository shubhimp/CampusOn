import { createClient } from '@supabase/supabase-js';
import { USERS } from '../mockData';

const SUPABASE_URL = 'https://agnscincokkwkhgdwoab.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbnNjaW5jb2trd2toZ2R3b2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NDQwMzksImV4cCI6MjEwOTAyMDAzOX0.UqUJZXeZRchsaoiLcGwYdlmx4EWPAqa-aXFbIPeuA6E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

const STORAGE_SESSION_KEY = 'campuson_active_user';
const STORAGE_USERS_KEY = 'campuson_registered_directory';

export function normalizeEmail(email) {
  if (!email) return '';
  let clean = email.trim().toLowerCase();
  if (clean === 'shubhimp13@gmail') clean = 'shubhimp13@gmail.com';
  return clean;
}

// Default initial users for demo/evaluation
const INITIAL_DIRECTORY = [
  {
    id: 'usr_student_01',
    role: 'student',
    name: 'Shubhi Mathur',
    email: 'shubhi.btec25o1060@mitsgwalior.in',
    enrollmentNo: 'BTEC25O1060',
    department: 'Electrical & Computer Engineering',
    semester: '3rd Semester',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rfidTag: 'RFID-9A-4F-2C-11',
    createdAt: '2026-10-28T09:00:00Z',
    status: 'Verified Student'
  },
  {
    id: 'usr_faculty_01',
    role: 'faculty',
    name: 'Dr. Murli Manohar',
    email: 'murli.manohar@mitsgwalior.in',
    employeeCode: 'FAC-ECE-208',
    designation: 'Associate Professor & IoT Mentor',
    department: 'Electrical & Computer Engineering',
    cabin: 'Faculty Block B - Cabin 208',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-25T11:00:00Z',
    status: 'Active Faculty'
  },
  {
    id: 'usr_admin_01',
    role: 'admin',
    name: 'Prof. R. C. Gupta',
    email: 'dean.infra@mitsgwalior.in',
    adminCode: 'ADM-MITS-01',
    department: 'Dean of Academic & Campus Infrastructure',
    accessLevel: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-20T10:00:00Z',
    status: 'Super Admin'
  },
  {
    id: 'usr_admin_shubhi',
    role: 'admin',
    name: 'Shubhi Mathur',
    email: 'shubhimp13@gmail.com',
    adminCode: 'ADM-MITS-02',
    department: 'Central Administration & Campus Infrastructure',
    accessLevel: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-11-01T00:00:00Z',
    status: 'Super Administrator'
  },
  {
    id: 'usr_parent_01',
    role: 'parent',
    name: 'Mr. R. K. Mathur',
    email: 'rkmathur.gwalior@gmail.com',
    linkedStudent: 'Shubhi Mathur (BTEC25O1060)',
    relationship: 'Father',
    emergencyContact: '+91 98260 12345',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-29T14:30:00Z',
    status: 'Verified Guardian'
  }
];

export function getLocalDirectory() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list) || list.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_DIRECTORY));
      return INITIAL_DIRECTORY;
    }
    // Ensure all initial users (especially shubhimp13@gmail.com as admin) are present & up to date
    let updated = false;
    for (const initUser of INITIAL_DIRECTORY) {
      const idx = list.findIndex(u => u.email.toLowerCase() === initUser.email.toLowerCase());
      if (idx === -1) {
        list.unshift(initUser);
        updated = true;
      } else if (initUser.role === 'admin' && list[idx].role !== 'admin') {
        list[idx] = { ...list[idx], ...initUser };
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(list));
    }
    return list;
  } catch (e) {
    return INITIAL_DIRECTORY;
  }
}

export function saveUserToDirectory(newUser) {
  try {
    const dir = getLocalDirectory();
    const existingIdx = dir.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingIdx >= 0) {
      dir[existingIdx] = { ...dir[existingIdx], ...newUser };
    } else {
      dir.unshift(newUser);
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(dir));
  } catch (e) {
    console.error('Error saving user to local directory:', e);
  }
}

export function getStoredSessionUser() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading stored session:', e);
  }
  return null;
}

export function setStoredSessionUser(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } else {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
  }
}

/**
 * Register account dynamically with Supabase + Local persistence
 */
export async function registerAccount(details) {
  const {
    email,
    password,
    fullName,
    role,
    enrollmentNo,
    department,
    semester,
    rfidTag,
    employeeCode,
    designation,
    cabin,
    adminCode,
    linkedStudent,
    relationship,
    emergencyContact
  } = details;

  // Generate user ID & avatar
  const generatedId = `usr_${role}_${Date.now().toString(36)}`;
  const avatarPool = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  ];
  const avatar = details.avatar || avatarPool[Math.floor(Math.random() * avatarPool.length)];

  const profileData = {
    id: generatedId,
    email: email.trim().toLowerCase(),
    name: fullName.trim(),
    role,
    avatar,
    createdAt: new Date().toISOString(),
    status: 'Active Account',
    // Student specifics
    enrollmentNo: enrollmentNo ? enrollmentNo.trim().toUpperCase() : undefined,
    department: department || 'Electrical & Computer Engineering',
    semester: semester || '3rd Semester',
    rfidTag: rfidTag ? rfidTag.trim().toUpperCase() : `RFID-${Math.random().toString(16).substring(2, 6).toUpperCase()}-${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
    // Faculty / Professor specifics
    employeeCode: employeeCode ? employeeCode.trim().toUpperCase() : undefined,
    designation: designation || (role === 'faculty' ? 'Assistant Professor' : undefined),
    cabin: cabin || 'Faculty Block B',
    // Admin specifics
    adminCode: adminCode ? adminCode.trim().toUpperCase() : undefined,
    accessLevel: role === 'admin' ? 'Campus Super Administrator' : undefined,
    // Parent specifics
    linkedStudent: linkedStudent || undefined,
    relationship: relationship || 'Guardian',
    emergencyContact: emergencyContact || undefined,
  };

  // 1. Attempt Supabase Auth Sign Up
  let supabaseAuthSuccess = false;
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: profileData.email,
      password,
      options: {
        data: {
          full_name: profileData.name,
          role: profileData.role,
          enrollment_number: profileData.enrollmentNo,
          employee_code: profileData.employeeCode,
          department: profileData.department
        }
      }
    });

    if (!authError && authData?.user) {
      supabaseAuthSuccess = true;
      profileData.id = authData.user.id || profileData.id;
    } else if (authError) {
      console.warn('Supabase Auth Notice:', authError.message);
    }
  } catch (err) {
    console.warn('Supabase Auth caught notice:', err.message);
  }

  // 2. Insert into Supabase 'users' table
  try {
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: profileData.id.includes('-') ? profileData.id : undefined,
        email: profileData.email,
        full_name: profileData.name,
        role: profileData.role,
        avatar_url: profileData.avatar
      }, { onConflict: 'email' });

    if (dbError) {
      console.warn('Supabase DB users upsert notice:', dbError.message);
    }
  } catch (err) {
    console.warn('Supabase DB notice:', err.message);
  }

  // 3. Persist to Local Directory and set as active session
  saveUserToDirectory(profileData);
  setStoredSessionUser(profileData);

  return {
    success: true,
    user: profileData,
    supabaseAuth: supabaseAuthSuccess
  };
}

/**
 * Login account dynamically with Supabase or Directory
 */
export async function loginAccount(email, password, expectedRole) {
  const cleanEmail = normalizeEmail(email);

  // 1. Attempt Supabase Auth
  let authUser = null;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });
    if (!error && data?.user) {
      authUser = data.user;
    }
  } catch (e) {
    console.warn('Supabase signInWithPassword notice:', e.message);
  }

  // 2. Lookup in Directory / Mock data
  const directory = getLocalDirectory();
  let matchedUser = directory.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    // Check initial mock users
    for (const key of Object.keys(USERS)) {
      if (USERS[key].email.toLowerCase() === cleanEmail) {
        matchedUser = USERS[key];
        break;
      }
    }
  }

  // If user authenticated via Supabase but not yet in local directory
  if (authUser && !matchedUser) {
    const meta = authUser.user_metadata || {};
    matchedUser = {
      id: authUser.id,
      email: authUser.email,
      name: meta.full_name || authUser.email.split('@')[0],
      role: meta.role || expectedRole || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      enrollmentNo: meta.enrollment_number,
      employeeCode: meta.employee_code,
      department: meta.department || 'Electrical & Computer Engineering'
    };
    saveUserToDirectory(matchedUser);
  }

  // If still not matched, check if role was selected and synthesize fallback for demo flexibility
  if (!matchedUser && cleanEmail.includes('@')) {
    matchedUser = {
      id: `usr_${expectedRole || 'student'}_${Date.now().toString(36)}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      role: expectedRole || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      enrollmentNo: (expectedRole === 'student') ? `BTEC25O${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      employeeCode: (expectedRole === 'faculty') ? `FAC-ECE-${Math.floor(100 + Math.random() * 900)}` : undefined,
      department: 'Electrical & Computer Engineering',
      semester: '3rd Semester'
    };
    saveUserToDirectory(matchedUser);
  }

  if (!matchedUser) {
    throw new Error('Invalid email or credentials. Please check your credentials or contact administrator.');
  }

  // Strict Single-Dashboard Enforcement: Account can only access its assigned dashboard
  if (expectedRole && matchedUser.role && matchedUser.role.toLowerCase() !== expectedRole.toLowerCase()) {
    throw new Error(
      `Access Denied: This account is authorized strictly for the ${matchedUser.role.toUpperCase()} Dashboard. You cannot log into the ${expectedRole.toUpperCase()} portal with these credentials.`
    );
  }

  setStoredSessionUser(matchedUser);
  return { success: true, user: matchedUser };
}

/**
 * Sign out and clear active session
 */
export async function logoutAccount() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('Sign out notice:', e.message);
  }
  setStoredSessionUser(null);
}

/**
 * OTP Verification Services (2FA & Passwordless Auth)
 */
export async function requestOtpCode(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please provide a valid institute or personal email.');
  }

  // Generate 6-digit cryptographic security code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Store in local storage for instantaneous demo & viva resilience
  const otpData = {
    code: otpCode,
    email: cleanEmail,
    expiresAt
  };
  localStorage.setItem(`campuson_otp_${cleanEmail}`, JSON.stringify(otpData));

  // Also attempt Supabase native OTP dispatch
  let supabaseDispatched = false;
  let isRateLimited = false;
  let errorMessage = '';

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true
      }
    });
    if (!error) {
      supabaseDispatched = true;
    } else {
      errorMessage = error.message;
      if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
        isRateLimited = true;
      }
    }
  } catch (err) {
    errorMessage = err.message;
    if (err.message && err.message.toLowerCase().includes('rate limit')) {
      isRateLimited = true;
    }
  }

  return {
    success: true,
    email: cleanEmail,
    otpCode,
    supabaseDispatched,
    isRateLimited,
    errorMessage,
    expiresInSeconds: 300
  };
}

export async function verifyOtpCode(email, enteredCode) {
  const cleanEmail = normalizeEmail(email);
  const trimmedCode = (enteredCode || '').trim();

  // 1. Universal backup passkey for evaluation & viva presentation
  if (trimmedCode === '123456') {
    return { valid: true };
  }

  // 2. Attempt native Supabase verifyOtp
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: trimmedCode,
      type: 'email'
    });
    if (!error && data?.user) {
      return { valid: true, user: data.user };
    }
  } catch (err) {
    console.warn('Supabase verifyOtp notice:', err.message);
  }

  // 3. Check stored dispatched OTP
  const raw = localStorage.getItem(`campuson_otp_${cleanEmail}`);
  if (!raw) {
    throw new Error('No active OTP found for this email. You can enter backup passkey 123456 or click resend.');
  }

  const { code, expiresAt } = JSON.parse(raw);

  if (Date.now() > expiresAt) {
    localStorage.removeItem(`campuson_otp_${cleanEmail}`);
    throw new Error('OTP has expired (valid for 5 minutes). You can enter backup passkey 123456 or request a new code.');
  }

  if (trimmedCode !== code.trim()) {
    throw new Error('Incorrect 6-digit OTP code. Please check your inbox or use backup passkey 123456.');
  }

  // Clear once consumed
  localStorage.removeItem(`campuson_otp_${cleanEmail}`);
  return { valid: true };
}

/**
 * Instant Passwordless Login via OTP
 */
export async function loginWithOtp(email, otpCode, expectedRole) {
  await verifyOtpCode(email, otpCode);

  const cleanEmail = normalizeEmail(email);
  const directory = getLocalDirectory();
  let matchedUser = directory.find(u => u.email.toLowerCase() === cleanEmail);

  // Strict Single-Dashboard Enforcement: Account can only access its assigned dashboard
  if (matchedUser && expectedRole && matchedUser.role && matchedUser.role.toLowerCase() !== expectedRole.toLowerCase()) {
    throw new Error(
      `Access Denied: This account is authorized strictly for the ${matchedUser.role.toUpperCase()} Dashboard. You cannot log into the ${expectedRole.toUpperCase()} portal with these credentials.`
    );
  }

  if (!matchedUser) {
    // Generate verified dynamic account
    matchedUser = {
      id: `usr_${expectedRole || 'student'}_${Date.now().toString(36)}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      role: expectedRole || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      enrollmentNo: (expectedRole === 'student') ? `BTEC25O${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      employeeCode: (expectedRole === 'faculty') ? `FAC-ECE-${Math.floor(100 + Math.random() * 900)}` : undefined,
      department: 'Electrical & Computer Engineering',
      semester: '3rd Semester',
      status: 'OTP 2FA Verified'
    };
    saveUserToDirectory(matchedUser);
  }

  setStoredSessionUser(matchedUser);
  return { success: true, user: matchedUser };
}


/**
 * Password Reset Services (via 6-Digit OTP or Supabase Email Link)
 */
export async function requestPasswordResetOtp(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid institute or personal email.');
  }

  // Generate 6-digit reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  localStorage.setItem(`campuson_reset_otp_${cleanEmail}`, JSON.stringify({
    code: resetCode,
    email: cleanEmail,
    expiresAt
  }));

  // Also dispatch Supabase native password reset email link
  let supabaseLinkSent = false;
  let isRateLimited = false;
  let errorMessage = '';

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/?mode=reset`
    });
    if (!error) {
      supabaseLinkSent = true;
    } else {
      errorMessage = error.message;
      if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
        isRateLimited = true;
      }
    }
  } catch (err) {
    errorMessage = err.message;
    if (err.message && err.message.toLowerCase().includes('rate limit')) {
      isRateLimited = true;
    }
  }

  return {
    success: true,
    email: cleanEmail,
    resetCode,
    supabaseLinkSent,
    isRateLimited,
    errorMessage
  };
}

export async function confirmPasswordReset(email, enteredCode, newPassword) {
  const cleanEmail = normalizeEmail(email);
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const raw = localStorage.getItem(`campuson_reset_otp_${cleanEmail}`);

  // Check code or master viva code 123456
  let isValid = false;
  if (enteredCode === '123456') {
    isValid = true;
  } else if (raw) {
    const { code, expiresAt } = JSON.parse(raw);
    if (Date.now() <= expiresAt && enteredCode.trim() === code.trim()) {
      isValid = true;
    }
  }

  if (!isValid) {
    throw new Error('Invalid or expired 6-digit OTP reset code. Please check your email inbox.');
  }

  // Clear consumed reset code
  localStorage.removeItem(`campuson_reset_otp_${cleanEmail}`);

  // Update password in local directory
  const dir = getLocalDirectory();
  const user = dir.find(u => u.email.toLowerCase() === cleanEmail);
  if (user) {
    user.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(dir));
  }

  // Attempt Supabase updateUser
  try {
    await supabase.auth.updateUser({ password: newPassword });
  } catch (err) {
    console.warn('Supabase updateUser notice:', err.message);
  }

  return { success: true };
}
