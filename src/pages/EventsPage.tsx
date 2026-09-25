import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Calendar, Clock, MapPin, Video, ArrowRight, ExternalLink } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead
        title="Symposiums, Briefings & Banquets"
        description="Join leadership, field engineers, and institutional donors for upcoming humanitarian briefings, donor galas, and online webinars."
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Global Engagements</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Events & Humanitarian Symposiums
        </h1>
        <p className="text-sm sm:text-base text-[#404846]">
          Direct briefings on groundwater hydrology, refugee relief logistics, and community partnership models.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Checking event schedule..." />
      ) : events.length === 0 ? (
        <EmptyState title="No upcoming events" description="Check back soon for announcements on our next donor briefing." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <article
              key={ev._id || ev.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeeeb]">
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#144238] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      {ev.status}
                    </span>
                  </div>
                  {ev.isVirtual && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#144238] flex items-center gap-1 shadow-sm">
                      <Video className="w-3.5 h-3.5" />
                      <span>Hybrid / Livestream</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#717975]">
                    <span className="flex items-center gap-1 font-semibold text-[#144238]">
                      <Calendar className="w-3.5 h-3.5 text-[#D97724]" />
                      <span>{ev.date}</span>
                    </span>
                    {ev.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.startTime}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[#144238] leading-snug line-clamp-2">{ev.title}</h2>

                  <div className="flex items-start gap-1.5 text-xs text-[#404846]">
                    <MapPin className="w-4 h-4 text-[#717975] flex-shrink-0 mt-0.5" />
                    <span>{ev.location}</span>
                  </div>

                  <p className="text-sm text-[#404846] leading-relaxed line-clamp-3">{ev.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#f4f3f0] mt-3">
                <Link
                  to={`/events/${ev.slug}`}
                  className="w-full h-11 mt-4 rounded-xl bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Event Brief & RSVP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
