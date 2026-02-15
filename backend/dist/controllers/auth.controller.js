"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const upload_service_1 = require("../services/upload.service");
class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            console.log('Registration attempt for:', email);
            const result = await auth_service_1.AuthService.register(name, email, password);
            console.log('Registration result:', result);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            console.error('Registration error:', error);
            next(error);
        }
    }
    static async verifyOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            const result = await auth_service_1.AuthService.verifyOTP(email, otp);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.AuthService.login(email, password);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.AuthService.requestPasswordReset(email);
            res.json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { email, otp, newPassword } = req.body;
            const result = await auth_service_1.AuthService.resetPassword(email, otp, newPassword);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
        try {
            const user = await auth_service_1.AuthService.getProfile(req.user.id);
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const updates = {};
            if (req.body.name)
                updates.name = req.body.name;
            if (req.file) {
                updates.avatar_url = await upload_service_1.UploadService.uploadFile('avatars', req.file);
            }
            const user = await auth_service_1.AuthService.updateProfile(req.user.id, updates);
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map