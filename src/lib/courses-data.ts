export interface Lesson {
  id: string;
  orderIndex: number;
  title: string;
  duration: string;
  description: string;
  videoUrl: string; // YouTube embed ID or video stream URL
  isFreePreview: boolean;
  resources?: { title: string; url: string }[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  category: string;
  level: "Beginner" | "Practitioner" | "Lead / Executive";
  priceInr: number;
  originalPriceInr: number;
  durationHours: string;
  totalLessons: number;
  thumbnailUrl: string;
  featured: boolean;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  whatYouWillLearn: string[];
  prerequisites: string[];
  targetAudience: string[];
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: "course-iso-42001",
    slug: "iso-42001-lead-implementer-masterclass",
    title: "ISO/IEC 42001 Lead Implementer Masterclass",
    subtitle: "End-to-End Certification Blueprint for AI Management Systems (AIMS)",
    summary: "Master the world's first certifiable standard for Artificial Intelligence. Learn Clause-by-Clause implementation, Annex A controls, risk assessment frameworks, and audit readiness.",
    description: "ISO/IEC 42001 is the global gold standard for responsible AI governance. This masterclass takes you deep into the requirements of Clause 4 through 10, provides production-tested Annex A control templates, and prepares your enterprise for Stage 1 and Stage 2 certification audits.",
    category: "ISO Standards",
    level: "Practitioner",
    priceInr: 4999,
    originalPriceInr: 14999,
    durationHours: "6.5 Hours",
    totalLessons: 8,
    thumbnailUrl: "/images/rkmidigilabs-logo.jpg",
    featured: true,
    instructor: {
      name: "Rajesh K. M.",
      role: "Principal AIGP & Enterprise GRC Practice Lead",
      avatar: "/images/rkmidigilabs-logo.jpg",
      bio: "20+ years enterprise GRC advisor, certified ISO 27001/42001 auditor, and AI Governance Practice Lead."
    },
    whatYouWillLearn: [
      "Understand ISO/IEC 42001 structure, principles, and relationship with ISO 27001 & NIST AI RMF",
      "Draft comprehensive AI Policies, Acceptable Use Guidelines, and define governance roles (Clause 5)",
      "Conduct systematic AI Risk Assessments & AI System Impact Assessments (Clause 6 & Annex B)",
      "Implement all 38 Annex A controls across data quality, transparency, model lifecycle, and third-party AI",
      "Establish internal audit mechanisms, management reviews, and continuous improvement metrics (Clause 9 & 10)",
      "Download ready-to-use policy templates, risk register spreadsheets, and audit checklists"
    ],
    prerequisites: [
      "Basic understanding of software lifecycle or IT compliance",
      "No programming or data science background required"
    ],
    targetAudience: [
      "GRC Managers, Information Security Officers (CISOs), and Compliance Directors",
      "AI Engineers, Product Managers, and Solution Architects deploying LLMs",
      "Management Consultants and Internal Auditors preparing for ISO 42001 accreditation"
    ],
    lessons: [
      {
        id: "iso-42001-mod-1",
        orderIndex: 1,
        title: "Introduction to ISO/IEC 42001 & The AIMS Architecture",
        duration: "22 mins",
        description: "Overview of the standard, business justification, timeline, and how AIMS integrates into existing ISO 27001 and ISO 9001 frameworks.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: true,
        resources: [
          { title: "ISO 42001 Executive Summary Slide Deck", url: "/company-profile" }
        ]
      },
      {
        id: "iso-42001-mod-2",
        orderIndex: 2,
        title: "Context of the Organization & Defining AI Scope (Clause 4)",
        duration: "35 mins",
        description: "How to identify internal and external stakeholders, legal obligations, and draw strict boundaries for your AI Management System.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "iso-42001-mod-3",
        orderIndex: 3,
        title: "Leadership, Policy & AI Governance Roles (Clause 5)",
        duration: "40 mins",
        description: "Drafting the Corporate AI Policy, establishing the AI Governance Committee, and allocating accountability across engineering and legal.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "iso-42001-mod-4",
        orderIndex: 4,
        title: "Systematic AI Risk & Impact Assessment (Clause 6)",
        duration: "50 mins",
        description: "Practical methodology for assessing algorithmic bias, hallucination risks, data leakage, and third-party API dependencies.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "iso-42001-mod-5",
        orderIndex: 5,
        title: "Implementing Annex A Controls: Data, Models & Lifecycle",
        duration: "45 mins",
        description: "Deep dive into Annex A controls: data lineage, training data acquisition, model verification, testing, and documentation.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "iso-42001-mod-6",
        orderIndex: 6,
        title: "Operational Controls & Production Monitoring (Clause 8)",
        duration: "48 mins",
        description: "Real-time guardrails, telemetry, drift detection, and human-in-the-loop intervention protocols for deployed AI systems.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "iso-42001-mod-7",
        orderIndex: 7,
        title: "Internal Audits, Metrics & Management Review (Clause 9)",
        duration: "38 mins",
        description: "Setting up Key Performance Indicators (KPIs), conducting mock internal audits, and running executive management reviews.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "iso-42001-mod-8",
        orderIndex: 8,
        title: "Lead Implementer Certification Blueprint & Final Checklist",
        duration: "42 mins",
        description: "Final walkthrough of the certification body audit process, handling non-conformities, and maintaining continuous accreditation.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      }
    ]
  },
  {
    id: "course-eu-ai-act",
    slug: "eu-ai-act-technical-compliance-risk-assessment",
    title: "EU AI Act Technical Compliance & Risk Assessment",
    subtitle: "Complete Practitioner Guide to Legal, Risk, and Technical Mandates",
    summary: "Everything engineering, compliance, and product teams need to comply with the European Union AI Act. Covers risk tiers, Article 50 watermarking, high-risk technical documentation, and FRIA.",
    description: "The European Union AI Act is the world's most aggressive and comprehensive regulatory framework for artificial intelligence. Penalties reach up to €35M or 7% of global turnover. This course provides direct, actionable blueprints to classify your systems, satisfy Article 50 transparency, and prepare High-Risk AI conformity assessments.",
    category: "AI Governance",
    level: "All Levels",
    priceInr: 5499,
    originalPriceInr: 16999,
    durationHours: "7.0 Hours",
    totalLessons: 9,
    thumbnailUrl: "/images/rkmidigilabs-logo.jpg",
    featured: true,
    instructor: {
      name: "Rajesh K. M.",
      role: "Principal AIGP & Enterprise GRC Practice Lead",
      avatar: "/images/rkmidigilabs-logo.jpg",
      bio: "20+ years enterprise GRC advisor, certified ISO 27001/42001 auditor, and AI Governance Practice Lead."
    },
    whatYouWillLearn: [
      "Categorize AI systems accurately across Unacceptable Risk, High Risk, Specific Transparency Risk, and Minimal Risk",
      "Comply with Article 50 synthetic content labeling, watermarking, and AI-generated disclosure rules",
      "Prepare Annex IV Technical Documentation and Automated Logging architectures (Article 11 & 12)",
      "Conduct Fundamental Rights Impact Assessments (FRIA) for banking, healthcare, and enterprise software",
      "Establish Post-Market Monitoring systems and reporting protocols for serious AI incidents (Article 72)",
      "Avoid multi-million euro penalties and navigate the European AI Office enforcement structure"
    ],
    prerequisites: [
      "General familiarity with AI, LLMs, or digital software products",
      "Applicable for both EU-based companies and global companies selling into the EU market"
    ],
    targetAudience: [
      "Product Managers, CTOs, and Engineering Leads building AI products for global deployment",
      "Corporate Legal Counsel, Data Protection Officers (DPOs), and Privacy Professionals",
      "GRC specialists and Enterprise Risk Auditors"
    ],
    lessons: [
      {
        id: "eu-ai-act-mod-1",
        orderIndex: 1,
        title: "EU AI Act Scope, Jurisdiction & Enforcement Timelines",
        duration: "25 mins",
        description: "Understanding extraterritorial reach, enforcement phases (2025-2027), and immediate obligations for AI providers and deployers.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: true
      },
      {
        id: "eu-ai-act-mod-2",
        orderIndex: 2,
        title: "Article 50: Synthetic Content, Watermarking & Disclosures",
        duration: "35 mins",
        description: "Technical standards for machine-readable watermarking, deepfake labeling, and automated user notification requirements.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-3",
        orderIndex: 3,
        title: "High-Risk AI Systems: Annex III Classification Criteria",
        duration: "45 mins",
        description: "Deep dive into employment, critical infrastructure, credit scoring, biometric identification, and essential public services.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-4",
        orderIndex: 4,
        title: "Technical Documentation & System Logging (Article 11 & 12)",
        duration: "40 mins",
        description: "Architectural blueprints for tamper-proof logging, telemetry retention, and technical dossiers required before market launch.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-5",
        orderIndex: 5,
        title: "Data Governance & Training Data Quality Mandates (Article 10)",
        duration: "45 mins",
        description: "Addressing bias mitigation, statistical representativeness, data provenance, and copyright protections for training corpora.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-6",
        orderIndex: 6,
        title: "Human Oversight, Cybersecurity & Robustness (Article 14 & 15)",
        duration: "50 mins",
        description: "Implementing human-on-the-loop and human-in-the-loop controls, stop buttons, adversarial robustness, and red-teaming.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-7",
        orderIndex: 7,
        title: "Fundamental Rights Impact Assessments (FRIA) in Practice",
        duration: "42 mins",
        description: "Step-by-step methodology for executing and documenting a FRIA before placing high-risk AI in production.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-8",
        orderIndex: 8,
        title: "Conformity Assessment Procedures & CE Marking",
        duration: "40 mins",
        description: "Internal control vs. notified body conformity assessment paths, declaration of conformity, and EU database registration.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "eu-ai-act-mod-9",
        orderIndex: 9,
        title: "Enterprise Action Plan & Audit Trail Setup",
        duration: "35 mins",
        description: "Building an enterprise compliance matrix, allocating budget, training teams, and continuous post-market surveillance.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      }
    ]
  },
  {
    id: "course-nist-ai-rmf",
    slug: "nist-ai-rmf-generative-ai-governance",
    title: "NIST AI RMF 1.0 & Generative AI Governance in Practice",
    subtitle: "Operationalize GOVERN, MAP, MEASURE, and MANAGE for Foundation Models",
    summary: "Practical implementation of the National Institute of Standards and Technology AI Risk Management Framework, with specialized guidance for Generative AI and LLMs.",
    description: "The NIST AI RMF is the most widely adopted enterprise risk framework in North America and globally. This course shows you how to translate the four core functions into engineering workflows, conduct red-teaming for hallucinations and prompt injections, and generate board-level risk dashboards.",
    category: "Risk Frameworks",
    level: "Practitioner",
    priceInr: 3999,
    originalPriceInr: 11999,
    durationHours: "5.5 Hours",
    totalLessons: 7,
    thumbnailUrl: "/images/rkmidigilabs-logo.jpg",
    featured: false,
    instructor: {
      name: "Rajesh K. M.",
      role: "Principal AIGP & Enterprise GRC Practice Lead",
      avatar: "/images/rkmidigilabs-logo.jpg",
      bio: "20+ years enterprise GRC advisor, certified ISO 27001/42001 auditor, and AI Governance Practice Lead."
    },
    whatYouWillLearn: [
      "Master the NIST AI RMF 1.0 architecture and the Generative AI Profile (NIST AI 600-1)",
      "Establish the GOVERN function: policies, organizational structures, and accountability",
      "Execute the MAP function: contextualizing AI risks and profiling third-party foundation models",
      "Implement the MEASURE function: testing LLMs for toxicity, hallucination rate, and prompt injection",
      "Operationalize the MANAGE function: incident response, continuous monitoring, and fail-safes",
      "Build executive board reports mapping AI risks to business outcomes"
    ],
    prerequisites: [
      "Basic understanding of enterprise IT risk management or cybersecurity",
      "No specialized coding skills required"
    ],
    targetAudience: [
      "Risk Managers, AI Security Engineers, and Enterprise Architects",
      "Cybersecurity Professionals expanding into AI Safety and Red-Teaming",
      "Corporate Leadership managing AI adoption and vendor risk"
    ],
    lessons: [
      {
        id: "nist-rmf-mod-1",
        orderIndex: 1,
        title: "NIST AI RMF Core: Architecture & The 4 Functions",
        duration: "20 mins",
        description: "Introduction to Trustworthy AI characteristics and the interconnected loop of GOVERN, MAP, MEASURE, and MANAGE.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: true
      },
      {
        id: "nist-rmf-mod-2",
        orderIndex: 2,
        title: "The GOVERN Function: Policy, Culture & Accountability",
        duration: "35 mins",
        description: "Defining enterprise risk tolerance, establishing cross-functional AI review boards, and legal compliance alignment.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "nist-rmf-mod-3",
        orderIndex: 3,
        title: "The MAP Function: Contextualizing Risks & Model Profiling",
        duration: "42 mins",
        description: "Mapping supply chain dependencies, third-party LLM APIs, fine-tuning datasets, and end-user exposure risks.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "nist-rmf-mod-4",
        orderIndex: 4,
        title: "The MEASURE Function: Evaluating LLMs & Red-Teaming",
        duration: "50 mins",
        description: "Quantitative metrics for measuring accuracy, hallucination rates, bias, and automated red-teaming methodologies.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "nist-rmf-mod-5",
        orderIndex: 5,
        title: "The MANAGE Function: Incident Response & Safeguards",
        duration: "40 mins",
        description: "Setting up automated circuit breakers, human override protocols, and continuous production monitoring.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      },
      {
        id: "nist-rmf-mod-6",
        orderIndex: 6,
        title: "NIST Generative AI Profile (AI 600-1) in Practice",
        duration: "45 mins",
        description: "Specialized controls for copyright infringement, confidential data leakage, prompt injection, and synthetic media.",
        videoUrl: "https://www.youtube.com/embed/k238XpMMn38",
        isFreePreview: false
      },
      {
        id: "nist-rmf-mod-7",
        orderIndex: 7,
        title: "Executive Board Reporting & Audit Readiness",
        duration: "38 mins",
        description: "Packaging your NIST AI RMF assessment into executive dashboards, investor reports, and enterprise client audit dossiers.",
        videoUrl: "https://www.youtube.com/embed/p1T_e4tGvHQ",
        isFreePreview: false
      }
    ]
  }
];
