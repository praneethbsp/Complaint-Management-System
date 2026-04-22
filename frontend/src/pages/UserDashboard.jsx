import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ClipboardList, PlusCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const data = await apiClient.get('/api/user/my-complaints');
      setComplaints(data.complaints || []);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    total:    complaints.length,
    pending:  complaints.filter(c => c.status === 'PENDING').length,
    active:   complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  };

  const stats = [
    { label: 'Total',    value: counts.total,    icon: ClipboardList },
    { label: 'Pending',  value: counts.pending,  icon: Clock         },
    { label: 'Active',   value: counts.active,   icon: ArrowRight    },
    { label: 'Resolved', value: counts.resolved, icon: CheckCircle2  },
  ];

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>My Complaints</h1>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Track your submitted requests</p>
        </div>
        <Link to="/complaints/new">
          <Button size="sm">
            <PlusCircle size={14} /> New Complaint
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

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 skeleton" />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList size={28} style={{ color: 'var(--text-muted)' }} />
              <p className="mt-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No complaints yet</p>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--text-muted)' }}>Submit your first complaint to get started.</p>
              <Link to="/complaints/new" className="mt-4">
                <Button size="sm"><PlusCircle size={13} /> New Complaint</Button>
              </Link>
            </div>
          ) : (
            <table className="mono-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td className="font-medium max-w-[200px] truncate" style={{ color: 'var(--text)' }}>{c.title}</td>
                    <td>
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        {c.category}
                      </span>
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td className="text-[12px] whitespace-nowrap">{format(new Date(c.createdAt), 'MMM d, yyyy')}</td>
                    <td>
                      <Link to={`/complaints/${c._id}`}>
                        <Button variant="ghost" size="sm"><ArrowRight size={14} /></Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
