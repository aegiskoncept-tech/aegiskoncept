const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js server for Services verification...');
const nextBin = path.join(__dirname, '../node_modules/next/dist/bin/next');
const nextProcess = spawn(process.execPath, [nextBin, 'start', '-p', '3007'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

nextProcess.stdout.on('data', (d) => {
  console.log('[Next.js]', d.toString().trim());
});

nextProcess.stderr.on('data', (d) => {
  console.error('[Next.js Err]', d.toString().trim());
});

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:3007${urlPath}`, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

let attempts = 0;
async function runChecks() {
  attempts++;
  try {
    const hub = await fetchUrl('/services');
    console.log('\n--- Services Hub (/services) ---');
    console.log('Status:', hub.status);
    const hubChecks = [
      { label: 'H1 Five Services. One Team.', pass: hub.body.includes('Five Services. One Team.') },
      { label: "What's your goal?", pass: hub.body.includes("What's your goal?") },
      { label: '5 Service Blocks', pass: hub.body.includes('Website Design &amp; Development') || hub.body.includes('Website Design & Development') },
      { label: 'CTA Band', pass: hub.body.includes('Not Sure Where to Start?') },
    ];
    hubChecks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const seo = await fetchUrl('/services/seo');
    console.log('\n--- SEO Service Detail (/services/seo) ---');
    console.log('Status:', seo.status);
    const seoChecks = [
      { label: 'SEO H1 Heading', pass: seo.body.includes('Show up on Google') },
      { label: 'Real Results Screenshots Gallery', pass: seo.body.includes('Real Results. Real Screenshots.') },
      { label: 'FixRows Section', pass: seo.body.includes("Sound Familiar? Here's the Fix.") },
      { label: 'Deliverables Table', pass: seo.body.includes("What's Included.") },
      { label: 'SEO FAQs Accordion', pass: seo.body.includes('Questions?') },
    ];
    seoChecks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const social = await fetchUrl('/services/social-media-marketing-management');
    console.log('\n--- Social Media Service Detail ---');
    console.log('Status:', social.status);
    const socialChecks = [
      { label: 'Social Media Comparison (Most agencies vs We also)', pass: social.body.includes('Most agencies') && social.body.includes('We also') },
    ];
    socialChecks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const video = await fetchUrl('/services/video-production');
    console.log('\n--- Video Production Service Detail ---');
    console.log('Status:', video.status);
    const videoChecks = [
      { label: 'Watch Our Shoots section', pass: video.body.includes('Watch Our Shoots.') },
    ];
    videoChecks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const allPass =
      hubChecks.every((c) => c.pass) &&
      seoChecks.every((c) => c.pass) &&
      socialChecks.every((c) => c.pass) &&
      videoChecks.every((c) => c.pass);

    console.log('\n==================================');
    console.log(allPass ? 'ALL STEP 4 CHECKS PASSED!' : 'SOME CHECKS FAILED!');
    console.log('==================================');

    nextProcess.kill();
    process.exit(allPass ? 0 : 1);
  } catch {
    if (attempts < 30) {
      setTimeout(runChecks, 400);
    } else {
      console.error('Failed to connect to Next.js server after 30 attempts');
      nextProcess.kill();
      process.exit(1);
    }
  }
}

setTimeout(runChecks, 1500);

