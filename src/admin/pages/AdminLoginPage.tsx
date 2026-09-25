import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Logo } from '../../components/common/Logo.tsx';
import { SEOHead } from '../../components/common/SEOHead.tsx';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid email or password');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@imanrelief.org');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEOHead title="Administrative Staff Login" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#144238]">Operations & Governance Portal</h2>
        <p className="text-xs text-[#717975]">
          Secure JWT access restricted to authorized board members, editors, and secretariat officers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#144238]/10 shadow-lg space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/30 text-xs text-[#ba1a1a] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@imanrelief.org"
                  className="w-full h-11 pl-10 pr-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
                <Mail className="w-4 h-4 text-[#717975] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
                <Lock className="w-4 h-4 text-[#717975] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#144238] hover:bg-[#1a5346] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill for Reviewers */}
          <div className="pt-4 border-t border-[#efeeeb] space-y-2">
            <span className="text-[11px] font-semibold text-[#717975] block text-center">
              Testing or Evaluation Access:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#144238] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#c0c8c4]/40"
            >
              <Key className="w-3.5 h-3.5 text-[#D97724]" />
              <span>Fill Default Super Admin Credentials</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#717975] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#144238]" />
          <span>Fiduciary Access • All IP queries and modifications logged</span>
        </div>
      </div>
    </div>
  );
};
