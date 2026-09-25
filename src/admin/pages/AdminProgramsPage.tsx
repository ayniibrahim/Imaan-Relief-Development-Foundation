import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Check, X, Search, Image as ImageIcon } from 'lucide-react';

export const AdminProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Water & Sanitation',
    shortDescription: '',
    description: '',
    image: '',
    targetBeneficiaries: '',
    locations: '',
    objectives: '',
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/programs?published=all');
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Water & Sanitation',
      shortDescription: '',
      description: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3QyaoK1mScVTcylHhi7TpfXjZo8jFohHo01uAdxIajK7DdC2Vm0W4fzL9589hAZeg1uZp6maLqG0wXjoDgiknnru6blAyHEx7iyzTpwjIV7Q6DW2ofKyXiDud5ud00BRwu4tipBKdrN9EgNBsGI3vQnUX7gRJ49Nuc2hmm6E93OLePPTicjOwf2AMgQyBUNc5EhdU-QE39BI0SmZmSL7wTDbnko-Z9d9A4cLlWXgoI7uUCmbrmP-E',
      targetBeneficiaries: '',
      locations: '',
      objectives: '',
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (prog: any) => {
    setEditingProgram(prog);
    setFormData({
      title: prog.title || '',
      slug: prog.slug || '',
      category: prog.category || 'Water & Sanitation',
      shortDescription: prog.shortDescription || '',
      description: prog.description || '',
      image: prog.image || '',
      targetBeneficiaries: prog.targetBeneficiaries || '',
      locations: Array.isArray(prog.locations) ? prog.locations.join(', ') : (prog.locations || ''),
      objectives: Array.isArray(prog.objectives) ? prog.objectives.join('\n') : (prog.objectives || ''),
      published: prog.published !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingProgram) {
        await api.put(`/programs/${editingProgram._id || editingProgram.id}`, formData);
      } else {
        await api.post('/programs', formData);
      }
      setModalOpen(false);
      fetchPrograms();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete program "${title}"?`)) {
      try {
        await api.delete(`/programs/${id}`);
        fetchPrograms();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const filtered = programs.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Programs - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Development Programs CMS</h1>
          <p className="text-xs text-[#717975]">Create, edit, and organize core organizational programs.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Program</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#717975] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter programs by title or category..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Programs Table */}
      {loading ? (
        <LoadingSpinner message="Loading program records..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Program</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Locations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {filtered.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-[#efeeeb]" />
                      <div>
                        <span className="font-bold text-[#144238] block text-sm">{p.title}</span>
                        <span className="text-[10px] text-[#717975] font-mono">/{p.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{p.category}</td>
                    <td className="p-4 text-[#717975] max-w-xs truncate">
                      {Array.isArray(p.locations) ? p.locations.join(', ') : p.locations}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.published ? 'bg-[#144238]/10 text-[#144238]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(String(p._id || p.id), p.title)}
                          className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg"
                          title="Delete"
                        >
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975] hover:text-[#1a1c1a]">
                ✕
              </button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Full Description *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Objectives (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Locations (comma separated)</label>
                  <input
                    type="text"
                    value={formData.locations}
                    onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Target Beneficiaries</label>
                  <input
                    type="text"
                    value={formData.targetBeneficiaries}
                    onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#144238] focus:ring-[#144238]"
                />
                <span className="font-bold text-[#1a1c1a]">Publish to Public Website</span>
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
                  {saving ? 'Saving...' : 'Save Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
