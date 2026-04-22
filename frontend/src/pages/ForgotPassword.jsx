import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-sm text-center page-enter">
          <div
            className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
          >
            <MailCheck size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Check your email</h1>
          <p className="mt-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            If an account exists for <strong style={{ color: 'var(--text-secondary)' }}>{email}</strong>,
            you'll receive a password reset link shortly.
          </p>
          <Link to="/login" className="mt-6 inline-block text-[13px] font-medium underline" style={{ color: 'var(--text-secondary)' }}>
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm page-enter">
        <div className="mb-8">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Reset password</h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@campus.edu"
          />
          <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
            Send Reset Link
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
