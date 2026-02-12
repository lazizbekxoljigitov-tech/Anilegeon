import { Router } from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Supabase Client
// CRITICAL: Must use SERVICE_ROLE_KEY for backend operations to bypass RLS if needed, 
// or ensure ANON_KEY has proper policy. Ideally use Service Role for admin uploads.
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

router.post('/', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
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

  } catch (error: any) {
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

export default router;
