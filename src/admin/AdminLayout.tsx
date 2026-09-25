import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Logo } from '../components/common/Logo.tsx';
import {
  LayoutDashboard,
  Grid,
  Handshake,
  Newspaper,
  BookOpen,
  Calendar,
  Image,
  Users,
  UserCheck,
  Heart,
  Mail,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Programs', path: '/admin/programs', icon: Grid },
    { name: 'Projects', path: '/admin/projects', icon: Handshake },
    { name: 'News', path: '/admin/news', icon: Newspaper },
    { name: 'Stories', path: '/admin/stories', icon: BookOpen },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Team', path: '/admin/team', icon: Users },
    { name: 'Volunteers', path: '/admin/volunteers', icon: UserCheck },
    { name: 'Donations', path: '/admin/donations', icon: Heart },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
    ...(user?.role === 'super_admin' ? [{ name: 'Users', path: '/admin/users', icon: UserCog }] : []),
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f3f0] text-[#1a1c1a]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#144238]/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#144238] text-white flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center">
              <Logo variant="dark" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#D97724] text-white shadow-xs font-bold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar User & Logout */}
          <div className="p-4 border-t border-white/10 bg-black/15 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold truncate text-white">{user?.name}</span>
                <span className="inline-block px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono text-[#ffdcc6] uppercase">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-[#ba1a1a] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#c0c8c4]/30 px-4 sm:px-8 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#144238] rounded-lg hover:bg-[#f4f3f0]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-serif text-lg font-bold text-[#144238] hidden sm:block">
              Operations & Governance Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] rounded-lg text-xs font-bold transition-colors"
            >
              <span>Live Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 border-l border-[#c0c8c4]/40 pl-4 text-xs font-medium text-[#717975]">
              <Shield className="w-4 h-4 text-[#144238]" />
              <span className="hidden md:inline">Audit Trail Active</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
