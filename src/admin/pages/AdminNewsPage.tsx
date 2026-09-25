import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Search, Calendar } from 'lucide-react';

export const AdminNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Emergency Update',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: '',
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news?published=all');
      if (res.data.success) {
        setNewsList(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Emergency Update',
      excerpt: '',
      content: '',
      featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzrEd-cREPmch8RSwd4vecEo96xxDl4jAKkxlCkhHwRMEuGSx4Nvy4gQ3uF2ozRHgE7PS1WE_Oq7z2YnmlK3Fq0gCSq6KiLQPLI_9haO9YNCBFeQeKxDY3XuNAOPvkhqwbC_MbTOSDjGS4ytj-Q8q3k_D9dV2aesqSmGKqoBS1rRMv-PTNmzd5Ueem4tpXwwObTtCutwVrnmdg0I20uwq0TpUxVq7BKLYavhGXfIsLpPIbkUJ7-ewl',
      author: 'Imaan Press Office',
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Emergency Update',
      excerpt: item.excerpt || '',
      content: item.content || '',
      featuredImage: item.featuredImage || '',
      author: item.author || '',
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
        await api.put(`/news/${editingItem._id || editingItem.id}`, formData);
      } else {
        await api.post('/news', formData);
      }
      setModalOpen(false);
      fetchNews();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save news article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete news article "${title}"?`)) {
      try {
        await api.delete(`/news/${id}`);
        fetchNews();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const filtered = newsList.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEOHead title="Manage News - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">News & Bulletins CMS</h1>
          <p className="text-xs text-[#717975]">Manage press releases, emergency updates, and audit statements.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Bulletin</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#717975] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter news by headline or category..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving news records..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Headline</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {filtered.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.featuredImage} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-[#efeeeb]" />
                      <div>
                        <span className="font-bold text-[#144238] block text-sm">{item.title}</span>
                        <span className="text-[10px] text-[#717975]">By {item.author}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#717975]">{item.category}</td>
                    <td className="p-4 text-[#717975]">{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.published ? 'bg-[#144238]/10 text-[#144238]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(String(item._id || item.id), item.title)} className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
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
                {editingItem ? 'Edit News Bulletin' : 'Publish News Bulletin'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975] hover:text-[#1a1c1a]">✕</button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Headline *</label>
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
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Featured Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
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
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Content *</label>
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
                <span className="font-bold text-[#1a1c1a]">Published to live website</span>
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
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
