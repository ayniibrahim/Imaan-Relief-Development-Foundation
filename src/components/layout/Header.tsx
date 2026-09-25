import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo.tsx';
import { Menu, X, ArrowRight, User as UserIcon, Heart, Shield, Award, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.tsx';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Projects', path: '/projects' },
    { name: 'Impact', path: '/impact' },
    { name: 'Stories', path: '/stories' },
    { name: 'News', path: '/news' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#144238]/10 shadow-[0_1px_8px_rgba(20,66,56,0.05)]">
        {/* Urgent Relief Banner */}
        <div className="bg-[#144238] text-white px-4 py-1.5 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[#D97724] animate-pulse flex-shrink-0"></span>
            <span className="uppercase tracking-wider font-bold text-[10px] text-[#D97724]">Urgent Relief:</span>
            <span className="truncate opacity-90 text-[11px] sm:text-xs">
              Emergency Gaza & Horn of Africa Nutrition & Water Drives Active
            </span>
          </div>
          <Link
            to="/donate"
            className="text-[#ffdcc6] font-bold hover:underline flex items-center gap-1 flex-shrink-0 ml-2 text-[11px] sm:text-xs"
          >
            <span>Give Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#144238] rounded-lg hover:bg-[#efeeeb] active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-[#144238] font-bold border-b-2 border-[#144238] pb-1' : 'text-[#404846] hover:text-[#144238]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/donate"
              className="h-10 px-4 bg-[#D97724] hover:bg-[#b86119] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(217,119,36,0.3)] active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Give</span>
            </Link>

            <Link
              to="/admin/login"
              title="Staff & Governance Portal"
              className="w-9 h-9 rounded-full bg-[#144238] hover:bg-[#1a5346] flex items-center justify-center text-white shadow-sm transition-colors"
            >
              <UserIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile & Tablet Drawer */}
      {isDrawerOpen && (
        <aside className="fixed inset-0 z-50 flex">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-[#144238]/50 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          ></div>

          {/* Drawer Menu Panel */}
          <div className="relative w-4/5 max-w-sm h-full bg-[#faf9f6] shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="h-16 px-5 border-b border-[#efeeeb] flex items-center justify-between">
              <Logo />
              <button
                onClick={closeDrawer}
                aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center text-[#717975] hover:text-[#144238] rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="mx-4 mt-4 p-3 rounded-xl bg-[#144238]/5 border border-[#144238]/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#144238] text-white flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#717975]">Field Emergency Support</span>
                <span className="text-xs font-bold text-[#144238]">{settings?.phone || '+1 (800) 412-4622'}</span>
              </div>
            </div>

            <div className="flex-1 px-4 py-4 space-y-1">
              <Link
                to="/"
                onClick={closeDrawer}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === '/' ? 'bg-[#144238] text-white' : 'text-[#1a1c1a] hover:bg-[#efeeeb]'
                }`}
              >
                <span>Home</span>
              </Link>

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeDrawer}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive ? 'bg-[#144238] text-white' : 'text-[#1a1c1a] hover:bg-[#efeeeb]'
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-2">
                <Link
                  to="/donate"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#D97724] text-white font-bold text-sm rounded-lg shadow-md"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Donate / Support</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer Accreditation */}
            <div className="p-4 border-t border-[#efeeeb] bg-[#f4f3f0] space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-[#717975]">
                <Shield className="w-3.5 h-3.5 text-[#144238]" />
                <span>100% Zakat Compliant • Reg #84-192048</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#717975]">
                <Award className="w-3.5 h-3.5 text-[#144238]" />
                <span>UN ECOSOC Special Consultative Status</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  onClick={closeDrawer}
                  className="text-xs font-semibold text-[#144238] hover:underline flex items-center gap-1"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Staff Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
