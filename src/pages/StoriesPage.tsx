import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Clock, MapPin, ArrowRight, BookOpen } from 'lucide-react';

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get('/stories');
        if (res.data.success) {
          setStories(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead
        title="Field Stories & Humanitarian Documentaries"
        description="Read firsthand dispatches and documentary narratives from beneficiaries, water engineers, and community elders."
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Voices of Dignity</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Humanitarian Field Stories
        </h1>
        <p className="text-sm sm:text-base text-[#404846]">
          Real journeys of resilience, communal enterprise, and hope told directly through the words of our regional partners.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Gathering field stories..." />
      ) : stories.length === 0 ? (
        <EmptyState title="No stories published" description="Check back soon for latest documentary updates from the field." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <article
              key={story._id || story.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeeeb]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-[#144238] text-white text-xs font-semibold">
                      Field Story
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#717975]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{story.readingTime || '4 min read'}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#D97724] font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{story.location}</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[#144238] leading-snug line-clamp-2">
                    {story.title}
                  </h2>

                  <p className="text-sm text-[#404846] leading-relaxed line-clamp-3">{story.excerpt}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#f4f3f0] mt-3">
                <Link
                  to={`/stories/${story.slug}`}
                  className="w-full h-11 mt-4 rounded-xl bg-[#efeeeb] hover:bg-[#144238] hover:text-white text-[#144238] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Read Full Documentary</span>
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
