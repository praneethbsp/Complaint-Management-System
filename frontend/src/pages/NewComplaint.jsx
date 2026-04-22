import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Upload, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'HOSTEL',     label: 'Hostel'       },
  { value: 'CLASSROOM',  label: 'Classroom'    },
  { value: 'INTERNET',   label: 'Internet / Wi-Fi' },
  { value: 'SANITATION', label: 'Sanitation'   },
  { value: 'ELECTRICAL', label: 'Electrical'   },
  { value: 'PLUMBING',   label: 'Plumbing'     },
  { value: 'FOOD',       label: 'Food'         },
  { value: 'OTHER',      label: 'Other'        },
];

export default function NewComplaint() {
  const [form, setForm] = useState({ title: '', category: '', description: '', location: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append('images', file);
      await apiClient.post('/api/user/create-complaint', data);
      toast.success('Complaint submitted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5 page-enter">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-md p-1.5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>New Complaint</h1>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Describe the issue you want to report</p>
        </div>
      </div>

      <Card>
        <CardContent className="!p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              required
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Wi-Fi not working in Room 201"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                required
                value={form.category}
                onChange={set('category')}
                options={CATEGORIES}
              />
              <Input
                label="Location"
                required
                value={form.location}
                onChange={set('location')}
                placeholder="e.g. Block A, Room 202"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Description
              </label>
              <textarea
                required
                rows={5}
                className="input-field resize-none"
                style={{ height: 'auto', padding: '10px 12px' }}
                value={form.description}
                onChange={set('description')}
                placeholder="Describe the issue in detail…"
              />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Attachment <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              {file ? (
                <div
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px]"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg py-8 text-center transition-colors"
                  style={{ border: '1px dashed var(--border)', background: 'var(--bg-subtle)' }}
                >
                  <Upload size={18} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    Click to upload image
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>JPG, PNG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Submit Complaint
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
