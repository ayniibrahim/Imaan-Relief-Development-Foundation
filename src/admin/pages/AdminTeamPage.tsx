import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Mail, Users } from 'lucide-react';

export const AdminTeamPage: React.FC = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Executive Leadership',
    biography: '',
    photo: '',
    email: '',
    order: 0,
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get('/team');
      if (res.data.success) {
        setTeam(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      department: 'Executive Leadership',
      biography: '',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      email: '',
      order: team.length + 1,
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      position: member.position || '',
      department: member.department || 'Executive Leadership',
      biography: member.biography || '',
      photo: member.photo || '',
      email: member.email || '',
      order: member.order || 0,
      published: member.published !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingMember) {
        await api.put(`/team/${editingMember._id || editingMember.id}`, formData);
      } else {
        await api.post('/team', formData);
      }
      setModalOpen(false);
      fetchTeam();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete team profile for "${name}"?`)) {
      try {
        await api.delete(`/team/${id}`);
        fetchTeam();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Leadership Team - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Leadership & Staff CMS</h1>
          <p className="text-xs text-[#717975]">Manage directors, field coordinators, and fiduciary trustees.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving leadership registry..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Member</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {team.map((m) => (
                  <tr key={m._id || m.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover bg-[#efeeeb]" />
                      <span className="font-bold text-[#144238] text-sm">{m.name}</span>
                    </td>
                    <td className="p-4 font-medium text-[#1a1c1a]">{m.position}</td>
                    <td className="p-4 text-[#717975]">{m.department}</td>
                    <td className="p-4 text-[#717975]">{m.email || '—'}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(m)} className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(String(m._id || m.id), m.name)} className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
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
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">
                {editingMember ? 'Edit Profile' : 'Add Team Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975] hover:text-[#1a1c1a]">✕</button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Photo URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Biography *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
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
                  disabled={saving}
                  className="px-5 py-2 bg-[#144238] hover:bg-[#1a5346] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
