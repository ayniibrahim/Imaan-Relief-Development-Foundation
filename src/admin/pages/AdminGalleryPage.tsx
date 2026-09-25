import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Upload, MapPin } from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Clean Water',
    location: '',
    year: '2025',
    description: '',
    image: '',
    published: true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      if (res.data.success) {
        setGallery(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    setError(null);
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Clean Water',
      location: '',
      year: '2025',
      description: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArEhRc-Xyvdxiy5v4UyML-yodE_UbwRCmNpO3JGYhMqCQ1Ry3DWbKLkeGghy2M8TdDM0jyxmvsGvz-GAlepfGXpmSv-vedVzI0apAkgPod0BVHbavSknN8At-WYtgcr2OhF7trhKcH_UL7kDG9rUOPU8Xe-6CSvwMhA72pY7TGYQ3s2x3VbfoSqrMAAgTFV6sDUv7P0Rym95QTzJznnKPnMU8r1OfEM9AeEaBp-kyLaYzPhqoPKSrL',
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Clean Water',
      location: item.location || '',
      year: item.year || '2025',
      description: item.description || '',
      image: item.image || '',
      published: item.published !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingItem) {
        await api.put(`/gallery/${editingItem._id || editingItem.id}`, formData);
      } else {
        await api.post('/gallery', formData);
      }
      setModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save gallery photo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete photo "${title}"?`)) {
      try {
        await api.delete(`/gallery/${id}`);
        fetchGallery();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Gallery - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Field Photo Gallery CMS</h1>
          <p className="text-xs text-[#717975]">Upload, organize, and publish high-resolution documentary photography.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving media items..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item._id || item.id} className="bg-white rounded-2xl overflow-hidden border border-[#c0c8c4]/30 shadow-xs flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-[#efeeeb]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 text-[#144238] text-[10px] font-bold uppercase">
                  {item.category}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-serif text-base font-bold text-[#144238] line-clamp-1">{item.title}</h3>
                <p className="text-xs text-[#717975] line-clamp-2">{item.description}</p>
                {item.location && (
                  <span className="text-[11px] text-[#D97724] font-semibold flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </span>
                )}
              </div>
              <div className="p-3 bg-[#f4f3f0] border-t border-[#efeeeb] flex items-center justify-end gap-2">
                <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-white rounded-lg text-[#144238]">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(String(item._id || item.id), item.title)} className="p-1.5 hover:bg-[#ffdad6] rounded-lg text-[#ba1a1a]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">
                {editingItem ? 'Edit Photo Details' : 'Add Photo to Archive'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975] hover:text-[#1a1c1a]">✕</button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  >
                    <option value="Clean Water">Clean Water</option>
                    <option value="Livelihood & Agriculture">Livelihood & Agriculture</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Education Support">Education Support</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload or Image URL */}
              <div className="space-y-2 p-3 rounded-xl bg-[#f4f3f0] border border-[#c0c8c4]/40">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Upload from device</label>
                  {uploading && <span className="text-[11px] text-[#D97724] font-semibold animate-pulse">Uploading...</span>}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-[#144238] file:text-white"
                />
                <div className="pt-1">
                  <label className="text-[10px] uppercase font-bold text-[#717975]">Or direct image URL:</label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full h-8 px-2 bg-white rounded-lg text-xs mt-0.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#efeeeb]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#f4f3f0] rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 bg-[#144238] hover:bg-[#1a5346] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
