const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');

// Fixed/necessity categories — overspending here usually just means the
// budgeted amount was set too low, not that the user did something wrong.
const ESSENTIAL_CATEGORIES = ['Rent', 'Utilities', 'Education', 'Health', 'Repair'];

const monthKey = (month, year) => `${year}-${String(month).padStart(2, '0')}`;

const upsert = async (userId, key, type, message, category = null) => {
  const existing = await Notification.findOne({ user: userId, key });
  if (existing) {
    // Only resurface it as unread if something actually changed
    if (existing.message !== message || existing.type !== type) {
      existing.message = message;
      existing.type = type;
      existing.read = false;
      await existing.save();
    }
    return;
  }
  await Notification.create({ user: userId, key, type, message, category });
};

exports.generateNotifications = async (userId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const mKey = monthKey(month, year);

  const budgets = await Budget.find({ user: userId, month, year });
  const budgetedCategories = budgets.map((b) => b.category);

  const spend = await Transaction.aggregate([
    { $match: { user: userId, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
  ]);
  const spendMap = {};
  spend.forEach((s) => { spendMap[s._id] = s.total; });

  // 1. Budget-based alerts — tone depends on essential vs discretionary
  for (const b of budgets) {
    const spent = spendMap[b.category] || 0;
    const percent = (spent / b.monthlyLimit) * 100;
    const isEssential = ESSENTIAL_CATEGORIES.includes(b.category);
    const key = `budget-${b.category}-${mKey}`;

    if (percent >= 100) {
      const overBy = spent - b.monthlyLimit;
      const message = isEssential
        ? `Your ${b.category} spend (Rs ${spent.toLocaleString()}) went past the Rs ${b.monthlyLimit.toLocaleString()} budget you set — this is usually a fixed cost, so the budgeted amount might just need updating.`
        : `You've gone over your ${b.category} budget by Rs ${overBy.toLocaleString()} this month — worth reeling in.`;
      await upsert(userId, key, isEssential ? 'info' : 'alert', message, b.category);
    } else if (percent >= 80 && !isEssential) {
      const message = `You've used ${Math.round(percent)}% of your ${b.category} budget — consider slowing down.`;
      await upsert(userId, key, 'warning', message, b.category);
    }
  }

  // 2. Suggest budgets for discretionary categories with spend but no budget set
  const threeMonthsAgo = new Date(year, month - 3, 1);
  for (const s of spend) {
    if (!budgetedCategories.includes(s._id) && !ESSENTIAL_CATEGORIES.includes(s._id)) {
      const history = await Transaction.aggregate([
        { $match: { user: userId, type: 'expense', category: s._id, date: { $gte: threeMonthsAgo, $lte: endDate } } },
        { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
      ]);
      const avg = history.reduce((a, b) => a + b.total, 0) / (history.length || 1);
      const suggested = Math.ceil((avg * 1.1) / 500) * 500;
      const key = `suggest-budget-${s._id}-${mKey}`;
      const message = `You've spent Rs ${s.total.toLocaleString()} on ${s._id} but have no budget set. Try a monthly limit of Rs ${suggested.toLocaleString()}.`;
      await upsert(userId, key, 'recommendation', message, s._id);
    }
  }

  // 3. Top spending category — neutral info, no judgement
  if (spend.length) {
    const key = `top-category-${mKey}`;
    const message = `Your biggest expense category this month is ${spend[0]._id} at Rs ${spend[0].total.toLocaleString()}.`;
    await upsert(userId, key, 'info', message, spend[0]._id);
  }

  // 4. Savings rate
  const totalIncomeAgg = await Transaction.aggregate([
    { $match: { user: userId, type: 'income', date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalExpense = spend.reduce((a, b) => a + b.total, 0);
  const income = totalIncomeAgg[0]?.total || 0;

  if (income > 0) {
    const savingsRate = ((income - totalExpense) / income) * 100;
    const key = `savings-rate-${mKey}`;

    if (savingsRate < 0) {
      await upsert(userId, key, 'alert', `You're spending more than you're earning this month. Try to cut back where you can.`);
    } else if (savingsRate < 20) {
      await upsert(userId, key, 'warning', `You're saving ${Math.round(savingsRate)}% of your income — below the recommended 20%.`);
    } else {
      await upsert(userId, key, 'positive', `Nice — you're saving ${Math.round(savingsRate)}% of your income this month. Keep it up.`);
    }
  }
};

exports.getNotifications = async (req, res) => {
  await exports.generateNotifications(req.user._id);
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notif) return res.status(404).json({ message: 'Not found' });
  res.json(notif);
};

exports.markAllAsRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All marked as read' });
};