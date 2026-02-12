"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const supabase_1 = require("../config/supabase");
const env_1 = require("../config/env");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
class UploadService {
    static async uploadFile(bucket, file, folder) {
        const ext = file.originalname.split('.').pop();
        const fileName = `${folder ? folder + '/' : ''}${(0, uuid_1.v4)()}.${ext}`;
        try {
            // Use the file path from Multer (diskStorage)
            const fileContent = fs_1.default.readFileSync(file.path);
            const { error } = await supabase_1.supabase.storage
                .from(bucket)
                .upload(fileName, fileContent, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (error) {
                throw new Error(`Upload failed: ${error.message}`);
            }
            const { data } = supabase_1.supabase.storage.from(bucket).getPublicUrl(fileName);
            return data.publicUrl;
        }
        finally {
            // Cleanup: Delete the temporary file from the local server after upload
            if (file.path && fs_1.default.existsSync(file.path)) {
                fs_1.default.unlinkSync(file.path);
            }
        }
    }
    static async deleteFile(bucket, url) {
        try {
            const baseUrl = `${env_1.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
            const path = url.replace(baseUrl, '');
            if (path && path !== url) {
                await supabase_1.supabase.storage.from(bucket).remove([path]);
            }
        }
        catch {
            // Silently fail - file may already be deleted
        }
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map