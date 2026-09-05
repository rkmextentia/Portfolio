// scripts/verify-all-pages.mjs
import http from 'http';

const urls = [
  { name: 'Home Page', url: 'http://localhost:4321/' },
  { name: 'Services & SOC Roadmap', url: 'http://localhost:4321/services/' },
  { name: 'Blog & Articles Directory', url: 'http://localhost:4321/blog/' },
  { name: 'Company Profile & Brochure', url: 'http://localhost:4321/company-profile/' },
  { name: 'Frameworks (ISO/NIST/EU AI)', url: 'http://localhost:4321/frameworks/' },
  { name: 'About Practice Lead', url: 'http://localhost:4321/about/' },
  { name: 'Contact & Inquiry', url: 'http://localhost:4321/contact/' },
  { name: 'Admin Studio Dashboard', url: 'http://localhost:4321/admin/' },
  { name: 'Admin Login', url: 'http://localhost:4321/admin/login/' },
  { name: 'Admin New Post / Video', url: 'http://localhost:4321/admin/new/' },
  { name: 'Admin Edit Post', url: 'http://localhost:4321/admin/edit?slug=iso-42001-ai-management-system' },
  { name: 'Article: ISO 42001 AI Management', url: 'http://localhost:4321/blog/iso-42001-ai-management-system/' },
  { name: 'Article: EU AI Act Conformity', url: 'http://localhost:4321/blog/eu-ai-act-high-risk-conformity/' },
  { name: 'Article: NIST AI RMF Measuring LLMs', url: 'http://localhost:4321/blog/nist-ai-rmf-measuring-llms/' },
  { name: 'Article: EU AI Act Art. 50 Watermarking', url: 'http://localhost:4321/blog/eu-ai-act-article-50-transparency-and-watermarking/' },
  { name: 'RSS Feed', url: 'http://localhost:4321/rss.xml' },
  { name: 'Sitemap XML', url: 'http://localhost:4321/sitemap.xml' },
  { name: 'Admin API Health Check', url: 'http://localhost:4322/api/admin/health' },
];

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
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
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
  console.log('=== STEP 1: VERIFYING ALL 18 ROUTES ACROSS SITES ===\n');
  let passedCount = 0;
  const results = [];

  for (const item of urls) {
    try {
      const res = await fetchUrl(item.url);
      const passed = res.status >= 200 && res.status < 400;
      if (passed) passedCount++;
      const resultObj = {
        name: item.name,
        url: item.url,
        status: res.status,
        passed,
        bytes: res.body.length
      };
      results.push(resultObj);
      console.log(`[${passed ? 'PASS' : 'FAIL'}] HTTP ${res.status} | ${item.name.padEnd(35)} | ${item.url}`);
    } catch (err) {
      console.log(`[FAIL] ERROR: ${err.message} | ${item.name} | ${item.url}`);
      results.push({ name: item.name, url: item.url, status: 'CONN_ERR', passed: false, error: err.message });
    }
  }

  console.log(`\nInitial route verification: ${passedCount}/${urls.length} passed.`);

  console.log('\n=== STEP 2: TESTING UNPUBLISH & PUBLISH TOGGLE WITHOUT 404 ===\n');
  
  // 1. Get Auth Token
  const loginRes = await fetchUrl('http://localhost:4322/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rkmidigi2026!' })
  });
  const loginData = JSON.parse(loginRes.body);
  const token = loginData.token;
  console.log(`Admin token obtained: ${token ? 'SUCCESS' : 'FAILED'}`);

  const testSlug = 'iso-42001-ai-management-system';

  // 2. Toggle to Unpublished
  console.log(`\nToggling "${testSlug}" to UNPUBLISHED (Draft)...`);
  const toggleRes1 = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const toggleData1 = JSON.parse(toggleRes1.body);
  console.log(`Toggle Response:`, toggleData1);

  // 3. Immediately verify /admin and /blog and post detail do NOT return 404
  console.log('\nVerifying pages immediately after unpublishing (checking for 404 absence)...');
  const checkRoutes = [
    'http://localhost:4321/admin/',
    'http://localhost:4321/blog/',
    `http://localhost:4321/blog/${testSlug}/`
  ];

  for (const url of checkRoutes) {
    const res = await fetchUrl(url);
    console.log(`Status ${res.status} on ${url} (length: ${res.body.length} bytes)`);
    if (res.status === 404) {
      console.error(`ERROR: Encountered 404 on ${url}!`);
    } else {
      console.log(`SUCCESS: Page remained accessible without 404.`);
    }
  }

  // 4. Toggle back to Published
  console.log(`\nToggling "${testSlug}" back to PUBLISHED...`);
  const toggleRes2 = await fetchUrl(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const toggleData2 = JSON.parse(toggleRes2.body);
  console.log(`Toggle Response:`, toggleData2);

  console.log('\nVerifying pages again after re-publishing...');
  for (const url of checkRoutes) {
    const res = await fetchUrl(url);
    console.log(`Status ${res.status} on ${url} (length: ${res.body.length} bytes)`);
  }

  console.log('\n=== ALL TESTS COMPLETE ===');
}

run();
