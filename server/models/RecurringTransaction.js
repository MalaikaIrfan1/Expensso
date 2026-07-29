const mongoose = require('mongoose');

const recurringTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    note: { type: String },
    dayOfMonth: { type: Number, required: true, min: 1, max: 28 },
    startDate: { type: Date, required: true, default: Date.now },
    active: { type: Boolean, default: true },
    generatedMonths: { type: [String], default: [] }, // e.g. ["2026-05", "2026-06"]
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);