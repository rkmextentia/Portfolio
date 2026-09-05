import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const blogDir = path.join(projectRoot, 'src', 'content', 'blog');
const dataDir = path.join(projectRoot, 'data');
const socialConfigFile = path.join(dataDir, 'social-config.json');
const socialBroadcastsFile = path.join(dataDir, 'social-broadcasts.json');
const inquiriesDir = path.join(dataDir, 'inquiries');
const inquiriesFile = path.join(dataDir, 'inquiries.json');

// Simple .env parser
function loadEnv() {
  const envPath = path.join(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=');
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.ADMIN_API_PORT || '4322', 10);
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'rkmidigi2026!';

// Generate deterministic token for current day/secret
function getValidToken() {
  return crypto.createHash('sha256').update(ADMIN_SECRET + '_rkmidigi_session').digest('hex');
}

function verifyAuth(req) {
  const authHeader = req.headers['authorization'] || '';
  const customHeader = req.headers['x-admin-token'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() || customHeader;
  return token === getValidToken();
}

function parseFrontmatter(fileContent) {
  const cleanContent = (fileContent || '').replace(/^\uFEFF/, '').trimStart();
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: cleanContent };
  }
  const rawYaml = match[1];
  const body = match[2] || '';
  const data = {};

  const lines = rawYaml.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > -1) {
      const key = trimmed.slice(0, colonIndex).trim();
      let val = trimmed.slice(colonIndex + 1).trim();

      // Parse booleans and JSON arrays/strings
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith('[') && val.endsWith(']')) {
        try {
          val = JSON.parse(val);
        } catch {
          val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        }
      } else if (val === 'true') {
        val = true;
      } else if (val === 'false') {
        val = false;
      }
      data[key] = val;
    }
  }

  return { data, body };
}

function stringifyFrontmatter(data, body) {
  let yaml = '---\n';
  yaml += `title: "${(data.title || '').replace(/"/g, '\\"')}"\n`;
  yaml += `date: ${data.date || new Date().toISOString().split('T')[0]}\n`;
  yaml += `category: "${data.category || 'AI Governance'}"\n`;
  yaml += `tags: ${JSON.stringify(Array.isArray(data.tags) ? data.tags : ['AI Governance', 'Compliance'])}\n`;
  if (data.youtubeUrl) {
    yaml += `youtubeUrl: "${data.youtubeUrl.trim()}"\n`;
  }
  if (data.image) {
    yaml += `image: "${data.image.trim()}"\n`;
  }
  yaml += `summary: "${(data.summary || '').replace(/"/g, '\\"')}"\n`;
  yaml += `featured: ${data.featured === true || data.featured === 'true'}\n`;
  yaml += `published: ${data.published !== false && data.published !== 'false'}\n`;
  yaml += `readTime: "${data.readTime || '4 min read'}"\n`;
  yaml += `author: "${data.author || 'RKMIDIGILABS'}"\n`;
  yaml += '---\n\n';
  yaml += body || '';
  return yaml;
}

function escapeHtml(str) {
  return (str || '')
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateExecutiveEmailTemplate({ inquiryId, name, email, phone, service, description, timestamp }) {
  const formattedTime = new Date(timestamp).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RKMIDIGILABS Client Service Inquiry</title>
  <style>
    body { font-family: Calibri, 'Carlito', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { background-color: #112649; color: #ffffff; padding: 24px 30px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
    .header p { margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; font-family: monospace; }
    .badge { display: inline-block; background-color: #16A34A; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-top: 10px; }
    .content { padding: 30px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .table td.label { font-weight: bold; color: #64748b; width: 35%; text-transform: uppercase; font-size: 11px; font-family: monospace; }
    .table td.value { color: #000000; font-weight: 600; }
    .service-highlight { color: #16A34A; font-weight: 800; font-size: 14px; }
    .desc-box { background-color: #f8fafc; border-left: 4px solid #16A34A; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; }
    .actions { display: block; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 6px; font-size: 12px; font-weight: bold; text-decoration: none; text-align: center; margin-right: 8px; margin-bottom: 8px; }
    .btn-green { background-color: #16A34A; color: #ffffff !important; }
    .btn-navy { background-color: #112649; color: #ffffff !important; }
    .btn-whatsapp { background-color: #25D366; color: #ffffff !important; }
    .footer { background-color: #f8fafc; padding: 16px 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RKMIDIGILABS</h1>
      <p>AI Governance &amp; Enterprise GRC Practice</p>
      <span class="badge">New Client Service Inquiry</span>
    </div>
    <div class="content">
      <table class="table">
        <tr>
          <td class="label">Client Name</td>
          <td class="value">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${escapeHtml(email)}" style="color: #16A34A; text-decoration: underline;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td class="label">Phone / Mobile</td>
          <td class="value"><a href="tel:${escapeHtml(phone)}" style="color: #000000; text-decoration: none;">${escapeHtml(phone)}</a></td>
        </tr>
        <tr>
          <td class="label">Target Offering</td>
          <td class="value service-highlight">${escapeHtml(service)}</td>
        </tr>
        <tr>
          <td class="label">Submission Date</td>
          <td class="value">${formattedTime} (IST)</td>
        </tr>
        <tr>
          <td class="label">Inquiry Ref ID</td>
          <td class="value" style="font-family: monospace;">${inquiryId}</td>
        </tr>
      </table>

      <h3 style="font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; font-family: monospace;">Client Scope &amp; Project Description:</h3>
      <div class="desc-box">${escapeHtml(description)}</div>

      <div class="actions">
        <a href="mailto:${escapeHtml(email)}?subject=Re:%20RKMIDIGILABS%20Inquiry%20-%20${encodeURIComponent(service)}" class="btn btn-green">Reply via Email</a>
        <a href="tel:${escapeHtml(phone)}" class="btn btn-navy">Call Client</a>
        <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" class="btn btn-whatsapp">WhatsApp Client</a>
      </div>
    </div>
    <div class="footer">
      This inquiry was received through the RKMIDIGILABS official portal and delivered directly to rkmvedant@gmail.com.<br>
      © ${new Date().getFullYear()} RKMIDIGILABS • All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
======================================================
RKMIDIGILABS - NEW CLIENT SERVICE INQUIRY
======================================================
Ref ID:        ${inquiryId}
Date:          ${formattedTime} (IST)
Recipient:     rkmvedant@gmail.com

CLIENT CONTACT:
- Name:        ${name}
- Email:       ${email}
- Phone:       ${phone}

SERVICE REQUESTED:
${service}

DESCRIPTION / REQUIREMENTS:
------------------------------------------------------
${description}
------------------------------------------------------

DIRECT ACTIONS:
- Reply to Client:  mailto:${email}?subject=Re:%20RKMIDIGILABS%20Inquiry%20-%20${encodeURIComponent(service)}
- Call Client:      tel:${phone}
- WhatsApp Client:  https://wa.me/${phone.replace(/[^0-9]/g, '')}

======================================================
RKMIDIGILABS Client Dispatch Engine
======================================================
  `.trim();

  return { html, text, subject: `[RKMIDIGILABS Inquiry] ${service} - ${name} (${phone})` };
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Read JSON body helper
  const readBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        callback(null, json);
      } catch (err) {
        callback(err);
      }
    });
  };

  // 1. Health check & Service status
  if ((pathname === '/' || pathname === '/health' || pathname === '/api' || pathname === '/api/admin/health' || pathname === '/api/admin') && req.method === 'GET') {
    return sendJson(res, 200, { 
      status: 'healthy', 
      service: 'RKMIDIGILABS Admin API Server',
      version: '1.0.0', 
      time: new Date().toISOString(),
      organization: 'RKMIDIGILABS',
      lead: 'Principal AIGP & GRC Practice Lead',
      email: 'rkmvedant@gmail.com',
      mobile: '+91 9371650121',
      auth: 'Bearer Token Active',
      endpoints: [
        '/api/admin/health',
        '/api/admin/login',
        '/api/admin/posts',
        '/api/admin/upload',
        '/api/admin/rebuild',
        '/api/admin/social-config',
        '/api/admin/social-push',
        '/api/admin/inquiries',
        '/api/inquire'
      ]
    });
  }

  // 2. Client Service Inquiry (Public Endpoint - Delivered to rkmvedant@gmail.com)
  if (pathname === '/api/inquire' && req.method === 'POST') {
    return readBody(async (err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      
      const { name, email, phone, service, description } = data;
      if (!name || !email || !phone || !description) {
        return sendJson(res, 400, { 
          success: false, 
          error: 'All fields (name, email, phone, description) are required.' 
        });
      }

      const inquiryId = `RKM-INQ-${Date.now()}`;
      const targetService = service || 'General Advisory & Training Inquiry';
      const timestamp = new Date().toISOString();

      const { html, text, subject } = generateExecutiveEmailTemplate({
        inquiryId,
        name,
        email,
        phone,
        service: targetService,
        description,
        timestamp
      });

      // Ensure data directories exist
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      if (!fs.existsSync(inquiriesDir)) fs.mkdirSync(inquiriesDir, { recursive: true });

      // Save individual HTML and TXT email records
      const htmlPath = path.join(inquiriesDir, `${inquiryId}.html`);
      const txtPath = path.join(inquiriesDir, `${inquiryId}.txt`);
      try {
        fs.writeFileSync(htmlPath, html, 'utf-8');
        fs.writeFileSync(txtPath, text, 'utf-8');
      } catch (fsErr) {
        console.error('Error archiving inquiry file:', fsErr);
      }

      // Record in inquiries.json running register
      const record = {
        inquiryId,
        timestamp,
        name,
        email,
        phone,
        service: targetService,
        description,
        status: 'received',
        recipient: 'rkmvedant@gmail.com',
        subject
      };

      try {
        let list = [];
        if (fs.existsSync(inquiriesFile)) {
          list = JSON.parse(fs.readFileSync(inquiriesFile, 'utf-8'));
        }
        list.unshift(record);
        if (list.length > 100) list = list.slice(0, 100);
        fs.writeFileSync(inquiriesFile, JSON.stringify(list, null, 2), 'utf-8');
      } catch (logErr) {
        console.error('Error logging to inquiries.json:', logErr);
      }

      console.log(`======================================================`);
      console.log(`📥 NEW SERVICE INQUIRY RECEIVED FOR rkmvedant@gmail.com`);
      console.log(`ID:      ${inquiryId}`);
      console.log(`From:    ${name} (${email} | ${phone})`);
      console.log(`Service: ${targetService}`);
      console.log(`Subject: ${subject}`);
      console.log(`======================================================`);

      const mailtoUrl = `mailto:rkmvedant@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

      return sendJson(res, 200, {
        success: true,
        inquiryId,
        message: 'Inquiry successfully formatted and delivered for rkmvedant@gmail.com',
        recipient: 'rkmvedant@gmail.com',
        subject,
        mailtoUrl,
        timestamp,
        previewText: text
      });
    });
  }

  // 3. Login
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    return readBody((err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      if (data.password === ADMIN_SECRET) {
        const token = getValidToken();
        return sendJson(res, 200, { 
          success: true, 
          token, 
          user: { name: 'Admin', organization: 'RKMIDIGILABS' },
          message: 'Authentication successful' 
        });
      } else {
        return sendJson(res, 401, { success: false, error: 'Invalid admin passcode' });
      }
    });
  }

  // 2b. Public Posts API - Real-time reflection of published and unpublished status
  if (pathname === '/api/public/posts' && req.method === 'GET') {
    try {
      if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
      }
      const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
      const posts = files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = parseFrontmatter(content);
        const isPublished = data.published !== false && data.published !== 'false';
        return {
          slug,
          file,
          title: data.title || slug,
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          category: data.category || 'Enterprise GRC',
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
          youtubeUrl: data.youtubeUrl || '',
          image: data.image || '',
          summary: data.summary || '',
          featured: data.featured === true || data.featured === 'true',
          published: isPublished,
          readTime: data.readTime || '4 min read',
          author: data.author || 'RKMIDIGILABS'
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const publishedPosts = posts.filter(p => p.published);
      const unpublishedPosts = posts.filter(p => !p.published);

      return sendJson(res, 200, {
        success: true,
        timestamp: new Date().toISOString(),
        totalCount: posts.length,
        publishedCount: publishedPosts.length,
        unpublishedCount: unpublishedPosts.length,
        posts,
        publishedPosts
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 2c. Public Single Post Status API
  if (pathname.startsWith('/api/public/posts/') && req.method === 'GET') {
    const slug = pathname.replace('/api/public/posts/', '').trim();
    const filePath = path.join(blogDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return sendJson(res, 404, { success: false, error: `Post "${slug}" not found` });
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data } = parseFrontmatter(content);
      const isPublished = data.published !== false && data.published !== 'false';
      return sendJson(res, 200, {
        success: true,
        slug,
        title: data.title || slug,
        published: isPublished,
        featured: data.featured === true || data.featured === 'true',
        category: data.category || 'Enterprise GRC',
        youtubeUrl: data.youtubeUrl || '',
        date: data.date,
        summary: data.summary || ''
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // All subsequent routes require authentication
  if (!verifyAuth(req)) {
    return sendJson(res, 401, { success: false, error: 'Unauthorized. Valid token required.' });
  }

  // 3. List all posts
  if (pathname === '/api/admin/posts' && req.method === 'GET') {
    try {
      if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
      }
      const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
      const posts = files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data, body } = parseFrontmatter(content);
        return {
          slug,
          file,
          title: data.title || slug,
          date: data.date || '',
          category: data.category || 'AI Governance',
          tags: data.tags || [],
          youtubeUrl: data.youtubeUrl || '',
          image: data.image || '',
          summary: data.summary || '',
          featured: data.featured || false,
          published: data.published !== false && data.published !== 'false',
          readTime: data.readTime || '4 min read',
          wordCount: body.trim().split(/\s+/).length,
        };
      });

      // Sort by date descending
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return sendJson(res, 200, { success: true, count: posts.length, posts });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 4. Get single post by slug
  if (pathname.startsWith('/api/admin/posts/') && req.method === 'GET') {
    const slug = pathname.replace('/api/admin/posts/', '').trim();
    const filePath = path.join(blogDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return sendJson(res, 404, { success: false, error: `Post with slug "${slug}" not found` });
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, body } = parseFrontmatter(content);
      return sendJson(res, 200, {
        success: true,
        post: {
          slug,
          ...data,
          body,
        }
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 5. Create new post
  if (pathname === '/api/admin/posts' && req.method === 'POST') {
    return readBody((err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      if (!data.title) return sendJson(res, 400, { success: false, error: 'Title is required' });

      let slug = data.slug || data.title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

      if (!slug) slug = `post-${Date.now()}`;
      const filePath = path.join(blogDir, `${slug}.md`);

      const fileContent = stringifyFrontmatter(data, data.body || '');
      try {
        fs.writeFileSync(filePath, fileContent, 'utf-8');

        return sendJson(res, 201, {
          success: true,
          slug,
          message: 'Post published successfully',
          url: `/blog/${slug}`
        });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    });
  }

  // 6. Update existing post
  if (pathname.startsWith('/api/admin/posts/') && req.method === 'PUT') {
    const slug = pathname.replace('/api/admin/posts/', '').trim();
    const filePath = path.join(blogDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return sendJson(res, 404, { success: false, error: `Post with slug "${slug}" not found` });
    }

    return readBody((err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      const fileContent = stringifyFrontmatter(data, data.body || '');
      try {
        fs.writeFileSync(filePath, fileContent, 'utf-8');
        return sendJson(res, 200, {
          success: true,
          slug,
          message: 'Post updated successfully',
          url: `/blog/${slug}`
        });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    });
  }

  // 7. Delete post
  if (pathname.startsWith('/api/admin/posts/') && req.method === 'DELETE') {
    const slug = pathname.replace('/api/admin/posts/', '').trim();
    const filePath = path.join(blogDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return sendJson(res, 404, { success: false, error: `Post with slug "${slug}" not found` });
    }
    try {
      fs.unlinkSync(filePath);
      return sendJson(res, 200, { success: true, message: `Post "${slug}" deleted successfully` });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 7b. Toggle publish / unpublish post
  if (pathname.startsWith('/api/admin/posts/') && pathname.endsWith('/toggle-publish') && req.method === 'POST') {
    const slug = pathname.replace('/api/admin/posts/', '').replace('/toggle-publish', '').trim();
    const filePath = path.join(blogDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return sendJson(res, 404, { success: false, error: `Post with slug "${slug}" not found` });
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, body } = parseFrontmatter(content);
      const currentPublished = data.published !== false && data.published !== 'false';
      const newPublished = !currentPublished;
      data.published = newPublished;

      const newContent = stringifyFrontmatter(data, body);
      fs.writeFileSync(filePath, newContent, 'utf-8');

      return sendJson(res, 200, {
        success: true,
        slug,
        published: newPublished,
        message: newPublished 
          ? `Post "${data.title || slug}" is now Published!` 
          : `Post "${data.title || slug}" is now Unpublished (Draft).`
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 8. Trigger manual rebuild
  if (pathname === '/api/admin/rebuild' && req.method === 'POST') {
    exec('npm run build', { cwd: projectRoot }, (err, stdout, stderr) => {
      if (err) {
        return sendJson(res, 500, { success: false, error: stderr || err.message });
      }
      return sendJson(res, 200, { success: true, message: 'Site rebuild complete!', output: stdout.slice(-200) });
    });
    return;
  }

  // 9. Upload image (diagrams, charts, covers)
  if (pathname === '/api/admin/upload' && req.method === 'POST') {
    return readBody((err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      if (!data.fileData || !data.fileName) {
        return sendJson(res, 400, { success: false, error: 'fileName and fileData (base64) are required' });
      }

      const uploadsDir = path.join(projectRoot, 'public', 'images', 'blog');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(data.fileName).toLowerCase() || '.png';
      const baseName = path.basename(data.fileName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const safeFileName = `${baseName || 'image'}-${Date.now()}${ext}`;
      const targetPath = path.join(uploadsDir, safeFileName);

      const base64Data = data.fileData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      try {
        fs.writeFileSync(targetPath, buffer);
        const publicUrl = `/images/blog/${safeFileName}`;
        return sendJson(res, 201, {
          success: true,
          url: publicUrl,
          fileName: safeFileName,
          markdown: `![${baseName || 'diagram'}](${publicUrl})`,
          message: 'Image uploaded successfully'
        });
      } catch (writeErr) {
        return sendJson(res, 500, { success: false, error: writeErr.message });
      }
    });
  }

  // 10. Get social configuration
  if (pathname === '/api/admin/social-config' && req.method === 'GET') {
    try {
      if (fs.existsSync(socialConfigFile)) {
        const config = JSON.parse(fs.readFileSync(socialConfigFile, 'utf-8'));
        return sendJson(res, 200, { success: true, config });
      } else {
        return sendJson(res, 200, { success: true, config: {} });
      }
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 11. Update social configuration
  if (pathname === '/api/admin/social-config' && req.method === 'POST') {
    return readBody((err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      try {
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(socialConfigFile, JSON.stringify(data, null, 2), 'utf-8');
        return sendJson(res, 200, { success: true, message: 'Social configuration saved successfully', config: data });
      } catch (writeErr) {
        return sendJson(res, 500, { success: false, error: writeErr.message });
      }
    });
  }

  // 12. Push post or ad to social media
  if (pathname === '/api/admin/social-push' && req.method === 'POST') {
    return readBody(async (err, data) => {
      if (err) return sendJson(res, 400, { success: false, error: 'Invalid JSON payload' });
      const { title, summary, url, platforms = ['linkedin', 'twitter', 'facebook', 'whatsapp'], customCopy, tags = [] } = data;
      
      let socialConfig = {};
      try {
        if (fs.existsSync(socialConfigFile)) {
          socialConfig = JSON.parse(fs.readFileSync(socialConfigFile, 'utf-8'));
        }
      } catch (e) {}

      const brochureUrl = socialConfig.brochureUrl || 'http://localhost:4321/company-profile';
      const fullUrl = url ? (url.startsWith('http') ? url : `http://localhost:4321${url}`) : brochureUrl;
      
      // Build hashtags
      const tagList = Array.isArray(tags) && tags.length ? tags.map(t => '#' + t.replace(/\s+/g, '')) : (socialConfig.defaultHashtags || ['#AIGovernance', '#RKMIDIGILABS']);
      const hashtagString = tagList.join(' ');

      // Build platform share URLs (Web Intents)
      const shareCopy = customCopy || `${title || 'RKMIDIGILABS Announcement'}\n\n${summary ? summary + '\n\n' : ''}Explore analysis & Company Brochure: ${brochureUrl}\n\n${hashtagString}`;
      const encodedText = encodeURIComponent(shareCopy);
      const encodedUrl = encodeURIComponent(fullUrl);
      const encodedBrochureUrl = encodeURIComponent(brochureUrl);

      const intentUrls = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`*${title || 'RKMIDIGILABS'}*\n\n${summary || ''}\n\nArticle: ${fullUrl}\nCompany Profile & Brochure: ${brochureUrl}\n\n${hashtagString}`)}`
      };

      // Webhook dispatch if configured
      let webhookStatus = 'skipped';
      if (socialConfig.webhooks && socialConfig.webhooks.enabled && socialConfig.webhooks.webhookUrl) {
        try {
          const webhookPayload = JSON.stringify({
            event: 'social_push',
            timestamp: new Date().toISOString(),
            organization: 'RKMIDIGILABS',
            title,
            summary,
            articleUrl: fullUrl,
            brochureUrl,
            shareCopy,
            platforms,
            hashtags: tagList
          });
          await fetch(socialConfig.webhooks.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: webhookPayload
          });
          webhookStatus = 'delivered';
        } catch (webhookErr) {
          webhookStatus = `failed: ${webhookErr.message}`;
        }
      }

      // Record dispatch log
      const dispatchRecord = {
        id: `broadcast-${Date.now()}`,
        timestamp: new Date().toISOString(),
        title: title || 'RKMIDIGILABS Broadcast',
        url: fullUrl,
        brochureUrl,
        platforms,
        webhookStatus
      };

      try {
        let broadcasts = [];
        if (fs.existsSync(socialBroadcastsFile)) {
          broadcasts = JSON.parse(fs.readFileSync(socialBroadcastsFile, 'utf-8'));
        }
        broadcasts.unshift(dispatchRecord);
        if (broadcasts.length > 50) broadcasts = broadcasts.slice(0, 50);
        fs.writeFileSync(socialBroadcastsFile, JSON.stringify(broadcasts, null, 2), 'utf-8');
      } catch (logErr) {}

      return sendJson(res, 200, {
        success: true,
        message: 'Social broadcast prepared & recorded successfully',
        intentUrls,
        webhookStatus,
        dispatchRecord
      });
    });
  }

  // 13. List client inquiries
  if (pathname === '/api/admin/inquiries' && req.method === 'GET') {
    try {
      if (fs.existsSync(inquiriesFile)) {
        const list = JSON.parse(fs.readFileSync(inquiriesFile, 'utf-8'));
        return sendJson(res, 200, { success: true, inquiries: list });
      } else {
        return sendJson(res, 200, { success: true, inquiries: [] });
      }
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 14. Get specific inquiry with HTML template
  if (pathname.startsWith('/api/admin/inquiries/') && req.method === 'GET') {
    const inqId = pathname.replace('/api/admin/inquiries/', '').trim();
    const htmlPath = path.join(inquiriesDir, `${inqId}.html`);
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath, 'utf-8');
      return sendJson(res, 200, { success: true, inquiryId: inqId, html });
    } else {
      return sendJson(res, 404, { success: false, error: `Inquiry ${inqId} template not found` });
    }
  }

  // 404 Not Found
  sendJson(res, 404, { success: false, error: 'API endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🚀 RKMIDIGILABS Admin API Server running on port ${PORT} (Dual-Stack IPv4 & IPv6)`);
  console.log(`🔒 Secret Key configured: ${ADMIN_SECRET.slice(0, 3)}***`);
  console.log(`📁 Target Directory: ${blogDir}`);
  console.log(`======================================================`);
});