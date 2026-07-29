export default function TransactionList({ transactions, onDelete }) {
  if (!transactions.length) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet.</p>;
  }

  return (
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
          {transactions.map((t) => (
            <tr key={t._id} className="border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
              <td className={`py-3 pr-4 font-medium ${t.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                {t.type === 'income' ? '+' : '-'}{t.amount}
              </td>
              <td className="py-3 pr-4 capitalize text-gray-600 dark:text-gray-300">{t.type}</td>
              <td className="py-3 pr-4">{t.category}</td>
              <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{t.note}</td>
              <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
              <td className="py-3 pr-4">
                <button onClick={() => onDelete(t._id)}
                  className="text-red-500 hover:text-red-600 text-xs font-medium">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}