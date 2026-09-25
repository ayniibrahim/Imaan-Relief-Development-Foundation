import React, { useState } from 'react';
import api from '../services/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Your inquiry has been logged with our secretariat.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to dispatch message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      <SEOHead
        title="Contact Secretariat & Global Offices"
        description="Reach out to Imaan Relief & Development Foundation for donor support, institutional alliances, or press inquiries."
      />

      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Donor Care & Secretariat</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Contact Our Secretariat
        </h1>
        <p className="text-sm sm:text-base text-[#404846]">
          We are dedicated to total transparency and open communications with donors, partners, and community members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#144238]/10 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#144238]">Send an Inquiry</h2>

          {successMessage && (
            <div className="p-4 rounded-xl bg-[#144238]/10 border border-[#144238]/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#144238] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-sm font-bold text-[#144238]">Inquiry Dispatched</span>
                <p className="text-xs text-[#144238]/90 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/30 text-xs text-[#ba1a1a] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                  Your Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Bilal Karim"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                  Email Address <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="bilal@example.org"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (800) 000-0000"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                  Subject <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Donation Allocation Inquiry"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                Message <span className="text-[#ba1a1a]">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message, partnership proposal, or questions here..."
                className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-[#144238] hover:bg-[#1a5346] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting...' : 'Send Message to Secretariat'}</span>
            </button>
          </form>
        </div>

        {/* Office Details Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#f4f3f0] p-6 rounded-3xl border border-[#144238]/10 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#144238]">Headquarters & Office Hours</h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#404846]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D97724] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#1a1c1a] block">Physical Office</span>
                  <p>{settings?.address || '742 Global Humanitarian Plaza, Suite 400, New York, NY 10017'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#efeeeb]">
                <Clock className="w-4 h-4 text-[#144238] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#1a1c1a] block">Office Hours</span>
                  <p>{settings?.officeHours || 'Monday - Friday: 8:30 AM - 5:30 PM EST'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#efeeeb]">
                <Phone className="w-4 h-4 text-[#144238] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#1a1c1a] block">General Telephone</span>
                  <p>{settings?.phone || '+1 (800) 412-4622'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#efeeeb]">
                <Mail className="w-4 h-4 text-[#144238] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#1a1c1a] block">Donor Correspondence</span>
                  <p>{settings?.email || 'info@imanrelief.org'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#144238] text-white p-6 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ffdcc6] uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" />
              <span>24/7 Field Disaster Hotline</span>
            </div>
            <p className="font-serif text-2xl font-bold">{settings?.emergencyHotline || '+1 (800) 911-3320'}</p>
            <p className="text-xs text-white/70">
              Reserved for regional logistics emergencies, acute convoy coordinates, and medical crisis alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
