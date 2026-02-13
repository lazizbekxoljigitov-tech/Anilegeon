import nodemailer from 'nodemailer';
import { env } from '../config/env';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
    console.log(`EmailService initialized with user: ${env.EMAIL_USER}`);
  }

  async sendOTP(to: string, otp: string) {
    console.log(`Attempting to send OTP to: ${to} (Code: ${otp})`);
    const mailOptions = {
      from: `"ANILEGEON" <${env.EMAIL_USER}>`,
      to,
      subject: 'Verification Code - ANILEGEON',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #ff3b30; text-align: center;">ANILEGEON</h2>
          <p style="font-size: 16px; color: #333;">Xush kelibsiz! Sizning tasdiqlash kodingiz:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff3b30;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">Ushbu kod 10 daqiqa davomida amal qiladi. Agar siz so'rov yubormagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2026 ANILEGEON. Barcha huquqlar himoyalangan.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully');
      return true;
    } catch (error) {
      console.log('\n' + '='.repeat(50));
      console.log('⚠️  EMAIL SEND FAILED (EAUTH/Network)');
      console.log(`🔑 VERIFICATION CODE FOR ${to}: ${otp}`);
      console.log('='.repeat(50) + '\n');
      return true; // Return true to allow registration to proceed
    }
  }

  async sendPasswordResetOTP(to: string, otp: string) {
    const mailOptions = {
      from: `"ANILEGEON" <${env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Code - ANILEGEON',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #ff3b30; text-align: center;">ANILEGEON</h2>
          <p style="font-size: 16px; color: #333;">Parolni tiklash kodingiz:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff3b30;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">Ushbu kod orqali parolingizni yangilashingiz mumkin. Kod 10 daqiqa davomida amal qiladi.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2026 ANILEGEON. Barcha huquqlar himoyalangan.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log('\n' + '='.repeat(50));
      console.log('⚠️  PASSWORD RESET EMAIL FAILED');
      console.log(`🔑 RESET CODE FOR ${to}: ${otp}`);
      console.log('='.repeat(50) + '\n');
      return true;
    }
  }
}

export default new EmailService();
