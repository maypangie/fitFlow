const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    day: { type: String, required: true }, // e.g., "Monday", "Tuesday"
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Workout', workoutSchema);
