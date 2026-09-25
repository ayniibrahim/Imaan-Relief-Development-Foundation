import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Shield, Heart, ArrowRight, MapPin, CheckCircle, Droplet, Users, Layers, Sparkles } from 'lucide-react';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModalProgram, setActiveModalProgram] = useState<any | null>(null);

  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'Emergency Relief', name: 'Emergency Relief' },
    { id: 'Water & Sanitation', name: 'Clean Water & WASH' },
    { id: 'Livelihood & Food Security', name: 'Food & Livelihood' },
    { id: 'Education Support', name: 'Education & Protection' },
  ];

  useEffect(() => {
    fetchPrograms();
  }, [category]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const url = category === 'all' ? '/programs' : `/programs?category=${encodeURIComponent(category)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load programs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead
        title="Humanitarian Relief & Sustainable Development Portfolios"
        description="Explore our community-managed solar water pumping systems, emergency rapid blitz relief, and regenerative agribusiness cooperatives."
      />

      {/* Editorial Intro Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Impact in Action • Portfolios</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Humanitarian Relief & Sustainable Development
        </h1>

        <p className="text-base text-[#404846] leading-relaxed">
          We design integrated, community-led programs that provide immediate lifesaving assistance while establishing
          the infrastructure for generational resilience.
        </p>

        {/* Snapshot Ribbon */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#f4f3f0] shadow-xs max-w-lg">
          <div className="text-center">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#144238]">100%</span>
            <span className="block text-[10px] uppercase font-bold text-[#717975]">Zakat Compliant</span>
          </div>
          <div className="text-center border-x border-[#c0c8c4]/40">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#D97724]">140k+</span>
            <span className="block text-[10px] uppercase font-bold text-[#717975]">Lives Sustained</span>
          </div>
          <div className="text-center">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#144238]">12</span>
            <span className="block text-[10px] uppercase font-bold text-[#717975]">Field Missions</span>
          </div>
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="sticky top-16 z-30 bg-[#faf9f6]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-y border-[#efeeeb] overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              category === c.id
                ? 'bg-[#144238] text-white shadow-sm'
                : 'bg-[#efeeeb] text-[#404846] hover:bg-[#e3e2e0]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Programs Stream */}
      {loading ? (
        <LoadingSpinner message="Loading program frameworks..." />
      ) : programs.length === 0 ? (
        <EmptyState title="No programs found" description="No active programs found in this category." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((prog) => (
            <article
              key={prog._id || prog.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image Header with Badge */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#efeeeb]">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#144238]/80 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#144238] text-xs font-bold uppercase tracking-wider shadow-sm">
                      {prog.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#ffdcc6]" />
                      <span>{prog.locations?.[0] || 'International Field Mission'}</span>
                    </div>
                    <span className="bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono">
                      ID: {prog.slug?.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="font-serif text-2xl font-bold text-[#144238] leading-snug">{prog.title}</h2>
                    <p className="text-sm text-[#404846] leading-relaxed line-clamp-3">{prog.shortDescription}</p>
                  </div>

                  {/* Highlights / Badges */}
                  {prog.stats && prog.stats.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {prog.stats.map((st: any, i: number) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-[#f4f3f0] text-[#144238] text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#4E7D6B]" />
                          <span>
                            <strong>{st.metricValue}</strong> {st.metricLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalProgram(prog)}
                  className="h-11 rounded-lg bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#144238] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Quick Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <Link
                  to={`/donate?purpose=${encodeURIComponent(prog.title)}`}
                  className="h-11 rounded-lg bg-[#D97724] hover:bg-[#b86119] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Support</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Program Quick Brief Modal Drawer */}
      {activeModalProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#144238]/60 backdrop-blur-xs" onClick={() => setActiveModalProgram(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#efeeeb] pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#D97724] tracking-wider">
                  {activeModalProgram.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#144238]">{activeModalProgram.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalProgram(null)}
                className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#717975] hover:text-[#144238]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#404846] leading-relaxed">
              <p className="whitespace-pre-line">{activeModalProgram.description}</p>

              {activeModalProgram.objectives && activeModalProgram.objectives.length > 0 && (
                <div className="bg-[#f4f3f0] p-4 rounded-2xl space-y-2">
                  <h4 className="font-serif text-base font-bold text-[#144238]">Strategic Objectives</h4>
                  <ul className="space-y-1.5">
                    {activeModalProgram.objectives.map((obj: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                        <CheckCircle className="w-4 h-4 text-[#144238] flex-shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeModalProgram.locations && (
                <div className="flex items-center gap-2 text-xs text-[#717975]">
                  <MapPin className="w-4 h-4 text-[#D97724]" />
                  <span>
                    Locations: <strong className="text-[#1a1c1a]">{activeModalProgram.locations.join(', ')}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/programs/${activeModalProgram.slug}`}
                onClick={() => setActiveModalProgram(null)}
                className="flex-1 h-12 rounded-xl bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#144238] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Full Program Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/donate?purpose=${encodeURIComponent(activeModalProgram.title)}`}
                onClick={() => setActiveModalProgram(null)}
                className="flex-1 h-12 rounded-xl bg-[#D97724] hover:bg-[#b86119] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate to this Program</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
