import fs from 'fs';

async function testE2E() {
  console.log('Testing Frontend (http://localhost:4321/services)...');
  const resHtml = await fetch('http://localhost:4321/services');
  const html = await resHtml.text();
  
  const hasModal = html.includes('id="inquiry-modal"');
  const hasOpenBtn = html.includes('open-inquiry-modal-btn');
  const hasServiceSelect = html.includes('id="inq-service"');
  const hasCorporateHeader = html.includes('bg-[#112649]');
  const hasTargetEmail = html.includes('rkmvedant@gmail.com');

  console.log('Frontend Checks:');
  console.log('  - Modal in DOM:', hasModal);
  console.log('  - Modal open buttons present:', hasOpenBtn);
  console.log('  - Service dropdown present:', hasServiceSelect);
  console.log('  - Corporate header present:', hasCorporateHeader);
  console.log('  - Target email embedded:', hasTargetEmail);

  console.log('\nTesting Backend API (http://localhost:4322)...');
  const healthRes = await fetch('http://localhost:4322/api/health');
  const health = await healthRes.json();
  console.log('  - API Health:', health.status, 'version:', health.version);

  const inquiryPayload = {
    name: 'Vikram Mehta (Chief Risk Officer)',
    email: 'vikram.mehta@globalfin.org',
    phone: '+91 91234 56789',
    service: 'Enterprise GRC Advisory',
    description: 'We require an ISO 27001:2022 to ISO 42001 cross-mapping and SOC 2 Type II audit remediation roadmap for our cloud-hosted LLM deployment.'
  };

  const inqRes = await fetch('http://localhost:4322/api/inquire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryPayload)
  });
  const inqData = await inqRes.json();

  console.log('\nInquiry Submission API:');
  console.log('  - Status Code:', inqRes.status);
  console.log('  - Response Data:', inqData);

  if (inqData.success && inqData.inquiryId) {
    const filePath = `data/inquiries/${inqData.inquiryId}.html`;
    if (fs.existsSync(filePath)) {
      const savedHtml = fs.readFileSync(filePath, 'utf-8');
      console.log('  - Saved Email Template File Exists:', filePath);
      console.log('  - Contains Recipient rkmvedant@gmail.com:', savedHtml.includes('rkmvedant@gmail.com'));
      console.log('  - Contains Client Vikram Mehta:', savedHtml.includes('Vikram Mehta'));
      console.log('  - Contains Phone +91 91234 56789:', savedHtml.includes('+91 91234 56789'));
      console.log('  - Contains Service Enterprise GRC Advisory:', savedHtml.includes('Enterprise GRC Advisory'));
    }
  }
}

testE2E().catch(console.error);
