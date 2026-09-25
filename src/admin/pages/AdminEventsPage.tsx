import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Plus, Edit2, Trash2, Search, Calendar, MapPin } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    image: '',
    description: '',
    isVirtual: false,
    registrationUrl: '',
    status: 'Upcoming',
    published: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?published=all');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00 AM EST',
      endTime: '1:00 PM EST',
      location: 'Hybrid Livestream & UN Plaza',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3QyaoK1mScVTcylHhi7TpfXjZo8jFohHo01uAdxIajK7DdC2Vm0W4fzL9589hAZeg1uZp6maLqG0wXjoDgiknnru6blAyHEx7iyzTpwjIV7Q6DW2ofKyXiDud5ud00BRwu4tipBKdrN9EgNBsGI3vQnUX7gRJ49Nuc2hmm6E93OLePPTicjOwf2AMgQyBUNc5EhdU-QE39BI0SmZmSL7wTDbnko-Z9d9A4cLlWXgoI7uUCmbrmP-E',
      description: '',
      isVirtual: false,
      registrationUrl: '',
      status: 'Upcoming',
      published: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (ev: any) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title || '',
      date: ev.date || '',
      startTime: ev.startTime || '',
      endTime: ev.endTime || '',
      location: ev.location || '',
      image: ev.image || '',
      description: ev.description || '',
      isVirtual: Boolean(ev.isVirtual),
      registrationUrl: ev.registrationUrl || '',
      status: ev.status || 'Upcoming',
      published: ev.published !== false,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id || editingEvent.id}`, formData);
      } else {
        await api.post('/events', formData);
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete event "${title}"?`)) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const filtered = events.filter((ev) =>
    ev.title?.toLowerCase().includes(search.toLowerCase()) ||
    ev.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Events - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Events Calendar CMS</h1>
          <p className="text-xs text-[#717975]">Schedule briefings, symposiums, and fundraising banquets.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#717975] ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter events..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving scheduled events..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Event</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {filtered.map((ev) => (
                  <tr key={ev._id || ev.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 flex items-center gap-3">
                      <img src={ev.image} alt={ev.title} className="w-10 h-10 rounded-lg object-cover bg-[#efeeeb]" />
                      <span className="font-bold text-[#144238] block text-sm">{ev.title}</span>
                    </td>
                    <td className="p-4 font-medium text-[#717975]">
                      {ev.date} {ev.startTime ? `(${ev.startTime})` : ''}
                    </td>
                    <td className="p-4 text-[#717975]">{ev.location}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#144238]/10 text-[#144238]">
                        {ev.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => openEditModal(ev)} className="p-1.5 hover:bg-[#efeeeb] text-[#144238] rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(String(ev._id || ev.id), ev.title)} className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg">
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
                {editingEvent ? 'Edit Event' : 'Schedule Event'}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Start Time</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">End Time</label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                  />
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
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Past">Past</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Banner Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Description *</label>
                <textarea
                  required
                  rows={4}
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
                  disabled={saving}
                  className="px-5 py-2 bg-[#144238] hover:bg-[#1a5346] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
