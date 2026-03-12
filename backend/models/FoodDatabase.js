const mongoose = require('mongoose');

const foodDatabaseSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    category: { type: String },
    nutritionalValues: {
        calories: Number,
        protein: Number,
        fiber: Number,
        carbs: Number,
        fat: Number
    },
    ayurvedicEffect: { type: String, enum: ['Heating', 'Cooling', 'Detoxifying', 'Nourishing', 'Balancing', 'Energizing'] },
    doshaImpact: { type: String },
    taste: { type: String },
    season: [{ type: String }],
    description: { type: String }
});

module.exports = mongoose.model('FoodDatabase', foodDatabaseSchema);
