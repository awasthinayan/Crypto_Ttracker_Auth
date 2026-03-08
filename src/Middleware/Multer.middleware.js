import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// ── Configure Cloudinary ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Cloudinary storage config ─────────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'shaadi-bio/photos',      // folder in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 500, crop: 'limit' }, // resize on Cloudinary's side
      { quality: 'auto:good' },                   // auto compress
    ],
    public_id: (req) => {
      // Unique filename: userId_timestamp
      const userId = req.user?.id || 'unknown';
      return `${userId}_${Date.now()}`;
    },
  },
});

// ── File filter — images only ─────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG and WEBP images are allowed'), false);
  }
};

// ── Export upload middleware ───────────────────────────────────────────────────
export const uploadPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max before Cloudinary transforms
}).single('profilePhoto');

// ── Export cloudinary instance for deleting old photos ───────────────────────
export { cloudinary };