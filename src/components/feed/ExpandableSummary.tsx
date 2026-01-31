import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { NewsCard } from '@/types/news';
import { useContentTranslation } from '@/hooks/useContentTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
interface ExpandableSummaryProps {
  card: NewsCard;
  isActive?: boolean;
}
export const ExpandableSummary = ({
  card,
  isActive = true
}: ExpandableSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    translateContent
  } = useContentTranslation();
  const {
    t
  } = useLanguage();
  const handleExpand = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    setIsExpanded(true);

    // If we have full content and haven't translated yet
    if (card.fullContent && !translatedContent) {
      setIsLoading(true);
      try {
        const translated = await translateContent(card.fullContent, card.headline, card.id);
        setTranslatedContent(translated);
      } catch (err) {
        console.error('Translation failed:', err);
        setTranslatedContent(card.fullContent);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Only show additional content when expanded - avoid repeating summary
  const additionalContent = translatedContent || card.fullContent;
  const hasAdditionalContent = additionalContent && additionalContent !== card.summary;
  
  return <div className="relative">
      {/* Summary - clickable to expand */}
      <div onClick={handleExpand} className="cursor-pointer group">
        <p className={cn("text-card-summary text-white mb-3 transition-all duration-300 font-sans font-normal", !isExpanded && "line-clamp-3")}>
          {card.summary}
        </p>
        
        {/* Only show expanded content if it's different from summary */}
        {isExpanded && hasAdditionalContent && (
          <div className="mt-2 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
            <p className="text-card-summary text-white text-shadow-sm whitespace-pre-line">
              {additionalContent}
            </p>
          </div>
        )}
        
        {/* Expand/collapse indicator - only show if there's additional content */}
        {hasAdditionalContent && (
          <div className="flex items-center gap-1 text-xs text-white/60 group-hover:text-white/80 transition-colors">
            {isLoading ? <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{t('loading')}</span>
              </> : isExpanded ? <>
                <ChevronUp className="w-3 h-3" />
                <span>{t('showLess')}</span>
              </> : <>
                <ChevronDown className="w-3 h-3" />
                <span>{t('readMore')}</span>
              </>}
          </div>
        )}
      </div>
    </div>;
};