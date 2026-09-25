import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteSettings extends Document {
  organizationName: string;
  tagline: string;
  logo: string;
  logoDark?: string;
  favicon?: string;
  mission: string;
  vision: string;
  description: string;
  values: {
    title: string;
    description: string;
    icon?: string;
  }[];
  email: string;
  phone: string;
  emergencyHotline?: string;
  address: string;
  officeHours: string;
  charityRegistrationNumber: string;
  taxStatus: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  impactStatistics: {
    individualsAssisted: string;
    solarWellsInstalled: string;
    activeRegions: string;
    directProgramRatio: string;
    lastAuditedYear: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
  };
  homepageContent: {
    heroHeadline: string;
    heroSubheadline: string;
    criticalAppealTitle: string;
    criticalAppealGoal: number;
    criticalAppealRaised: number;
    stewardshipText: string;
  };
  updatedAt: Date;
}

const websiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    organizationName: {
      type: String,
      default: 'Imaan Relief & Development Foundation',
    },
    tagline: {
      type: String,
      default: 'Restoring Dignity, Building Resilient Communities',
    },
    logo: {
      type: String,
      default: 'https://lh3.googleusercontent.com/aida/AEtjO1WYIUFqbnG8NPRiRo32mNXeBRT2JS0ixtS30Tq5UaPMngNuQIO0f3uNFXrN9qBsXs1nLzs6nZTpTPu3BpJmsABW2s7Kgtsb2_HEDrvFmS7jFqDVdpmO9CBCpmlKxHB7zjydc19CKTP1iQ35MCs4FGS2aQZXADC4fZpIB2aQ-ZtuE0K0IWe0xFBoT97ExnXdw5XKMHjSmdxa08FFlEwnYywe780AMH_S98IcTkSMN2ml6PBEpy3YLs6Rzw',
    },
    logoDark: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    mission: {
      type: String,
      default: 'To provide principled, immediate emergency humanitarian relief and execute sustainable community-led development programs that restore dignity, nurture self-reliance, and transform vulnerable populations worldwide.',
    },
    vision: {
      type: String,
      default: 'A resilient world where every community has independent access to clean water, sustainable nourishment, protective education, and economic dignity regardless of race, creed, or geography.',
    },
    description: {
      type: String,
      default: 'Imaan Relief & Development Foundation is an independent non-profit humanitarian organization dedicated to bridging life-saving frontline relief with durable infrastructure and local capacity building.',
    },
    values: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    email: {
      type: String,
      default: 'info@imanrelief.org',
    },
    phone: {
      type: String,
      default: '+1 (800) 412-4622',
    },
    emergencyHotline: {
      type: String,
      default: '+1 (800) 911-3320',
    },
    address: {
      type: String,
      default: '742 Global Humanitarian Plaza, Suite 400, New York, NY 10017',
    },
    officeHours: {
      type: String,
      default: 'Monday - Friday: 8:30 AM - 5:30 PM EST',
    },
    charityRegistrationNumber: {
      type: String,
      default: 'IRDF-883921',
    },
    taxStatus: {
      type: String,
      default: '501(c)(3) Registered Public Charity • 100% Zakat Compliant',
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
    impactStatistics: {
      individualsAssisted: { type: String, default: '140,000+' },
      solarWellsInstalled: { type: String, default: '85+' },
      activeRegions: { type: String, default: '12' },
      directProgramRatio: { type: String, default: '91%' },
      lastAuditedYear: { type: String, default: '2024' },
    },
    seo: {
      metaTitle: { type: String, default: 'Imaan Relief & Development Foundation' },
      metaDescription: { type: String, default: 'Humanitarian relief and sustainable development platform featuring community programs, field projects, and impact tracking.' },
      keywords: { type: [String], default: ['humanitarian relief', 'clean water borehole', 'emergency aid', 'charity NGO'] },
      ogImage: String,
    },
    homepageContent: {
      heroHeadline: { type: String, default: 'Restoring Dignity, Building Resilient Communities' },
      heroSubheadline: { type: String, default: 'Bridging emergency humanitarian relief and long-term sustainable development across vulnerable regions worldwide.' },
      criticalAppealTitle: { type: String, default: 'East Africa Drought & Food Security Appeal' },
      criticalAppealGoal: { type: Number, default: 600000 },
      criticalAppealRaised: { type: Number, default: 420000 },
      stewardshipText: { type: String, default: 'We hold every penny in trust. Donors may designate their contribution to our 100% Zakat & Relief Direct Policy, where operational costs are underwritten exclusively by private endowment donors.' },
    },
  },
  {
    timestamps: true,
  }
);

export const WebsiteSettings = mongoose.models.WebsiteSettings || mongoose.model<IWebsiteSettings>('WebsiteSettings', websiteSettingsSchema);
