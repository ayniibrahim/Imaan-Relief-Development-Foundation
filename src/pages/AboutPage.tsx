import React, { useState, useEffect } from 'react';
import api from '../services/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { Shield, Target, Compass, Award, CheckCircle, Users, Mail, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        if (res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      <SEOHead
        title="About Our Mission & Leadership"
        description="Learn about Imaan Relief & Development Foundation, our founding principles, approach to sustainable self-reliance, and executive leadership."
      />

      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Principled Humanitarian Governance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Grounded Empathy, Verified Stewardship
        </h1>
        <p className="text-base sm:text-lg text-[#404846] leading-relaxed">
          {settings?.mission ||
            'To provide principled, immediate emergency humanitarian relief and execute sustainable community-led development programs that restore dignity, nurture self-reliance, and transform vulnerable populations worldwide.'}
        </p>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#144238]/10 text-[#144238] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#144238]">Our Mission</h2>
          <p className="text-sm sm:text-base text-[#404846] leading-relaxed">
            {settings?.mission ||
              'To deliver unconditional lifesaving emergency provisions during natural crises and conflict while equipping remote pastoral and farming villages with clean solar water systems, regenerative farming tools, and child schooling.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffdcc6] text-[#954a00] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#144238]">Our Vision</h2>
          <p className="text-sm sm:text-base text-[#404846] leading-relaxed">
            {settings?.vision ||
              'A resilient world where every community possesses independent access to potable water, nutritional food security, and dignified livelihoods without perpetual reliance on external emergency shipments.'}
          </p>
        </div>
      </div>

      {/* Core Organizational Values */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">The Values That Guide Us</h2>
          <p className="text-sm text-[#717975]">The non-negotiable moral benchmarks embedded in all field deployments.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(settings?.values || [
            {
              title: 'Dignity Over Dependency',
              description: 'Co-designing every well and seed grant with indigenous community councils.',
            },
            {
              title: '100% Zakat Direct Policy',
              description: 'Operational overhead is supported by private endowments so field gifts go 100% to relief.',
            },
            {
              title: 'Radical Transparency',
              description: 'Public quarterly financial filings and GPS-verified borehole meters.',
            },
            {
              title: 'Humanitarian Neutrality',
              description: 'Aiding displaced persons based strictly on acute vulnerability regardless of background.',
            },
          ]).map((val, idx) => (
            <div key={idx} className="bg-[#f4f3f0] p-6 rounded-2xl space-y-2 border-t-2 border-[#144238]">
              <span className="text-xs font-bold text-[#D97724] uppercase tracking-wider">0{idx + 1}</span>
              <h3 className="font-serif text-lg font-bold text-[#144238]">{val.title}</h3>
              <p className="text-xs sm:text-sm text-[#404846] leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Approach (Methodology) */}
      <div className="bg-[#144238] text-white p-8 sm:p-12 rounded-3xl space-y-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="text-[#ffdcc6] text-xs uppercase font-bold tracking-widest">Our Methodology</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">The Imaan Lifecycle: From Relief to Self-Reliance</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Humanitarian aid often fails when it creates passive dependency. We implement an engineered 3-stage model:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-sm border border-white/10">
            <span className="w-8 h-8 rounded-full bg-[#D97724] text-white font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h3 className="font-serif text-lg font-bold">Acute Relief Blitz</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Immediate deployment of ready-to-use therapeutic food packs, safe water tankers, and temporary shelter within
              72 hours of disaster declarations.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-sm border border-white/10">
            <span className="w-8 h-8 rounded-full bg-[#D97724] text-white font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h3 className="font-serif text-lg font-bold">Durable Infrastructure</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Drilling 160-meter solar submersible wells, constructing permanent schools, and laying gravity drip-irrigation
              networks.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-sm border border-white/10">
            <span className="w-8 h-8 rounded-full bg-[#D97724] text-white font-bold text-xs flex items-center justify-center">
              03
            </span>
            <h3 className="font-serif text-lg font-bold">Custodial Handover</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Training local Village Governance Councils with toolkits and financial reserves, ensuring projects function
              independently for decades.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership & Trustees Section (from MongoDB) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238]">
            <Users className="w-4 h-4 text-[#144238]" />
            <span>Fiduciary Leadership</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#144238]">Board of Trustees & Directors</h2>
          <p className="text-sm text-[#717975]">Seasoned humanitarian logisticians, hydrologists, and compliance officers.</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading leadership profiles..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member._id || member.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#efeeeb]">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97724]">
                      {member.department}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#144238] mt-0.5">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#717975]">{member.position}</p>
                    <p className="text-xs text-[#404846] mt-2 leading-relaxed line-clamp-3">{member.biography}</p>
                  </div>
                  {member.email && (
                    <div className="pt-2 border-t border-[#f4f3f0] flex items-center gap-2 text-xs text-[#717975]">
                      <Mail className="w-3.5 h-3.5 text-[#144238]" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact & Governance Callout */}
      <div className="p-6 rounded-2xl bg-[#f4f3f0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-lg font-bold text-[#144238]">Interested in Institutional Governance?</h3>
          <p className="text-xs text-[#717975]">
            Review our 990 filings, IRS tax exemption letters, and annual external auditor opinions.
          </p>
        </div>
        <Link
          to="/contact"
          className="h-10 px-5 rounded-lg bg-[#144238] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1a5346] transition-colors"
        >
          <span>Contact Trustees</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
