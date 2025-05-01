import prisma from './prismaClient.js'; // Adjust the path as needed

const clearUsers = async () => {
  try {
    // Delete all articles first
    await prisma.article.deleteMany({});
    console.log('All articles deleted');

    // Then delete all users
    await prisma.user.deleteMany({});
    console.log('All users deleted');
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
};

clearUsers();