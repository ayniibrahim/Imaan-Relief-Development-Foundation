import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { BottomNav } from './BottomNav.tsx';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1a1c1a]">
      <Header />
      <main className="flex-1 pt-24 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};
