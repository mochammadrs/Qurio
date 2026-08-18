import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: npx tsx scripts/promote-admin.ts <email>");
    console.error("Example: npx tsx scripts/promote-admin.ts admin@example.com");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`User with email "${email}" not found.`);
    process.exit(1);
  }

  if (user.role === "admin") {
    console.log(`User ${email} is already an admin.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`✅ Promoted ${email} to admin role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });