import prisma from './prismaClient.js';
import bcrypt from 'bcrypt';

async function resetUserPassword(email, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log(`Password reset successful for user: ${updatedUser.username}`);
    return updatedUser;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Reset password for sampleuser1 to 'password123'
resetUserPassword('samplesuser1@example.com', 'password123')
  .then(() => console.log('Password reset complete'))
  .catch(error => console.error('Failed to reset password:', error));
