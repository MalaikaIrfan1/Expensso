import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroScene from '../components/HeroScene';
import { Moon, Sun, PieChart, Wallet, TrendingUp, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    icon: PieChart,
    title: 'Visual Insights',
    desc: 'See exactly where your money goes with clean, interactive charts you actually enjoy looking at.',
  },
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    desc: 'Set monthly limits per category and get nudged before you overspend, not after.',
  },
  {
    icon: TrendingUp,
    title: 'Month-over-Month',
    desc: 'Compare your spending trends over time and spot patterns before they become habits.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'Your financial data stays yours — encrypted, authenticated, and never shared.',
  },
];

const steps = [
  { step: '01', title: 'Create your account', desc: 'Sign up in seconds, no credit card required.' },
  { step: '02', title: 'Log your transactions', desc: 'Add income and expenses as they happen.' },
  { step: '03', title: 'Understand your money', desc: 'Get instant visual breakdowns and budget insights.' },
];

export default function Landing() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors overflow-hidden">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-blue flex items-center justify-center font-bold text-white">
            E
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Expensso</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange transition-colors">
            Login
          </Link>
          <Link to="/signup"
            className="px-4 py-2 rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
            Your ultimate <span className="bg-gradient-to-br from-orange to-blue bg-clip-text text-transparent">budget partner</span> — got it all
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
            Track expenses, plan your budget, and understand your money — all in one clean, simple dashboard.
          </p>
          <div className="flex gap-4">
            <Link to="/signup"
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-orange to-orange-dark text-white font-medium hover:opacity-90 transition-opacity">
              Start for free
            </Link>
            <Link to="/login"
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              I have an account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="h-[420px]"
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-8 py-8 border-t border-gray-200 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Everything you need, nothing you don't
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Built to make budgeting feel effortless, not like a chore.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <FeatureCard key={title} icon={icon} title={title} desc={desc} index={i} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-8 py-16 border-t border-gray-200 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">How it works</h2>
          <p className="text-gray-500 dark:text-gray-400">Three steps. That's it.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map(({ step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -6 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm cursor-pointer"
            >
              <span className="text-5xl font-bold bg-gradient-to-br from-orange to-blue bg-clip-text text-transparent">
                {step}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-3 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-orange to-blue p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your money?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join Expensso today and start budgeting smarter, not harder.
          </p>
          <Link to="/signup"
            className="inline-block px-8 py-3 rounded-xl bg-white text-gray-900 font-medium hover:opacity-90 transition-opacity">
            Get started for free
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange to-blue flex items-center justify-center font-bold text-white text-xs">
            E
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expensso</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2026 Expensso. Built for people who want to understand their money.
        </p>
      </footer>
    </div>
  );
}