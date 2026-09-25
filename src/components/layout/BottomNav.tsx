import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, BarChart3, BookOpen } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Programs', path: '/programs', icon: Grid },
    { name: 'Donate', path: '/donate', isAction: true },
    { name: 'Impact', path: '/impact', icon: BarChart3 },
    { name: 'Stories', path: '/stories', icon: BookOpen },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf9f6]/95 backdrop-blur-xl border-t border-[#144238]/10 shadow-[0_-2px_12px_rgba(20,66,56,0.06)] pb-safe">
      <div className="flex justify-around items-center h-16 px-2 relative">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <div key="donate-button" className="relative -top-3">
                <Link
                  to="/donate"
                  className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#D97724] text-white shadow-[0_4px_14px_rgba(217,119,36,0.4)] active:scale-95 transition-transform"
                >
                  <Heart className="w-6 h-6 fill-white" />
                  <span className="text-[10px] font-bold tracking-tight uppercase leading-none mt-0.5">Give</span>
                </Link>
              </div>
            );
          }

          const Icon = tab.icon!;
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors ${
                isActive ? 'text-[#144238] font-bold' : 'text-[#717975] hover:text-[#144238]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium leading-none">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
