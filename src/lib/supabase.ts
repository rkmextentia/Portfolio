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
