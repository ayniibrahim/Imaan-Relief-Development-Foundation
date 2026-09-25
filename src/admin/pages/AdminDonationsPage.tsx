import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Search, Eye, Trash2, Heart, DollarSign, Download, Filter } from 'lucide-react';

export const AdminDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [aggregates, setAggregates] = useState<{ totalAmountRaised: number; totalCount: number }>({
    totalAmountRaised: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);

  useEffect(() => {
    fetchDonations();
  }, [statusFilter]);

  const fetchDonations = async (query = search) => {
    setLoading(true);
    try {
      let url = '/donations?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (query.trim()) url += `search=${encodeURIComponent(query)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setDonations(res.data.data);
        if (res.data.aggregates) {
          setAggregates(res.data.aggregates);
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.put(`/donations/${id}`, { paymentStatus: newStatus });
      if (res.data.success) {
        if (selectedDonation && (selectedDonation._id === id || selectedDonation.id === id)) {
          setSelectedDonation(res.data.data);
        }
        fetchDonations();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, ref: string) => {
    if (window.confirm(`Delete donation record "${ref}"?`)) {
      try {
        await api.delete(`/donations/${id}`);
        if (selectedDonation && (selectedDonation._id === id || selectedDonation.id === id)) {
          setSelectedDonation(null);
        }
        fetchDonations();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Donations Management - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Donations & Financial Ledger</h1>
          <p className="text-xs text-[#717975]">Monitor incoming contributions, transaction hashes, and Zakat allocations.</p>
        </div>

        {/* Aggregate Badge */}
        <div className="px-5 py-3 rounded-2xl bg-white border border-[#144238]/10 shadow-xs flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#717975] block">Total Registered Funds</span>
            <span className="font-serif text-2xl font-bold text-[#144238]">
              ${aggregates.totalAmountRaised.toLocaleString()} USD
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ffdcc6] text-[#954a00] flex items-center justify-center">
            <Heart className="w-5 h-5 fill-[#954a00]" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#c0c8c4]/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['all', 'completed', 'pending', 'pledged'].map((st) => (
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
              fetchDonations(e.target.value);
            }}
            placeholder="Search donor name or reference..."
            className="w-full h-9 pl-3 pr-8 bg-[#f4f3f0] rounded-xl text-xs focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[#717975] absolute right-2.5 top-3" />
        </div>
      </div>

      {/* Donations Table */}
      {loading ? (
        <LoadingSpinner message="Auditing donation records..." />
      ) : (
        <div className="bg-white rounded-2xl border border-[#c0c8c4]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1a1c1a]">
              <thead className="bg-[#f4f3f0] uppercase tracking-wider text-[10px] text-[#717975] font-bold">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Donor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb]">
                {donations.map((d) => (
                  <tr key={d._id || d.id} className="hover:bg-[#faf9f6]">
                    <td className="p-4 font-mono font-bold text-[#144238]">{d.transactionReference}</td>
                    <td className="p-4">
                      <span className="font-bold text-[#1a1c1a] block">{d.donorName}</span>
                      <span className="text-[11px] text-[#717975]">{d.email}</span>
                    </td>
                    <td className="p-4 font-bold text-[#144238]">
                      ${d.amount.toFixed(2)} {d.currency}
                      <span className="block text-[10px] font-normal text-[#717975]">{d.frequency}</span>
                    </td>
                    <td className="p-4 text-[#404846] max-w-xs truncate">{d.purpose}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.paymentStatus === 'completed'
                            ? 'bg-[#4E7D6B]/15 text-[#144238]'
                            : d.paymentStatus === 'pending'
                            ? 'bg-[#D97724]/15 text-[#D97724]'
                            : 'bg-[#ba1a1a]/15 text-[#ba1a1a]'
                        }`}
                      >
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-[#717975]">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDonation(d)}
                          className="px-2.5 py-1 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] rounded-lg font-bold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDelete(String(d._id || d.id), d.transactionReference)}
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

      {/* Donation Receipt / Audit Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setSelectedDonation(null)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#efeeeb] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97724]">Official Receipt Record</span>
                <h3 className="font-serif text-xl font-bold text-[#144238] font-mono">{selectedDonation.transactionReference}</h3>
              </div>
              <button onClick={() => setSelectedDonation(null)} className="text-[#717975]">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-[#f4f3f0] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#717975]">Donor Name:</span>
                <span className="font-bold text-[#1a1c1a]">{selectedDonation.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717975]">Receipt Email:</span>
                <span className="text-[#1a1c1a]">{selectedDonation.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717975]">Gift Frequency:</span>
                <span className="font-medium text-[#1a1c1a]">{selectedDonation.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717975]">Base Amount:</span>
                <span className="font-bold text-[#144238]">${selectedDonation.amount.toFixed(2)} USD</span>
              </div>
              {selectedDonation.coverFees && (
                <div className="flex justify-between">
                  <span className="text-[#717975]">Donor Covered Fee:</span>
                  <span className="font-bold text-[#4E7D6B]">+${selectedDonation.feeAmount?.toFixed(2)} USD</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#efeeeb]">
                <span className="font-bold text-[#144238]">Total Charged:</span>
                <span className="font-serif text-base font-bold text-[#144238]">
                  ${selectedDonation.totalCharged?.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[#717975]">Designated Pillar:</span>
              <p className="text-sm font-semibold text-[#144238]">{selectedDonation.purpose}</p>
            </div>

            {selectedDonation.dedication?.honoreeName && (
              <div className="p-3 rounded-xl bg-[#ffdcc6]/30 border border-[#ffdcc6] space-y-1">
                <span className="font-bold uppercase tracking-wider text-[#954a00] text-[10px]">Tribute Dedication</span>
                <p className="text-[#1a1c1a]">In honor of: <strong>{selectedDonation.dedication.honoreeName}</strong></p>
                {selectedDonation.dedication.recipientEmail && (
                  <p className="text-[#717975] text-[11px]">Notice emailed to: {selectedDonation.dedication.recipientEmail}</p>
                )}
              </div>
            )}

            {/* Quick Status Updater */}
            <div className="pt-3 border-t border-[#efeeeb] flex items-center justify-between">
              <span className="font-bold text-[#1a1c1a]">Payment State:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(String(selectedDonation._id || selectedDonation.id), 'completed')}
                  className="px-2.5 py-1 bg-[#4E7D6B] text-white font-bold rounded-lg text-[10px]"
                >
                  Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(String(selectedDonation._id || selectedDonation.id), 'pending')}
                  className="px-2.5 py-1 bg-[#D97724] text-white font-bold rounded-lg text-[10px]"
                >
                  Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(String(selectedDonation._id || selectedDonation.id), 'pledged')}
                  className="px-2.5 py-1 bg-[#144238] text-white font-bold rounded-lg text-[10px]"
                >
                  Pledged
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
