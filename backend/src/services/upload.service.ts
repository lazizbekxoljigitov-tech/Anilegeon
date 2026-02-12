import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

export class UploadService {
  static async uploadFile(
    bucket: string,
    file: Express.Multer.File,
    folder?: string
  ): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${uuid()}.${ext}`;

    try {
      // Use the file path from Multer (diskStorage)
      const fileContent = fs.readFileSync(file.path);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileContent, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
    } finally {
      // Cleanup: Delete the temporary file from the local server after upload
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  static async deleteFile(bucket: string, url: string): Promise<void> {
    try {
      const baseUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
      const path = url.replace(baseUrl, '');
      if (path && path !== url) {
        await supabase.storage.from(bucket).remove([path]);
      }
    } catch {
      // Silently fail - file may already be deleted
    }
  }
}
