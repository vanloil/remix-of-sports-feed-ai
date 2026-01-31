import { NewsCard, SportCategory } from '@/types/news';
import { cn } from '@/lib/utils';
import { ClickableTag } from './ClickableTag';
import { ExpandableSummary } from './ExpandableSummary';
import { useSummaryTranslation } from '@/hooks/useContentTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsCardContentProps {
  card: NewsCard;
  isActive: boolean;
}

const categoryColors: Record<SportCategory, string> = {
  football: 'tag-football',
  basketball: 'tag-basketball',
  tennis: 'tag-tennis',
  chess: 'tag-chess',
  cycling: 'tag-cycling',
  motorsport: 'tag-motorsport',
  esports: 'tag-esports',
  local: 'tag-local',
  hockey: 'bg-cyan-500',
  baseball: 'bg-red-600',
  golf: 'bg-green-600',
  athletics: 'bg-amber-500',
  swimming: 'bg-blue-400',
  boxing: 'bg-red-700',
  mma: 'bg-orange-700',
  rugby: 'bg-emerald-700',
  cricket: 'bg-lime-600',
};

export const NewsCardContent = ({ card, isActive }: NewsCardContentProps) => {
  const { language } = useLanguage();
  const { translatedSummary } = useSummaryTranslation(
    card.summary,
    card.headline,
    card.id,
    isActive
  );
  
  const mainTag = card.tags.find(t => t.type === 'sport' || t.type === 'team') || card.tags[0];
  const timeAgo = getTimeAgo(card.publishedAt, language);

  // Get unique tags (deduplicated by name)
  const uniqueTags = card.tags.filter((tag, index, self) => 
    index === self.findIndex(t => t.name.toLowerCase() === tag.name.toLowerCase())
  );

  return (
    <div className="absolute inset-0 flex flex-col justify-end p-4 pb-6">
      {/* Top gradient overlay */}
      <div 
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: 'var(--card-overlay-top)' }}
      />
      
      {/* Ad indicator */}
      {card.isAd && (
        <div className="absolute top-4 left-4 animate-fade-in">
          <span className="px-2 py-1 text-xs font-semibold bg-white/20 glass-dark rounded-full text-white/90">
            Gesponsord
          </span>
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div 
        className="absolute inset-x-0 bottom-0 h-80 pointer-events-none"
        style={{ background: 'var(--card-overlay)' }}
      />

      {/* Content - adjusted padding for left and right buttons */}
      <div className="relative z-10 animate-slide-up px-12">
        {/* Tags - clickable */}
        <div className="flex flex-wrap gap-2 mb-3">
          {mainTag && (
            <ClickableTag 
              tag={{...mainTag, category: card.primaryCategory}} 
              isPrimary 
              categoryColors={categoryColors}
            />
          )}
          {uniqueTags.slice(1, 3).map(tag => (
            <ClickableTag 
              key={tag.id} 
              tag={tag} 
              categoryColors={categoryColors}
            />
          ))}
        </div>

        {/* Headline */}
        <h2 className="text-card-headline text-white text-shadow mb-3 leading-tight">
          {card.headline}
        </h2>

        {/* Expandable Summary - use translated summary */}
        <ExpandableSummary 
          card={{ ...card, summary: translatedSummary }} 
          isActive={isActive}
        />

        {/* Source & Time */}
        <div className="flex items-center gap-2 text-xs text-white/60 mt-3">
          <span className="font-medium">{card.sourceName}</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>

        {/* Ad CTA */}
        {card.isAd && card.adData && (
          <button className="mt-4 px-6 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-white/90 transition-colors">
            {card.adData.cta}
          </button>
        )}
      </div>
    </div>
  );
};

function getTimeAgo(dateString: string, language: string = 'nl'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (language === 'en') {
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  if (diffMins < 60) return `${diffMins}m geleden`;
  if (diffHours < 24) return `${diffHours}u geleden`;
  if (diffDays < 7) return `${diffDays}d geleden`;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}
