import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Briefcase, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAssigned(); }, []);

  const fetchAssigned = async () => {
    try {
      const data = await apiClient.get('/api/staff/view-assigned-tasks');
      setComplaints(data.complaints || []);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const statusChange = async (id, status) => {
    try {
      await apiClient.patch(`/api/staff/complaints/${id}/status`, { status });
      toast.success('Status updated');
      fetchAssigned();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const counts = {
    total:      complaints.length,
    newTasks:   complaints.filter(c => c.status === 'ASSIGNED').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
  };

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>My Tasks</h1>
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Active maintenance assignments</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total', value: counts.total, icon: Briefcase },
          { label: 'New', value: counts.newTasks, icon: Clock },
          { label: 'In Progress', value: counts.inProgress, icon: ArrowRight },
        ].map(({ label, value, icon: Icon }) => (
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

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 skeleton" />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 size={28} style={{ color: 'var(--text-muted)' }} />
              <p className="mt-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>All clear</p>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--text-muted)' }}>No tasks assigned to you.</p>
            </div>
          ) : (
            <table className="mono-table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Reporter</th>
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
                    <td>{c.user?.name ?? '—'}</td>
                    <td>
                      <select
                        value={c.status}
                        onChange={(e) => statusChange(c._id, e.target.value)}
                        className="input-field !w-auto !h-7 !px-2 !text-[11px] font-semibold cursor-pointer"
                      >
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                    <td className="text-[12px] whitespace-nowrap">{format(new Date(c.updatedAt), 'MMM d, yyyy')}</td>
                    <td>
                      <Link to={`/staff/complaints/${c._id}`}>
                        <Button variant="ghost" size="sm">Manage <ArrowRight size={12} /></Button>
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
