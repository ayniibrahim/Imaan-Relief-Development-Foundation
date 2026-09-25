import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There is currently no published data matching your criteria.',
  icon: Icon = FolderOpen,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-6 text-center bg-[#efeeeb]/50 rounded-2xl border border-[#c0c8c4]/40 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#144238] mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-[#1a1c1a]">{title}</h3>
      <p className="mt-1 text-sm text-[#717975] max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-[#144238] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1a5346] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
