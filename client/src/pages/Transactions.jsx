import { useEffect, useState } from 'react';
import API from '../api/axios';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import { Search, Download } from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchData = async () => {
    const res = await API.get('/transactions?limit=100');
    setTransactions(res.data.transactions);
  };

  const handleExport = async () => {
    const res = await API.get('/transactions/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expensso-transactions.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchData();
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue/10 text-blue text-sm font-medium hover:bg-blue/20 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          All your income and expenses in one place.
        </p>

        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm mb-6">
          <TransactionForm onAdded={fetchData} />
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search category or note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'income', 'expense'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors
                    ${typeFilter === f
                      ? 'bg-orange text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {!filtered.length ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-4 font-medium">Amount</th>
                    <th className="py-2 pr-4 font-medium">Type</th>
                    <th className="py-2 pr-4 font-medium">Category</th>
                    <th className="py-2 pr-4 font-medium">Note</th>
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t._id} className="border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
                      <td className={`py-3 pr-4 font-medium ${t.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                        {t.type === 'income' ? '+' : '-'}{t.amount}
                      </td>
                      <td className="py-3 pr-4 capitalize text-gray-600 dark:text-gray-300">{t.type}</td>
                      <td className="py-3 pr-4">{t.category}</td>
                      <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{t.note}</td>
                      <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <button onClick={() => handleDelete(t._id)}
                          className="text-red-500 hover:text-red-600 text-xs font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}