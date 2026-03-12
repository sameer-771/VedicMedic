const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    doshaType: { type: String, enum: ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridosha'], required: true },
    medicalConditions: [{ type: String }],
    allergies: [{ type: String }],
    dietRestrictions: [{ type: String }],
    phone: { type: String },
    email: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
