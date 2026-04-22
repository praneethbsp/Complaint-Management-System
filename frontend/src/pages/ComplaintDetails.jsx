import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { ArrowLeft, MapPin, Calendar, Tag, User, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchDetails(); }, [id]);

  const fetchDetails = async () => {
    try {
      const data = await apiClient.get(`/api/user/view-complaint/${id}`);
      setComplaint(data.complaint);
    } catch {
      toast.error('Failed to load complaint');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post(`/api/staff/update-progress/${id}`, { content: noteContent });
      toast.success('Progress updated');
      setNoteContent('');
      fetchDetails();
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-5 page-enter">
      {/* Back + status */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardContent className="!p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{complaint.title}</h1>
                <div className="mt-3 flex flex-wrap gap-4 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1.5"><Tag size={12} />{complaint.category}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} />{complaint.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={12} />{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-[13px] font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</p>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
                  {complaint.description}
                </p>
              </div>

              {complaint.images?.length > 0 && (
                <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-[13px] font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Attachments</p>
                  <div className="grid grid-cols-2 gap-3">
                    {complaint.images.map((img, i) => (
                      <div key={i} className="aspect-video overflow-hidden rounded-lg" style={{ border: '1px solid var(--border)' }}>
                        <img src={img} alt={`Attachment ${i + 1}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <h2 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Progress Timeline</h2>
            </CardHeader>
            <CardContent className="!p-5 space-y-5">
              {currentUser?.role === 'STAFF' && complaint.status !== 'RESOLVED' && (
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    className="input-field resize-none w-full"
                    style={{ height: 'auto', padding: '10px 12px', minHeight: 80 }}
                    placeholder="Add a progress note…"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" isLoading={isSubmitting}>
                      <Send size={12} /> Post Update
                    </Button>
                  </div>
                </form>
              )}

              {complaint.progressNotes?.length > 0 ? (
                <div className="space-y-4">
                  {[...complaint.progressNotes].reverse().map((note, i) => (
                    <div key={i} className="relative pl-5">
                      <div
                        className="absolute left-0 top-1.5 h-2 w-2 rounded-full"
                        style={{ background: 'var(--text-muted)' }}
                      />
                      {i < complaint.progressNotes.length - 1 && (
                        <div
                          className="absolute left-[3px] top-4 w-px"
                          style={{ background: 'var(--border)', height: 'calc(100% + 8px)' }}
                        />
                      )}
                      <div className="rounded-lg px-4 py-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text)' }}>{note.content}</p>
                        <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {format(new Date(note.createdAt), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-center py-6" style={{ color: 'var(--text-muted)' }}>No progress notes yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="!p-5 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Reporter</p>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold shrink-0"
                  style={{ background: 'var(--bg-muted)', color: 'var(--text)' }}
                >
                  {complaint.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{complaint.user?.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{complaint.user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="!p-5 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Details</p>
              {[
                { label: 'Category', value: complaint.category },
                { label: 'Location', value: complaint.location },
                { label: 'Submitted', value: format(new Date(complaint.createdAt), 'MMM d, yyyy') },
                { label: 'Last updated', value: format(new Date(complaint.updatedAt), 'MMM d, yyyy') },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
