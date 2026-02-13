"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const supabase_1 = require("../config/supabase");
const jwt_1 = require("../utils/jwt");
const helpers_1 = require("../utils/helpers");
const email_service_1 = __importDefault(require("./email.service"));
class AuthService {
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    static async register(name, email, password) {
        // Check existing verified user
        const { data: existing } = await supabase_1.supabase
            .from('users')
            .select('id, is_verified')
            .eq('email', email.toLowerCase())
            .single();
        if (existing && existing.is_verified) {
            throw new helpers_1.AppError('Email already registered', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        let user;
        let error;
        if (existing && !existing.is_verified) {
            // Update existing unverified user
            const { data, error: updateError } = await supabase_1.supabase
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
        }
        else {
            // Create new unverified user
            const { data, error: insertError } = await supabase_1.supabase
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
        if (error)
            throw new helpers_1.AppError('Registration failed: ' + error.message, 500);
        // Send Email
        await email_service_1.default.sendOTP(email, otp);
        return { message: 'Verification code sent to email' };
    }
    static async verifyOTP(email, otp) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('otp_code', otp)
            .single();
        if (error || !user) {
            throw new helpers_1.AppError('Invalid verification code', 400);
        }
        const now = new Date();
        const expiresAt = new Date(user.otp_expires_at);
        if (now > expiresAt) {
            throw new helpers_1.AppError('Verification code expired', 400);
        }
        // Mark as verified and clear OTP
        const { data: updatedUser, error: updateError } = await supabase_1.supabase
            .from('users')
            .update({ is_verified: true, otp_code: null, otp_expires_at: null })
            .eq('id', user.id)
            .select('id, name, email, role, avatar_url, created_at')
            .single();
        if (updateError)
            throw new helpers_1.AppError('Verification failed', 500);
        const token = (0, jwt_1.generateToken)({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });
        return { user: updatedUser, token };
    }
    static async login(email, password) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        if (error || !user) {
            throw new helpers_1.AppError('Invalid email or password', 401);
        }
        if (!user.is_verified) {
            // Allow re-sending OTP if user is not verified
            const otp = this.generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await supabase_1.supabase
                .from('users')
                .update({ otp_code: otp, otp_expires_at: expiresAt.toISOString() })
                .eq('id', user.id);
            await email_service_1.default.sendOTP(user.email, otp);
            throw new helpers_1.AppError('Please verify your email. Code sent again.', 403);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new helpers_1.AppError('Invalid email or password', 401);
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        const { password: _, otp_code, otp_expires_at, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static async requestPasswordReset(email) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase())
            .single();
        if (error || !user) {
            // Don't reveal if email exists or not for security, but user requested explicitly
            throw new helpers_1.AppError('User not found', 404);
        }
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await supabase_1.supabase
            .from('users')
            .update({ otp_code: otp, otp_expires_at: expiresAt.toISOString() })
            .eq('id', user.id);
        await email_service_1.default.sendPasswordResetOTP(user.email, otp);
        return { message: 'Password reset code sent to email' };
    }
    static async resetPassword(email, otp, newPassword) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('otp_code', otp)
            .single();
        if (error || !user) {
            throw new helpers_1.AppError('Invalid or expired reset code', 400);
        }
        const now = new Date();
        const expiresAt = new Date(user.otp_expires_at);
        if (now > expiresAt) {
            throw new helpers_1.AppError('Reset code expired', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        const { error: updateError } = await supabase_1.supabase
            .from('users')
            .update({
            password: hashedPassword,
            otp_code: null,
            otp_expires_at: null,
            is_verified: true // Ensure they are verified if they reset password
        })
            .eq('id', user.id);
        if (updateError)
            throw new helpers_1.AppError('Password reset failed', 500);
        return { success: true, message: 'Password reset successful' };
    }
    static async getProfile(userId) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('id, name, email, role, avatar_url, created_at')
            .eq('id', userId)
            .single();
        if (error || !user)
            throw new helpers_1.AppError('User not found', 404);
        return user;
    }
    static async updateProfile(userId, updates) {
        const { data, error } = await supabase_1.supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select('id, name, email, role, avatar_url, created_at')
            .single();
        if (error)
            throw new helpers_1.AppError('Update failed', 500);
        return data;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map