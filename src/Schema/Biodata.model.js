import mongoose from 'mongoose';

const biodataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    // ── Personal Details ──────────────────────────────────────────────
    personal: {
      fullName:      { type: String, default: '' },
      dateOfBirth:   { type: Date,   default: null },
      age:           { type: Number, default: null }, // auto-calculated
      timeOfBirth:   { type: String, default: '' },
      placeOfBirth:  { type: String, default: '' },
      gender:        { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
      height:        { type: String, default: '' },
      weight:        { type: String, default: '' },
      complexion:    { type: String, default: '' },
      maritalStatus: {
        type: String,
        enum: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'],
        default: 'Never Married',
      },
      religion:      { type: String, default: '' },
      caste:         { type: String, default: '' },
      subCaste:      { type: String, default: '' },
      motherTongue:  { type: String, default: '' },
      nationality:   { type: String, default: 'Indian' },
      bloodGroup:    { type: String, default: '' },
      profilePhoto:  { type: String, default: '' }, // base64 or URL
    },

    // ── Contact Details ───────────────────────────────────────────────
    contact: {
      address:          { type: String, default: '' },
      city:             { type: String, default: '' },
      state:            { type: String, default: '' },
      pincode:          { type: String, default: '' },
      mobile:           { type: String, default: '' },
      email:            { type: String, default: '' },
      alternateContact: { type: String, default: '' },
    },

    // ── Family Details ────────────────────────────────────────────────
    family: {
      fatherName:       { type: String, default: '' },
      fatherOccupation: { type: String, default: '' },
      motherName:       { type: String, default: '' },
      motherOccupation: { type: String, default: '' },
      brothers:         { type: Number, default: 0 },
      brothersMarried:  { type: Number, default: 0 },
      sisters:          { type: Number, default: 0 },
      sistersMarried:   { type: Number, default: 0 },
      familyType: {
        type: String,
        enum: ['Nuclear', 'Joint', 'Extended'],
        default: 'Nuclear',
      },
      familyStatus: {
        type: String,
        enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'],
        default: 'Middle Class',
      },
      familyValues: {
        type: String,
        enum: ['Traditional', 'Moderate', 'Liberal'],
        default: 'Moderate',
      },
      nativePlace: { type: String, default: '' },
      gotra:       { type: String, default: '' },
    },

    // ── Education ─────────────────────────────────────────────────────
    education: {
      highestQualification:    { type: String, default: '' },
      fieldOfStudy:            { type: String, default: '' },
      university:              { type: String, default: '' },
      yearOfCompletion:        { type: String, default: '' },
      additionalQualifications:{ type: String, default: '' },
    },

    // ── Profession ────────────────────────────────────────────────────
    profession: {
      employmentType: {
        type: String,
        enum: ['Employed', 'Self-Employed', 'Business', 'Government', 'Not Working'],
        default: 'Employed',
      },
      designation:    { type: String, default: '' },
      organization:   { type: String, default: '' },
      workLocation:   { type: String, default: '' },
      annualIncome:   { type: String, default: '' },
      workExperience: { type: String, default: '' },
    },

    // ── Horoscope (Optional) ──────────────────────────────────────────
    horoscope: {
      isEnabled:  { type: Boolean, default: false },
      rashi:      { type: String, default: '' },
      nakshatra:  { type: String, default: '' },
      gotra:      { type: String, default: '' },
      manglik:    { type: String, enum: ['Yes', 'No', 'Partial'], default: 'No' },
      chartType:  { type: String, enum: ['North Indian', 'South Indian', 'East Indian'], default: 'North Indian' },
    },

    // ── Partner Preferences ───────────────────────────────────────────
    preferences: {
      ageFrom:           { type: Number, default: null },
      ageTo:             { type: Number, default: null },
      heightFrom:        { type: String, default: '' },
      heightTo:          { type: String, default: '' },
      religion:          { type: String, default: '' },
      caste:             { type: String, default: '' },
      education:         { type: String, default: '' },
      profession:        { type: String, default: '' },
      location:          { type: String, default: '' },
      otherExpectations: { type: String, default: '' },
    },

    // ── Template & Customization ──────────────────────────────────────
    selectedTemplate: { type: Number, default: 1, min: 1, max: 3 },
    templateCustomization: {
      primaryColor: { type: String, default: '#b5451b' },
      fontFamily:   { type: String, default: 'Playfair Display, serif' },
    },

    // ── Privacy ───────────────────────────────────────────────────────
    privacy: {
      showContactDetails: { type: Boolean, default: true },
      showHoroscope:      { type: Boolean, default: true },
      showIncome:         { type: Boolean, default: false },
    },

    isComplete: { type: Boolean, default: false },
    title:      { type: String, default: 'My Biodata' }, // user-facing name
  },
  { timestamps: true }
);

export const Biodata = mongoose.model('Biodata', biodataSchema);
