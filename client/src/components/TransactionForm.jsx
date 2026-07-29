import { useState } from 'react';
import API from '../api/axios';
import DatePicker from './DatePicker';

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Rent', 'Utilities', 'Health', 'Entertainment', 'Education', 'Repair', 'Something else'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Refund', 'Something else'];

function toLocalDateInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function TransactionForm({ onAdded }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    note: '',
    date: toLocalDateInputValue(new Date()),
  });
  const [customCategory, setCustomCategory] = useState('');

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const isCustom = form.category === 'Something else';

  const handleTypeChange = (type) => {
    setForm({ ...form, type, category: '' });
    setCustomCategory('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = isCustom ? customCategory.trim() : form.category;
    if (!finalCategory) return;

    await API.post('/transactions', {
      ...form,
      category: finalCategory,
      date: new Date(form.date).toISOString(),
    });
    onAdded();
    setForm({
      amount: '',
      type: 'expense',
      category: '',
      note: '',
      date: toLocalDateInputValue(new Date()),
    });
    setCustomCategory('');
  };

  const inputClass = "px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40";

  return (
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

      <input placeholder="Note" value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        className={`${inputClass} flex-1 min-w-[120px]`} />

      <DatePicker value={form.date} onChange={(d) => setForm({ ...form, date: d })} />

      <button type="submit"
        className="px-5 py-2 rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium hover:opacity-90 transition-opacity">
        Add
      </button>
    </form>
  );
}