import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import {
  ShieldCheck,
  Heart,
  Droplet,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Gift,
  FileCheck,
  HelpCircle,
  Copy,
  ArrowRight,
} from 'lucide-react';

export const DonatePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [frequency, setFrequency] = useState<'One-time' | 'Monthly'>(
    searchParams.get('frequency') === 'monthly' ? 'Monthly' : 'Monthly'
  );
  const [purpose, setPurpose] = useState<string>(
    searchParams.get('purpose') || 'Where Needed Most (Emergency & Core Programs)'
  );
  const [baseAmount, setBaseAmount] = useState<number>(
    parseFloat(searchParams.get('amount') || '75')
  );
  const [customAmount, setCustomAmount] = useState<string>('');
  const [coverFee, setCoverFee] = useState<boolean>(true);
  const [dedicate, setDedicate] = useState<boolean>(false);
  const [dedicationDetails, setDedicationDetails] = useState({
    honoreeName: '',
    recipientEmail: '',
    message: '',
  });

  // Donor credentials
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Processing state & Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [donationReceipt, setDonationReceipt] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const presetTiers = [
    { amount: 35, desc: 'Emergency hygiene & pure water filtration for 1 family' },
    { amount: 75, desc: 'Essential monthly nutrition & food basket for a household' },
    { amount: 150, desc: 'School kits, uniforms & pediatric healthcare for 3 youth' },
    { amount: 300, desc: 'Solar well drilling shares & permanent community tap access' },
  ];

  const calculatedFee = coverFee ? parseFloat((baseAmount * 0.025).toFixed(2)) : 0;
  const totalAmount = parseFloat((baseAmount + calculatedFee).toFixed(2));

  const handleSelectPreset = (amount: number) => {
    setBaseAmount(amount);
    setCustomAmount('');
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCustomAmount(e.target.value);
    if (!isNaN(val) && val > 0) {
      setBaseAmount(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !email) {
      setErrorMessage('Please enter your donor name and valid receipt email.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        donorName,
        email,
        phone,
        amount: baseAmount,
        currency: 'USD',
        frequency,
        purpose,
        paymentMethod: 'Card (Encrypted Stripe Intent)',
        coverFees: coverFee,
        feeAmount: calculatedFee,
        totalCharged: totalAmount,
        dedication: dedicate ? dedicationDetails : undefined,
      };

      const res = await api.post('/donations', payload);
      if (res.data.success) {
        setDonationReceipt(res.data.data);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to register donation. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRef = () => {
    if (donationReceipt?.transactionReference) {
      navigator.clipboard.writeText(donationReceipt.transactionReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-8">
      <SEOHead
        title="Direct Support & Zakat Giving Portal"
        description="Designate your contribution to clean water boreholes, emergency survival baskets, and female farming cooperatives with 100% Zakat compliance."
      />

      {/* Visual Hero Banner with Reassurance Badges */}
      <div className="relative rounded-3xl overflow-hidden bg-[#144238] text-white shadow-lg">
        <div className="relative h-56 sm:h-72 w-full overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn1ou55aTq-2TWWMYAYJpB06K4mXT9uo-4rBEZ0FclVSAkVoKCl4sdnu0NL-MQcvLW8hILHGXD2inmsaQ0YPxWcBRK94ELuDDDTQfmyTpm8ur-UyJUmlwXhbliCsp-MEMGjkXiRSeei7Hbq9s5LAqtDOcSHx24Vja0qb7TXY5RaKVYShdMUp_WN9zaMhsqfuBQBYuKr1G6M5fxM6G2HNfWMhhdZ_kFiTJNvABq-fEcbqZEaujHL1hK"
            alt="East African village community rejoicing with fresh water from newly drilled well"
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#144238] via-[#144238]/40 to-transparent"></div>

          {/* Floating Pill Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#144238] text-xs font-bold shadow-sm pointer-events-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D97724]" />
              <span>100% Transparent Aid</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#144238]/80 backdrop-blur-md text-white text-xs font-bold">
              <FileCheck className="w-3.5 h-3.5 text-[#ffdcc6]" />
              <span>Tax Deductible 501(c)(3)</span>
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 space-y-1">
            <p className="text-xs uppercase font-bold tracking-widest text-[#ffdcc6]">Dignity • Resilience • Relief</p>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight drop-shadow-sm">
              Your Gift Empowers Communities with Dignity & Hope
            </h1>
          </div>
        </div>
      </div>

      {/* Trust Indicator Ribbon */}
      <div className="bg-white rounded-2xl p-4 flex items-center justify-around text-center border border-[#144238]/10 shadow-xs">
        <div>
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#144238]">94.2%</span>
          <span className="block text-[11px] font-semibold text-[#717975]">Direct Program Aid</span>
        </div>
        <div className="w-px h-8 bg-[#c0c8c4]/40"></div>
        <div>
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#144238]">Annual</span>
          <span className="block text-[11px] font-semibold text-[#717975]">Audited Books</span>
        </div>
        <div className="w-px h-8 bg-[#c0c8c4]/40"></div>
        <div>
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#144238]">1.2M+</span>
          <span className="block text-[11px] font-semibold text-[#717975]">Lives Sustained</span>
        </div>
      </div>

      {/* Main Donation Container OR Receipt */}
      {donationReceipt ? (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#144238]/15 shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#144238]/10 text-[#144238] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#144238]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97724]">Official Charitable Receipt</span>
            <h2 className="font-serif text-3xl font-bold text-[#144238]">Thank You, {donationReceipt.donorName}</h2>
            <p className="text-sm text-[#404846] max-w-md mx-auto leading-relaxed">
              Your commitment to human dignity has been registered. An official tax-deductible disclosure has been dispatched to{' '}
              <strong>{donationReceipt.email}</strong>.
            </p>
          </div>

          <div className="bg-[#f4f3f0] p-6 rounded-2xl max-w-lg mx-auto text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#efeeeb]">
              <span className="text-[#717975]">Transaction Reference:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-[#144238]">
                <span>{donationReceipt.transactionReference}</span>
                <button
                  type="button"
                  onClick={copyRef}
                  className="p-1 hover:bg-[#e3e2e0] rounded text-[#717975]"
                  title="Copy reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {copied && <p className="text-[11px] text-[#4E7D6B] font-semibold text-right">Reference copied!</p>}

            <div className="flex justify-between">
              <span className="text-[#717975]">Gift Amount:</span>
              <span className="font-bold text-[#1a1c1a]">
                ${donationReceipt.amount.toFixed(2)} USD ({donationReceipt.frequency})
              </span>
            </div>

            {donationReceipt.coverFees && (
              <div className="flex justify-between">
                <span className="text-[#717975]">Processing Fee Covered:</span>
                <span className="font-bold text-[#4E7D6B]">+${donationReceipt.feeAmount?.toFixed(2)} USD</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-[#efeeeb] text-sm">
              <span className="font-bold text-[#144238]">Total Registered:</span>
              <span className="font-serif text-lg font-bold text-[#144238]">
                ${donationReceipt.totalCharged?.toFixed(2)} USD
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#717975]">Designated Fund:</span>
              <span className="font-medium text-[#1a1c1a] text-right">{donationReceipt.purpose}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#717975]">Status:</span>
              <span className="px-2 py-0.5 rounded bg-[#4E7D6B]/15 text-[#144238] font-bold text-[11px]">
                {donationReceipt.paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setDonationReceipt(null)}
              className="px-6 py-3 rounded-xl bg-[#144238] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1a5346] transition-colors"
            >
              Make Another Donation
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Giving Frequency Switcher */}
          <div className="bg-[#efeeeb] p-1.5 rounded-2xl flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setFrequency('One-time')}
              className={`flex-1 py-3 rounded-xl text-center text-xs sm:text-sm font-bold transition-all ${
                frequency === 'One-time'
                  ? 'bg-white text-[#144238] shadow-sm'
                  : 'text-[#717975] hover:text-[#1a1c1a]'
              }`}
            >
              One-Time Gift
            </button>
            <button
              type="button"
              onClick={() => setFrequency('Monthly')}
              className={`flex-1 py-3 rounded-xl text-center text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                frequency === 'Monthly'
                  ? 'bg-white text-[#144238] shadow-sm'
                  : 'text-[#717975] hover:text-[#1a1c1a]'
              }`}
            >
              <span>Monthly Sustainer</span>
              <span className="bg-[#ffdcc6] text-[#954a00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Most Impact
              </span>
            </button>
          </div>

          {/* Fund Allocation Selector */}
          <div className="bg-white rounded-2xl p-5 border border-[#144238]/10 shadow-xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a] flex items-center justify-between">
              <span>Direct Your Support</span>
              <span className="text-[11px] text-[#D97724] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Allocation
              </span>
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full h-12 px-3 bg-[#f4f3f0] rounded-xl text-sm text-[#1a1c1a] font-medium focus:outline-none focus:ring-1 focus:ring-[#144238]"
            >
              <option value="Where Needed Most (Emergency & Core Programs)">
                Where Needed Most (Emergency & Core Programs)
              </option>
              <option value="Clean Water & Solar Boreholes Fund">Clean Water & Solar Boreholes Fund</option>
              <option value="Emergency Relief & Rapid Crisis Fund">Emergency Relief & Rapid Crisis Fund</option>
              <option value="Livelihood & Food Sovereignty Initiative">Livelihood & Food Sovereignty Initiative</option>
              <option value="Orphan & Vulnerable Family Sustenance">Orphan & Vulnerable Family Sustenance</option>
            </select>
          </div>

          {/* Giving Amount Tiers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif text-lg font-bold text-[#144238]">Choose Giving Amount</h3>
              <span className="text-xs text-[#717975] uppercase font-bold tracking-wider">USD ($)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presetTiers.map((tier) => {
                const isSelected = baseAmount === tier.amount && !customAmount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => handleSelectPreset(tier.amount)}
                    className={`p-4 rounded-2xl text-left flex flex-col justify-between transition-all border ${
                      isSelected
                        ? 'bg-[#144238] text-white border-[#144238] shadow-md'
                        : 'bg-white text-[#1a1c1a] border-[#144238]/10 hover:border-[#144238]/30 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-2xl font-bold">${tier.amount}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${isSelected ? 'bg-[#ffdcc6] border-[#ffdcc6]' : 'border-[#717975]'}`}></span>
                    </div>
                    <p className={`text-xs leading-snug line-clamp-2 ${isSelected ? 'text-white/80' : 'text-[#717975]'}`}>
                      {tier.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div className="bg-white p-4 rounded-2xl border border-[#144238]/10 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f4f3f0] flex items-center justify-center font-bold text-[#144238]">
                $
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#717975]">Other Custom Amount</label>
                <input
                  type="number"
                  min="5"
                  value={customAmount}
                  onChange={handleCustomInput}
                  placeholder="Enter custom USD"
                  className="w-full text-base font-bold text-[#144238] placeholder:text-[#c0c8c4] focus:outline-none"
                />
              </div>
              <span className="px-2.5 py-1 rounded bg-[#144238]/10 text-xs font-bold text-[#144238]">USD</span>
            </div>
          </div>

          {/* Immediate Field Echo */}
          <div className="bg-[#f4f3f0] p-4 rounded-2xl flex items-center gap-3.5 border border-[#144238]/10">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#efeeeb]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuCwBOMV7W8CvzhOiKav2BFNETJrqUFAWA3zty8lcyp0gnFSw9TZfLPEMDvyAqE9iUlX73yVuBQYO5-st3mIwgqmse01s9BSWGPWt-ekw-VIgzI5mlIFnr_ytQ1YQSRe-S79MyYHvUQOHuQdP_LBkwl9NWgpgFSrgnGdgnHbwjsYoXlpApzU5FIWM9K4jZcP3wQi1eg6g64g_R3HwDvDNF49P31MPc5s2I1L0SHpd4nIt1Y1Xv6HZt"
                alt="Turkana mother drinking fresh clean well water"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97724]">Direct Field Echo</span>
              <h4 className="font-serif text-sm font-bold text-[#144238]">Solar Deep Boreholes in Turkana</h4>
              <p className="text-xs text-[#404846] line-clamp-1 italic">
                "Our daughters walked 8km each day. Today, they are in class reading books."
              </p>
            </div>
          </div>

          {/* Gifting Add-ons & Customization */}
          <div className="bg-white rounded-2xl p-5 border border-[#144238]/10 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Gift Customization</h4>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={coverFee}
                onChange={(e) => setCoverFee(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#144238] focus:ring-[#144238] accent-[#144238]"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#1a1c1a]">
                  Cover the 2.5% transaction cost (+${calculatedFee.toFixed(2)})
                </span>
                <p className="text-[#717975]">Ensures 100% of your primary donation reaches frontline field aid directly.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dedicate}
                onChange={(e) => setDedicate(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#144238] focus:ring-[#144238] accent-[#144238]"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-[#1a1c1a]">Dedicate this gift in honor or memory of someone</span>
                <p className="text-[#717975]">We will send a personalized notification card to your honoree.</p>
              </div>
            </label>

            {dedicate && (
              <div className="p-4 rounded-xl bg-[#f4f3f0] space-y-3 pt-3">
                <input
                  type="text"
                  placeholder="Honoree Full Name (e.g. Maryam & Omar)"
                  value={dedicationDetails.honoreeName}
                  onChange={(e) => setDedicationDetails({ ...dedicationDetails, honoreeName: e.target.value })}
                  className="w-full h-10 px-3 bg-white rounded-lg text-xs focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Recipient Email for Digital Certificate (Optional)"
                  value={dedicationDetails.recipientEmail}
                  onChange={(e) => setDedicationDetails({ ...dedicationDetails, recipientEmail: e.target.value })}
                  className="w-full h-10 px-3 bg-white rounded-lg text-xs focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Donor Information */}
          <div className="bg-white rounded-2xl p-5 border border-[#144238]/10 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1a]">Donor & Card Details</h4>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-[#ffdad6]/40 text-[#ba1a1a] text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#717975]">Donor Full Name *</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Full name as printed on card"
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#717975]">Receipt Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.org"
                  className="w-full h-10 px-3 bg-[#f4f3f0] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#144238]"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#717975]">Encrypted Card Details</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="4242 •••• •••• 4242"
                  className="w-full h-10 pl-3 pr-10 bg-[#f4f3f0] font-mono text-xs rounded-lg focus:outline-none"
                />
                <CreditCard className="w-4 h-4 text-[#717975] absolute right-3 top-3" />
              </div>
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#D97724] hover:bg-[#b86119] text-white font-serif text-lg font-bold shadow-lg shadow-[#D97724]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>
                {submitting
                  ? 'Processing Encrypted Contribution...'
                  : `Donate $${totalAmount.toFixed(2)} ${frequency === 'Monthly' ? 'Monthly' : 'Today'}`}
              </span>
            </button>

            {/* Accreditation Footer */}
            <div className="flex items-center justify-center gap-4 text-xs text-[#717975] pt-1">
              <span className="flex items-center gap-1 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#144238]" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#144238]" /> 501(c)(3) Tax Exempt
              </span>
              <span>•</span>
              <span>Reg #84-192048</span>
            </div>
          </div>
        </form>
      )}

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#144238]/10 shadow-xs space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#144238]">Frequently Asked Questions</h3>

        <div className="space-y-3">
          {[
            {
              q: 'Where does my money immediately go?',
              a: 'Your donation goes directly into emergency logistics, clean water borehole equipment, or community nourishment according to your selected fund. Over 94% of foundation expenditures support frontline programs directly.',
            },
            {
              q: 'Can I get an official tax-deductible receipt?',
              a: 'Yes. An official charitable tax receipt with our non-profit registration number is emailed immediately upon payment completion, and annual consolidated tax statements are sent each January.',
            },
            {
              q: 'How do monthly sustainer gifts work?',
              a: 'Monthly gifts are billed automatically on the same day each month. You can pause, adjust, or cancel your monthly pledge at any time with a single email to donor care.',
            },
            {
              q: 'How does the 100% Zakat Policy work?',
              a: 'Donors may designate gifts specifically to Zakat. All administrative overhead costs are underwritten exclusively by private endowment donors.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-[#efeeeb] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-[#144238] bg-[#f4f3f0]/50 hover:bg-[#f4f3f0] transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-[#404846] leading-relaxed border-t border-[#efeeeb]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
