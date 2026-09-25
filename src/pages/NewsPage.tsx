import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Newspaper, Calendar, ArrowRight, User } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        if (res.data.success) {
          setNewsList(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead
        title="News, Bulletins & Press Dispatches"
        description="Official press announcements, emergency mobilization bulletins, and independent financial audit disclosures from Imaan Relief."
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Press & Institutional Bulletins</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          News & Humanitarian Updates
        </h1>
        <p className="text-sm sm:text-base text-[#404846]">
          Real-time dispatches from our logistics corridors, emergency convoys, and audit committees.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading bulletins..." />
      ) : newsList.length === 0 ? (
        <EmptyState title="No news bulletins" description="Official press updates will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <article
              key={item._id || item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeeeb]">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#144238] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#717975]">
                    <Calendar className="w-3.5 h-3.5 text-[#144238]" />
                    <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h2 className="font-serif text-lg font-bold text-[#144238] line-clamp-2 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-[#404846] leading-relaxed line-clamp-3">{item.excerpt}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#f4f3f0] mt-3">
                <Link
                  to={`/news/${item.slug}`}
                  className="w-full h-10 mt-3 rounded-lg bg-[#efeeeb] hover:bg-[#144238] hover:text-white text-[#144238] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                >
                  <span>Read Full Article</span>
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
