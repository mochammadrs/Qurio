import { PrismaClient } from '@prisma/client';
import { questions } from '../src/data/questions';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const categories = [
    {
      slug: 'agama',
      name: 'Agama',
      description: 'Pengetahuan tentang Islam & nilai-nilai keagamaan',
      emoji: '📖',
    },
    {
      slug: 'sejarah',
      name: 'Sejarah',
      description: 'Peristiwa penting dalam sejarah dunia & Indonesia',
      emoji: '🕰️',
    },
    {
      slug: 'umum',
      name: 'Pengetahuan Umum',
      description: 'Wawasan luas tentang dunia & kehidupan',
      emoji: '🌍',
    },
  ];

  console.log('📦 Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log('📚 Migrating questions from questions.ts...');
  const categoryMap = await prisma.category.findMany();
  const categoryIdMap = Object.fromEntries(
    categoryMap.map((c) => [c.slug, c.id])
  );

  for (const question of questions) {
    const categoryId = categoryIdMap[question.category];
    if (!categoryId) {
      console.warn(`⚠️  Category not found for question: ${question.id}`);
      continue;
    }

    await prisma.question.upsert({
      where: { id: question.id },
      update: {
        categoryId,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      },
      create: {
        id: question.id,
        categoryId,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      },
    });
  }

  const questionCount = await prisma.question.count();
  console.log(`✅ Seeded ${questionCount} questions`);
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
