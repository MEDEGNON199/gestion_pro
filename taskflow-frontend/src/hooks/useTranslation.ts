import { useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';

type TranslationKey = string;
type Translations = typeof enTranslations;

// Helper function to get nested object value by dot notation
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

// Helper function to replace placeholders in translation strings
function replacePlaceholders(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }, text);
}

export function useTranslation() {
  const [locale, setLocale] = useState<string>('en');
  const [translations, setTranslations] = useState<Translations>(enTranslations);

  // Load translations based on locale
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        switch (locale) {
          case 'en':
          default:
            setTranslations(enTranslations);
            break;
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        setTranslations(enTranslations); // Fallback to English
      }
    };

    loadTranslations();
  }, [locale]);

  // Translation function
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations, key);
    return replacePlaceholders(translation, params);
  };

  // Change language function
  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('taskflow-locale', newLocale);
  };

  // Initialize locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('taskflow-locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  return {
    t,
    locale,
    changeLanguage,
    translations
  };
}

// Export types for TypeScript support
export type { TranslationKey, Translations };