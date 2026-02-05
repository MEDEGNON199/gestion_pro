import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationKey } from '../hooks/useTranslation';

interface TranslationContextType {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  locale: string;
  changeLanguage: (locale: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const translation = useTranslation();

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useT = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useT must be used within a TranslationProvider');
  }
  return context;
};

// Export the context for direct access if needed
export { TranslationContext };