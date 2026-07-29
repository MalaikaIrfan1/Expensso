import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Info, Sparkles, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const typeConfig = {
  alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
  warning: { icon: AlertTriangle, color: 'text-orange', bg: 'bg-orange/10' },
  positive: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  info: { icon: Info, color: 'text-blue', bg: 'bg-blue/10' },
  recommendation: { icon: Sparkles, color: 'text-orange', bg: 'bg-orange/10' },
};
const defaultConfig = { icon: Info, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-white/5' };

export default function NotificationToasts() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div className="fixed top-20 md:top-6 right-4 md:right-6 z-[60] flex flex-col gap-2 w-72 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {toasts.map((t) => {
          const config = typeConfig[t.type] || defaultConfig;
          const Icon = config.icon;
          return (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 flex items-start gap-3"
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon size={14} className={config.color} />
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed flex-1">{t.message}</p>
              <button onClick={() => dismissToast(t._id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}