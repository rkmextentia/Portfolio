import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const nextVal = args[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        options[key] = nextVal;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  return options;
};

async function main() {
  const cliArgs = parseArgs();

  let title = cliArgs.title;
  let category = cliArgs.category || 'AI Governance';
  let youtubeUrl = cliArgs.video || cliArgs.youtube || '';
  let image = cliArgs.image || '';
  let summary = cliArgs.summary || '';
  let tags = cliArgs.tags ? cliArgs.tags.split(',').map(t => t.trim()) : ['AI Governance', 'Compliance'];
  let featured = cliArgs.featured === true || cliArgs.featured === 'true';

  // If title was not provided via CLI flags, ask interactively
  if (!title) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const ask = (q, d = '') => new Promise(res => rl.question(q, ans => res(ans.trim() || d)));

    console.log('\n======================================================');
    console.log('   RKMIDIGILABS — Create New Blog Post / Video Article');
    console.log('======================================================\n');

    title = await ask('1. Post Title (e.g. EU AI Act Article 50 Transparency Rules): ');
    if (!title) {
      console.error('Title is required. Aborting.');
      rl.close();
      process.exit(1);
    }

    console.log('\nSelect Category:');
    console.log('  [1] AI Governance');
    console.log('  [2] Enterprise GRC');
    console.log('  [3] Corporate Training');
    console.log('  [4] Regulatory Alerts');
    const catChoice = await ask('Category number [1-4] (default: 1): ', '1');
    const categories = {
      '1': 'AI Governance',
      '2': 'Enterprise GRC',
      '3': 'Corporate Training',
      '4': 'Regulatory Alerts'
    };
    category = categories[catChoice] || 'AI Governance';

    console.log('\nPaste YouTube URL if this post has a video (e.g. https://www.youtube.com/watch?v=XXXXX)');
    youtubeUrl = await ask('YouTube URL (leave blank if text/image article): ', '');

    console.log('\nOptional Image / Diagram path (e.g. /images/blog/diagram.png or leave blank):');
    image = await ask('Image Path (optional): ', '');

    summary = await ask('\n4. Short Executive Summary (1-2 sentences for preview & Google SEO): ', 
      `Key analysis and enterprise governance breakdown on ${title}.`);

    const tagsInput = await ask('\n5. Tags (comma-separated, e.g. "EU AI Act, Compliance, Auditing"): ', 'AI Governance, Compliance');
    tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const featuredInput = await ask('\n6. Feature on Homepage? (y/N): ', 'n');
    featured = featuredInput.toLowerCase() === 'y' || featuredInput.toLowerCase() === 'yes';

    rl.close();
  } else {
    if (!summary) {
      summary = `Key analysis and enterprise governance breakdown on ${title}.`;
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const slug = slugify(title);
  const targetDir = path.resolve(__dirname, '../src/content/blog');
  const targetFilePath = path.join(targetDir, `${slug}.md`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${today}
category: "${category}"
tags: ${JSON.stringify(tags)}
${youtubeUrl ? `youtubeUrl: "${youtubeUrl.trim()}"\n` : ''}${image ? `image: "${image.trim()}"\n` : ''}summary: "${summary.replace(/"/g, '\\"')}"
featured: ${featured}
readTime: "4 min read"
author: "RKMIDIGILABS"
---

### Executive Summary

${summary}

---

### Key Regulatory Insights & Framework Alignment

Write your breakdown here. You can use markdown headings, bullet points, and callouts:

- **Core Mandate:** Explain the requirement, risk classification, or standard.
- **Audit Implications:** What evidence does an enterprise need to collect?
- **Engineering Action:** How should technical teams implement guardrails?

---

### Action Checklist for Enterprise Teams

- [ ] Audit existing workflows against these requirements.
- [ ] Document governance policies and risk thresholds.
- [ ] Review vendor contracts and third-party AI exposure.

---

### Advisory & Training Support

Need tailored advisory or team training on this framework? Reach out to the **RKMIDIGILABS** practice at [rkmvedant@gmail.com](mailto:rkmvedant@gmail.com) or call **+91 9371650121**.
`;

  fs.writeFileSync(targetFilePath, fileContent, 'utf-8');

  console.log('\n======================================================');
  console.log('✅ Post Created Successfully!');
  console.log(`📁 File: src/content/blog/${slug}.md`);
  console.log(`🌐 Live URL once built: /blog/${slug}`);
  console.log('======================================================\n');
  console.log('Next Steps:');
  console.log(`1. Open "src/content/blog/${slug}.md" in your editor to add or refine your text.`);
  console.log('2. Run "npm run build" or check your local preview at http://localhost:4321/blog\n');
}

main().catch(err => {
  console.error('Error creating post:', err);
  process.exit(1);
});