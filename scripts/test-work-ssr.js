const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js server for Our Work verification...');
const nextBin = path.join(__dirname, '../node_modules/next/dist/bin/next');
const nextProcess = spawn(process.execPath, [nextBin, 'start', '-p', '3008'], {
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
    http.get(`http://127.0.0.1:3008${urlPath}`, (res) => {
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
    const hub = await fetchUrl('/our-work');
    console.log('\n--- Our Work Hub (/our-work) ---');
    console.log('Status:', hub.status);
    const hubChecks = [
      { label: 'H1 Our Work.', pass: hub.body.includes('Our Work.') },
      { label: 'Headline Stats', pass: hub.body.includes('3.51M') && hub.body.includes('Google impressions') },
      { label: 'Featured 10Q Challenge', pass: hub.body.includes('Featured · SEO + Website') && hub.body.includes('10Q Challenge') },
      { label: 'Sticky Filter Bar', pass: hub.body.includes('Filter by service') && hub.body.includes('All work') },
      { label: 'Live Client Sites', pass: hub.body.includes("Websites We've Built. Live Now.") },
      { label: 'More SEO Results', pass: hub.body.includes('More SEO Results.') },
      { label: 'We Shoot Too', pass: hub.body.includes('We Shoot Too.') },
      { label: 'CTA Band', pass: hub.body.includes('Want Results Like These?') },
    ];
    hubChecks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const cs1 = await fetchUrl('/our-work/10q-challenge');
    console.log('\n--- Case Study: 10Q Challenge (/our-work/10q-challenge) ---');
    console.log('Status:', cs1.status);
    const cs1Checks = [
      { label: 'Case Study H1', pass: cs1.body.includes('10Q Challenge') },
      { label: 'Problem & What We Did', pass: cs1.body.includes('The Problem') && cs1.body.includes('What We Did') },
      { label: 'The Result', pass: cs1.body.includes('The Result') },
      { label: 'The Proof Gallery', pass: cs1.body.includes('The Proof.') },
      { label: 'Owner Card (Harshal Jain)', pass: cs1.body.includes('Harshal Jain') },
      {
        label: 'Strict Honesty Rule (Draft review text NOT exposed publicly)',
        pass: !cs1.body.includes('AegisKoncept rebuilt our site and SEO. We now rank #1 for BITSAT'),
      },
    ];
    cs1Checks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const cs2 = await fetchUrl('/our-work/allied-industrial-park');
    console.log('\n--- Case Study: Allied Industrial Park ---');
    console.log('Status:', cs2.status);
    const cs2Checks = [
      { label: 'Case Study H1', pass: cs2.body.includes('Allied Industrial Park') },
      { label: 'Result stats', pass: cs2.body.includes('100%') },
    ];
    cs2Checks.forEach((c) => console.log(`${c.pass ? '✔ PASS' : '✖ FAIL'}: ${c.label}`));

    const allPass =
      hubChecks.every((c) => c.pass) &&
      cs1Checks.every((c) => c.pass) &&
      cs2Checks.every((c) => c.pass);

    console.log('\n==================================');
    console.log(allPass ? 'ALL STEP 5 CHECKS PASSED!' : 'SOME CHECKS FAILED!');
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

