import express from 'express';
import { authMiddleware } from '../Middleware/authMiddleware.js';
import { uploadPhoto } from '../Middleware/Multer.middleware.js';
import {
  createBiodata,
  getAllBiodatas,
  getBiodataByIdController,
  updateBiodata,
  deleteBiodata,
  updateTemplate,
} from '../Controller/Biodata.controller.js';

const router = express.Router();

// All routes protected
router.use(authMiddleware);

// Photo upload via multer on create & update
// Other routes use plain JSON
router.post('/',                uploadPhoto, createBiodata);
router.get('/',                 getAllBiodatas);
router.get('/:id',              getBiodataByIdController);
router.put('/:id',              uploadPhoto, updateBiodata);
router.delete('/:id',           deleteBiodata);
router.patch('/:id/template',   updateTemplate);

export default router;