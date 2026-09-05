# RKMIDIGILABS — Guide: How to Add Blog Posts & Video Articles

This guide explains how to quickly publish new articles, daily video breakdowns, and regulatory updates to the **RKMIDIGILABS** website.

---

## Method 1: The Fast Interactive Command (Recommended)

You don't need to manually type frontmatter or format filenames. Run this single command in your project terminal:

```bash
npm run new-post
```

The tool will ask you 5 simple questions:
1. **Title:** e.g., `EU AI Act Article 50: Watermarking & Deepfake Transparency`
2. **Category:** Choose `1` (AI Governance), `2` (Enterprise GRC), `3` (Corporate Training), or `4` (Regulatory Alerts)
3. **YouTube URL:** Paste the YouTube link (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`). If it's a text-only article without video, just press Enter to skip!
4. **Summary:** 1 or 2 sentences summarizing the takeaway (used for Google SEO and social media previews).
5. **Tags:** Comma-separated topics (e.g., `EU AI Act, Deepfakes, Compliance`).
6. **Feature on Homepage:** Type `y` if you want this to appear as the large featured hero article on the homepage, or press Enter for `No`.

The script instantly creates a new file in `src/content/blog/<slug>.md`.

---

## Method 2: Manual Copy & Paste

If you prefer using your editor:
1. Go to the `src/content/blog/` folder.
2. Copy `_template.md.example` and save it as a new file (e.g. `iso-42001-audit-checklist.md`).
3. Fill in the header metadata (between the `---` lines):

```markdown
---
title: "Your Article Title"
date: 2026-09-05
category: "AI Governance"
tags: ["EU AI Act", "Compliance"]
youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
summary: "Brief 1-2 sentence overview for Google SEO and social sharing cards."
featured: false
readTime: "4 min read"
author: "RKMIDIGILABS"
---

### Executive Summary

Write your article here using standard Markdown...
```

---

## How YouTube Videos Work on the Site

- **Zero slow-down (< 0.8s load speed):** Videos are **never** stored on the server. The site uses a lightweight facade that shows the crisp YouTube thumbnail and play button. The heavy YouTube player only loads when a visitor actually clicks Play!
- **Automatic Thumbnails:** Just paste any YouTube URL (`https://www.youtube.com/watch?v=...` or `https://youtu.be/...`). The site automatically extracts the video ID and downloads the highest resolution thumbnail from YouTube.
- **Google Video SEO:** The site automatically injects Schema.org `VideoObject` structured data so Google Video Search indexes your video immediately with your article.
- **Direct Link:** Visitors can watch the video right on your website or click "Open in YouTube ↗".

---

## Allowed Categories

Choose one of these 4 categories to ensure proper filtering on `/blog`:
- `AI Governance`
- `Enterprise GRC`
- `Corporate Training`
- `Regulatory Alerts`

---

## Testing & Publishing

1. **Preview Locally:**
   Run:
   ```bash
   npm run preview
   ```
   Open `http://localhost:4321/blog` in your browser. You will see your new post immediately!

2. **Build for Production / Cloud Deployment:**
   Run:
   ```bash
   npm run build
   ```
   This generates the 100% static files, updates `/sitemap.xml`, and updates `/rss.xml` automatically.