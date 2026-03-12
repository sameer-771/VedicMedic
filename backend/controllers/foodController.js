const FoodDatabase = require('../models/FoodDatabase');

exports.getAll = async (req, res) => {
    try {
        const { search, dosha, effect } = req.query;
        let filter = {};
        if (search) filter.foodName = { $regex: search, $options: 'i' };
        if (dosha) filter.doshaImpact = { $regex: dosha, $options: 'i' };
        if (effect) filter.ayurvedicEffect = effect;

        const foods = await FoodDatabase.find(filter).sort({ foodName: 1 });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const food = await FoodDatabase.create(req.body);
        res.status(201).json(food);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await FoodDatabase.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
