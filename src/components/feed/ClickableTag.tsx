import { NewsTag, SportCategory } from '@/types/news';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ClickableTagProps {
  tag: NewsTag;
  isPrimary?: boolean;
  categoryColors: Record<SportCategory, string>;
}

export const ClickableTag = ({ tag, isPrimary, categoryColors }: ClickableTagProps) => {
  const { addInterest, interests } = useAuth();
  const { t } = useLanguage();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isAlreadyAdded = interests.includes(tag.name);
    
    if (isAlreadyAdded) {
      toast.info(t('tags.alreadyAdded'));
    } else {
      addInterest(tag.name);
      toast.success(t('tags.added').replace('{tag}', tag.name));
    }
  };

  if (isPrimary) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-semibold text-white cursor-pointer",
          "hover:ring-2 hover:ring-white/50 transition-all active:scale-95",
          categoryColors[tag.category || 'local']
        )}
      >
        {tag.name}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium bg-white/15 glass-dark text-white/90",
        "hover:bg-white/25 hover:ring-2 hover:ring-white/30 transition-all cursor-pointer active:scale-95"
      )}
    >
      {tag.name}
    </button>
  );
};
