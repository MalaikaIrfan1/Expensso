import { useEffect, useState } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export default function Analytics() {
  const [monthly, setMonthly] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const monthlyRes = await API.get('/transactions/monthly-comparison');
      setMonthly(monthlyRes.data);

      const summaryRes = await API.get('/transactions/summary/all?type=expense');
      setExpenseSummary(summaryRes.data);
    };
    fetchData();
  }, []);

  const currentMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];

  const expenseChange = currentMonth && prevMonth && prevMonth.expense
    ? (((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100).toFixed(0)
    : 0;

  const topCategory = [...expenseSummary].sort((a, b) => b.total - a.total)[0];
  const avgDaily = currentMonth ? Math.round(currentMonth.expense / new Date().getDate()) : 0;

  const cards = [
    {
      label: 'This Month vs Last',
      value: `${expenseChange > 0 ? '+' : ''}${expenseChange}%`,
      icon: expenseChange > 0 ? TrendingUp : TrendingDown,
      color: expenseChange > 0 ? 'text-red-500' : 'text-green-500',
    },
    {
      label: 'Top Spending Category',
      value: topCategory ? topCategory._id : '—',
      icon: PiggyBank,
      color: 'text-orange',
    },
    {
      label: 'Avg Daily Spend',
      value: `Rs ${avgDaily.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-blue',
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Understand your trends over the last 6 months.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {cards.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm"
            >
              <Icon size={18} className={`${color} mb-3`} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Income vs Expense — Last 6 Months</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="income" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#FF7A45" radius={[6, 6, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}