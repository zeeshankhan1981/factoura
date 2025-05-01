import prisma from './prismaClient.js';

async function listAllUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('All users in the database:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
    });
    console.log(`Total users: ${users.length}`);
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();
