import prisma from './prismaClient.js';
import bcrypt from 'bcrypt';

async function createTestUser() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Try to create user directly without checking tables
    try {
      const newUser = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword
        }
      });
      console.log('Test user created successfully:', newUser);
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  } catch (error) {
    console.error('Error in createTestUser:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
