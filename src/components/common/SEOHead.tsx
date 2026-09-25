import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Imaan Relief & Development Foundation is an independent humanitarian organization bridging emergency relief and sustainable development.',
  ogImage,
}) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Imaan Relief & Development Foundation`
      : 'Imaan Relief & Development Foundation | Humanitarian Aid & Sustainable Development';
    document.title = fullTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    if (ogImage) {
      let ogImgMeta = document.querySelector('meta[property="og:image"]');
      if (!ogImgMeta) {
        ogImgMeta = document.createElement('meta');
        ogImgMeta.setAttribute('property', 'og:image');
        document.head.appendChild(ogImgMeta);
      }
      ogImgMeta.setAttribute('content', ogImage);
    }
  }, [title, description, ogImage]);

  return null;
};
