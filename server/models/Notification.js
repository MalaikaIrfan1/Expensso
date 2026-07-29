const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true }, // dedupe key, e.g. "budget-Rent-2026-07"
  type: { type: String, enum: ['alert', 'warning', 'recommendation', 'positive', 'info'], required: true },
  message: { type: String, required: true },
  category: { type: String, default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Notification', notificationSchema);