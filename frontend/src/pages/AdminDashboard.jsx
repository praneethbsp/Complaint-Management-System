import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from 'recharts';
import { ClipboardList, CheckCircle2, Clock, Activity, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const COLORS = ['#18181b','#3f3f46','#71717a','#a1a1aa','#d4d4d8','#27272a','#52525b','#e4e4e7'];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, analyticsRes] = await Promise.all([
        apiClient.get('/api/metrics/summary'),
        apiClient.get('/api/admin/analytics'),
      ]);
      setMetrics(metricsRes);
      setAnalytics(analyticsRes);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 page-enter">
        <div className="h-6 w-40 skeleton" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total',       value: analytics?.total ?? 0,                                                           icon: ClipboardList },
    { label: 'Resolved',    value: analytics?.byStatus?.find(s => s.status === 'RESOLVED')?.count ?? 0,              icon: CheckCircle2  },
    { label: 'Pending',     value: analytics?.byStatus?.find(s => s.status === 'PENDING')?.count ?? 0,               icon: Clock         },
    { label: 'In Progress', value: analytics?.byStatus?.find(s => s.status === 'IN_PROGRESS')?.count ?? 0,           icon: Activity      },
  ];

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Overview</h1>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>System metrics and analytics</p>
        </div>
        <Link to="/admin/staff">
          <Button variant="outline" size="sm">
            <Users size={13} /> Manage Staff <ArrowRight size={12} />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between !p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
              <div className="rounded-md p-2" style={{ background: 'var(--bg-muted)' }}>
                <Icon size={18} style={{ color: 'var(--text-muted)' }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>By Category</h2>
          </CardHeader>
          <CardContent className="h-[260px] !pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.byCategory} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 8, fontSize: 12, color: 'var(--text)'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {analytics?.byCategory?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>By Status</h2>
          </CardHeader>
          <CardContent className="h-[260px] !pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.byStatus} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 8, fontSize: 12, color: 'var(--text)'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill="var(--status-pending)" />
                  <Cell fill="var(--status-assigned)" />
                  <Cell fill="var(--status-progress)" />
                  <Cell fill="var(--status-resolved)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
