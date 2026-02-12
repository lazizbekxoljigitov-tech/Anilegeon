import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/helpers';
import { User } from '../types';
import EmailService from './email.service';

export class AuthService {
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async register(name: string, email: string, password: string) {
    // Check existing verified user
    const { data: existing } = await supabase
      .from('users')
      .select('id, is_verified')
      .eq('email', email.toLowerCase())
      .single();

    if (existing && existing.is_verified) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user;
    let error;

    if (existing && !existing.is_verified) {
      // Update existing unverified user
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ 
          name, 
          password: hashedPassword, 
          otp_code: otp, 
          otp_expires_at: expiresAt.toISOString() 
        })
        .eq('id', existing.id)
        .select('id, name, email, role, created_at')
        .single();
      user = data;
      error = updateError;
    } else {
      // Create new unverified user
      const { data, error: insertError } = await supabase
        .from('users')
        .insert({ 
          name, 
          email: email.toLowerCase(), 
          password: hashedPassword, 
          role: 'user',
          otp_code: otp,
          otp_expires_at: expiresAt.toISOString(),
          is_verified: false
        })
        .select('id, name, email, role, created_at')
        .single();
      user = data;
      error = insertError;
    }

    if (error) throw new AppError('Registration failed: ' + error.message, 500);

    // Send Email
    await EmailService.sendOTP(email, otp);

    return { message: 'Verification code sent to email' };
  }

  static async verifyOTP(email: string, otp: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp_code', otp)
      .single();

    if (error || !user) {
      throw new AppError('Invalid verification code', 400);
    }

    const now = new Date();
    const expiresAt = new Date(user.otp_expires_at);

    if (now > expiresAt) {
      throw new AppError('Verification code expired', 400);
    }

    // Mark as verified and clear OTP
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true, otp_code: null, otp_expires_at: null })
      .eq('id', user.id)
      .select('id, name, email, role, avatar_url, created_at')
      .single();

    if (updateError) throw new AppError('Verification failed', 500);

    const token = generateToken({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });
    return { user: updatedUser, token };
  }

  static async login(email: string, password: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.is_verified) {
        // Allow re-sending OTP if user is not verified
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await supabase
            .from('users')
            .update({ otp_code: otp, otp_expires_at: expiresAt.toISOString() })
            .eq('id', user.id);
        
        await EmailService.sendOTP(user.email, otp);
        throw new AppError('Please verify your email. Code sent again.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, otp_code, otp_expires_at, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async requestPasswordReset(email: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      // Don't reveal if email exists or not for security, but user requested explicitly
      throw new AppError('User not found', 404);
    }

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabase
      .from('users')
      .update({ otp_code: otp, otp_expires_at: expiresAt.toISOString() })
      .eq('id', user.id);

    await EmailService.sendPasswordResetOTP(user.email, otp);

    return { message: 'Password reset code sent to email' };
  }

  static async resetPassword(email: string, otp: string, newPassword: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp_code', otp)
      .single();

    if (error || !user) {
      throw new AppError('Invalid or expired reset code', 400);
    }

    const now = new Date();
    const expiresAt = new Date(user.otp_expires_at);

    if (now > expiresAt) {
      throw new AppError('Reset code expired', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword, 
        otp_code: null, 
        otp_expires_at: null,
        is_verified: true // Ensure they are verified if they reset password
      })
      .eq('id', user.id);

    if (updateError) throw new AppError('Password reset failed', 500);

    return { success: true, message: 'Password reset successful' };
  }

  static async getProfile(userId: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) throw new AppError('User not found', 404);
    return user;
  }

  static async updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'avatar_url'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, name, email, role, avatar_url, created_at')
      .single();

    if (error) throw new AppError('Update failed', 500);
    return data;
  }
}
