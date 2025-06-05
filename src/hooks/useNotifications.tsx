import { useState, useEffect } from "react";
import storage from "@/services/storage";

// Event emitter simple para notificaciones
class NotificationEventEmitter {
  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  emit() {
    this.listeners.forEach((callback) => callback());
  }
}

export const notificationEvents = new NotificationEventEmitter();

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = () => {
    const count = storage.getUnreadNotificationsCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    // Initial load
    updateUnreadCount();

    // Subscribe to notification events
    const unsubscribe = notificationEvents.subscribe(updateUnreadCount);

    return unsubscribe;
  }, []);

  return { unreadCount };
};
