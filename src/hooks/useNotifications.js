import { useCallback, useState, useEffect } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.warn('Notification permission error:', error);
      return 'denied';
    }
  }, []);

  const notify = useCallback((title, body, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.svg',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.warn('Notification error:', error);
      return null;
    }
  }, []);

  const hasPermission = useCallback(() => {
    return permission === 'granted';
  }, [permission]);

  return {
    requestPermission,
    notify,
    hasPermission,
    permission,
  };
}
