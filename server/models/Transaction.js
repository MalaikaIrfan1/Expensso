const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
  recurringRule: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringTransaction', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);