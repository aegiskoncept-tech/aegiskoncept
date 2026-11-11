const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'admin@aegiskoncept.com';
  const password = process.argv[3] || 'AegisAdmin2026!';
  const name = process.argv[4] || 'Ritesh Kumar';

  console.log(`Creating/updating admin user: ${email}...`);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role: 'ADMIN',
    },
    create: {
      email,
      name,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Successfully created/updated admin user:`);
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

