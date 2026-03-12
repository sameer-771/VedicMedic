const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number },
    protein: { type: Number },
    fiber: { type: Number },
    carbs: { type: Number },
    fat: { type: Number },
    ayurvedicClassification: { type: String },
    doshaCompatibility: { type: String }
}, { _id: false });

const dietPlanSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doshaType: { type: String, required: true },
    season: { type: String, enum: ['Summer', 'Winter', 'Monsoon', 'All'], default: 'All' },
    breakfast: [mealItemSchema],
    lunch: [mealItemSchema],
    dinner: [mealItemSchema],
    snacks: [mealItemSchema],
    totalNutrients: {
        calories: Number,
        protein: Number,
        fiber: Number,
        carbs: Number,
        fat: Number
    },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
