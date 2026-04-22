import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Check, BellOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.get('/api/user/notifications');
      setNotifications(data.notifications || []);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.post(`/api/user/mark-read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.allSettled(unread.map(n => apiClient.post(`/api/user/mark-read/${n._id}`)));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Notifications</h1>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BellOff size={24} style={{ color: 'var(--text-muted)' }} />
          <p className="mt-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No notifications</p>
          <p className="mt-1 text-[12px]" style={{ color: 'var(--text-muted)' }}>
            We'll notify you when your complaint status changes.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors"
              style={{
                background: n.read ? 'var(--bg)' : 'var(--bg-muted)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: n.read ? 'var(--bg-subtle)' : 'var(--bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <Bell size={13} style={{ color: n.read ? 'var(--text-muted)' : 'var(--text)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: n.read ? 'var(--text-secondary)' : 'var(--text)' }}
                >
                  {n.title}
                </p>
                <p className="mt-0.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>{n.description}</p>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {format(new Date(n.createdAt), 'MMM d, yyyy · h:mm a')}
                </p>
              </div>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="shrink-0 rounded-md p-1.5 transition-colors"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                  title="Mark as read"
                >
                  <Check size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
