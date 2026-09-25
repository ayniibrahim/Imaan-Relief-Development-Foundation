import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Search, MapPin } from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    program: '',
    location: '',
    status: 'Active',
    shortDescription: '',
    description: '',
    coverImage: '',
    targetBeneficiaries: '',
    beneficiariesReached: '',
    budgetGoal: 0,
    fundsRaised: 0,
    objectives: '',
    activities: '',
    results: '',
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, progRes] = await Promise.all([
        api.get('/projects?published=all'),
        api.get('/programs?published=all'),
      ]);
      if (projRes.data.success) setProjects(projRes.data.data);
      if (progRes.data.success) setPrograms(progRes.data.data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      program: programs[0]?.slug || 'clean-water-solar-infrastructure',
      location: '',
      status: 'Active',
      shortDescription: '',
      description: '',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArEhRc-Xyvdxiy5v4UyML-yodE_UbwRCmNpO3JGYhMqCQ1Ry3DWbKLkeGghy2M8TdDM0jyxmvsGvz-GAlepfGXpmSv-vedVzI0apAkgPod0BVHbavSknN8At-WYtgcr2OhF7trhKcH_UL7kDG9rUOPU8Xe-6CSvwMhA72pY7TGYQ3s2x3VbfoSqrMAAgTFV6sDUv7P0Rym95QTzJznnKPnMU8r1OfEM9AeEaBp-kyLaYzPhqoPKSrL',
      targetBeneficiaries: '',
      beneficiariesReached: '',
      budgetGoal: 35000,
      fundsRaised: 28000,
      objectives: '',
      activities: '',
      results: '',
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (proj: any) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      program: proj.program || '',
      location: proj.location || '',
      status: proj.status || 'Active',
      shortDescription: proj.shortDescription || '',
      description: proj.description || '',
      coverImage: proj.coverImage || '',
      targetBeneficiaries: proj.targetBeneficiaries || '',
      beneficiariesReached: proj.beneficiariesReached || '',
      budgetGoal: proj.budgetGoal || 0,
      fundsRaised: proj.fundsRaised || 0,
      objectives: Array.isArray(proj.objectives) ? proj.objectives.join('\n') : (proj.objectives || ''),
      activities: Array.isArray(proj.activities) ? proj.activities.join('\n') : (proj.activities || ''),
      results: Array.isArray(proj.results) ? proj.results.join('\n') : (proj.results || ''),
      published: proj.published !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id || editingProject.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete project "${title}"?`)) {
      try {
        await api.delete(`/projects/${id}`);
        fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const filtered = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Projects - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Field Projects CMS</h1>
          <p className="text-xs text-[#717975]">Manage active installations, emergency distributions, and reports.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#717975] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter projects by title or location..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving projects..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Budget Progress</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {filtered.map((proj) => (
                  <tr key={proj._id || proj.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={proj.coverImage} alt={proj.title} className="w-10 h-10 rounded-lg object-cover bg-[#efeeeb]" />
                      <div>
                        <span className="font-bold text-[#144238] block text-sm">{proj.title}</span>
                        <span className="text-[10px] text-[#717975]">ID: {proj.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#717975]">{proj.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${proj.status === 'Completed' ? 'bg-[#4E7D6B]/15 text-[#144238]' : proj.status === 'Active' ? 'bg-[#D97724]/15 text-[#D97724]' : 'bg-[#717975]/10 text-[#717975]'}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {proj.budgetGoal > 0 ? (
                        <div className="space-y-1 max-w-[120px]">
                          <div className="flex justify-between text-[10px] font-semibold text-[#717975]">
                            <span>${(proj.fundsRaised || 0).toLocaleString()}</span>
                            <span>${proj.budgetGoal.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#efeeeb]">
                            <div className="h-full rounded-full bg-[#144238]" style={{ width: `${Math.min(100, Math.round(((proj.fundsRaised || 0) / proj.budgetGoal) * 100))}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#717975] text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(proj)} className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(String(proj._id || proj.id), proj.title)} className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
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
                {editingProject ? 'Edit Field Project' : 'Create New Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#717975] hover:text-[#1a1c1a]">✕</button>
            </div>

            {error && <div className="p-3 bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold rounded-lg">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Associated Program *</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  >
                    {programs.map((p) => (
                      <option key={p.slug} value={p.slug}>{p.title}</option>
                    ))}
                  </select>
                </div>
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
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Full Project Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Target Beneficiaries</label>
                  <input
                    type="text"
                    value={formData.targetBeneficiaries}
                    onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Beneficiaries Reached</label>
                  <input
                    type="text"
                    value={formData.beneficiariesReached}
                    onChange={(e) => setFormData({ ...formData, beneficiariesReached: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Budget Target (USD)</label>
                  <input
                    type="number"
                    value={formData.budgetGoal}
                    onChange={(e) => setFormData({ ...formData, budgetGoal: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Funds Disbursed (USD)</label>
                  <input
                    type="number"
                    value={formData.fundsRaised}
                    onChange={(e) => setFormData({ ...formData, fundsRaised: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Objectives (one per line)</label>
                <textarea
                  rows={2}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Results / Milestones (one per line)</label>
                <textarea
                  rows={2}
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
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
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
