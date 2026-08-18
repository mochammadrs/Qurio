import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verifikasi soal di database...\n");

  const categories = await prisma.category.findMany();
  
  for (const category of categories) {
    const count = await prisma.question.count({
      where: { categoryId: category.id },
    });
    
    console.log(`📚 ${category.name} (${category.slug}): ${count} soal`);
    
    const sample = await prisma.question.findFirst({
      where: { categoryId: category.id },
      orderBy: { createdAt: 'desc' },
    });
    
    if (sample) {
      console.log(`   Sample soal terbaru: "${sample.question.substring(0, 50)}..."`);
    }
    console.log();
  }

  const total = await prisma.question.count();
  console.log(`✅ TOTAL: ${total} soal di database`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
