const RecurringTransaction = require('../models/RecurringTransaction');
const Transaction = require('../models/Transaction');

exports.generateDueTransactions = async (userId) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();

  const rules = await RecurringTransaction.find({ user: userId, active: true });

  for (const rule of rules) {
    const generatedMonths = Array.isArray(rule.generatedMonths) ? rule.generatedMonths : [];
    const start = rule.startDate ? new Date(rule.startDate) : new Date(rule.createdAt);
    let year = start.getFullYear();
    let monthIndex = start.getMonth();
    let safetyCounter = 0;

    while (
      (year < currentYear || (year === currentYear && monthIndex <= currentMonthIndex)) &&
      safetyCounter < 36
    ) {
      safetyCounter++;
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const isCurrentMonth = year === currentYear && monthIndex === currentMonthIndex;
      const dayHasPassed = isCurrentMonth ? rule.dayOfMonth <= currentDay : true;
      const genDate = new Date(year, monthIndex, rule.dayOfMonth);

      if (dayHasPassed && genDate >= start && !generatedMonths.includes(monthKey)) {
        // Atomic "claim" — only ONE concurrent request can win this update,
        // because MongoDB guarantees single-document updates are atomic.
        const claimed = await RecurringTransaction.findOneAndUpdate(
          { _id: rule._id, generatedMonths: { $ne: monthKey } },
          { $addToSet: { generatedMonths: monthKey } },
          { new: true }
        );

        if (claimed) {
          await Transaction.create({
            user: userId,
            amount: rule.amount,
            type: rule.type,
            category: rule.category,
            note: rule.note ? `${rule.note} (auto)` : '(auto)',
            date: genDate,
            recurringRule: rule._id,
          });
        }
      }

      monthIndex++;
      if (monthIndex > 11) {
        monthIndex = 0;
        year++;
      }
    }
  }
};

exports.getRecurring = async (req, res) => {
  const rules = await RecurringTransaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(rules);
};

exports.addRecurring = async (req, res) => {
  const { amount, type, category, note, dayOfMonth, startDate } = req.body;
  const rule = await RecurringTransaction.create({
    user: req.user._id,
    amount,
    type,
    category,
    note,
    dayOfMonth,
    startDate: startDate || new Date(),
  });
  res.status(201).json(rule);
};

exports.updateRecurring = async (req, res) => {
  const rule = await RecurringTransaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!rule) return res.status(404).json({ message: 'Not found' });
  res.json(rule);
};

exports.deleteRecurring = async (req, res) => {
  const rule = await RecurringTransaction.findOneAndDelete({
    _id: req.params.id, user: req.user._id,
  });
  if (!rule) return res.status(404).json({ message: 'Not found' });

  await Transaction.deleteMany({ user: req.user._id, recurringRule: rule._id });

  res.json({ message: 'Deleted' });
};