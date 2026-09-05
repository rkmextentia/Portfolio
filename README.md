# RKMIDIGILABS — Enterprise AI Governance & GRC Portfolio

[![Astro](https://img.shields.io/badge/Astro-4.16-BC52EE?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

**RKMIDIGILABS** is an executive-grade platform for AI Governance, Enterprise Governance Risk & Compliance (GRC), and Corporate Training led by Principal AIGP & GRC Practice Lead.

---

## 🏛️ Key Features

* **AI Governance & Compliance Hub:** Deep-dive regulatory breakdowns on EU AI Act (Article 50, Annex III Conformity), NIST AI RMF 1.0, and ISO 42001 (AIMS).
* **Dynamic Media & Video Integration:** Native YouTube video analysis embedder, custom cover thumbnails, and read-time estimators.
* **Admin Content Studio (`/admin`):**
  * Single-toggle **Published / Unpublished (Draft)** status.
  * Real-time multi-channel sync via `BroadcastChannel`, `localStorage`, and automated polling.
  * Local image upload system with instant markdown insertion.
  * Multi-platform Social Media Push (LinkedIn, X / Twitter, WhatsApp Business, Facebook).
* **Executive Client Service Inquiry System:**
  * Inline inquiry modal across all service cards.
  * Direct delivery formatting for `rkmvedant@gmail.com`.
  * Mobile and WhatsApp click-to-chat integration (+91 9371650121).
* **Company Profile & Corporate Brochure (`/company-profile`):**
  * Interactive company profile and service matrix.
  * Standardized destination for all official social media profile links.
* **Technical SEO & Standards:**
  * Strict OpenGraph / Twitter Cards meta tags.
  * Dynamic XML Sitemap (`/sitemap.xml`) and RSS Feed (`/rss.xml`).

---

## 🚀 Quick Start & Local Development

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd grc-aigp-portfolio
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
ADMIN_SECRET_KEY=rkmidigi2026!
ADMIN_API_PORT=4322
SITE_URL=http://localhost:4321
```

### 3. Launch Services
Run both the frontend and the Admin API server:

* **Start Admin API Server (Port 4322):**
  ```bash
  npm run admin:server
  ```
* **Start Astro Development Server (Port 4321):**
  ```bash
  npm run dev
  ```

---

## 📁 Repository Structure

```
├── data/                  # Social configs, broadcasts, and inquiry archives
├── public/                # Static assets, corporate logo, and uploaded images
│   └── images/            # RKMIDIGILABS branding & article cover images
├── src/
│   ├── components/        # Reusable Astro UI components (Header, Footer, PostCard, Hero)
│   ├── content/
│   │   └── blog/          # Markdown content collections with frontmatter schema
│   ├── layouts/           # BaseLayout and PostLayout templates
│   └── pages/             # Astro static routes & Admin Studio
│       ├── admin/         # Admin dashboard, login, new post, and edit post views
│       ├── blog/          # Knowledge Hub & article dispatches
│       ├── company-profile.astro # Corporate Profile & Brochure
│       ├── frameworks.astro      # ISO 42001, NIST AI RMF, EU AI Act
│       └── services.astro        # Advisory, Audit & Training roadmaps
├── server/
│   └── admin-api.js       # Dual-stack REST API server (Auth, Upload, Toggle, Inquiries)
├── scripts/               # Automated verification and test suites
└── tailwind.config.mjs    # Corporate color scheme & typography tokens
```

---

## 📞 Contact & Organization

* **Organization:** RKMIDIGILABS
* **Practice Lead:** Principal AIGP & Enterprise GRC Practice Lead
* **Email:** [rkmvedant@gmail.com](mailto:rkmvedant@gmail.com)
* **Mobile / WhatsApp:** [+91 9371650121](tel:+919371650121)
* **Brochure:** [http://localhost:4321/company-profile](http://localhost:4321/company-profile)
