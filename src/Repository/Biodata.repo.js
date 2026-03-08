/**
 * biodata.queries.js  —  Query Layer (Data Access Layer)
 *
 * Responsibility: ONLY talks to MongoDB via Mongoose.
 * No business logic, no HTTP, no validation — just raw DB operations.
 *
 * Every function:
 *   - Receives plain arguments (ids, filter objects, data objects)
 *   - Returns a Mongoose document / array / null
 *   - Throws on DB errors (let the service layer handle them)
 */

import {Biodata} from '../Schema/Biodata.model.js';

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Insert a new Biodata document into the database.
 * @param {Object} data  - Plain object matching the Biodata schema
 * @returns {Promise<BiodataDocument>}
 */
export const insertBiodata = async (data) => {
  console.log("[insertBiodata] data keys:", Object.keys(data || {}));
  const biodata = new Biodata(data);
  return await biodata.save();
};

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a lightweight list of biodatas for a user (summary fields only).
 * Used in dashboard listing — avoids pulling heavy base64 photo data.
 * @param {string} userId
 * @returns {Promise<BiodataDocument[]>}
 */
export const findAllByUserId = async (userId) => {
  return await Biodata
    .find({ userId })
    .sort({ updatedAt: -1 })
    .select(
      'title selectedTemplate isComplete ' +
      'personal.fullName personal.profilePhoto ' +
      'createdAt updatedAt'
    )
    .lean();  // returns plain JS objects → faster for read-only listing
};

/**
 * Fetch a single full Biodata document by its _id AND userId.
 * The userId check prevents users from accessing each other's data.
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<BiodataDocument|null>}
 */
export const findOneByIdAndUserId = async (id, userId) => {
  return await Biodata.findOne({ _id: id, userId });
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Partially update a Biodata document using $set (merge, not replace).
 * Returns the updated document.
 * @param {string} id
 * @param {string} userId
 * @param {Object} updateData  - Fields to set (can be nested paths)
 * @returns {Promise<BiodataDocument|null>}
 */
export const findOneAndUpdate = async (id, userId, updateData) => {
  return await Biodata.findOneAndUpdate(
    { _id: id, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

/**
 * Update only the template & customization fields.
 * @param {string} id
 * @param {string} userId
 * @param {number} selectedTemplate
 * @param {Object} templateCustomization
 * @returns {Promise<BiodataDocument|null>}
 */
export const updateTemplateById = async (id, userId, selectedTemplate, templateCustomization) => {
  return await Biodata.findOneAndUpdate(
    { _id: id, userId },
    { $set: { selectedTemplate, templateCustomization } },
    { new: true }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Delete a Biodata document by its _id AND userId.
 * Returns the deleted document (or null if not found).
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<BiodataDocument|null>}
 */
export const deleteOneByIdAndUserId = async (id, userId) => {
  return await Biodata.findOneAndDelete({ _id: id, userId });
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether a Biodata document exists (lightweight — no data returned).
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export const existsByIdAndUserId = async (id, userId) => {
  const count = await Biodata.countDocuments({ _id: id, userId });
  return count > 0;
};





























