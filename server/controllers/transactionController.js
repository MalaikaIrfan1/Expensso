const Transaction = require('../models/Transaction');
const { generateDueTransactions } = require('./recurringController');

exports.getTransactions = async (req, res) => {
  await generateDueTransactions(req.user._id);

  const { category, type, month, year, page = 1, limit = 10 } = req.query;
  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (type) filter.type = type;

  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Transaction.countDocuments(filter);
  res.json({ transactions, total, page: Number(page) });
};

exports.addTransaction = async (req, res) => {
  const { amount, type, category, note, date } = req.body;
  const transaction = await Transaction.create({
    user: req.user._id, amount, type, category, note, date,
  });
  res.status(201).json(transaction);
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!transaction) return res.status(404).json({ message: 'Not found' });
  res.json(transaction);
};

exports.deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id, user: req.user._id,
  });
  if (!transaction) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

exports.getSummary = async (req, res) => {
  await generateDueTransactions(req.user._id);

  const { type, month, year } = req.query;
  const match = { user: req.user._id };
  if (type) match.type = type;

  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    match.date = { $gte: start, $lte: end };
  }

  const summary = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  res.json(summary);
};

exports.getMonthlyComparison = async (req, res) => {
  await generateDueTransactions(req.user._id);

  const now = new Date();
  const results = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const [income, expense] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: req.user._id, type: 'income', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    results.push({
      month: date.toLocaleString('default', { month: 'short' }),
      income: income[0]?.total || 0,
      expense: expense[0]?.total || 0,
    });
  }

  res.json(results);
};

exports.getYearlySummary = async (req, res) => {
  const { year } = req.query;
  const targetYear = Number(year) || new Date().getFullYear();

  const months = [];
  let totalSavings = 0;

  for (let m = 0; m < 12; m++) {
    const start = new Date(targetYear, m, 1);
    const end = new Date(targetYear, m + 1, 0, 23, 59, 59, 999);

    const [income, expense] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: req.user._id, type: 'income', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const inc = income[0]?.total || 0;
    const exp = expense[0]?.total || 0;
    const savings = inc - exp;
    totalSavings += savings;

    months.push({
      month: start.toLocaleString('default', { month: 'short' }),
      income: inc,
      expense: exp,
      savings,
    });
  }

  res.json({ year: targetYear, months, totalSavings });
};

exports.exportTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
  let csv = 'Date,Type,Category,Amount,Note\n';
  transactions.forEach((t) => {
    csv += `${new Date(t.date).toLocaleDateString()},${t.type},${t.category},${t.amount},"${t.note || ''}"\n`;
  });
  res.header('Content-Type', 'text/csv');
  res.attachment('expensso-transactions.csv');
  res.send(csv);
};