import React, { useState, useEffect } from 'react';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { Image, MapPin, Calendar, X, ZoomIn } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  const categories = ['all', 'Clean Water', 'Livelihood & Agriculture', 'Emergency Relief', 'Education Support'];

  useEffect(() => {
    fetchGallery();
  }, [category]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const url = category === 'all' ? '/gallery' : `/gallery?category=${encodeURIComponent(category)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <SEOHead
        title="Field Photography Archives & Photojournalism"
        description="High-resolution documentary photography capturing clean water well installations, rapid emergency relief distributions, and community cooperatives."
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Image className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Visual Documentation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Field Photography Archives
        </h1>
        <p className="text-sm sm:text-base text-[#404846]">
          Documentary photojournalism from our frontline missions, honoring communal resilience and transformative hope.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              category === c ? 'bg-[#144238] text-white shadow-xs' : 'bg-[#efeeeb] text-[#404846] hover:bg-[#e3e2e0]'
            }`}
          >
            {c === 'all' ? 'All Archives' : c}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Curating photo archives..." />
      ) : items.length === 0 ? (
        <EmptyState title="No images in this category" description="Select another category to view field archives." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id || item.id}
              onClick={() => setLightboxItem(item)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#144238]/10 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#efeeeb]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#144238] flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#144238] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <h3 className="font-serif text-base font-bold text-[#144238] line-clamp-1">{item.title}</h3>
                <p className="text-xs text-[#717975] line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-[11px] text-[#717975] pt-1">
                  {item.location && (
                    <span className="flex items-center gap-1 text-[#D97724] font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </span>
                  )}
                  {item.year && <span>{item.year}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setLightboxItem(null)}></div>
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-black overflow-hidden flex items-center justify-center">
              <img src={lightboxItem.image} alt={lightboxItem.title} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="p-6 space-y-2 bg-[#faf9f6]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#144238] text-white text-[10px] font-bold uppercase tracking-wider">
                  {lightboxItem.category}
                </span>
                {lightboxItem.location && (
                  <span className="text-xs text-[#717975] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D97724]" />
                    <span>{lightboxItem.location}</span>
                  </span>
                )}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#144238]">{lightboxItem.title}</h2>
              <p className="text-sm text-[#404846] leading-relaxed">{lightboxItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
