import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Search, Eye, Trash2, Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyNotes, setReplyNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const statuses = ['all', 'New', 'Read', 'Replied', 'Archived'];

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async (query = search) => {
    setLoading(true);
    try {
      let url = '/contact?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (query.trim()) url += `search=${encodeURIComponent(query)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (msg: any) => {
    setSelectedMessage(msg);
    setReplyNotes(msg.replyNotes || '');

    // Auto mark as Read on backend
    if (msg.status === 'New') {
      try {
        await api.put(`/contact/${msg._id || msg.id}`, { status: 'Read' });
        fetchMessages();
      } catch (e) {}
    }
  };

  const handleUpdate = async (newStatus: string) => {
    if (!selectedMessage) return;
    setSaving(true);
    try {
      const res = await api.put(`/contact/${selectedMessage._id || selectedMessage.id}`, {
        status: newStatus,
        replyNotes,
      });
      if (res.data.success) {
        setSelectedMessage(res.data.data);
        fetchMessages();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update message');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, subject: string) => {
    if (window.confirm(`Delete message "${subject}"?`)) {
      try {
        await api.delete(`/contact/${id}`);
        if (selectedMessage && (selectedMessage._id === id || selectedMessage.id === id)) {
          setSelectedMessage(null);
        }
        fetchMessages();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Contact Messages - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Secretariat Communications</h1>
          <p className="text-xs text-[#717975]">Review public inquiries, donor messages, and partnership requests.</p>
        </div>
      </div>

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
              fetchMessages(e.target.value);
            }}
            placeholder="Search sender, subject..."
            className="w-full h-9 pl-3 pr-8 bg-[#f4f3f0] rounded-xl text-xs focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[#717975] absolute right-2.5 top-3" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving secretariat inbox..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Received</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {messages.map((m) => (
                  <tr key={m._id || m.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4">
                      <span className="font-bold text-[#144238] block text-sm">{m.name}</span>
                      <span className="text-[11px] text-[#717975]">{m.email}</span>
                    </td>
                    <td className="p-4 font-medium text-[#1a1c1a] max-w-sm truncate">{m.subject}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.status === 'New'
                            ? 'bg-[#D97724]/15 text-[#D97724]'
                            : m.status === 'Replied'
                            ? 'bg-[#4E7D6B]/15 text-[#144238]'
                            : 'bg-[#717975]/15 text-[#717975]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#717975]">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openMessage(m)}
                          className="px-2.5 py-1 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] rounded-lg font-bold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          <span>Read</span>
                        </button>
                        <button
                          onClick={() => handleDelete(String(m._id || m.id), m.subject)}
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

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setSelectedMessage(null)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97724]">Secretariat Inquiry</span>
                <h3 className="font-serif text-lg font-bold text-[#144238]">{selectedMessage.subject}</h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-[#717975]">✕</button>
            </div>

            <div className="p-3 rounded-xl bg-[#f4f3f0] space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-[#144238]">{selectedMessage.name}</span>
                <span className="text-[#717975]">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-[#717975]">{selectedMessage.email} {selectedMessage.phone ? `• ${selectedMessage.phone}` : ''}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f6] border border-[#efeeeb] text-sm text-[#404846] leading-relaxed whitespace-pre-line">
              {selectedMessage.message}
            </div>

            <div className="space-y-1 pt-2">
              <label className="font-bold uppercase tracking-wider text-[#717975]">Secretariat Action & Reply Notes</label>
              <textarea
                rows={3}
                value={replyNotes}
                onChange={(e) => setReplyNotes(e.target.value)}
                placeholder="Log internal reply details, officer initials, or response date..."
                className="w-full p-2.5 bg-[#f4f3f0] rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#efeeeb]">
              <button
                type="button"
                onClick={() => handleUpdate('Archived')}
                className="px-3 py-1.5 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#717975] font-bold rounded-lg"
              >
                Archive
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleUpdate('Replied')}
                  className="px-4 py-2 bg-[#144238] hover:bg-[#1a5346] text-white font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save & Mark Replied'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
