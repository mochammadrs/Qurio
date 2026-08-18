import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VALID_ROLES = ["admin", "user"];

async function main() {
  const email = process.argv[2];
  const role = process.argv[3] ?? "admin";

  if (!email) {
    console.error("Usage: npx tsx prisma/promote-admin.ts <email> [role]");
    console.error("  role: admin (default) atau user");
    process.exit(1);
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(`Role harus salah satu dari: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`User dengan email "${email}" tidak ditemukan.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role },
  });

  console.log(`Role ${updated.email} diubah menjadi "${updated.role}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());