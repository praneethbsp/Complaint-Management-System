import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/Badge';
import { UserPlus, CheckCircle2, Loader2, Users, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function StaffManagement() {
  const [unassigned, setUnassigned] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState({});

  const [form, setForm] = useState({ name: '', email: '', occupation: '' });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, staffRes] = await Promise.all([
        apiClient.get('/api/admin/unassigned-tasks'),
        apiClient.get('/api/admin/staff'),
      ]);
      setUnassigned(tasksRes.complaints || []);
      setStaff(staffRes.staff || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await apiClient.post('/api/admin/create-staff', form);
      toast.success('Staff account created & credentials emailed');
      setForm({ name: '', email: '', occupation: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to create staff');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssign = async (complaintId) => {
    const staffId = selectedStaff[complaintId];
    if (!staffId) { toast.error('Select a staff member first'); return; }
    setAssigningId(complaintId);
    try {
      await apiClient.post('/api/admin/assign-task', { complaintId, staffId });
      toast.success('Task assigned');
      fetchData();
    } catch {
      toast.error('Assignment failed');
    } finally {
      setAssigningId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5 page-enter">
        <div className="h-6 w-48 skeleton" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 skeleton" />
          <div className="h-80 skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Staff Management</h1>
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Onboard staff and assign pending complaints</p>
      </div>

      {/* Stats strip */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 !p-4">
            <div className="rounded-md p-2" style={{ background: 'var(--bg-muted)' }}>
              <Users size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Staff</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{staff.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 !p-4">
            <div className="rounded-md p-2" style={{ background: 'var(--bg-muted)' }}>
              <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Unassigned</p>
              <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{unassigned.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Staff */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-[13px] font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <UserPlus size={14} style={{ color: 'var(--text-muted)' }} />
                Onboard New Staff
              </h2>
            </CardHeader>
            <CardContent className="!p-5">
              <form onSubmit={handleCreateStaff} className="space-y-4">
                <Input label="Full Name" required value={form.name} onChange={set('name')} placeholder="e.g. Vikas Kumar" />
                <Input label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="staff@campus.edu" />
                <Input label="Specialty" required value={form.occupation} onChange={set('occupation')} placeholder="e.g. Plumber, Electrician" />
                <Button type="submit" className="w-full" isLoading={isCreating}>
                  Create &amp; Email Credentials
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Staff list */}
          <Card>
            <CardHeader>
              <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                Active Staff ({staff.length})
              </h2>
            </CardHeader>
            <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
              {staff.length === 0 ? (
                <p className="px-5 py-8 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>No staff yet.</p>
              ) : staff.map((s) => (
                <div key={s._id} className="flex items-center gap-3 px-5 py-3" style={{ borderColor: 'var(--border)' }}>
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                    style={{ background: 'var(--bg-muted)', color: 'var(--text)' }}
                  >
                    {s.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>{s.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.occupation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Unassigned Tasks */}
        <Card>
          <CardHeader>
            <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              Pending Assignment
            </h2>
          </CardHeader>
          <div className="divide-y max-h-[600px] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
            {unassigned.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-5">
                <CheckCircle2 size={24} style={{ color: 'var(--text-muted)' }} />
                <p className="mt-3 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>All complaints assigned</p>
              </div>
            ) : unassigned.map((task) => (
              <div key={task._id} className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{task.title}</p>
                  <p className="mt-0.5 text-[12px] line-clamp-1" style={{ color: 'var(--text-muted)' }}>{task.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {task.category}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      By {task.user?.name}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    className="input-field flex-1 !h-8 !text-[12px] cursor-pointer"
                    value={selectedStaff[task._id] || ''}
                    onChange={(e) => setSelectedStaff(prev => ({ ...prev, [task._id]: e.target.value }))}
                  >
                    <option value="">Select staff…</option>
                    {staff.map(s => (
                      <option key={s._id} value={s._id}>{s.name} — {s.occupation}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => handleAssign(task._id)}
                    isLoading={assigningId === task._id}
                    disabled={!selectedStaff[task._id]}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
