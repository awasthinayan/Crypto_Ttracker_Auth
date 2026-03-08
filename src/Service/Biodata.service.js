/**
 * biodata.service.js  —  Service Layer
 *
 * Responsibility: Owns ALL business logic.
 *   • Calls the Query layer for DB operations
 *   • Uses helper utilities (e.g. age calculation)
 *   • Throws typed errors that the Controller layer catches
 *   • Never touches req / res — completely framework-agnostic
 *
 * This layer is the single source of truth for "what is allowed to happen".
 */

import * as BiodataQueries from '../Repository/Biodata.repo.js';
import { injectCalculatedAge } from '../Utils/Biodata.helpers.js';

// ─────────────────────────────────────────────────────────────────────────────
// Custom service errors (controllers check these to set the right HTTP status)
// ─────────────────────────────────────────────────────────────────────────────

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a new biodata record for a user.
 * Injects auto-calculated age before saving.
 *
 * @param {string} userId    - Authenticated user's _id
 * @param {Object} bodyData  - Raw form data from the request body
 * @returns {Promise<BiodataDocument>}
 */
export const createBiodata = async (userId, bodyData) => {
  const data = injectCalculatedAge(bodyData);
  // Use Object.assign instead of spread to avoid Symbol.iterator issues
  const payload = Object.assign({}, data, { userId });
  return await BiodataQueries.insertBiodata(payload);
};

// ─────────────────────────────────────────────────────────────────────────────
// READ — LIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a summary list of all biodatas belonging to a user.
 *
 * @param {string} userId
 * @returns {Promise<BiodataDocument[]>}
 */
export const getAllBiodatas = async (userId) => {
  return await BiodataQueries.findAllByUserId(userId);
};

// ─────────────────────────────────────────────────────────────────────────────
// READ — SINGLE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a single biodata.
 * Throws NotFoundError if it doesn't exist or belongs to a different user.
 *
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<BiodataDocument>}
 */
export const getBiodataById = async (id, userId) => {
  const biodata = await BiodataQueries.findOneByIdAndUserId(id, userId);

  if (!biodata) {
    throw new NotFoundError('Biodata not found or you do not have access to it.');
  }

  return biodata;
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE — FULL / PARTIAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update a biodata record.
 * - Re-calculates age if dateOfBirth is part of the update
 * - Throws NotFoundError if not found / not owned by user
 *
 * @param {string} id
 * @param {string} userId
 * @param {Object} bodyData  - Partial or full biodata payload
 * @returns {Promise<BiodataDocument>}
 */
export const updateBiodata = async (id, userId, bodyData) => {
  const data    = injectCalculatedAge(bodyData);
  const updated = await BiodataQueries.findOneAndUpdate(id, userId, data);

  if (!updated) {
    throw new NotFoundError('Biodata not found or you do not have access to it.');
  }

  return updated;
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE — TEMPLATE ONLY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update only the selectedTemplate and templateCustomization fields.
 * Keeps a narrow, explicit update surface for the template-picker feature.
 *
 * @param {string} id
 * @param {string} userId
 * @param {number} selectedTemplate
 * @param {Object} templateCustomization
 * @returns {Promise<BiodataDocument>}
 */
export const updateTemplate = async (id, userId, selectedTemplate, templateCustomization) => {
  // Validate template number
  const VALID_TEMPLATES = [1, 2, 3];
  if (!VALID_TEMPLATES.includes(Number(selectedTemplate))) {
    throw new Error(`Invalid template. Must be one of: ${VALID_TEMPLATES.join(', ')}`);
  }

  const updated = await BiodataQueries.updateTemplateById(
    id,
    userId,
    selectedTemplate,
    templateCustomization
  );

  if (!updated) {
    throw new NotFoundError('Biodata not found or you do not have access to it.');
  }

  return updated;
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Delete a biodata record.
 * Throws NotFoundError if it doesn't exist or belongs to a different user.
 *
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<void>}   - Resolves on success; throws on failure
 */
export const deleteBiodata = async (id, userId) => {
  const deleted = await BiodataQueries.deleteOneByIdAndUserId(id, userId);

  if (!deleted) {
    throw new NotFoundError('Biodata not found or you do not have access to it.');
  }
  // Nothing to return — deletion is a void operation
};
