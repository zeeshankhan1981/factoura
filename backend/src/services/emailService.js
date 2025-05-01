import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create test account and transporter
const createTestTransporter = async () => {
  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter using the test account
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Initialize transporter
let transporter;

export const sendWelcomeEmail = async (user) => {
  try {
    // Create transporter if it doesn't exist
    if (!transporter) {
      transporter = await createTestTransporter();
    }

    const mailOptions = {
      from: '"factoura. Team" <test@factoura.xyz>',
      to: user.email,
      subject: 'Welcome to factoura. - Your Journey in Collaborative Journalism Begins!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #2c3e50;">Welcome to factoura.!</h1>
        <p style="color: #7f8c8d; font-size: 16px;">Hi ${user.firstName},</p>
        
        <p>Welcome to factoura., where journalism meets blockchain technology! We're thrilled to have you join our community of dedicated journalists and fact-checkers.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Your account is now active!</strong></p>
          <p style="margin: 10px 0 0 0;">You can now log in and start exploring verified stories, contribute to ongoing investigations, or even start your own journalistic project.</p>
        </div>
        
        <p>Here's what you can do next:</p>
        <ul>
          <li>Complete your profile to build credibility</li>
          <li>Explore verified stories on topics that interest you</li>
          <li>Connect with other journalists and fact-checkers</li>
          <li>Start contributing to the verification process</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://factoura.xyz/login" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In to Your Account</a>
        </div>
        
        <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:support@factoura.xyz">support@factoura.xyz</a>.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; color: #7f8c8d;">Best regards,</p>
          <p style="margin: 5px 0 0 0;"><strong>The factoura. Team</strong></p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #95a5a6;"> 2025 factoura. All rights reserved.</p>
        </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', user.email);
    
    // Log preview URL (only works with Ethereal Email)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw the error - we don't want to break the signup process if email fails
  }
};
