import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdmin() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: 'rizkyseptian401@gmail.com'
      }
    });

    if (!user) {
      console.error('❌ User not found!');
      process.exit(1);
    }

    console.log('👤 Found user:', user.name, `(${user.email})`);
    console.log('📝 Current role:', user.role);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' }
    });

    console.log('✅ Role updated successfully!');
    console.log('🎉 New role:', updated.role);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
