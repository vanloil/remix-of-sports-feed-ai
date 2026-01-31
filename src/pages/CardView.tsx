import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FeedCard } from '@/components/feed/FeedCard';
import { ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cardStore } from '@/stores/cardStore';
import { NewsCard } from '@/types/news';

export default function CardView() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [card, setCard] = useState<NewsCard | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get card from store
    const storedCard = cardStore.getCard(cardId || '');
    if (storedCard) {
      setCard(storedCard);
      setIsLoading(false);
    } else {
      // Subscribe to store updates in case cards are loaded later
      const unsubscribe = cardStore.subscribe(() => {
        const updatedCard = cardStore.getCard(cardId || '');
        if (updatedCard) {
          setCard(updatedCard);
          setIsLoading(false);
        }
      });

      // Set a timeout to stop loading after 5s
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    }
  }, [cardId]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-feed-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-white/60 text-sm">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{t('card.notFound')}</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            {t('card.backToFeed')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-feed-bg relative">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-4 px-4 pt-safe-top">
        <button 
          onClick={() => navigate('/')}
          className="p-2 mt-3 rounded-full glass-dark hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Card */}
      <div className="h-[100dvh]">
        <FeedCard card={card} isActive={true} />
      </div>

      {/* Login prompt for non-logged-in users */}
      {!user && (
        <div className="absolute bottom-32 left-0 right-0 px-4 z-30">
          <div className="glass-dark rounded-2xl p-4 flex items-center justify-between">
            <p className="text-white text-sm">
              {t('auth.loginRequired')}
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              <LogIn className="w-4 h-4" />
              {t('auth.login')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
