import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Search, Eye, Trash2, CheckCircle2, UserCheck, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const AdminVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const statuses = ['all', 'New', 'Reviewing', 'Approved', 'Rejected', 'Contacted'];

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter]);

  const fetchVolunteers = async (query = search) => {
    setLoading(true);
    try {
      let url = '/volunteers?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (query.trim()) url += `search=${encodeURIComponent(query)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setVolunteers(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (vol: any) => {
    setSelectedVolunteer(vol);
    setAdminNotes(vol.notes || '');
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedVolunteer) return;
    setUpdating(true);
    try {
      const res = await api.put(`/volunteers/${selectedVolunteer._id || selectedVolunteer.id}`, {
        status: newStatus,
        notes: adminNotes,
      });
      if (res.data.success) {
        setSelectedVolunteer(res.data.data);
        fetchVolunteers();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete application from "${name}"?`)) {
      try {
        await api.delete(`/volunteers/${id}`);
        if (selectedVolunteer && (selectedVolunteer._id === id || selectedVolunteer.id === id)) {
          setSelectedVolunteer(null);
        }
        fetchVolunteers();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Volunteer Applications - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Volunteer Coordination Registry</h1>
          <p className="text-xs text-[#717975]">Review, screen, and deploy field volunteers and specialists.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors flex-shrink-0 ${
                statusFilter === st ? 'bg-[#144238] text-white shadow-xs' : 'bg-[#f4f3f0] text-[#717975] hover:bg-[#efeeeb]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchVolunteers(e.target.value);
            }}
            placeholder="Search candidate name or skill..."
            className="w-full h-9 pl-3 pr-8 bg-[#f4f3f0] rounded-xl text-xs focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[#717975] absolute right-2.5 top-3" />
        </div>
      </div>

      {/* Volunteers Table */}
      {loading ? (
        <LoadingSpinner message="Retrieving volunteer applications..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Submitted</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {volunteers.map((v) => (
                  <tr key={v._id || v.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4">
                      <span className="font-bold text-[#144238] block text-sm">{v.fullName}</span>
                      <span className="text-[11px] text-[#717975]">{v.email}</span>
                    </td>
                    <td className="p-4 text-[#717975]">{v.location}</td>
                    <td className="p-4 text-[#717975]">{v.availability}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          v.status === 'Approved'
                            ? 'bg-[#4E7D6B]/15 text-[#144238]'
                            : v.status === 'New'
                            ? 'bg-[#D97724]/15 text-[#D97724]'
                            : v.status === 'Rejected'
                            ? 'bg-[#ba1a1a]/15 text-[#ba1a1a]'
                            : 'bg-[#144238]/10 text-[#144238]'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#717975]">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openDetails(v)}
                          className="px-2.5 py-1 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] rounded-lg font-bold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleDelete(String(v._id || v.id), v.fullName)}
                          className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Review Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setSelectedVolunteer(null)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97724]">Volunteer Dossier</span>
                <h3 className="font-serif text-2xl font-bold text-[#144238]">{selectedVolunteer.fullName}</h3>
              </div>
              <button onClick={() => setSelectedVolunteer(null)} className="text-[#717975]">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f4f3f0]">
              <div className="flex items-center gap-2 text-[#404846]">
                <Mail className="w-3.5 h-3.5 text-[#144238]" />
                <span className="truncate">{selectedVolunteer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#404846]">
                <Phone className="w-3.5 h-3.5 text-[#144238]" />
                <span>{selectedVolunteer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#404846]">
                <MapPin className="w-3.5 h-3.5 text-[#D97724]" />
                <span>{selectedVolunteer.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[#404846]">
                <UserCheck className="w-3.5 h-3.5 text-[#144238]" />
                <span>{selectedVolunteer.availability}</span>
              </div>
            </div>

            {selectedVolunteer.skills && (
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-[#717975]">Skills:</span>
                <p className="text-[#1a1c1a]">{Array.isArray(selectedVolunteer.skills) ? selectedVolunteer.skills.join(', ') : selectedVolunteer.skills}</p>
              </div>
            )}

            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#717975]">Statement of Motivation:</span>
              <div className="p-3 bg-[#f4f3f0] rounded-xl text-[#404846] leading-relaxed whitespace-pre-line">
                {selectedVolunteer.message}
              </div>
            </div>

            {selectedVolunteer.cvUrl && (
              <div className="pt-1">
                <a
                  href={selectedVolunteer.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#144238]/10 text-[#144238] font-bold rounded-lg hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Attached Resume / CV</span>
                </a>
              </div>
            )}

            {/* Change Status Action Bar */}
            <div className="pt-3 border-t border-[#efeeeb] space-y-3">
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#717975]">Internal Review Notes</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes on interviews, training readiness, or assigned cluster..."
                  className="w-full p-2 bg-[#f4f3f0] rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#1a1c1a] mr-2">Set Status:</span>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('Approved')}
                  className="px-3 py-1.5 bg-[#4E7D6B] hover:bg-[#3d6556] text-white font-bold rounded-lg"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('Contacted')}
                  className="px-3 py-1.5 bg-[#144238] hover:bg-[#1a5346] text-white font-bold rounded-lg"
                >
                  Mark Contacted
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('Reviewing')}
                  className="px-3 py-1.5 bg-[#D97724] hover:bg-[#b86119] text-white font-bold rounded-lg"
                >
                  Mark Reviewing
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusChange('Rejected')}
                  className="px-3 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
