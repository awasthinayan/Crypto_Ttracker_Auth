import * as BiodataService from '../Service/Biodata.service.js';
import { NotFoundError } from '../Service/Biodata.service.js';
import { cloudinary } from '../Middleware/Multer.middleware.js';

// ── Error handler ─────────────────────────────────────────────────────────────
const handleError = (res, error) => {
  console.error(`[BiodataController] ${error.name || 'Error'}:`, error.message);
  if (error instanceof NotFoundError)
    return res.status(404).json({ success: false, message: error.message });
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(422).json({ success: false, message: messages.join('. ') });
  }
  if (error.name === 'CastError')
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  return res.status(500).json({ success: false, message: 'Internal server error.' });
};

// ── Parse biodataData JSON from FormData ──────────────────────────────────────
const parseBody = (req) => {
  try {
    return req.body.biodataData
      ? JSON.parse(req.body.biodataData)
      : req.body;
  } catch {
    return req.body;
  }
};

// ── Delete old photo from Cloudinary ─────────────────────────────────────────
const deleteOldPhoto = async (photoUrl) => {
  if (!photoUrl || !photoUrl.includes('cloudinary.com')) return;
  try {
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/<folder>/<public_id>.ext
    const parts   = photoUrl.split('/');
    const file    = parts[parts.length - 1];                    // e.g. userId_123.jpg
    const folder  = parts[parts.length - 2];                    // e.g. photos
    const parent  = parts[parts.length - 3];                    // e.g. shaadi-bio
    const publicId = `${parent}/${folder}/${file.split('.')[0]}`; // shaadi-bio/photos/userId_123

    await cloudinary.uploader.destroy(publicId);
    console.log('[Cloudinary] Deleted old photo:', publicId);
  } catch (err) {
    console.warn('[Cloudinary] Could not delete old photo:', err.message);
  }
};

// ── POST /api/biodata ─────────────────────────────────────────────────────────
export const createBiodata = async (req, res) => {
  try {
    const data = parseBody(req);

    // Cloudinary URL is in req.file.path after successful upload
    if (req.file?.path) {
      data.personal = { ...data.personal, profilePhoto: req.file.path };
    }

    const biodata = await BiodataService.createBiodata(req.user.id, data);
    return res.status(201).json({ success: true, data: biodata });
  } catch (error) {
    return handleError(res, error);
  }
};

// ── GET /api/biodata ──────────────────────────────────────────────────────────
export const getAllBiodatas = async (req, res) => {
  try {
    const biodatas = await BiodataService.getAllBiodatas(req.user.id);
    return res.status(200).json({ success: true, data: biodatas });
  } catch (error) {
    return handleError(res, error);
  }
};

// ── GET /api/biodata/:id ──────────────────────────────────────────────────────
export const getBiodataByIdController = async (req, res) => {
  try {
    const biodata = await BiodataService.getBiodataById(req.params.id, req.user.id);
    return res.status(200).json({ success: true, data: biodata });
  } catch (error) {
    return handleError(res, error);
  }
};

// ── PUT /api/biodata/:id ──────────────────────────────────────────────────────
export const updateBiodata = async (req, res) => {
  try {
    const data = parseBody(req);

    if (req.file?.path) {
      // New photo uploaded — delete old one from Cloudinary first
      const existing = await BiodataService.getBiodataById(req.params.id, req.user.id);
      await deleteOldPhoto(existing?.personal?.profilePhoto);
      data.personal = { ...data.personal, profilePhoto: req.file.path };
    }

    const biodata = await BiodataService.updateBiodata(req.params.id, req.user.id, data);
    return res.status(200).json({ success: true, data: biodata });
  } catch (error) {
    return handleError(res, error);
  }
};

// ── DELETE /api/biodata/:id ───────────────────────────────────────────────────
export const deleteBiodata = async (req, res) => {
  try {
    const existing = await BiodataService.getBiodataById(req.params.id, req.user.id);
    await deleteOldPhoto(existing?.personal?.profilePhoto);

    await BiodataService.deleteBiodata(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Biodata deleted successfully.' });
  } catch (error) {
    return handleError(res, error);
  }
};

// ── PATCH /api/biodata/:id/template ──────────────────────────────────────────
export const updateTemplate = async (req, res) => {
  try {
    const { selectedTemplate, templateCustomization } = req.body;
    const biodata = await BiodataService.updateTemplate(
      req.params.id,
      req.user.id,
      selectedTemplate,
      templateCustomization
    );
    return res.status(200).json({ success: true, data: biodata });
  } catch (error) {
    return handleError(res, error);
  }
};