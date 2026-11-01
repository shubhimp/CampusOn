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
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_DIRECTORY));
      return INITIAL_DIRECTORY;
    }
    return JSON.parse(raw);
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
  const cleanEmail = email.trim().toLowerCase();

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
    throw new Error('Invalid email or credentials. Please check your details or create a new account.');
  }

  // Ensure role consistency
  if (expectedRole && matchedUser.role !== expectedRole) {
    // allow switching role if desired or update
    matchedUser.role = expectedRole;
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
