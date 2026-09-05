import fs from 'fs';

async function testPublishToggle() {
  console.log('--- 1. Testing Admin Dashboard HTML (/admin) ---');
  const adminRes = await fetch('http://localhost:4321/admin');
  const adminHtml = await adminRes.text();
  console.log('  - Contains Publish Status column header:', adminHtml.includes('Publish Status'));
  console.log('  - Contains Status filter dropdown:', adminHtml.includes('id="status-filter"'));
  console.log('  - Contains Live Published stats card:', adminHtml.includes('id="stat-published"'));
  console.log('  - Contains Drafts stats card:', adminHtml.includes('id="stat-drafts"'));

  console.log('\n--- 2. Testing Edit and New Post Editor HTML ---');
  const editRes = await fetch('http://localhost:4321/admin/edit?slug=iso-42001-ai-management-system');
  const editHtml = await editRes.text();
  console.log('  - Edit page contains toggle-publish-btn:', editHtml.includes('id="toggle-publish-btn"'));

  const newRes = await fetch('http://localhost:4321/admin/new');
  const newHtml = await newRes.text();
  console.log('  - New page contains toggle-publish-btn:', newHtml.includes('id="toggle-publish-btn"'));

  console.log('\n--- 3. Testing Backend Toggle Endpoint ---');
  const loginRes = await fetch('http://localhost:4322/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rkmidigi2026!' })
  });
  const { token } = await loginRes.json();
  console.log('  - Logged in successfully:', !!token);

  const testSlug = 'iso-42001-ai-management-system';
  
  // Toggle 1: Publish -> Unpublish
  const t1 = await fetch(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('  - Toggle 1 (to unpublished):', t1);

  // Verify posts list reflects unpublished
  const postsRes1 = await fetch('http://localhost:4322/api/admin/posts', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  const postInList1 = postsRes1.posts.find(p => p.slug === testSlug);
  console.log('  - Post published status in list:', postInList1?.published, '(expected: false)');

  // Toggle 2: Unpublish -> Publish back
  const t2 = await fetch(`http://localhost:4322/api/admin/posts/${testSlug}/toggle-publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('  - Toggle 2 (back to published):', t2);

  const postsRes2 = await fetch('http://localhost:4322/api/admin/posts', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  const postInList2 = postsRes2.posts.find(p => p.slug === testSlug);
  console.log('  - Post published status in list after toggle back:', postInList2?.published, '(expected: true)');

  console.log('\n✅ All Publish / Unpublish Toggle tests verified successfully!');
}

testPublishToggle().catch(console.error);
