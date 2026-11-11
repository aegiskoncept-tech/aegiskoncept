const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting next server for Home Page verification...');
const nextBin = path.join(__dirname, '../node_modules/next/dist/bin/next');
const nextProcess = spawn(process.execPath, [nextBin, 'start', '-p', '3006'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

nextProcess.stdout.on('data', (d) => {
  console.log('[Next.js]', d.toString().trim());
});

nextProcess.stderr.on('data', (d) => {
  console.error('[Next.js Err]', d.toString().trim());
});

let attempts = 0;
function tryConnect() {
  attempts++;
  http.get('http://127.0.0.1:3006', (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('Response Status:', res.statusCode);
      console.log('HTML Length:', body.length);

      const checks = [
        { label: 'Hero Canvas (.hcv)', pass: body.includes('class="hcv"') },
        { label: 'Hero Slider (4 slides)', pass: body.includes('slide-0') && body.includes('slide-3') },
        { label: 'Hero Quote Form (hform)', pass: body.includes('class="hform"') },
        { label: 'Results Ticker (htick)', pass: body.includes('class="htick"') },
        { label: 'Logo Marquee (marq lg)', pass: body.includes('marq lg') },
        { label: 'Manifesto Scrub (.scrub)', pass: body.includes('class="scrub') },
        { label: 'We Don’t Just Do Marketing', pass: body.includes("We Don't Just Do Marketing") },
        { label: 'Services 5 Rows (.svc-row)', pass: (body.match(/class="svc-row"/g) || []).length === 5 },
        { label: 'Pinned Work (.hpin .track)', pass: body.includes('hpin') && body.includes('track') },
        { label: 'Simple Process Steps', pass: body.includes('Simple Process. Clear Results.') },
        { label: 'Every Month Like Clockwork', pass: body.includes('Every Month, Like Clockwork.') },
        { label: 'Every Industry Is Different', pass: body.includes('Every Industry Is Different.') },
        { label: 'Why People Work With Us (RK, YG)', pass: body.includes('Why People Work With Us') && body.includes('RK') },
        { label: 'Reviews Spotlight (.rvw-g)', pass: body.includes('The People Who Trust Us.') && body.includes('rvw-g') },
        { label: 'Blog / Tips to Grow Your Business', pass: body.includes('Tips to Grow Your Business.') },
        { label: 'CTA Band (Got a Goal? Let’s Make a Plan.)', pass: body.includes("Got a Goal? Let's Make a Plan.") },
      ];

      console.log('\n--- Home Page Verification Checks ---');
      let allPass = true;
      checks.forEach((c) => {
        if (!c.pass) allPass = false;
        console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`);
      });

      nextProcess.kill();
      process.exit(allPass ? 0 : 1);
    });
  }).on('error', () => {
    if (attempts < 30) {
      setTimeout(tryConnect, 400);
    } else {
      console.error('Failed to connect after 30 attempts');
      nextProcess.kill();
      process.exit(1);
    }
  });
}

setTimeout(tryConnect, 1500);
