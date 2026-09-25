import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { ErrorState } from '../components/common/ErrorState.tsx';
import { ArrowLeft, Clock, MapPin, User, Heart, Share2 } from 'lucide-react';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/stories/${slug}`);
        if (res.data.success) {
          setStory(res.data.data);
        } else {
          setError(res.data.message || 'Story not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchStory();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Opening field documentary..." />;
  if (error || !story) return <ErrorState title="Story Not Found" message={error || 'Unable to locate story.'} />;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead title={story.title} description={story.excerpt} ogImage={story.image} />

      <div>
        <Link
          to="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Field Stories</span>
        </Link>
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#717975]">
          <span className="flex items-center gap-1 text-[#D97724] font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{story.location}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{story.readingTime || '4 min read'}</span>
          </span>
          <span>•</span>
          <span>{new Date(story.publishedAt || story.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#144238] leading-tight">
          {story.title}
        </h1>

        <div className="flex items-center gap-2 text-xs text-[#404846] font-medium pt-1">
          <User className="w-4 h-4 text-[#144238]" />
          <span>Reported by {story.author || 'Imaan Field Communications Team'}</span>
        </div>
      </header>

      {/* Feature Photo */}
      <div className="rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-[#efeeeb]">
        <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Body */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#144238]/10 shadow-sm text-base sm:text-lg text-[#1a1c1a] leading-relaxed space-y-6 font-sans">
        <p className="font-serif text-xl sm:text-2xl text-[#144238] font-medium leading-relaxed italic border-l-4 border-[#D97724] pl-4">
          "{story.excerpt}"
        </p>

        <div className="whitespace-pre-line space-y-4 text-[#404846] leading-relaxed">
          {story.content}
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="p-6 rounded-2xl bg-[#144238] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-xl font-bold">Empower More Communities Like This</h3>
          <p className="text-xs text-white/80">Support solar water pumps and sustainable farming collectives.</p>
        </div>
        <Link
          to="/donate"
          className="h-11 px-6 rounded-xl bg-[#D97724] hover:bg-[#b86119] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Make a Contribution</span>
        </Link>
      </div>
    </article>
  );
};
