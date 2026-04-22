import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    if (password.length < 8) return toast.error('Minimum 8 characters');
    setIsLoading(true);
    try {
      await apiClient.post(`/api/auth/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-sm text-center page-enter">
          <div
            className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
          >
            <CheckCircle2 size={20} style={{ color: 'var(--status-resolved)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Password updated</h1>
          <p className="mt-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Your password has been reset. You can now sign in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 inline-block text-[13px] font-medium underline"
            style={{ color: 'var(--text-secondary)' }}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm page-enter">
        <div className="mb-8">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Set new password</h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            Reset Password
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-[13px]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
