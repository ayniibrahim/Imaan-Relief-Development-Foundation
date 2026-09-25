import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Shield, UserCog, Check, X } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      password: '',
      role: u.role || 'editor',
      isActive: u.isActive !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save administrative account');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own administrative account.');
      return;
    }
    if (window.confirm(`Permanently remove administrative account for "${name}"?`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Administrative Staff Users - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Administrative Staff Governance</h1>
          <p className="text-xs text-[#717975]">Manage officer credentials, roles, and administrative access privileges.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Account</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Verifying security credentials..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Role Privileges</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4">
                      <span className="font-bold text-[#144238] block text-sm">{u.name}</span>
                      <span className="text-[11px] text-[#717975]">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-[#144238]/10 text-[#144238]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.isActive ? 'bg-[#4E7D6B]/15 text-[#144238]' : 'bg-[#ba1a1a]/15 text-[#ba1a1a]'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4 text-[#717975]">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(u)} className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">
                {editingUser ? 'Edit Staff Privileges' : 'Provision Staff Account'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975]">✕</button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
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

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">
                  {editingUser ? 'New Password (leave empty to keep current)' : 'Account Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Min 6 characters'}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Authorization Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                >
                  <option value="editor">Editor (Content & Donations)</option>
                  <option value="content_manager">Content Manager (Programs & Media)</option>
                  <option value="super_admin">Super Administrator (Full System Control)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#144238] focus:ring-[#144238]"
                />
                <span className="font-bold text-[#1a1c1a]">Account is Active</span>
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
                  {saving ? 'Saving...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
