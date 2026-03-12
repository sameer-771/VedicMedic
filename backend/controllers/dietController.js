const DietPlan = require('../models/DietPlan');
const Patient = require('../models/Patient');
const { generateDietPlan } = require('../services/dietService');

exports.generate = async (req, res) => {
    try {
        const { patientId, season } = req.body;
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const plan = generateDietPlan(patient, season || 'All');

        const dietPlan = await DietPlan.create({
            patientId: patient._id,
            doshaType: patient.doshaType,
            season: season || 'All',
            breakfast: plan.breakfast,
            lunch: plan.lunch,
            dinner: plan.dinner,
            snacks: plan.snacks,
            totalNutrients: plan.totalNutrients,
            notes: plan.notes,
            createdBy: req.userId
        });

        res.status(201).json(dietPlan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getByPatient = async (req, res) => {
    try {
        const plans = await DietPlan.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const plans = await DietPlan.find().populate('patientId', 'name doshaType').sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
