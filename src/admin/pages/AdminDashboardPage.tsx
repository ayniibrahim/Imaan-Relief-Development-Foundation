import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.ts';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import {
  Grid,
  Handshake,
  BookOpen,
  Newspaper,
  Calendar,
  Users,
  UserCheck,
  Heart,
  Mail,
  ArrowRight,
  TrendingUp,
  Activity,
  PlusCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/settings/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating real-time database metrics..." />;

  const statCards = [
    { title: 'Total Programs', count: stats?.totalPrograms ?? 0, link: '/admin/programs', icon: Grid, color: 'text-[#144238]' },
    { title: 'Total Projects', count: stats?.totalProjects ?? 0, sub: `${stats?.activeProjects ?? 0} active`, link: '/admin/projects', icon: Handshake, color: 'text-[#144238]' },
    { title: 'Stories Published', count: stats?.totalStories ?? 0, link: '/admin/stories', icon: BookOpen, color: 'text-[#144238]' },
    { title: 'News Bulletins', count: stats?.totalNews ?? 0, link: '/admin/news', icon: Newspaper, color: 'text-[#144238]' },
    { title: 'Upcoming Events', count: stats?.upcomingEvents ?? 0, link: '/admin/events', icon: Calendar, color: 'text-[#144238]' },
    { title: 'Volunteer Applications', count: stats?.totalVolunteers ?? 0, sub: `${stats?.newVolunteers ?? 0} new`, link: '/admin/volunteers', icon: UserCheck, color: 'text-[#D97724]' },
    { title: 'Total Donations', count: stats?.totalDonations ?? 0, sub: `$${(stats?.totalAmountRaised ?? 0).toLocaleString()} recorded`, link: '/admin/donations', icon: Heart, color: 'text-[#D97724]' },
    { title: 'Inquiries & Messages', count: stats?.totalMessages ?? 0, sub: `${stats?.newMessages ?? 0} unread`, link: '/admin/messages', icon: Mail, color: 'text-[#144238]' },
  ];

  return (
    <div className="space-y-8">
      <SEOHead title="Administrative Dashboard" />

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#144238]">Executive Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#717975]">
            Real-time administrative control panel and field database statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/programs"
            className="px-3.5 py-2 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Program</span>
          </Link>
          <Link
            to="/admin/projects"
            className="px-3.5 py-2 bg-[#D97724] hover:bg-[#b86119] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-5 rounded-2xl border border-[#144238]/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#717975]">{card.title}</span>
                <div className="w-8 h-8 rounded-lg bg-[#f4f3f0] flex items-center justify-center text-[#144238] group-hover:bg-[#144238] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="font-serif text-3xl font-bold text-[#1a1c1a]">{card.count}</span>
                {card.sub && <span className="block text-[11px] font-semibold text-[#D97724] mt-0.5">{card.sub}</span>}
              </div>

              <div className="mt-3 pt-2 border-t border-[#efeeeb] flex items-center justify-between text-[11px] font-bold text-[#144238]">
                <span>Manage</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Audit Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#144238]/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#144238]" />
            <h2 className="font-serif text-xl font-bold text-[#144238]">Audit Trail & Admin Activity</h2>
          </div>
          <span className="text-xs text-[#717975]">Real-time system events</span>
        </div>

        {stats?.recentLogs && stats.recentLogs.length > 0 ? (
          <div className="divide-y divide-[#efeeeb] text-xs">
            {stats.recentLogs.map((log: any) => (
              <div key={log._id || log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#144238]">{log.action}</span>
                    <span className="px-2 py-0.2 rounded bg-[#f4f3f0] text-[10px] font-mono text-[#717975]">
                      {log.resourceType}
                    </span>
                  </div>
                  {log.details && <p className="text-[#404846]">{log.details}</p>}
                </div>
                <div className="flex items-center gap-3 text-[#717975] text-[11px] flex-shrink-0">
                  <span>{log.user?.name || 'Staff User'}</span>
                  <span>•</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#717975] py-4 text-center">No recent administrative actions recorded.</p>
        )}
      </div>
    </div>
  );
};
