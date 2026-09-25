import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { ErrorState } from '../components/common/ErrorState.tsx';
import { ArrowLeft, CheckCircle, MapPin, Users, Heart, ArrowRight, Layers } from 'lucide-react';

export const ProgramDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/programs/${slug}`);
        if (res.data.success) {
          setProgram(res.data.data);
        } else {
          setError(res.data.message || 'Program not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load program details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProgram();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading program dossier..." />;
  if (error || !program) return <ErrorState title="Program Not Found" message={error || 'Unable to locate specified program.'} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <SEOHead
        title={program.title}
        description={program.shortDescription}
        ogImage={program.image}
      />

      {/* Back button */}
      <div>
        <Link
          to="/programs"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Programs</span>
        </Link>
      </div>

      {/* Hero Visual Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[16/9] w-full bg-[#efeeeb]">
        <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#144238]/90 via-[#144238]/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#144238] text-xs font-bold uppercase tracking-wider shadow-sm">
            {program.category}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{program.title}</h1>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl">{program.shortDescription}</p>
        </div>
      </div>

      {/* Main Grid: Body vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Narrative */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#144238]">Program Framework & Strategic Vision</h2>
            <div className="text-sm sm:text-base text-[#404846] leading-relaxed space-y-4 whitespace-pre-line">
              {program.description}
            </div>
          </div>

          {/* Objectives */}
          {program.objectives && program.objectives.length > 0 && (
            <div className="bg-[#f4f3f0] p-6 sm:p-8 rounded-2xl space-y-4 border-l-4 border-[#144238]">
              <h3 className="font-serif text-xl font-bold text-[#144238]">Key Milestone Objectives</h3>
              <ul className="space-y-3">
                {program.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#1a1c1a]">
                    <CheckCircle className="w-5 h-5 text-[#144238] flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Projects */}
          {program.relatedProjects && program.relatedProjects.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#144238]">Active & Completed Field Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {program.relatedProjects.map((proj: any) => (
                  <Link
                    key={proj._id || proj.id}
                    to={`/projects/${proj.slug}`}
                    className="bg-white p-4 rounded-xl border border-[#144238]/10 shadow-xs hover:shadow-md transition-shadow space-y-2 block"
                  >
                    <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#efeeeb] mb-2">
                      <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97724]">{proj.location}</span>
                    <h4 className="font-serif text-base font-bold text-[#144238] line-clamp-1">{proj.title}</h4>
                    <p className="text-xs text-[#717975] line-clamp-2">{proj.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Donation Box */}
          <div className="bg-[#144238] text-white p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="font-serif text-xl font-bold">Support This Program</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Your gift is governed by our 100% Zakat Direct Policy with zero administrative deductions.
            </p>
            <Link
              to={`/donate?purpose=${encodeURIComponent(program.title)}`}
              className="w-full py-3.5 bg-[#D97724] hover:bg-[#b86119] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Sponsor This Pillar</span>
            </Link>
          </div>

          {/* Operational Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4 text-xs sm:text-sm text-[#404846]">
            <h4 className="font-serif text-base font-bold text-[#144238]">Operational Parameters</h4>

            {program.targetBeneficiaries && (
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-[#717975] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#144238]" /> Target Beneficiaries
                </span>
                <p className="font-medium text-[#1a1c1a]">{program.targetBeneficiaries}</p>
              </div>
            )}

            {program.locations && program.locations.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-[#efeeeb]">
                <span className="text-xs uppercase font-bold text-[#717975] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#144238]" /> Operational Regions
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {program.locations.map((loc: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#f4f3f0] text-xs text-[#144238] font-medium">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
