import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Global cache for translations
const translationCache: Record<string, string> = {};

export function useContentTranslation() {
  const { language } = useLanguage();

  const translateContent = useCallback(async (
    content: string,
    title: string,
    cardId: string
  ): Promise<string> => {
    const cacheKey = `${cardId}-${language}`;
    
    // Check cache first
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: { 
          content, 
          title,
          targetLanguage: language 
        },
      });

      if (error) {
        console.error('Translation error:', error);
        return content; // Return original on error
      }

      if (data?.success && data.translatedContent) {
        // Cache the result
        translationCache[cacheKey] = data.translatedContent;
        return data.translatedContent;
      }

      return content;
    } catch (err) {
      console.error('Translation failed:', err);
      return content;
    }
  }, [language]);

  return { translateContent, language };
}

// Hook for translating summary with automatic translation on mount
export function useSummaryTranslation(
  summary: string,
  title: string,
  cardId: string,
  isActive: boolean
) {
  const { language } = useLanguage();
  const [translatedSummary, setTranslatedSummary] = useState<string>(summary);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    
    const cacheKey = `summary-${cardId}-${language}`;
    
    // Check cache first
    if (translationCache[cacheKey]) {
      setTranslatedSummary(translationCache[cacheKey]);
      return;
    }

    // Only translate if not already in progress
    if (isTranslating) return;

    const translateSummary = async () => {
      setIsTranslating(true);
      try {
        const { data, error } = await supabase.functions.invoke('translate-content', {
          body: { 
            content: summary, 
            title,
            targetLanguage: language 
          },
        });

        if (!error && data?.success && data.translatedContent) {
          // Cache and set
          translationCache[cacheKey] = data.translatedContent;
          setTranslatedSummary(data.translatedContent);
        }
      } catch (err) {
        console.error('Summary translation failed:', err);
      } finally {
        setIsTranslating(false);
      }
    };

    translateSummary();
  }, [summary, title, cardId, language, isActive, isTranslating]);

  return { translatedSummary, isTranslating };
}
