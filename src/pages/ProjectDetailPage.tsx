import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { ErrorState } from '../components/common/ErrorState.tsx';
import { ArrowLeft, MapPin, Calendar, Users, CheckCircle, Heart, DollarSign } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/projects/${slug}`);
        if (res.data.success) {
          setProject(res.data.data);
        } else {
          setError(res.data.message || 'Project not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProject();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Retrieving field telemetry..." />;
  if (error || !project) return <ErrorState title="Project Not Found" message={error || 'Unable to load project.'} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead title={project.title} description={project.shortDescription} ogImage={project.coverImage} />

      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Main Header Container */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#144238] text-white text-xs font-bold uppercase tracking-wider">
            {project.status}
          </span>
          {project.associatedProgram && (
            <Link
              to={`/programs/${project.associatedProgram.slug}`}
              className="text-xs font-bold text-[#D97724] hover:underline"
            >
              Part of {project.associatedProgram.title}
            </Link>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#144238] leading-tight">{project.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#717975] pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#D97724]" />
            <strong className="text-[#1a1c1a]">{project.location}</strong>
          </span>
          {project.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#144238]" />
              <span>Timeline: {project.startDate} {project.endDate ? `to ${project.endDate}` : ''}</span>
            </span>
          )}
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md bg-[#efeeeb]">
        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Grid: Narrative vs Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#144238]">Field Description & Context</h2>
            <div className="text-sm sm:text-base text-[#404846] leading-relaxed whitespace-pre-line space-y-4">
              {project.description}
            </div>
          </div>

          {/* Objectives */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="bg-[#f4f3f0] p-6 rounded-2xl space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">Project Objectives</h3>
              <ul className="space-y-2">
                {project.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1a1c1a]">
                    <CheckCircle className="w-4 h-4 text-[#144238] flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Activities */}
          {project.activities && project.activities.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">Executed Field Activities</h3>
              <ul className="space-y-2">
                {project.activities.map((act: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#404846]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97724] mt-2 flex-shrink-0"></span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Measured Results */}
          {project.results && project.results.length > 0 && (
            <div className="bg-[#144238]/5 border border-[#144238]/20 p-6 rounded-2xl space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#144238]">Audited Field Results</h3>
              <ul className="space-y-2">
                {project.results.map((res: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#144238]">
                    <CheckCircle className="w-4 h-4 text-[#4E7D6B] flex-shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Photos */}
          {project.images && project.images.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#144238]">Field Documentation Gallery</h3>
              <div className="grid grid-cols-2 gap-3">
                {project.images.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#efeeeb]">
                    <img src={img} alt={`Field documentation ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#144238]">Execution Summary</h3>

            {project.targetBeneficiaries && (
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-[#717975]">Planned Target</span>
                <p className="text-sm font-semibold text-[#1a1c1a]">{project.targetBeneficiaries}</p>
              </div>
            )}

            {project.beneficiariesReached && (
              <div className="space-y-1 pt-2 border-t border-[#efeeeb]">
                <span className="text-xs uppercase font-bold text-[#717975]">Directly Reached</span>
                <p className="text-sm font-semibold text-[#144238]">{project.beneficiariesReached}</p>
              </div>
            )}

            {project.budgetGoal > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#efeeeb]">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#717975]">Budget Allocated:</span>
                  <span className="text-[#144238]">${project.budgetGoal.toLocaleString()}</span>
                </div>
                {project.fundsRaised > 0 && (
                  <div className="w-full h-2 rounded-full bg-[#efeeeb] overflow-hidden">
                    <div
                      className="h-full bg-[#144238] rounded-full"
                      style={{ width: `${Math.min(100, Math.round((project.fundsRaised / project.budgetGoal) * 100))}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <Link
                to={`/donate?purpose=${encodeURIComponent(project.title)}`}
                className="w-full py-3 bg-[#D97724] hover:bg-[#b86119] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Support This Location</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
