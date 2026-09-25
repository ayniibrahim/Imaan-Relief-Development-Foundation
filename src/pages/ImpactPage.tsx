import React from 'react';
import { useSettings } from '../context/SettingsContext.tsx';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { ShieldCheck, FileCheck, CheckCircle2, TrendingUp, Users, Droplet, Globe, Download, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ImpactPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      <SEOHead
        title="Audited Impact & Radical Financial Transparency"
        description="Review our independent external audit disclosures, GPS milestone completions, and our 100% Zakat Direct Allocation Covenant."
      />

      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Fiduciary Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Radical Field Accountability & Audited Results
        </h1>
        <p className="text-sm sm:text-base text-[#404846] leading-relaxed">
          We hold every gift in sacred trust. Every dollar deployed across clean water boreholes, emergency survival
          baskets, and female farming cooperatives is logged, independently audited, and verified on the ground.
        </p>
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#144238]">
            {settings?.impactStatistics?.individualsAssisted || '140,000+'}
          </div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#717975]">Direct Beneficiaries Reached</p>
          <span className="text-[11px] text-[#4E7D6B] font-medium block">Audited Baseline Metric</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
            <Droplet className="w-5 h-5 text-[#144238]" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#144238]">
            {settings?.impactStatistics?.solarWellsInstalled || '85+'}
          </div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#717975]">Solar Boreholes Commissioned</p>
          <span className="text-[11px] text-[#4E7D6B] font-medium block">Zero-Emissions Water Pumping</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#144238]">
            {settings?.impactStatistics?.activeRegions || '12'}
          </div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#717975]">Active Regional Corridors</p>
          <span className="text-[11px] text-[#4E7D6B] font-medium block">East Africa, Sahel, South Asia, MENA</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#ffdcc6] text-[#954a00] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#D97724]">
            {settings?.impactStatistics?.directProgramRatio || '91%'}
          </div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#717975]">Direct Frontline Ratio</p>
          <span className="text-[11px] text-[#D97724] font-medium block">Verified by External CPA Review</span>
        </div>
      </div>

      {/* Stewardship Covenant Deep Dive */}
      <div className="bg-[#144238] text-white p-8 sm:p-12 rounded-3xl space-y-6 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="text-[#ffdcc6] text-xs uppercase font-bold tracking-widest">Our Fiduciary Covenant</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">100% Zakat & Direct Relief Policy</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Many donors worry that their charitable gifts are consumed by marketing campaigns and administrative salaries.
            At Imaan Relief & Development Foundation, institutional operations are underwritten by private endowment donors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white/10 p-5 rounded-xl border border-white/10 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-[#ffdcc6]" />
            <h3 className="font-serif text-base font-bold">Zero Deductions on Zakat</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Every cent designated for Zakat goes straight into verified frontline food, medical care, and clean water delivery.
            </p>
          </div>

          <div className="bg-white/10 p-5 rounded-xl border border-white/10 space-y-2">
            <FileCheck className="w-5 h-5 text-[#ffdcc6]" />
            <h3 className="font-serif text-base font-bold">Independent Quarterly Audits</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Independent Certified Public Accountants examine financial books every quarter and submit public IRS filings.
            </p>
          </div>

          <div className="bg-white/10 p-5 rounded-xl border border-white/10 space-y-2">
            <Award className="w-5 h-5 text-[#ffdcc6]" />
            <h3 className="font-serif text-base font-bold">GPS Verified Handover</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Every completed solar borehole well includes geographic coordinates, water yield tests, and beneficiary signatures.
            </p>
          </div>
        </div>
      </div>

      {/* Annual Reports & Public Disclosure Cards */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#144238]">Annual Institutional Disclosures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#144238]">2024 Comprehensive Field Audit</span>
              <p className="text-xs text-[#717975]">Fiscal Year End Independent Report</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading 2024 Audit Disclosure (IRDF-Audit-2024.pdf)');
              }}
              className="w-9 h-9 rounded-lg bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] flex items-center justify-center transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#144238]">501(c)(3) IRS Determination Letter</span>
              <p className="text-xs text-[#717975]">Tax-Exempt Public Charity Verification</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading IRS Determination Letter (IRS-501c3-Verification.pdf)');
              }}
              className="w-9 h-9 rounded-lg bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] flex items-center justify-center transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#144238]">Form 990 Public Inspection Copy</span>
              <p className="text-xs text-[#717975]">Full Federal Tax Filing Disclosures</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading Form 990 Public Inspection Copy');
              }}
              className="w-9 h-9 rounded-lg bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] flex items-center justify-center transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
