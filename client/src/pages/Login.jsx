import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Moon, Sun, Mail, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const inputClass = "w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange/40";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-light-bg dark:bg-dark-bg transition-colors">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-orange to-blue relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-white">
            E
          </div>
          <span className="text-xl font-bold text-white">Expensso</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
            Welcome back to your money's home base.
          </h2>
          <p className="text-white/80 max-w-sm">
            Log in to see your latest spending insights and pick up right where you left off.
          </p>
        </motion.div>

        <div className="relative z-10 text-white/60 text-xs">
          © 2026 Expensso
        </div>

        {/* decorative floating circles */}
        <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-40 h-40 rounded-full bg-white/10 -top-10 -right-10" />
        <motion.div animate={{ y: [0, 18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-24 h-24 rounded-full bg-white/10 bottom-20 right-24" />
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center px-8 sm:px-16 relative">
        <Link to="/"
          className="lg:hidden absolute top-6 left-6 sm:left-16 p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <ArrowLeft size={18} />
        </Link>

        <button onClick={toggleTheme}
          className="absolute top-6 right-6 sm:right-16 p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm w-full mx-auto"
        >
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-blue flex items-center justify-center font-bold text-white">
              E
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Expensso</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Log in</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Enter your details to access your dashboard.
          </p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Email address" value={form.email} type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })} required
                className={inputClass} />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required
                className={inputClass} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 py-2.5 rounded-xl bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Log in
            </motion.button>
          </form>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 text-center">
            Don't have an account? <Link to="/signup" className="text-orange font-medium">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}