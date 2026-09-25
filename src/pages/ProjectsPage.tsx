import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Search, MapPin, CheckCircle, ArrowRight, Filter, Users, Calendar } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const statuses = ['all', 'Active', 'Completed', 'Upcoming', 'On Hold'];

  useEffect(() => {
    fetchProjects();
  }, [status]);

  const fetchProjects = async (searchQuery = search) => {
    setLoading(true);
    try {
      let url = `/projects?`;
      if (status !== 'all') url += `status=${status}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects(search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead
        title="Field Projects & Direct Interventions"
        description="Browse all ongoing, upcoming, and completed humanitarian projects executed by Imaan Relief & Development Foundation."
      />

      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D97724]">Direct Field Telemetry</span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Field Projects & Installations
        </h1>
        <p className="text-sm sm:text-base text-[#404846]">
          Every project is vetted hydrogeologically or logistically, audited quarterly, and co-managed with local community councils.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#144238]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors flex-shrink-0 ${
                status === st ? 'bg-[#144238] text-white shadow-xs' : 'bg-[#f4f3f0] text-[#717975] hover:bg-[#efeeeb]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or locations..."
            className="w-full h-10 pl-3 pr-9 bg-[#f4f3f0] text-[#1a1c1a] text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#144238]"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#717975] hover:text-[#144238]">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner message="Scanning project registries..." />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects match criteria"
          description="Try broadening your search or switching status filters."
          actionText="Reset Filters"
          onAction={() => {
            setStatus('all');
            setSearch('');
            fetchProjects('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isCompleted = proj.status === 'Completed';
            return (
              <article
                key={proj._id || proj.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeeeb]">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          isCompleted
                            ? 'bg-[#4E7D6B] text-white'
                            : proj.status === 'Active'
                            ? 'bg-[#D97724] text-white'
                            : 'bg-white text-[#144238]'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#D97724] font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{proj.location}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#144238] line-clamp-2 leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-[#404846] leading-relaxed line-clamp-3">{proj.shortDescription}</p>

                    {proj.targetBeneficiaries && (
                      <div className="pt-2 text-xs text-[#717975] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#144238]" />
                        <span className="truncate">Beneficiaries: {proj.beneficiariesReached || proj.targetBeneficiaries}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#f4f3f0] mt-3">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="w-full h-10 mt-3 rounded-lg bg-[#efeeeb] hover:bg-[#144238] hover:text-white text-[#144238] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                  >
                    <span>View Project Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
