import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { ErrorState } from '../components/common/ErrorState.tsx';
import { ArrowLeft, Calendar, User, Tag, Heart } from 'lucide-react';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [newsItem, setNewsItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/news/${slug}`);
        if (res.data.success) {
          setNewsItem(res.data.data);
        } else {
          setError(res.data.message || 'News article not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchNews();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading press release..." />;
  if (error || !newsItem) return <ErrorState title="Article Not Found" message={error || 'Unable to load article.'} />;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead title={newsItem.title} description={newsItem.excerpt} ogImage={newsItem.featuredImage} />

      <div>
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#144238] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All News</span>
        </Link>
      </div>

      <header className="space-y-3">
        <span className="px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          {newsItem.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#144238] leading-tight">
          {newsItem.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-[#717975] pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString()}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{newsItem.author || 'Press Secretariat'}</span>
          </span>
        </div>
      </header>

      <div className="rounded-2xl overflow-hidden shadow-md aspect-[16/10] bg-[#efeeeb]">
        <img src={newsItem.featuredImage} alt={newsItem.title} className="w-full h-full object-cover" />
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#144238]/10 shadow-sm text-base text-[#1a1c1a] leading-relaxed space-y-6">
        <p className="font-serif text-xl text-[#144238] font-medium italic border-l-4 border-[#144238] pl-4">
          {newsItem.excerpt}
        </p>

        <div className="whitespace-pre-line space-y-4 text-[#404846] leading-relaxed">
          {newsItem.content}
        </div>
      </div>
    </article>
  );
};
