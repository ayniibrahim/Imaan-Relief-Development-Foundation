import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';
import { ShieldCheck, Award, Heart, CheckCircle2, Mail, ArrowRight, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f4f3f0] border-t border-[#144238]/10 pt-16 pb-24 md:pb-12 text-[#404846]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-[#717975] max-w-md">
              {settings?.description ||
                'Grounded empathy, verified stewardship, and sustainable humanitarian aid for human dignity worldwide. We bridge emergency relief with permanent solar water boreholes and community self-reliance.'}
            </p>
            <div className="pt-2 text-xs text-[#717975] space-y-1">
              <p>
                <strong className="text-[#1a1c1a]">Headquarters:</strong>{' '}
                {settings?.address || '742 Global Humanitarian Plaza, Suite 400, New York, NY 10017'}
              </p>
              <p>
                <strong className="text-[#1a1c1a]">Emergency Hotline:</strong>{' '}
                {settings?.emergencyHotline || '+1 (800) 911-3320'}
              </p>
              <p>
                <strong className="text-[#1a1c1a]">Charity Registration:</strong>{' '}
                {settings?.charityRegistrationNumber || 'IRDF-883921'} • 501(c)(3) Public Charity
              </p>
            </div>
          </div>

          {/* Programs Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#144238]">Development Pillars</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/programs/clean-water-solar-infrastructure" className="hover:text-[#144238] transition-colors">
                  Clean Water & Solar Hubs
                </Link>
              </li>
              <li>
                <Link to="/programs/rapid-emergency-crisis-response" className="hover:text-[#144238] transition-colors">
                  Emergency Disaster Relief
                </Link>
              </li>
              <li>
                <Link to="/programs/sustainable-livelihood-agriculture" className="hover:text-[#144238] transition-colors">
                  Agro-Livelihoods & Microgrants
                </Link>
              </li>
              <li>
                <Link to="/programs/child-dignity-education-continuity" className="hover:text-[#144238] transition-colors">
                  Child Protection & Schooling
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-[#D97724] font-semibold flex items-center gap-1 hover:underline">
                  <span>All Programs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#144238]">Governance & Impact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#144238] transition-colors">
                  Who We Are & Trustees
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-[#144238] transition-colors">
                  Audited Direct Impact
                </Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-[#144238] transition-colors">
                  Documentary Field Stories
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#144238] transition-colors">
                  Press & Emergency Bulletins
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#144238] transition-colors">
                  Symposiums & Galas
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#144238] transition-colors">
                  Field Photo Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#144238]">Field Mission Dispatch</h4>
            <p className="text-xs text-[#717975] leading-relaxed">
              Receive monthly GPS-verified milestone completions, impact disclosures, and emergency mobilization alerts.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-lg bg-[#144238]/10 text-[#144238] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#144238]" />
                <span>Thank you. You are enrolled in direct dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    placeholder="Enter donor email"
                    className="w-full h-10 px-3 pr-9 rounded-lg bg-white border border-[#c0c8c4]/60 text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                  />
                  <Mail className="w-4 h-4 text-[#717975] absolute right-3 top-3 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="w-full h-9 bg-[#144238] hover:bg-[#1a5346] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Institutional Accreditation Ribbons */}
        <div className="pt-6 border-t border-[#efeeeb] flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#c0c8c4]/40 text-xs font-semibold text-[#144238]">
            <Award className="w-4 h-4 text-[#D97724]" />
            <span>UN ECOSOC Special Consultative Status</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#c0c8c4]/40 text-xs font-semibold text-[#144238]">
            <ShieldCheck className="w-4 h-4 text-[#144238]" />
            <span>100% Zakat Direct Compliance Certified</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#c0c8c4]/40 text-xs font-semibold text-[#144238]">
            <CheckCircle2 className="w-4 h-4 text-[#4E7D6B]" />
            <span>Registered 501(c)(3) Humanitarian Organization</span>
          </div>
        </div>

        {/* Bottom Legal & Administrative Bar */}
        <div className="pt-4 border-t border-[#efeeeb] flex flex-col sm:flex-row items-center justify-between text-xs text-[#717975] gap-4">
          <p>© {new Date().getFullYear()} Imaan Relief & Development Foundation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#144238]">
              Stewardship & Governance
            </Link>
            <span>•</span>
            <Link to="/impact" className="hover:text-[#144238]">
              Financial Audits
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#144238]">
              Donor Care
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="text-[#144238] font-bold flex items-center gap-1 hover:underline">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
