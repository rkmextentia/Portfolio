-- ==============================================================================
-- RKMIDIGILABS — Supabase Database Schema for Academy & Video Courses
-- Run this in your Supabase Project SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Student Profiles Table (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Practitioner',
  price_inr NUMERIC NOT NULL DEFAULT 4999,
  original_price_inr NUMERIC DEFAULT 14999,
  duration_hours TEXT DEFAULT '6 Hours',
  total_lessons INT DEFAULT 8,
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone" 
  ON public.courses FOR SELECT USING (is_published = true);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lesson metadata and free previews" 
  ON public.lessons FOR SELECT USING (true);

-- 5. Student Enrollments & Purchases Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  amount_paid NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own enrollments" 
  ON public.enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert enrollments" 
  ON public.enrollments FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 6. Initial Seed Data: 3 Flagship Masterclasses
-- ==============================================================================

INSERT INTO public.courses (id, slug, title, subtitle, summary, category, level, price_inr, original_price_inr, duration_hours, total_lessons, featured)
VALUES 
  ('course-iso-42001', 'iso-42001-lead-implementer-masterclass', 'ISO/IEC 42001 Lead Implementer Masterclass', 'End-to-End Certification Blueprint for AI Management Systems (AIMS)', 'Master the world''s first certifiable standard for Artificial Intelligence. Learn Clause-by-Clause implementation, Annex A controls, risk assessment frameworks, and audit readiness.', 'ISO Standards', 'Practitioner', 4999, 14999, '6.5 Hours', 8, true),
  ('course-eu-ai-act', 'eu-ai-act-technical-compliance-risk-assessment', 'EU AI Act Technical Compliance & Risk Assessment', 'Complete Practitioner Guide to Legal, Risk, and Technical Mandates', 'Everything engineering, compliance, and product teams need to comply with the European Union AI Act. Covers risk tiers, Article 50 watermarking, high-risk technical documentation, and FRIA.', 'AI Governance', 'All Levels', 5499, 16999, '7.0 Hours', 9, true),
  ('course-nist-ai-rmf', 'nist-ai-rmf-generative-ai-governance', 'NIST AI RMF 1.0 & Generative AI Governance in Practice', 'Operationalize GOVERN, MAP, MEASURE, and MANAGE for Foundation Models', 'Practical implementation of the National Institute of Standards and Technology AI Risk Management Framework, with specialized guidance for Generative AI and LLMs.', 'Risk Frameworks', 'Practitioner', 3999, 11999, '5.5 Hours', 7, false)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price_inr = EXCLUDED.price_inr;

-- Seed Lessons for ISO 42001
INSERT INTO public.lessons (id, course_id, order_index, title, duration, video_url, is_free_preview)
VALUES
  ('iso-42001-mod-1', 'course-iso-42001', 1, 'Introduction to ISO/IEC 42001 & The AIMS Architecture', '22 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', true),
  ('iso-42001-mod-2', 'course-iso-42001', 2, 'Context of the Organization & Defining AI Scope (Clause 4)', '35 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('iso-42001-mod-3', 'course-iso-42001', 3, 'Leadership, Policy & AI Governance Roles (Clause 5)', '40 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('iso-42001-mod-4', 'course-iso-42001', 4, 'Systematic AI Risk & Impact Assessment (Clause 6)', '50 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('iso-42001-mod-5', 'course-iso-42001', 5, 'Implementing Annex A Controls: Data, Models & Lifecycle', '45 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('iso-42001-mod-6', 'course-iso-42001', 6, 'Operational Controls & Production Monitoring (Clause 8)', '48 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('iso-42001-mod-7', 'course-iso-42001', 7, 'Internal Audits, Metrics & Management Review (Clause 9)', '38 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('iso-42001-mod-8', 'course-iso-42001', 8, 'Lead Implementer Certification Blueprint & Final Checklist', '42 mins', 'https://www.youtube.com/embed/k238XpMMn38', false)
ON CONFLICT (id) DO NOTHING;

-- Seed Lessons for EU AI Act
INSERT INTO public.lessons (id, course_id, order_index, title, duration, video_url, is_free_preview)
VALUES
  ('eu-ai-act-mod-1', 'course-eu-ai-act', 1, 'EU AI Act Scope, Jurisdiction & Enforcement Timelines', '25 mins', 'https://www.youtube.com/embed/k238XpMMn38', true),
  ('eu-ai-act-mod-2', 'course-eu-ai-act', 2, 'Article 50: Synthetic Content, Watermarking & Disclosures', '35 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('eu-ai-act-mod-3', 'course-eu-ai-act', 3, 'High-Risk AI Systems: Annex III Classification Criteria', '45 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('eu-ai-act-mod-4', 'course-eu-ai-act', 4, 'Technical Documentation & System Logging (Article 11 & 12)', '40 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('eu-ai-act-mod-5', 'course-eu-ai-act', 5, 'Data Governance & Training Data Quality Mandates (Article 10)', '45 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('eu-ai-act-mod-6', 'course-eu-ai-act', 6, 'Human Oversight, Cybersecurity & Robustness (Article 14 & 15)', '50 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('eu-ai-act-mod-7', 'course-eu-ai-act', 7, 'Fundamental Rights Impact Assessments (FRIA) in Practice', '42 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('eu-ai-act-mod-8', 'course-eu-ai-act', 8, 'Conformity Assessment Procedures & CE Marking', '40 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('eu-ai-act-mod-9', 'course-eu-ai-act', 9, 'Enterprise Action Plan & Audit Trail Setup', '35 mins', 'https://www.youtube.com/embed/k238XpMMn38', false)
ON CONFLICT (id) DO NOTHING;

-- Seed Lessons for NIST AI RMF
INSERT INTO public.lessons (id, course_id, order_index, title, duration, video_url, is_free_preview)
VALUES
  ('nist-rmf-mod-1', 'course-nist-ai-rmf', 1, 'NIST AI RMF Core: Architecture & The 4 Functions', '20 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', true),
  ('nist-rmf-mod-2', 'course-nist-ai-rmf', 2, 'The GOVERN Function: Policy, Culture & Accountability', '35 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('nist-rmf-mod-3', 'course-nist-ai-rmf', 3, 'The MAP Function: Contextualizing Risks & Model Profiling', '42 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('nist-rmf-mod-4', 'course-nist-ai-rmf', 4, 'The MEASURE Function: Evaluating LLMs & Red-Teaming', '50 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('nist-rmf-mod-5', 'course-nist-ai-rmf', 5, 'The MANAGE Function: Incident Response & Safeguards', '40 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false),
  ('nist-rmf-mod-6', 'course-nist-ai-rmf', 6, 'NIST Generative AI Profile (AI 600-1) in Practice', '45 mins', 'https://www.youtube.com/embed/k238XpMMn38', false),
  ('nist-rmf-mod-7', 'course-nist-ai-rmf', 7, 'Executive Board Reporting & Audit Readiness', '38 mins', 'https://www.youtube.com/embed/p1T_e4tGvHQ', false)
ON CONFLICT (id) DO NOTHING;

