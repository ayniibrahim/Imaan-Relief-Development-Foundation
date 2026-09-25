import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { ErrorState } from '../components/common/ErrorState.tsx';
import { ArrowLeft, Calendar, Clock, MapPin, Video, ExternalLink, CheckCircle } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/events/${slug}`);
        if (res.data.success) {
          setEvent(res.data.data);
        } else {
          setError(res.data.message || 'Event not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchEvent();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading event details..." />;
  if (error || !event) return <ErrorState title="Event Not Found" message={error || 'Unable to locate event.'} />;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead title={event.title} description={event.description} ogImage={event.image} />

      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      <header className="space-y-3">
        <span className="px-3 py-1 rounded-full bg-[#144238] text-white text-xs font-bold uppercase tracking-wider">
          {event.status}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#144238] leading-tight">
          {event.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#717975] pt-2">
          <span className="flex items-center gap-1 font-semibold text-[#144238]">
            <Calendar className="w-4 h-4 text-[#D97724]" />
            <span>{event.date}</span>
          </span>
          {event.startTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#144238]" />
              <span>{event.startTime} - {event.endTime || 'Concludes'}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#144238]" />
            <span>{event.location}</span>
          </span>
        </div>
      </header>

      <div className="rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-[#efeeeb]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-[#144238]/10 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#144238]">Symposium Overview & Agenda</h2>
          <div className="text-sm sm:text-base text-[#404846] leading-relaxed whitespace-pre-line space-y-4">
            {event.description}
          </div>
        </div>

        {/* RSVP Card */}
        <div className="bg-[#f4f3f0] p-6 rounded-2xl space-y-4 self-start">
          <h3 className="font-serif text-xl font-bold text-[#144238]">Attendance & RSVP</h3>
          <p className="text-xs text-[#717975] leading-relaxed">
            Attendance is complimentary for accredited partners, donors, and press representatives.
          </p>

          {registered ? (
            <div className="p-4 rounded-xl bg-[#144238]/10 text-[#144238] text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Your registration has been confirmed! An invitation pass has been prepared.</span>
            </div>
          ) : (
            <button
              onClick={() => setRegistered(true)}
              className="w-full py-3 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              Reserve Delegate Pass
            </button>
          )}

          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#144238] hover:underline flex items-center gap-1 font-semibold justify-center pt-2"
            >
              <span>External Registration Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
