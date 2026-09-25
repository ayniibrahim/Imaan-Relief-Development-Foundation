import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'light', className = 'h-9', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Vector Emblem matching Imaan Foundation Insignia */}
      <div className="relative w-8 h-8 rounded-full bg-[#144238]/10 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="19" fill="#144238" fillOpacity="0.08" />
          <path
            d="M20 6C14 6 10 11 10 18C10 24.5 14.5 29.5 21 29.5C26.5 29.5 30 25.5 30 20C30 14 26 9 20 6ZM20 25.5C16.5 25.5 14 22.5 14 18C14 13.5 16.5 10 20 10C21.5 10 23.5 11 24.5 13C22 14.5 20.5 17 20.5 20C20.5 22.5 21.5 24.5 23 25.5C22 25.5 21 25.5 20 25.5Z"
            fill="#144238"
          />
          <circle cx="24.5" cy="15.5" r="2.5" fill="#D97724" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-serif text-[17px] font-bold tracking-tight leading-tight ${variant === 'dark' ? 'text-white' : 'text-[#144238]'}`}>
              IMAAN
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#D97724]">
              RELIEF & DEV
            </span>
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-semibold leading-none ${variant === 'dark' ? 'text-white/60' : 'text-[#717975]'}`}>
            FOUNDATION
          </span>
        </div>
      )}
    </div>
  );
};
