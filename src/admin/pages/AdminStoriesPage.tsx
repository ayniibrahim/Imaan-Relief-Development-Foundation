import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';

export const AdminStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    readingTime: '4 min read',
    excerpt: '',
    content: '',
    image: '',
    author: 'Imaan Field Documentary Team',
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stories?published=all');
      if (res.data.success) {
        setStories(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      location: '',
      readingTime: '4 min read',
      excerpt: '',
      content: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6Z6IyPQx-tWT-4wzylKElNMQxXU8pggC7XwokeNyT5MSxWTOQ6hnKKU5lKWsqE_6fUE-lTCeymLnh543R5hihRQkH7Az8bN8bx-AD4WWq8MnktBIWZDzlFE0fZU3oWHxqwRyWDjr3568dykiJi77hcq3IRi8RinG0CKY36_yWRK9AaROl9JREjbOLwuKJgjhjGwyqrwipM6vWixTfbPGilEovz-2XiB5d0cczT54rrwZM2aDZljuq',
      author: 'Imaan Field Communications Team',
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingStory(s);
    setFormData({
      title: s.title || '',
      location: s.location || '',
      readingTime: s.readingTime || '4 min read',
      excerpt: s.excerpt || '',
      content: s.content || '',
      image: s.image || '',
      author: s.author || '',
      published: s.published !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingStory) {
        await api.put(`/stories/${editingStory._id || editingStory.id}`, formData);
      } else {
        await api.post('/stories', formData);
      }
      setModalOpen(false);
      fetchStories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save story');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete story "${title}"?`)) {
      try {
        await api.delete(`/stories/${id}`);
        fetchStories();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const filtered = stories.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Stories - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Humanitarian Stories CMS</h1>
          <p className="text-xs text-[#717975]">Curate personal narratives, audio/photo documentaries, and community impact.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Field Story</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#717975] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter stories by title or location..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving documentary stories..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {filtered.map((s) => (
                  <tr key={s._id || s.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={s.image} alt={s.title} className="w-10 h-10 rounded-lg object-cover bg-[#efeeeb]" />
                      <div>
                        <span className="font-bold text-[#144238] block text-sm">{s.title}</span>
                        <span className="text-[10px] text-[#717975]">ID: {s.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#717975]">{s.location}</td>
                    <td className="p-4 text-[#717975]">{s.author}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.published ? 'bg-[#144238]/10 text-[#144238]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                        {s.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(s)} className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(String(s._id || s.id), s.title)} className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">
                {editingStory ? 'Edit Field Story' : 'New Documentary Story'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975] hover:text-[#1a1c1a]">✕</button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Story Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Reading Duration</label>
                  <input
                    type="text"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Feature Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Full Story Content *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#144238] focus:ring-[#144238]"
                />
                <span className="font-bold text-[#1a1c1a]">Published to public story index</span>
              </label>

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
                  disabled={saving}
                  className="px-5 py-2 bg-[#144238] hover:bg-[#1a5346] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
