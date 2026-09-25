import React, { useState, useEffect } from 'react';
import api from '../../services/api.ts';
import { useSettings } from '../../context/SettingsContext.tsx';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { Save, CheckCircle2, AlertCircle, Building, BarChart2, Home, Globe } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  if (!formData) return <LoadingSpinner message="Loading foundation configuration..." />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.put('/settings', formData);
      if (res.data.success) {
        setSuccess(true);
        await refreshSettings();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <SEOHead title="Website Settings - Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Website Settings & Configuration</h1>
          <p className="text-xs text-[#717975]">Customize foundation branding, mission disclosures, and live impact statistics.</p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#144238]/10 text-[#144238] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website settings updated successfully! Public pages are synchronized.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Organization & Identity */}
        <div className="bg-white p-6 rounded-2xl border border-[#c0c8c4]/30 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#efeeeb] pb-3">
            <Building className="w-4 h-4 text-[#144238]" />
            <h2 className="font-serif text-lg font-bold text-[#144238]">Organizational Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Foundation Name</label>
              <input
                type="text"
                value={formData.organizationName || ''}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Mission Statement</label>
            <textarea
              rows={3}
              value={formData.mission || ''}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Vision Statement</label>
            <textarea
              rows={2}
              value={formData.vision || ''}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Contact & Office Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#c0c8c4]/30 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#efeeeb] pb-3">
            <Globe className="w-4 h-4 text-[#144238]" />
            <h2 className="font-serif text-lg font-bold text-[#144238]">Secretariat & Field Hotlines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Telephone</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">24/7 Disaster Hotline</label>
              <input
                type="text"
                value={formData.emergencyHotline || ''}
                onChange={(e) => setFormData({ ...formData, emergencyHotline: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Physical Headquarters</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Office Hours</label>
              <input
                type="text"
                value={formData.officeHours || ''}
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Live Impact Statistics */}
        <div className="bg-white p-6 rounded-2xl border border-[#c0c8c4]/30 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#efeeeb] pb-3">
            <BarChart2 className="w-4 h-4 text-[#144238]" />
            <h2 className="font-serif text-lg font-bold text-[#144238]">Audited Impact Benchmarks</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Individuals Assisted</label>
              <input
                type="text"
                value={formData.impactStatistics?.individualsAssisted || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impactStatistics: { ...formData.impactStatistics, individualsAssisted: e.target.value },
                  })
                }
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Solar Boreholes</label>
              <input
                type="text"
                value={formData.impactStatistics?.solarWellsInstalled || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impactStatistics: { ...formData.impactStatistics, solarWellsInstalled: e.target.value },
                  })
                }
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Active Regions</label>
              <input
                type="text"
                value={formData.impactStatistics?.activeRegions || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impactStatistics: { ...formData.impactStatistics, activeRegions: e.target.value },
                  })
                }
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Direct Program Ratio</label>
              <input
                type="text"
                value={formData.impactStatistics?.directProgramRatio || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impactStatistics: { ...formData.impactStatistics, directProgramRatio: e.target.value },
                  })
                }
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Homepage Featured Appeal */}
        <div className="bg-white p-6 rounded-2xl border border-[#c0c8c4]/30 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#efeeeb] pb-3">
            <Home className="w-4 h-4 text-[#144238]" />
            <h2 className="font-serif text-lg font-bold text-[#144238]">Homepage Featured Campaign</h2>
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Campaign Title</label>
            <input
              type="text"
              value={formData.homepageContent?.criticalAppealTitle || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  homepageContent: { ...formData.homepageContent, criticalAppealTitle: e.target.value },
                })
              }
              className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Appeal Target (USD)</label>
              <input
                type="number"
                value={formData.homepageContent?.criticalAppealGoal || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    homepageContent: { ...formData.homepageContent, criticalAppealGoal: Number(e.target.value) },
                  })
                }
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-[#1a1c1a]">Appeal Raised (USD)</label>
              <input
                type="number"
                value={formData.homepageContent?.criticalAppealRaised || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    homepageContent: { ...formData.homepageContent, criticalAppealRaised: Number(e.target.value) },
                  })
                }
                className="w-full h-10 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
