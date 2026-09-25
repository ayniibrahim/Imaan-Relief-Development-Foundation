import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.ts';

export interface WebsiteSettingsData {
  organizationName: string;
  tagline: string;
  logo: string;
  mission: string;
  vision: string;
  description: string;
  values?: { title: string; description: string; icon?: string }[];
  email: string;
  phone: string;
  emergencyHotline?: string;
  address: string;
  officeHours: string;
  charityRegistrationNumber: string;
  taxStatus: string;
  socialLinks?: Record<string, string>;
  impactStatistics: {
    individualsAssisted: string;
    solarWellsInstalled: string;
    activeRegions: string;
    directProgramRatio: string;
    lastAuditedYear: string;
  };
  homepageContent: {
    heroHeadline: string;
    heroSubheadline: string;
    criticalAppealTitle: string;
    criticalAppealGoal: number;
    criticalAppealRaised: number;
    stewardshipText: string;
  };
}

interface SettingsContextType {
  settings: WebsiteSettingsData | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load website settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
