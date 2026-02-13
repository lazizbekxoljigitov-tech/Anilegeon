"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../config/env");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Initialize Supabase Client
// CRITICAL: Must use SERVICE_ROLE_KEY for backend operations to bypass RLS if needed, 
// or ensure ANON_KEY has proper policy. Ideally use Service Role for admin uploads.
const supabase = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY);
router.post('/', auth_middleware_1.authMiddleware, role_middleware_1.adminOnly, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }
        // Sanitize filename
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${sanitizedName}`;
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('videos') // Make sure this bucket exists
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });
        if (error) {
            console.error('Supabase Upload Error:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
        // Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from('videos')
            .getPublicUrl(fileName);
        res.status(200).json({
            status: 'success',
            data: {
                url: publicUrlData.publicUrl,
                path: data.path
            }
        });
    }
    catch (error) {
        console.error('Upload Proxy Critical Error:', error);
        if (error.response) {
            console.error('Supabase Response Error:', error.response.data);
        }
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error during upload',
            details: error.response?.data || error
        });
    }
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map