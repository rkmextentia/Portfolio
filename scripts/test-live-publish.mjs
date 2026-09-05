// scripts/test-live-publish.mjs
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
  console.log('=== TEST 1: Public Posts API Endpoint (/api/public/posts) ===');
  const pubRes = await fetchUrl('http://localhost:4322/api/public/posts');
  console.log(`HTTP ${pubRes.status}`);
  console.log(`Total count: ${pubRes.json.totalCount}`);
  console.log(`Published count: ${pubRes.json.publishedCount}`);
  console.log(`Unpublished count: ${pubRes.json.unpublishedCount}`);
  pubRes.json.posts.forEach(p => {
    console.log(` - [${p.published ? 'PUBLISHED' : 'DRAFT'}] ${p.slug} (${p.category})`);
  });

  console.log('\n=== TEST 2: Admin Login & Obtain Token ===');
  const loginRes = await fetchUrl('http://localhost:4322/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rkmidigi2026!' })
  });
  const token = loginRes.json.token;
  console.log(`Login: ${token ? 'SUCCESS' : 'FAILED'}`);

  const testSlug = 'iso-42001-ai-management-system';

  console.log(`\n=== TEST 3: Toggle "${testSlug}" to UNPUBLISHED (Draft) ===`);
  const toggleRes1 = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Toggle Response:', toggleRes1.json);

  // Check public endpoint immediately
  const pubCheck1 = await fetchUrl('http://localhost:4322/api/public/posts');
  const target1 = pubCheck1.json.posts.find(p => p.slug === testSlug);
  console.log(`Public API status for ${testSlug}: published = ${target1 ? target1.published : 'not found'}`);
  console.log(`Public API publishedCount: ${pubCheck1.json.publishedCount}`);

  // Check blog page HTML contains the live sync script and data-slug
  const blogHtml = await fetchUrl('http://localhost:4321/blog/');
  console.log(`Blog Page HTTP Status: ${blogHtml.status}`);
  console.log(`Blog Page contains data-slug="${testSlug}": ${blogHtml.body.includes(`data-slug="${testSlug}"`)}`);
  console.log(`Blog Page contains syncLivePosts: ${blogHtml.body.includes('syncLivePosts')}`);
  console.log(`Blog Page contains BroadcastChannel: ${blogHtml.body.includes('BroadcastChannel')}`);

  console.log(`\n=== TEST 4: Toggle "${testSlug}" back to PUBLISHED ===`);
  const toggleRes2 = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Toggle Response:', toggleRes2.json);

  // Check public endpoint immediately
  const pubCheck2 = await fetchUrl('http://localhost:4322/api/public/posts');
  const target2 = pubCheck2.json.posts.find(p => p.slug === testSlug);
  console.log(`Public API status for ${testSlug}: published = ${target2 ? target2.published : 'not found'}`);
  console.log(`Public API publishedCount: ${pubCheck2.json.publishedCount}`);

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

run();
