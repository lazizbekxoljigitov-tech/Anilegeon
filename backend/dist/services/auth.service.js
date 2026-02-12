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
class AuthService {
    static async register(name, email, password) {
        // Check existing user
        const { data: existing } = await supabase_1.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        if (existing) {
            throw new helpers_1.AppError('Email already registered', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .insert({ name, email, password: hashedPassword, role: 'user' })
            .select('id, name, email, role, created_at')
            .single();
        if (error)
            throw new helpers_1.AppError('Registration failed: ' + error.message, 500);
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        return { user, token };
    }
    static async login(email, password) {
        const { data: user, error } = await supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !user) {
            throw new helpers_1.AppError('Invalid email or password', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new helpers_1.AppError('Invalid email or password', 401);
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
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