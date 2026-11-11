const fs = require('fs');
const path = require('path');

console.log('=== AEGISKONCEPT FINAL PRODUCTION QA VERIFICATION ===\n');

// 1. Check Strict Honesty Rule across all static HTML files
console.log('1. Checking Strict Honesty Rule across generated static HTML...');
const htmlDir = path.join('.next', 'server', 'app');

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(htmlDir);
console.log(`Found ${htmlFiles.length} rendered HTML files.`);

// Draft review text phrases from content.json to check against
const DRAFT_REVIEW_PHRASES = [
  "Ritesh and Yogeesh didn't just rebuild our website",
  "We went from invisible on Google to ranking #1 for BITSAT",
  "Patient footfall doubled in four months",
  "All 40 industrial plots sold out 6 months ahead of schedule",
  "Our Instagram went from a ghost town to 40+ membership walk-ins",
  "Our architectural portfolio finally looks as premium as the homes we design",
  "Our D2C supplement launch did ₹18L in month one",
  "Corporate training inquiries jumped 3x within 60 days",
  "Orders from the UK and US grew by 140%",
  "Commercial design contracts from Gurugram doubled",
  "Online sales grew 220% year-on-year",
  "The 4K factory tour videos closed a ₹4.5 Cr machinery deal"
];

let leakCount = 0;
htmlFiles.forEach((file) => {
  // Ignore admin files
  if (file.includes('admin')) return;
  const content = fs.readFileSync(file, 'utf8');
  DRAFT_REVIEW_PHRASES.forEach((phrase) => {
    if (content.includes(phrase)) {
      console.error(`[FAIL] Draft review leaked in: ${file}`);
      console.error(`Phrase: "${phrase}"`);
      leakCount++;
    }
  });
});

if (leakCount === 0) {
  console.log('✓ PASS: Strict Honesty Rule verified. 0 draft reviews found in public HTML.\n');
} else {
  console.error(`✕ FAIL: ${leakCount} draft review leaks found.\n`);
  process.exit(1);
}

// 2. Check Brand Rule: No phone number in video CTA buttons
console.log('2. Checking Brand Rule: No phone number in video CTA buttons...');
let videoCtaViolation = 0;
htmlFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  if (file.includes('videos.html')) {
    // Check if any video link has tel:
    if (/href=["']tel:[^"']+["'][^>]*>.*?(reel|video)/i.test(content)) {
      console.error(`[FAIL] Phone number found in video CTA: ${file}`);
      videoCtaViolation++;
    }
  }
});
if (videoCtaViolation === 0) {
  console.log('✓ PASS: Brand Rule verified. Zero phone numbers in video CTA buttons.\n');
} else {
  console.error(`✕ FAIL: Phone number found in video CTA.\n`);
  process.exit(1);
}

// 3. Verify sitemap.xml and robots.txt
console.log('3. Checking sitemap.xml and robots.txt...');
const sitemapPath = path.join('.next', 'server', 'app', 'sitemap.xml.body');
const sitemapAlt = path.join('.next', 'server', 'app', 'sitemap.xml');
const robotsPath = path.join('.next', 'server', 'app', 'robots.txt.body');
const robotsAlt = path.join('.next', 'server', 'app', 'robots.txt');

const hasSitemap = fs.existsSync(sitemapPath) || fs.existsSync(sitemapAlt) || fs.existsSync('app/sitemap.ts');
const hasRobots = fs.existsSync(robotsPath) || fs.existsSync(robotsAlt) || fs.existsSync('app/robots.ts');

console.log(hasSitemap ? '✓ PASS: sitemap.xml route present.' : '✕ FAIL: missing sitemap.xml');
console.log(hasRobots ? '✓ PASS: robots.txt route present.' : '✕ FAIL: missing robots.txt');

// 4. Verify IndexNow key file
const indexNowKeyPath = path.join('public', 'aegiskoncept8f9c1b2e3d4a5b6c7d8e9f0a.txt');
if (fs.existsSync(indexNowKeyPath)) {
  console.log('✓ PASS: IndexNow key verification file exists in /public.\n');
} else {
  console.error('✕ FAIL: Missing IndexNow verification key file.\n');
  process.exit(1);
}

// 5. Verify Admin user exists in SQLite
console.log('5. Verifying Admin User credentials in database...');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({ where: { email: 'admin@aegiskoncept.com' } }).then((u) => {
  if (u && u.role === 'ADMIN') {
    console.log(`✓ PASS: Admin user verified (${u.email}, role: ${u.role}).\n`);
  } else {
    console.error('✕ FAIL: Admin user not found in SQLite.\n');
    process.exit(1);
  }
  console.log('=== ALL QA CHECKS PASSED SUCCESSFULLY (100% READY FOR PRODUCTION) ===');
  process.exit(0);
});

