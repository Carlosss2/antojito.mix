import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useSettings } from '../hooks/useDatabase';
import type { AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings | null;
  updateSettings: (changes: Partial<AppSettings>) => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { settings, updateSettings } = useSettings();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (settings) {
      const resolvedTheme = settings.theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.theme;
      setTheme(resolvedTheme);
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    }
  }, [settings]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    updateSettings({ theme: newTheme });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      theme,
      toggleTheme,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};