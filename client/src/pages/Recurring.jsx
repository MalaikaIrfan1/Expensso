import { useEffect, useState } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';
import DatePicker from '../components/DatePicker';
import { Repeat, Pause, Play, Trash2 } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Rent', 'Utilities', 'Health', 'Entertainment', 'Education', 'Repair', 'Something else'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Refund', 'Something else'];

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function toLocalDateInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function Recurring() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    note: '',
    dayOfMonth: 1,
    startDate: toLocalDateInputValue(new Date()),
  });
  const [customCategory, setCustomCategory] = useState('');

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const isCustom = form.category === 'Something else';

  const fetchRules = async () => {
    const res = await API.get('/recurring');
    setRules(res.data);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleTypeChange = (type) => {
    setForm({ ...form, type, category: '' });
    setCustomCategory('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = isCustom ? customCategory.trim() : form.category;
    if (!finalCategory) return;

    await API.post('/recurring', {
      ...form,
      category: finalCategory,
      dayOfMonth: Number(form.dayOfMonth),
      startDate: new Date(form.startDate).toISOString(),
    });
    setForm({
      amount: '', type: 'expense', category: '', note: '', dayOfMonth: 1,
      startDate: toLocalDateInputValue(new Date()),
    });
    setCustomCategory('');
    fetchRules();
  };

  const toggleActive = async (rule) => {
    await API.put(`/recurring/${rule._id}`, { active: !rule.active });
    fetchRules();
  };

  const handleDelete = async (id) => {
    await API.delete(`/recurring/${id}`);
    fetchRules();
  };

  const inputClass = "px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Repeat size={20} className="text-orange" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recurring</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Set up income or expenses that repeat every month — like salary or rent — and we'll add them automatically.
        </p>

        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
            <input type="number" placeholder="Amount" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })} required
              className={`${inputClass} w-28`} />

            <select value={form.type} onChange={(e) => handleTypeChange(e.target.value)}
              className={inputClass}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              required className={`${inputClass} min-w-[140px]`}>
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {isCustom && (
              <input placeholder="Enter category name" value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)} required
                className={`${inputClass} min-w-[140px]`} />
            )}

            <input placeholder="Note (optional)" value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className={`${inputClass} flex-1 min-w-[120px]`} />

            <select value={form.dayOfMonth} onChange={(e) => setForm({ ...form, dayOfMonth: e.target.value })}
              className={inputClass}>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>Day {d}</option>
              ))}
            </select>

            <div>
              <DatePicker value={form.startDate} onChange={(d) => setForm({ ...form, startDate: d })} />
            </div>

            <button type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Add
            </button>
          </form>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Starts from the date you pick above — nothing before that date will be added automatically.
          </p>
        </div>

        {!rules.length ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recurring transactions set up yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {rules.map((rule) => (
              <div key={rule._id}
                className={`bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 ${!rule.active ? 'opacity-50' : ''}`}>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    <span className={rule.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}>
                      {rule.type === 'income' ? '+' : '-'}Rs {rule.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 font-normal"> · {rule.category}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Every month on the {ordinal(rule.dayOfMonth)}
                    {rule.note ? ` — ${rule.note}` : ''}
                    {!rule.active ? ' (paused)' : ''}
                  </p>
                  {rule.startDate && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Starting {new Date(rule.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(rule)}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    title={rule.active ? 'Pause' : 'Resume'}>
                    {rule.active ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button onClick={() => handleDelete(rule._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}