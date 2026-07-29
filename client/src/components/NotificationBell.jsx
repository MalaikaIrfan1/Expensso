import { useEffect, useRef, useState } from 'react';
import { Bell, AlertTriangle, TrendingUp, Info, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const typeConfig = {
  alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  warning: { icon: AlertTriangle, color: 'text-orange', bg: 'bg-orange/10' },
  positive: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  info: { icon: Info, color: 'text-blue', bg: 'bg-blue/10' },
  recommendation: { icon: Sparkles, color: 'text-orange', bg: 'bg-orange/10' },
};
const defaultConfig = { icon: Info, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-white/5' };

export default function NotificationBell({ align = 'right' }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-orange text-white text-[10px] font-medium flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 w-80 max-h-[70vh] overflow-y-auto bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-orange font-medium hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          {!notifications.length ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 px-4 py-6 text-center">
              You're all caught up.
            </p>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => {
                const config = typeConfig[n.type] || defaultConfig;
                const Icon = config.icon;
                return (
                  <button
                    key={n._id}
                    onClick={() => !n.read && markAsRead(n._id)}
                    className={`flex items-start gap-3 px-4 py-3 text-left border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!n.read ? 'bg-orange/5' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={14} className={config.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{n.message}</p>
                      {!n.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange mt-1.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}