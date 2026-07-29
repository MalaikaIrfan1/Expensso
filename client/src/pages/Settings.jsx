import { useState } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, User, Lock, Download, Trash2, ShieldAlert, Check } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'data', label: 'Data & Privacy', icon: Download },
];

export default function Settings() {
  const { user, login, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Password state
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Danger zone
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange/40";

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const { data } = await API.put('/auth/profile', { name });
    login({ ...user, name: data.name });
    setProfileMsg('Profile updated successfully');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');
    try {
      await API.put('/auth/password', { currentPassword: passwords.current, newPassword: passwords.next });
      setPasswordMsg('Password changed successfully');
      setPasswords({ current: '', next: '' });
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
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

  const handleDeleteAccount = async () => {
    await API.delete('/auth/account');
    logout();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Manage your account, security, and data.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab nav */}
          <div className="lg:col-span-1">
            <div className="flex lg:flex-col gap-1 bg-white dark:bg-dark-surface rounded-2xl p-2 shadow-sm">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
                    ${activeTab === id
                      ? 'bg-orange/10 text-orange-dark dark:text-orange'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6"
                >
                  <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange to-blue flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">Full name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">Email address</label>
                        <input value={user?.email || ''} disabled className={`${inputClass} bg-gray-50 dark:bg-white/5 cursor-not-allowed opacity-70`} />
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium w-fit">
                          Save changes
                        </button>
                        {profileMsg && (
                          <span className="flex items-center gap-1 text-xs text-green-500"><Check size={13} /> {profileMsg}</span>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Light or dark mode</p>
                      </div>
                      <button onClick={toggleTheme} className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-white/10 transition-colors flex items-center px-1">
                        <motion.div animate={{ x: darkMode ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-6 h-6 rounded-full bg-white dark:bg-orange shadow-md flex items-center justify-center">
                          {darkMode ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-orange" />}
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm"
                >
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Change password</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Use a strong password you don't use elsewhere.</p>

                  {passwordError && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-sm">{passwordError}</div>
                  )}

                  <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-sm">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">Current password</label>
                      <input type="password" value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">New password</label>
                      <input type="password" value={passwords.next}
                        onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} required minLength={6} className={inputClass} />
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-br from-orange to-orange-dark text-white text-sm font-medium w-fit">
                        Update password
                      </button>
                      {passwordMsg && (
                        <span className="flex items-center gap-1 text-xs text-green-500"><Check size={13} /> {passwordMsg}</span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6"
                >
                  <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Export your data</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Download all your transactions as a CSV file.
                    </p>
                    <button onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue/10 text-blue text-sm font-medium hover:bg-blue/20 transition-colors">
                      <Download size={16} /> Export as CSV
                    </button>
                  </div>

                  <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-red-200 dark:border-red-500/20">
                    <h2 className="font-semibold text-red-500 mb-1 flex items-center gap-2">
                      <ShieldAlert size={16} /> Danger zone
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </p>

                    {!confirmDelete ? (
                      <button onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} /> Delete my account
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3 max-w-sm">
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          Type <span className="font-semibold">DELETE</span> to confirm.
                        </p>
                        <input value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} className={inputClass} />
                        <div className="flex gap-2">
                          <button
                            disabled={deleteInput !== 'DELETE'}
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Confirm delete
                          </button>
                          <button
                            onClick={() => { setConfirmDelete(false); setDeleteInput(''); }}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}