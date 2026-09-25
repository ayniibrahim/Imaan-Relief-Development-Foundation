import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import {
  ShieldCheck,
  Heart,
  Compass,
  Droplet,
  Users,
  Sun,
  Globe,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
  FileText,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [programs, setPrograms] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick donate state for interactive appeal card
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [microcopy, setMicrocopy] = useState<string>(
    'Delivers clean family water storage containers and hygiene kits.'
  );

  const donationTiers = [
    { amount: 25, copy: 'Supplies high-energy nutrient meal packs for two children for one month.' },
    { amount: 50, copy: 'Delivers clean family water storage containers and hygiene kits.' },
    { amount: 100, copy: 'Provides drought-resistant seeds and hand tools for communal agriculture.' },
    { amount: 250, copy: 'Funds emergency mobile clinic medical provisions and rehydration supplies.' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, projRes, storyRes, newsRes] = await Promise.all([
          api.get('/programs?limit=4'),
          api.get('/projects?featured=true&limit=3'),
          api.get('/stories?limit=2'),
          api.get('/news?limit=2'),
        ]);

        if (progRes.data.success) setPrograms(progRes.data.data);
        if (projRes.data.success) setProjects(projRes.data.data);
        if (storyRes.data.success) setStories(storyRes.data.data);
        if (newsRes.data.success) setNews(newsRes.data.data);
      } catch (err) {
        console.warn('Home page load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectTier = (amount: number, copy: string) => {
    setSelectedAmount(amount);
    setMicrocopy(copy);
  };

  const criticalGoal = settings?.homepageContent?.criticalAppealGoal || 600000;
  const criticalRaised = settings?.homepageContent?.criticalAppealRaised || 420000;
  const percentFunded = Math.min(100, Math.round((criticalRaised / criticalGoal) * 100));

  return (
    <div className="flex flex-col w-full pb-16">
      <SEOHead
        title="Humanitarian Relief & Sustainable Development"
        description={settings?.mission || 'Restoring dignity and building resilient communities across vulnerable regions worldwide.'}
      />

      {/* 1. Hero Section & Editorial Documentary Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D97724]" />
              <span>Independent Humanitarian NGO</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238] leading-[1.15]">
              {settings?.homepageContent?.heroHeadline || 'Restoring Dignity, Building Resilient Communities'}
            </h1>

            <p className="text-base sm:text-lg text-[#404846] leading-relaxed">
              {settings?.homepageContent?.heroSubheadline ||
                'Bridging emergency humanitarian relief and long-term sustainable development across vulnerable regions worldwide.'}
            </p>

            {/* Quick CTA Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/donate"
                className="h-12 px-6 rounded-lg bg-[#D97724] hover:bg-[#b86119] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(217,119,36,0.3)] active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Relief Appeal</span>
              </Link>

              <Link
                to="/programs"
                className="h-12 px-6 rounded-lg bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#144238] font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Programs</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-[#efeeeb] group">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArEhRc-Xyvdxiy5v4UyML-yodE_UbwRCmNpO3JGYhMqCQ1Ry3DWbKLkeGghy2M8TdDM0jyxmvsGvz-GAlepfGXpmSv-vedVzI0apAkgPod0BVHbavSknN8At-WYtgcr2OhF7trhKcH_UL7kDG9rUOPU8Xe-6CSvwMhA72pY7TGYQ3s2x3VbfoSqrMAAgTFV6sDUv7P0Rym95QTzJznnKPnMU8r1OfEM9AeEaBp-kyLaYzPhqoPKSrL"
                  alt="East African village community celebrating fresh borehole water"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#144238]/90 via-[#144238]/30 to-transparent"></div>

                <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#D97724] text-white text-[10px] font-bold uppercase tracking-wider">
                      Field Note
                    </span>
                    <span className="text-xs text-white/90 font-medium">Kigoma Province • Safe Borehole #042</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                    Water restored. Joy multiplied.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Urgent Relief Appeal Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#144238]/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#D97724] text-xs font-bold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97724] animate-pulse"></span>
                <span>Critical Priority Appeal</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">
                {settings?.homepageContent?.criticalAppealTitle || 'East Africa Drought & Food Security Appeal'}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#ffdcc6] text-[#954a00] flex items-center justify-center flex-shrink-0">
              <Droplet className="w-6 h-6 fill-[#954a00]" />
            </div>
          </div>

          {/* Financial Progress Bar */}
          <div className="bg-[#f4f3f0] p-4 rounded-xl space-y-3">
            <div className="flex items-baseline justify-between text-sm sm:text-base font-semibold text-[#144238]">
              <span>[Audited Metric: ${criticalRaised.toLocaleString()} Raised]</span>
              <span className="text-[#717975] text-xs sm:text-sm">[Target: ${criticalGoal.toLocaleString()} Goal]</span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#e3e2e0] overflow-hidden">
              <div
                className="h-full bg-[#144238] rounded-full transition-all duration-700"
                style={{ width: `${percentFunded}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-[#404846]">
              <span className="font-bold text-[#144238]">{percentFunded}% Funded</span>
              <span className="text-[#717975] uppercase tracking-wide font-medium">
                3,410 Displaced Families Awaiting Kits
              </span>
            </div>
          </div>

          {/* Donation Tiers Chips */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-bold text-[#717975]">Select Giving Tier</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {donationTiers.map((tier) => {
                const isSelected = selectedAmount === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => handleSelectTier(tier.amount, tier.copy)}
                    className={`py-3 px-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#144238] text-white shadow-md'
                        : 'bg-[#f4f3f0] text-[#144238] hover:bg-[#efeeeb]'
                    }`}
                  >
                    <span className="text-lg font-bold">${tier.amount}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Microcopy Callout */}
            <div className="bg-[#f4f3f0] p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-[#404846]">
              <Sparkles className="w-4 h-4 text-[#D97724] flex-shrink-0" />
              <span>{microcopy}</span>
            </div>
          </div>

          <Link
            to={`/donate?amount=${selectedAmount}&frequency=once`}
            className="w-full h-12 bg-[#D97724] hover:bg-[#b86119] text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
          >
            <span>Proceed with ${selectedAmount} Direct Donation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Audited Direct Impact Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 w-full space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238]">
            <ShieldCheck className="w-4 h-4 text-[#144238]" />
            <span>Radical Field Accountability</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Audited Direct Impact</h2>
          <p className="text-sm text-[#717975]">
            Telemetry compiled from logistics warehouses, borehole meters, and regional partner hubs.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">
                {settings?.impactStatistics?.individualsAssisted || '140,000+'}
              </div>
              <p className="text-xs uppercase tracking-wider text-[#717975] font-semibold mt-0.5">
                Individuals Assisted
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">
                {settings?.impactStatistics?.solarWellsInstalled || '85+'}
              </div>
              <p className="text-xs uppercase tracking-wider text-[#717975] font-semibold mt-0.5">
                Solar Wells Commissioned
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">
                {settings?.impactStatistics?.activeRegions || '12'}
              </div>
              <p className="text-xs uppercase tracking-wider text-[#717975] font-semibold mt-0.5">
                Active Operational Regions
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ffdcc6] text-[#954a00] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#D97724]">
                {settings?.impactStatistics?.directProgramRatio || '91%'}
              </div>
              <p className="text-xs uppercase tracking-wider text-[#717975] font-semibold mt-0.5">
                Direct Frontline Ratio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Strategic Development Pillars (Dynamic from MongoDB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238]">
              <Layers className="w-4 h-4 text-[#144238]" />
              <span>Strategic Framework</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Core Development Pillars</h2>
            <p className="text-sm text-[#717975]">
              From rapid crisis response to generation-spanning community self-reliance.
            </p>
          </div>
          <Link
            to="/programs"
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-[#144238] hover:underline"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving programs..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <div
                key={prog._id || prog.id}
                className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-[11px] font-bold uppercase tracking-wider">
                      {prog.category}
                    </span>
                    <span className="text-xs text-[#717975]">ID: {prog.slug?.slice(0, 7).toUpperCase()}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#144238]">{prog.title}</h3>
                  <p className="text-sm text-[#404846] leading-relaxed line-clamp-2">{prog.shortDescription}</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#f4f3f0]">
                  <Link
                    to={`/programs/${prog.slug}`}
                    className="text-xs font-bold text-[#144238] hover:underline flex items-center gap-1"
                  >
                    <span>Full Program Strategy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/donate?purpose=${encodeURIComponent(prog.title)}`}
                    className="text-xs font-bold text-[#D97724] hover:underline"
                  >
                    Direct Sponsorship →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Featured Field Story Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 w-full">
        <div className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Z6IyPQx-tWT-4wzylKElNMQxXU8pggC7XwokeNyT5MSxWTOQ6hnKKU5lKWsqE_6fUE-lTCeymLnh543R5hihRQkH7Az8bN8bx-AD4WWq8MnktBIWZDzlFE0fZU3oWHxqwRyWDjr3568dykiJi77hcq3IRi8RinG0CKY36_yWRK9AaROl9JREjbOLwuKJgjhjGwyqrwipM6vWixTfbPGilEovz-2XiB5d0cczT54rrwZM2aDZljuq"
              alt="Hawa inspecting crops grown with solar water borehole irrigation"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#144238] text-white text-xs font-semibold">
                Featured Field Story
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#717975]">
                <Clock className="w-3.5 h-3.5" />
                <span>4 min read • Shinyanga Region, Tanzania</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238] leading-snug">
                Hawa's Village: How Solar Water Transformed Health & Agriculture
              </h3>
              <p className="text-sm sm:text-base text-[#404846] leading-relaxed">
                Before the solar pump was commissioned, 38-year-old Hawa walked six hours each dawn. Today, she leads a
                thriving 40-member collective cultivating seasonal vegetables and sending daughters to school.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/stories/hawas-village-solar-water-transformed-health-agriculture"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Read Full Documentary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Stewardship Covenant & Institutional Governance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 w-full">
        <div className="bg-[#f4f3f0] rounded-2xl p-6 sm:p-8 space-y-4 border-l-4 border-[#144238]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#144238]"></span>
            <h2 className="font-serif text-2xl font-bold text-[#144238]">The Imaan Stewardship Covenant</h2>
          </div>
          <p className="text-sm sm:text-base text-[#404846] leading-relaxed max-w-3xl">
            {settings?.homepageContent?.stewardshipText ||
              'We hold every penny in trust. Donors may designate their contribution to our 100% Zakat & Relief Direct Policy, where operational costs are underwritten exclusively by private endowment donors.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-4 rounded-xl flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#144238] mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-[#144238]">100% Direct Giving Option</span>
                <p className="text-xs text-[#717975]">Optionally direct 100% of your gift to frontline field items.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl flex items-start gap-3 shadow-xs">
              <FileText className="w-5 h-5 text-[#144238] mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-[#144238]">Audited Books & Open Disclosures</span>
                <p className="text-xs text-[#717975]">Published quarterly reports and third-party accounting filings.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/impact"
              className="text-xs font-bold text-[#144238] hover:underline flex items-center gap-1"
            >
              <span>Review 2024 Independent Financial Audit Report</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Bottom Monthly Partner Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 w-full">
        <div className="bg-[#144238] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[#ffdcc6] text-xs uppercase font-bold tracking-widest">Continuous Empathy</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Join the Circle of Enduring Sustenance
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Predictable monthly pledges empower our field emergency logistics corridors to mobilize food, medicine, and
              clean water within 24 hours of crises.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/donate?frequency=monthly"
              className="h-12 px-8 rounded-xl bg-[#D97724] hover:bg-[#b86119] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D97724]/20 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Become a Monthly Partner</span>
            </Link>
            <Link
              to="/about"
              className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center justify-center transition-colors"
            >
              Learn More About Our Governance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
