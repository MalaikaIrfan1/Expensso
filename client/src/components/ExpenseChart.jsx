import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FF7A45', '#2563EB', '#14B8A6', '#F5A623', '#7C6FDB', '#E5637A', '#38BDF8', '#C2853A'];
export default function ExpenseChart({ expenseData, incomeData }) {
  const [activeTab, setActiveTab] = useState('expense');
  const [hoverIndex, setHoverIndex] = useState(null);

  const data = activeTab === 'expense' ? expenseData : incomeData;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${activeTab === 'expense'
              ? 'bg-orange text-white'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${activeTab === 'income'
              ? 'bg-blue text-white'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}
        >
          Income
        </button>
      </div>

      {!data.length ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No {activeTab} data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={90}
              onMouseEnter={(_, index) => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              animationBegin={0}
              animationDuration={700}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                  style={{
                    filter: hoverIndex === index ? 'brightness(1.15)' : 'none',
                    transform: hoverIndex === index ? 'scale(1.04)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}