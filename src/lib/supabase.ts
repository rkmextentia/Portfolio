import { createClient } from '@supabase/supabase-js';
import { COURSES, type Course } from './courses-data';

// Public Supabase Configuration
export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SUPABASE_URL) || 
  'https://dovtttobiciiekppuvbw.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SUPABASE_ANON_KEY) || 
  'sb_publishable_kunA_NG_7XqhiymLh8FrdQ_xRIw6xg8';

// Browser-safe Supabase Client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'rkmidigi_student_auth'
  }
});

export interface StudentProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role?: string;
  created_at: string;
  enrolled_courses?: string[];
}

export interface EnrollmentRecord {
  id: string;
  user_id?: string;
  student_email: string;
  student_name?: string;
  course_id: string;
  course_title?: string;
  amount_inr?: number;
  payment_id?: string;
  status: 'active' | 'completed' | 'revoked';
  created_at: string;
}

// Helper: Get all available courses
export function getAllCourses(): Course[] {
  return COURSES;
}

// Helper: Get a course by slug
export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find(c => c.slug === slug);
}

// Helper: Check if user is enrolled in course
export async function isUserEnrolled(courseId: string, userEmail?: string): Promise<boolean> {
  if (!courseId) return false;

  // 1. Check local session enrollments (for instant testing & offline purchases)
  if (typeof window !== 'undefined') {
    const localEnrollments = JSON.parse(localStorage.getItem('rkmidigi_enrolled_courses') || '[]');
    if (localEnrollments.includes(courseId)) {
      return true;
    }
  }

  // 2. Query Supabase database enrollments table
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('enrollments')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      // If table not yet created in Supabase, rely on local verification
      return false;
    }

    return !!data;
  } catch (err) {
    return false;
  }
}

// Helper: Grant enrollment to user
export async function enrollStudentInCourse(courseId: string, paymentId = 'DIRECT-TEST'): Promise<boolean> {
  // Store locally for instant UI response
  if (typeof window !== 'undefined') {
    const localEnrollments = JSON.parse(localStorage.getItem('rkmidigi_enrolled_courses') || '[]');
    if (!localEnrollments.includes(courseId)) {
      localEnrollments.push(courseId);
      localStorage.setItem('rkmidigi_enrolled_courses', JSON.stringify(localEnrollments));
    }
  }

  // Record in Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('enrollments').upsert({
        user_id: user.id,
        course_id: courseId,
        payment_id: paymentId,
        status: 'active',
        created_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Could not sync enrollment to Supabase table:', e);
  }

  return true;
}

// ==========================================
// ADMIN HELPERS FOR ADMIN STUDIO
// ==========================================

// 1. Retrieve all registered students (Supabase + Local Cache)
export async function getAdminStudentProfiles(): Promise<StudentProfile[]> {
  const studentsMap = new Map<string, StudentProfile>();

  // Attempt Supabase fetch
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      data.forEach(p => {
        studentsMap.set(p.email || p.id, {
          id: p.id,
          email: p.email || 'student@rkmidigi.com',
          full_name: p.full_name || 'Registered Student',
          phone: p.phone || '',
          role: p.role || 'student',
          created_at: p.created_at || new Date().toISOString(),
          enrolled_courses: []
        });
      });
    }
  } catch (e) {
    console.warn('Supabase profiles query error:', e);
  }

  // Also merge any local test accounts created in browser
  if (typeof window !== 'undefined') {
    const localStudents = JSON.parse(localStorage.getItem('rkmidigi_admin_students') || '[]');
    localStudents.forEach((s: StudentProfile) => {
      if (!studentsMap.has(s.email)) {
        studentsMap.set(s.email, s);
      }
    });

    // If empty (fresh start), add default administrator profile for demonstration
    if (studentsMap.size === 0) {
      studentsMap.set('rkmvedant@gmail.com', {
        id: 'admin-rkm',
        email: 'rkmvedant@gmail.com',
        full_name: 'Rajesh K. M. (Admin)',
        phone: '+91-98811-XXXXX',
        role: 'admin',
        created_at: '2026-09-01T10:00:00.000Z',
        enrolled_courses: ['course-iso-42001', 'course-eu-ai-act', 'course-nist-ai-rmf']
      });
    }
  }

  return Array.from(studentsMap.values());
}

// 2. Retrieve all active enrollments (Supabase + Local Cache)
export async function getAdminEnrollments(): Promise<EnrollmentRecord[]> {
  const records: EnrollmentRecord[] = [];
  const seenIds = new Set<string>();

  // Attempt Supabase fetch
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      data.forEach(row => {
        seenIds.add(row.id);
        const course = COURSES.find(c => c.id === row.course_id);
        records.push({
          id: row.id,
          user_id: row.user_id,
          student_email: row.user_email || 'student@rkmidigi.com',
          student_name: row.user_name || 'Enrolled Student',
          course_id: row.course_id,
          course_title: course?.title || row.course_id,
          amount_inr: course?.priceInr || 4999,
          payment_id: row.payment_id || 'COMPLETED',
          status: row.status || 'active',
          created_at: row.created_at || new Date().toISOString()
        });
      });
    }
  } catch (e) {
    console.warn('Supabase enrollments query error:', e);
  }

  // Merge local enrollments cache
  if (typeof window !== 'undefined') {
    const localEnrollments = JSON.parse(localStorage.getItem('rkmidigi_admin_enrollments') || '[]');
    localEnrollments.forEach((e: EnrollmentRecord) => {
      if (!seenIds.has(e.id)) {
        records.push(e);
        seenIds.add(e.id);
      }
    });
  }

  return records;
}

// 3. Admin: Manually grant enrollment to a student
export async function adminGrantCourseAccess(
  studentEmail: string, 
  courseId: string, 
  paymentRef = 'MANUAL-UPI',
  studentName = 'Enrolled Student'
): Promise<EnrollmentRecord> {
  const course = COURSES.find(c => c.id === courseId);
  const newRecord: EnrollmentRecord = {
    id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    student_email: studentEmail.trim().toLowerCase(),
    student_name: studentName,
    course_id: courseId,
    course_title: course?.title || courseId,
    amount_inr: course?.priceInr || 4999,
    payment_id: paymentRef,
    status: 'active',
    created_at: new Date().toISOString()
  };

  // 1. Try Supabase
  try {
    await supabase.from('enrollments').insert({
      id: newRecord.id,
      course_id: newRecord.course_id,
      payment_id: newRecord.payment_id,
      status: 'active',
      user_email: newRecord.student_email,
      created_at: newRecord.created_at
    });
  } catch (e) {
    console.warn('Supabase manual grant insert error:', e);
  }

  // 2. Update local storage cache
  if (typeof window !== 'undefined') {
    const list = JSON.parse(localStorage.getItem('rkmidigi_admin_enrollments') || '[]');
    list.unshift(newRecord);
    localStorage.setItem('rkmidigi_admin_enrollments', JSON.stringify(list));

    // Also update student profile if not registered
    const students = JSON.parse(localStorage.getItem('rkmidigi_admin_students') || '[]');
    const existing = students.find((s: StudentProfile) => s.email === newRecord.student_email);
    if (existing) {
      if (!existing.enrolled_courses) existing.enrolled_courses = [];
      if (!existing.enrolled_courses.includes(courseId)) existing.enrolled_courses.push(courseId);
    } else {
      students.push({
        id: `usr-${Date.now()}`,
        email: newRecord.student_email,
        full_name: studentName,
        role: 'student',
        created_at: new Date().toISOString(),
        enrolled_courses: [courseId]
      });
    }
    localStorage.setItem('rkmidigi_admin_students', JSON.stringify(students));

    // Grant local session permission if testing on the same machine
    const localCourses = JSON.parse(localStorage.getItem('rkmidigi_enrolled_courses') || '[]');
    if (!localCourses.includes(courseId)) {
      localCourses.push(courseId);
      localStorage.setItem('rkmidigi_enrolled_courses', JSON.stringify(localCourses));
    }
  }

  return newRecord;
}

// 4. Admin: Revoke course enrollment
export async function adminRevokeCourseAccess(enrollmentId: string, courseId?: string): Promise<boolean> {
  // Try Supabase
  try {
    await supabase.from('enrollments').update({ status: 'revoked' }).eq('id', enrollmentId);
  } catch (e) {
    console.warn('Supabase revoke error:', e);
  }

  // Update local storage
  if (typeof window !== 'undefined') {
    const list = JSON.parse(localStorage.getItem('rkmidigi_admin_enrollments') || '[]');
    const updated = list.map((e: EnrollmentRecord) => {
      if (e.id === enrollmentId) {
        return { ...e, status: 'revoked' };
      }
      return e;
    });
    localStorage.setItem('rkmidigi_admin_enrollments', JSON.stringify(updated));

    if (courseId) {
      const active = JSON.parse(localStorage.getItem('rkmidigi_enrolled_courses') || '[]');
      const filtered = active.filter((id: string) => id !== courseId);
      localStorage.setItem('rkmidigi_enrolled_courses', JSON.stringify(filtered));
    }
  }

  return true;
}
