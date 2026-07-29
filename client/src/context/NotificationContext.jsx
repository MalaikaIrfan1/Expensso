import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const TOAST_STORAGE_KEY = 'expensso_toasted_notifications';

function getToastedIds() {
  try {
    return JSON.parse(localStorage.getItem(TOAST_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveToastedIds(ids) {
  localStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(ids.slice(-200)));
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const hasFetchedOnce = useRef(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get('/notifications');
      const data = res.data;
      setNotifications(data);

      const toastedIds = getToastedIds();

      if (hasFetchedOnce.current) {
        // Any unread notification we haven't toasted yet is genuinely new — show it
        const newOnes = data.filter((n) => !n.read && !toastedIds.includes(n._id));
        if (newOnes.length) {
          setToasts((prev) => [...prev, ...newOnes]);
          saveToastedIds([...toastedIds, ...newOnes.map((n) => n._id)]);
          newOnes.forEach((n) => {
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t._id !== n._id));
            }, 6000);
          });
        }
      } else {
        // First load of this session — remember existing unread ones silently,
        // don't blast toasts for old news the moment the app opens.
        const unseen = data.filter((n) => !n.read && !toastedIds.includes(n._id));
        saveToastedIds([...toastedIds, ...unseen.map((n) => n._id)]);
        hasFetchedOnce.current = true;
      }
    } catch {
      // ignore transient errors (e.g. not authenticated yet)
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setToasts([]);
      hasFetchedOnce.current = false;
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = async () => {
    await API.put('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t._id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, toasts, markAsRead, markAllAsRead, dismissToast }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}