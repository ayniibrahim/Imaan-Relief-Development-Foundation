import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'An unexpected network error occurred while contacting the server.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-6 text-center bg-[#ffdad6]/20 border border-[#ba1a1a]/20 rounded-2xl max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-xl bg-white text-[#ba1a1a] shadow-sm flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-[#1a1c1a]">{title}</h3>
      <p className="mt-1 text-sm text-[#ba1a1a] max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#144238] text-white text-xs font-semibold rounded-lg hover:bg-[#1a5346] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
