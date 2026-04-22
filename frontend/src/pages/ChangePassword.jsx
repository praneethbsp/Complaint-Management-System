import { useState } from 'react';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setIsLoading(true);
    try {
      await apiClient.post('/api/auth/update-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 page-enter">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Security</h1>
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Manage your account password</p>
      </div>

      {user?.mustChangePass && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--status-pending)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>
            You're using a temporary password. Please update it now.
          </p>
        </div>
      )}

      <div className="card p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            value={form.currentPassword}
            onChange={set('currentPassword')}
            placeholder="••••••••"
          />
          <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="space-y-4">
              <Input
                label="New Password"
                type="password"
                required
                value={form.newPassword}
                onChange={set('newPassword')}
                placeholder="At least 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5 text-[13px]"
        style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
      >
        <ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
        <p style={{ color: 'var(--text-muted)' }}>
          Use a strong password with letters, numbers, and symbols. Never reuse passwords.
        </p>
      </div>
    </div>
  );
}
