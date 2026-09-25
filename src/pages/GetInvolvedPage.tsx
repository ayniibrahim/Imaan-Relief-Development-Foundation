import React, { useState } from 'react';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { Handshake, Heart, Send, CheckCircle2, AlertCircle, Upload, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GetInvolvedPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    skills: '',
    education: '',
    experience: '',
    availability: 'Part-time (5-10 hrs/week)',
    interests: [] as string[],
    message: '',
    cvUrl: '',
  });

  const [uploadingCv, setUploadingCv] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const interestOptions = [
    'Emergency Logistics & Relief',
    'Water & Environmental Engineering',
    'Child Nutrition & Schooling',
    'Medical & Health Outreach',
    'Fundraising & Donor Care',
    'Media, Photography & Storytelling',
  ];

  const handleInterestToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== item) : [...prev.interests, item],
      };
    });
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingCv(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, cvUrl: res.data.url }));
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessResponse(null);

    try {
      const res = await api.post('/volunteers', formData);
      if (res.data.success) {
        setSuccessResponse(res.data.message || 'Volunteer application received successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          skills: '',
          education: '',
          experience: '',
          availability: 'Part-time (5-10 hrs/week)',
          interests: [],
          message: '',
          cvUrl: '',
        });
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      <SEOHead
        title="Get Involved • Volunteer, Partner & Advocate"
        description="Join our global humanitarian missions through volunteer service, institutional alliances, and grassroots advocacy."
      />

      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#144238]/10 text-[#144238] text-xs font-bold uppercase tracking-wider">
          <Handshake className="w-3.5 h-3.5 text-[#D97724]" />
          <span>Solidarity in Action</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#144238]">
          Join Our Mission to Restore Dignity
        </h1>
        <p className="text-sm sm:text-base text-[#404846] leading-relaxed">
          Whether you are a medical professional, hydraulic technician, student organizer, or institutional partner,
          your talents directly uplift communities in crisis.
        </p>
      </div>

      {/* Main Grid: Volunteer Form + Ways to Engage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Volunteer Application Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#144238]/10 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#144238]">Global Volunteer Application</h2>
            <p className="text-xs sm:text-sm text-[#717975]">
              Applications are reviewed by regional volunteer coordinators. All data is securely processed.
            </p>
          </div>

          {successResponse && (
            <div className="p-5 rounded-2xl bg-[#144238]/10 border border-[#144238]/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#144238] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-sm font-bold text-[#144238]">Application Received</span>
                <p className="text-xs text-[#144238]/90 leading-relaxed">{successResponse}</p>
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
                  Full Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Amina Hassan"
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
                  placeholder="amina@example.org"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                  Phone Number <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                  City & Country <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. London, UK or Nairobi, Kenya"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Key Skills / Profession</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Nurse, Hydrogeologist, Translator"
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full h-11 px-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
                >
                  <option>Part-time (2-5 hrs/week)</option>
                  <option>Part-time (5-10 hrs/week)</option>
                  <option>Full-time deployment / missions</option>
                  <option>On-call during acute emergencies</option>
                </select>
              </div>
            </div>

            {/* Interest checkboxes */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Areas of Interest</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {interestOptions.map((opt) => {
                  const selected = formData.interests.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleInterestToggle(opt)}
                      className={`text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        selected
                          ? 'bg-[#144238] text-white border-[#144238]'
                          : 'bg-[#f4f3f0] text-[#404846] border-transparent hover:bg-[#efeeeb]'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${selected ? 'bg-white text-[#144238]' : 'border-[#717975]'}`}>
                        {selected && '✓'}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">
                Why do you want to join Imaan Foundation? <span className="text-[#ba1a1a]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your motivation, relevant experience, or how you would like to contribute..."
                className="w-full p-3 bg-[#f4f3f0] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#144238]"
              ></textarea>
            </div>

            {/* CV Upload */}
            <div className="p-4 rounded-2xl bg-[#f4f3f0] space-y-2 border border-[#c0c8c4]/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Attach Resume / CV (Optional)</span>
                {uploadingCv && <span className="text-xs text-[#D97724] font-medium animate-pulse">Uploading file...</span>}
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                disabled={uploadingCv}
                className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#144238] file:text-white hover:file:bg-[#1a5346]"
              />
              {formData.cvUrl && (
                <p className="text-xs text-[#4E7D6B] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resume uploaded successfully</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-[#144238] hover:bg-[#1a5346] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Submit Volunteer Application'}</span>
            </button>
          </form>
        </div>

        {/* Right: Alternative Ways to Get Involved */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#144238] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
            <h3 className="font-serif text-2xl font-bold">Institutional Alliances</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              We collaborate with family trusts, diaspora councils, corporate philanthropic funds, and international NGOs
              seeking verifiable, zero-waste field delivery.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#ffdcc6]" />
                <span>Custom co-funding frameworks</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#ffdcc6]" />
                <span>Bespoke quarterly audit reports</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#ffdcc6]" />
                <span>Dedicated field mission briefings</span>
              </div>
            </div>
            <Link
              to="/contact?subject=Institutional+Partnership"
              className="inline-block mt-2 px-5 py-2.5 bg-white text-[#144238] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/90 transition-colors"
            >
              Inquire for Partnership
            </Link>
          </div>

          <div className="bg-[#f4f3f0] p-6 sm:p-8 rounded-3xl border border-[#144238]/10 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#144238]">Grassroots Advocacy</h3>
            <p className="text-xs sm:text-sm text-[#404846] leading-relaxed">
              Host a clean water awareness night, university panel, or community fundraising banquet with our curated
              speaker kits and documentary screenings.
            </p>
            <Link
              to="/contact?subject=Advocacy+Kit+Request"
              className="text-xs font-bold text-[#D97724] hover:underline flex items-center gap-1"
            >
              <span>Request Community Advocacy Kit →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
