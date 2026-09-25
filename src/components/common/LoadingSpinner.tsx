import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading humanitarian records...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative w-10 h-10 mb-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#144238]/20 border-t-[#144238] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#D97724]"></span>
        </div>
      </div>
      <p className="text-sm font-medium text-[#717975]">{message}</p>
    </div>
  );
};
