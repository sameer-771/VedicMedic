const Appointment = require('../models/Appointment');

exports.getAll = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patientId', 'name doshaType').sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const appointment = await Appointment.create({ ...req.body, createdBy: req.userId });
        const populated = await appointment.populate('patientId', 'name doshaType');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patientId', 'name doshaType');
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
