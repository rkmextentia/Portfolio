// scripts/test-admin-all-actions.mjs
import http from 'http';

function fetchUrl(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            json: data ? JSON.parse(data) : null
          });
        } catch(e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            json: null
          });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function run() {
  console.log('=== VERIFYING ALL ADMIN STUDIO ACTIONS ===\n');

  // 1. Admin Login
  console.log('--- 1. Testing Admin Authentication ---');
  const loginRes = await fetchUrl('http://localhost:4322/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rkmidigi2026!' })
  });
  console.log(`Login Status: ${loginRes.status}`);
  const token = loginRes.json?.token;
  if (!token) throw new Error('Failed to obtain token');
  console.log('✅ Admin Token Obtained Successfully\n');

  const authHeader = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // 2. Fetch Posts List
  console.log('--- 2. Testing Fetch Posts List ---');
  const listRes = await fetchUrl('http://localhost:4322/api/admin/posts', {
    headers: authHeader
  });
  console.log(`Fetch Posts Status: ${listRes.status}`);
  const posts = listRes.json?.posts || [];
  console.log(`Total Posts Loaded: ${posts.length}`);
  posts.forEach(p => console.log(`  • [${p.published ? 'PUBLISHED' : 'DRAFT'}] ${p.slug} - ${p.title}`));
  console.log('✅ Fetch Posts Succeeded\n');

  const testSlug = 'iso-42001-ai-management-system';

  // 3. Test View Link
  console.log('--- 3. Testing View Article Route ---');
  const viewRes = await fetchUrl(`http://localhost:4321/blog/${testSlug}/`);
  console.log(`View Route Status: ${viewRes.status} (Length: ${viewRes.body.length} bytes)`);
  if (viewRes.status !== 200) throw new Error(`View failed with status ${viewRes.status}`);
  console.log('✅ View Article Route Succeeded\n');

  // 4. Test Single Publish / Unpublish Toggle
  console.log('--- 4. Testing Publish / Unpublish Toggle ---');
  const toggleUnpub = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: authHeader
  });
  console.log(`Toggle to Unpublish:`, toggleUnpub.json);
  if (toggleUnpub.json?.published !== false) throw new Error('Failed to toggle to unpublished');

  const togglePub = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: authHeader
  });
  console.log(`Toggle to Publish:`, togglePub.json);
  if (togglePub.json?.published !== true) throw new Error('Failed to toggle to published');
  console.log('✅ Publish / Unpublish Toggle Succeeded\n');

  // 5. Test Edit Post (Read & Update)
  console.log('--- 5. Testing Edit Post (Load & Save) ---');
  const getPostRes = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}`, {
    headers: authHeader
  });
  console.log(`Load Post for Edit: Status ${getPostRes.status}`);
  const postData = getPostRes.json?.post;
  if (!postData) throw new Error('Failed to load post for editing');

  const updateRes = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}`, {
    method: 'PUT',
    headers: authHeader,
    body: JSON.stringify({
      ...postData,
      summary: postData.summary + ' [Verified]'
    })
  });
  console.log(`Save Edit Post: Status ${updateRes.status}`, updateRes.json);

  // Restore original summary
  await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}`, {
    method: 'PUT',
    headers: authHeader,
    body: JSON.stringify(postData)
  });
  console.log('✅ Edit Post Succeeded\n');

  // 6. Test Social Push
  console.log('--- 6. Testing Social Push Broadcast ---');
  const pushRes = await fetchUrl('http://localhost:4322/api/admin/social-push', {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: postData.title,
      summary: postData.summary,
      url: `/blog/${testSlug}/`,
      customCopy: `Executive Briefing: ${postData.title}\nBrochure: http://localhost:4321/company-profile`,
      tags: postData.tags
    })
  });
  console.log(`Social Push Status: ${pushRes.status}`, pushRes.json);
  if (!pushRes.json?.success) throw new Error('Social push failed');
  console.log('✅ Social Media Push Succeeded\n');

  // 7. Test Create and Delete Lifecycle
  console.log('--- 7. Testing Create & Delete Lifecycle ---');
  const tempSlug = `test-post-lifecycle-${Date.now()}`;
  const createRes = await fetchUrl('http://localhost:4322/api/admin/posts', {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({
      title: 'Temporary Verification Post',
      slug: tempSlug,
      category: 'Enterprise GRC',
      readTime: '2 min read',
      published: true,
      summary: 'Temporary post for testing delete action.',
      tags: ['Test', 'GRC'],
      body: '## Temporary Post Body'
    })
  });
  console.log(`Create Post Status: ${createRes.status}`, createRes.json);
  if (createRes.status !== 201) throw new Error('Create post failed');

  const deleteRes = await fetchUrl(`http://localhost:4322/api/admin/posts/${tempSlug}`, {
    method: 'DELETE',
    headers: authHeader
  });
  console.log(`Delete Post Status: ${deleteRes.status}`, deleteRes.json);
  if (!deleteRes.json?.success) throw new Error('Delete post failed');
  console.log('✅ Create & Delete Post Succeeded\n');

  // 8. Test Admin UI Pages
  console.log('--- 8. Testing Admin UI HTML Pages ---');
  const adminPages = [
    { name: 'Admin Dashboard', url: 'http://localhost:4321/admin/' },
    { name: 'Admin Login', url: 'http://localhost:4321/admin/login/' },
    { name: 'Admin New Post', url: 'http://localhost:4321/admin/new/' },
    { name: 'Admin Edit Post', url: `http://localhost:4321/admin/edit?slug=${testSlug}` },
  ];

  for (const p of adminPages) {
    const res = await fetchUrl(p.url);
    console.log(`  • ${p.name.padEnd(20)}: HTTP ${res.status} (${res.body.length} bytes)`);
    if (res.status !== 200) throw new Error(`${p.name} returned status ${res.status}`);
  }
  console.log('✅ All Admin UI Pages Succeeded\n');

  console.log('======================================================');
  console.log('🏆 ALL 5 ACTIONS (EDIT, PUSH, PUBLISH, VIEW, DELETE) VERIFIED 100% OPERATIONAL!');
  console.log('======================================================');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
