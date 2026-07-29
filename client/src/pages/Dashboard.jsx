import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseChart from '../components/ExpenseChart';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyExpenseSummary, setMonthlyExpenseSummary] = useState([]);
  const [monthlyIncomeSummary, setMonthlyIncomeSummary] = useState([]);
  const { user } = useAuth();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const fetchData = async () => {
    const txRes = await API.get(`/transactions?month=${month}&year=${year}&limit=10`);
    setTransactions(txRes.data.transactions);

    const monthlyExpenseRes = await API.get(`/transactions/summary/all?type=expense&month=${month}&year=${year}`);
    setMonthlyExpenseSummary(monthlyExpenseRes.data);

    const monthlyIncomeRes = await API.get(`/transactions/summary/all?type=income&month=${month}&year=${year}`);
    setMonthlyIncomeSummary(monthlyIncomeRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchData();
  };

  const totalIncome = monthlyIncomeSummary.reduce((a, b) => a + b.total, 0);
  const totalExpense = monthlyExpenseSummary.reduce((a, b) => a + b.total, 0);
  const balance = totalIncome - totalExpense;

  const statCards = [
    { label: "This Month's Balance", value: balance, color: 'from-blue to-blue-dark' },
    { label: "This Month's Income", value: totalIncome, color: 'from-green-400 to-green-600' },
    { label: "This Month's Expense", value: totalExpense, color: 'from-orange to-orange-dark' },
  ];

  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Here's what's happening with your money this month.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{card.label}</p>
              <p className={`text-2xl font-bold bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
                Rs {card.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm mb-6">
          <TransactionForm onAdded={fetchData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Spending Breakdown</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{monthLabel}</p>
            <ExpenseChart expenseData={monthlyExpenseSummary} incomeData={monthlyIncomeSummary} />
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Recent Transactions</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{monthLabel}</p>
            <TransactionList transactions={transactions} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </Layout>
  );
}