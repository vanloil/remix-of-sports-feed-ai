import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Link2,
  Newspaper,
  Check
} from 'lucide-react';
import { ActionButton } from './ActionButton';
import { NewsCard } from '@/types/news';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CardActionsRightProps {
  card: NewsCard;
  onOpenSheet: (type: 'people' | 'sport' | 'related' | 'sources' | 'comments' | 'team') => void;
  commentCount: number;
}

export const CardActionsRight = ({ card, onOpenSheet, commentCount }: CardActionsRightProps) => {
  const { user, bookmarks, toggleBookmark } = useAuth();
  const { t } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 5000) + 100);
  const [shareSuccess, setShareSuccess] = useState(false);

  const isSaved = bookmarks.includes(card.id);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    // Use the original source URL for sharing, or fallback to card page
    const shareUrl = card.sourceUrl || `${window.location.origin}/card/${card.id}`;
    const shareText = `${card.headline}\n\n${card.summary.slice(0, 200)}${card.summary.length > 200 ? '...' : ''}`;
    
    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: card.headline,
          text: shareText,
          url: shareUrl,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        // User cancelled or error - fallback to clipboard
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(shareUrl);
        }
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      toast.success(t('feed.linkCopied'));
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Could not copy link');
    }
  };

  const handleSave = () => {
    if (user) {
      toggleBookmark(card.id);
    } else {
      toast.error(t('auth.loginToSave'));
    }
  };

  return (
    <div className="absolute right-3 bottom-32 flex flex-col gap-4 z-20">
      {/* Sources */}
      <ActionButton
        icon={<Link2 className="w-6 h-6" />}
        label={t('feed.sources')}
        onClick={() => onOpenSheet('sources')}
      />

      {/* Related news - always show, dynamically computed */}
      <ActionButton
        icon={<Newspaper className="w-6 h-6" />}
        label={t('feed.related')}
        onClick={() => onOpenSheet('related')}
      />

      <div className="w-12 h-px bg-white/20 mx-auto" />

      {/* Like */}
      <ActionButton
        icon={<Heart className={cn("w-6 h-6", liked && "fill-current")} />}
        count={likeCount}
        active={liked}
        onClick={handleLike}
      />

      {/* Comments */}
      <ActionButton
        icon={<MessageCircle className="w-6 h-6" />}
        count={commentCount}
        onClick={() => onOpenSheet('comments')}
      />

      {/* Share */}
      <ActionButton
        icon={shareSuccess ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
        label={t('feed.share')}
        active={shareSuccess}
        onClick={handleShare}
      />

      {/* Bookmark */}
      <ActionButton
        icon={<Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />}
        active={isSaved}
        onClick={handleSave}
      />
    </div>
  );
};
