import prisma from './prismaClient.js';
import bcrypt from 'bcrypt';

async function initializeDatabase() {
  try {
    // Check if tables exist, if not create them
    try {
      await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
      console.log('User table exists');
    } catch (error) {
      console.log('Creating User table...');
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "User" (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `;
      console.log('User table created');
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM "Article" LIMIT 1`;
      console.log('Article table exists');
    } catch (error) {
      console.log('Creating Article table...');
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Article" (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          "authorId" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          FOREIGN KEY ("authorId") REFERENCES "User"(id)
        )
      `;
      console.log('Article table created');
    }

    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!existingUser) {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const newUser = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword
        }
      });
      console.log('Test user created:', newUser);
    } else {
      console.log('Test user already exists');
    }

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();
