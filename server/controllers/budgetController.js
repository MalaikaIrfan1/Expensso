const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const budgets = await Budget.find({ user: req.user._id, month, year });

  // calculate actual spend per category for this month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const spend = await Transaction.aggregate([
    { $match: { user: req.user._id, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);

  const spendMap = {};
  spend.forEach((s) => { spendMap[s._id] = s.total; });

  const result = budgets.map((b) => ({
    _id: b._id,
    category: b.category,
    monthlyLimit: b.monthlyLimit,
    spent: spendMap[b.category] || 0,
  }));

  res.json(result);
};

exports.setBudget = async (req, res) => {
  const { category, monthlyLimit, month, year } = req.body;
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month: m, year: y },
    { monthlyLimit },
    { new: true, upsert: true }
  );
  res.status(201).json(budget);
};

exports.deleteBudget = async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};