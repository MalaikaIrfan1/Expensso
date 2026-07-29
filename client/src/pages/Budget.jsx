import { useEffect, useState } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Rent', 'Utilities', 'Health', 'Entertainment', 'Education', 'Repair', 'Something else'];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [limit, setLimit] = useState('');

  const isCustom = category === 'Something else';

  const fetchBudgets = async () => {
    const res = await API.get('/budgets');
    setBudgets(res.data);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = isCustom ? customCategory.trim() : category;
    if (!finalCategory || !limit) return;

    await API.post('/budgets', { category: finalCategory, monthlyLimit: Number(limit) });
    setCategory('');
    setCustomCategory('');
    setLimit('');
    fetchBudgets();
  };

  const handleDelete = async (id) => {
    await API.delete(`/budgets/${id}`);
    fetchBudgets();
  };

  const getBarColor = (percent) => {
    if (percent >= 100) return 'from-red-500 to-red-600';
    if (percent >= 80) return 'from-yellow-400 to-orange';
    return 'from-blue to-green-500';
  };

  const inputClass = "px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40";

  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Budget</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Set monthly limits and keep your spending in check — {monthName}.
        </p>

        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Set a category budget</h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} required
              className={`${inputClass} min-w-[160px]`}>
              <option value="" disabled>Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {isCustom && (
              <input placeholder="Enter category name" value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)} required
                className={`${inputClass} min-w-[140px]`} />
            )}

            <input type="number" placeholder="Monthly limit (Rs)" value={limit}
              onChange={(e) => setLimit(e.target.value)} required
              className={`${inputClass} w-40`} />

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium">
              Set Budget
            </motion.button>
          </form>
        </div>

        {!budgets.length ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-10 shadow-sm text-center">
            <p className="text-gray-500 dark:text-gray-400">No budgets set yet for this month. Add one above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {budgets.map((b) => {
              const percent = Math.min((b.spent / b.monthlyLimit) * 100, 100);
              const overBudget = b.spent > b.monthlyLimit;
              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{b.category}</h3>
                    <button onClick={() => handleDelete(b._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className={overBudget ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-300'}>
                      Rs {b.spent.toLocaleString()} spent
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">of Rs {b.monthlyLimit.toLocaleString()}</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${getBarColor(percent)}`}
                    />
                  </div>

                  {overBudget && (
                    <p className="text-xs text-red-500 mt-2">
                      Over budget by Rs {(b.spent - b.monthlyLimit).toLocaleString()}
                    </p>
                  )}
                  {!overBudget && percent >= 80 && (
                    <p className="text-xs text-orange mt-2">
                      You're close to your limit
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}