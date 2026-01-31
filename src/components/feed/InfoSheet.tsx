import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NewsCard } from '@/types/news';
import { ExternalLink, User, HelpCircle, Newspaper, Link2, MessageCircle, Loader2, Users, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { cardStore } from '@/stores/cardStore';
import { TeamContent } from './TeamContent';
import { CommentsContent } from './CommentsContent';

interface InfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'people' | 'sport' | 'related' | 'sources' | 'comments' | 'team' | null;
  card: NewsCard;
  selectedTeam?: string | null;
  onCommentCountChange?: (count: number) => void;
}

interface WikiData {
  title: string;
  extract: string;
  thumbnail: string | null;
  source: string;
  sourceUrl: string;
}

export const InfoSheet = ({ open, onOpenChange, type, card, selectedTeam, onCommentCountChange }: InfoSheetProps) => {
  const { t } = useLanguage();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleOpenPlayer = (playerName: string) => {
    setSelectedPlayer(playerName);
  };

  const handleBackToTeam = () => {
    setSelectedPlayer(null);
  };

  const getTitle = () => {
    if (selectedPlayer) return t('info.aboutPerson');
    switch (type) {
      case 'people': return t('info.aboutPerson');
      case 'sport': return t('info.aboutSport');
      case 'related': return t('info.relatedNews');
      case 'sources': return t('info.sources');
      case 'comments': return t('feed.comments');
      case 'team': return t('info.aboutTeam');
      default: return '';
    }
  };

  const getIcon = () => {
    if (selectedPlayer) return <User className="w-5 h-5" />;
    switch (type) {
      case 'people': return <User className="w-5 h-5" />;
      case 'sport': return <HelpCircle className="w-5 h-5" />;
      case 'related': return <Newspaper className="w-5 h-5" />;
      case 'sources': return <Link2 className="w-5 h-5" />;
      case 'comments': return <MessageCircle className="w-5 h-5" />;
      case 'team': return <Users className="w-5 h-5" />;
      default: return null;
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedPlayer(null);
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent 
        side="bottom" 
        className="h-[70vh] rounded-t-3xl bg-card border-t border-border"
      >
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            {type === 'team' && selectedPlayer && (
              <button 
                onClick={handleBackToTeam}
                className="mr-2 text-sm text-primary hover:underline"
              >
                ← {t('team.back')}
              </button>
            )}
            {getIcon()}
            {getTitle()}
          </SheetTitle>
        </SheetHeader>

        <div className="pt-4 overflow-y-auto h-[calc(100%-60px)]">
          {type === 'people' && <PeopleContent card={card} playerName={selectedPlayer} />}
          {type === 'sport' && <SportContent card={card} />}
          {type === 'related' && <RelatedContent card={card} onOpenChange={onOpenChange} />}
          {type === 'sources' && <SourcesContent card={card} />}
          {type === 'comments' && (
            <CommentsContent 
              cardId={card.id} 
              onCommentCountChange={onCommentCountChange || (() => {})} 
            />
          )}
          {type === 'team' && !selectedPlayer && (
            <TeamContent card={card} onOpenPlayer={handleOpenPlayer} selectedTeam={selectedTeam} />
          )}
          {type === 'team' && selectedPlayer && (
            <PeopleContent card={card} playerName={selectedPlayer} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const PeopleContent = ({ card, playerName }: { card: NewsCard; playerName?: string | null }) => {
  const { t, language } = useLanguage();
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const personTag = card.tags.find(t => t.type === 'player');
  const personName = playerName || personTag?.name || '';

  useEffect(() => {
    const fetchWikiData = async () => {
      if (!personName) {
        setIsLoading(false);
        setError(t('info.noData'));
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase.functions.invoke('wikipedia', {
          body: { query: personName, language, type: 'person' }
        });

        if (fetchError) throw fetchError;

        if (data?.success && data?.data) {
          setWikiData(data.data);
        } else {
          setError(data?.error || t('info.noData'));
        }
      } catch (err) {
        console.error('Failed to fetch wiki data:', err);
        setError(t('info.noData'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWikiData();
  }, [personName, language, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">{t('info.loading')}</span>
      </div>
    );
  }

  if (error && !wikiData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {wikiData?.thumbnail ? (
          <img 
            src={wikiData.thumbnail} 
            alt={wikiData.title}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{wikiData?.title || personName}</h3>
          <p className="text-sm text-muted-foreground">
            {card.primaryCategory === 'football' && t('player.footballer')}
            {card.primaryCategory === 'chess' && t('player.chessPlayer')}
            {card.primaryCategory === 'cycling' && t('player.cyclist')}
            {card.primaryCategory === 'motorsport' && t('player.driver')}
            {card.primaryCategory === 'tennis' && t('player.tennisPlayer')}
            {card.primaryCategory === 'basketball' && t('player.basketballPlayer')}
          </p>
        </div>
      </div>
      
      {wikiData?.extract && (
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-foreground leading-relaxed">{wikiData.extract}</p>
        </div>
      )}

      {wikiData?.sourceUrl && (
        <a 
          href={wikiData.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
        >
          <span className="text-muted-foreground">{t('info.wikiSource')}</span>
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </a>
      )}
    </div>
  );
};

const SportContent = ({ card }: { card: NewsCard }) => {
  const { t, language } = useLanguage();
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sportNames: Record<string, string> = {
    football: 'Voetbal',
    basketball: 'Basketbal',
    tennis: 'Tennis',
    chess: 'Schaken',
    cycling: 'Wielrennen',
    motorsport: 'Formule 1',
    esports: 'Esports',
    local: 'Sport',
    hockey: 'Hockey',
    athletics: 'Atletiek',
    swimming: 'Zwemmen',
    boxing: 'Boksen',
    golf: 'Golf',
  };

  const sportName = sportNames[card.primaryCategory] || card.primaryCategory;

  useEffect(() => {
    const fetchWikiData = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase.functions.invoke('wikipedia', {
          body: { query: sportName, language, type: 'sport' }
        });

        if (fetchError) throw fetchError;

        if (data?.success && data?.data) {
          setWikiData(data.data);
        } else {
          setError(data?.error || t('info.noData'));
        }
      } catch (err) {
        console.error('Failed to fetch wiki data:', err);
        setError(t('info.noData'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWikiData();
  }, [sportName, language, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">{t('info.loading')}</span>
      </div>
    );
  }

  if (error && !wikiData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{wikiData?.title || sportName}</h3>
      
      {wikiData?.extract && (
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-foreground leading-relaxed">{wikiData.extract}</p>
        </div>
      )}

      {wikiData?.sourceUrl && (
        <a 
          href={wikiData.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
        >
          <span className="text-muted-foreground">{t('info.wikiSource')}</span>
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </a>
      )}
    </div>
  );
};

const RelatedContent = ({ card, onOpenChange }: { card: NewsCard; onOpenChange: (open: boolean) => void }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Find related cards - now with flexible matching (min 1 overlap)
  const relatedCards = cardStore.findRelatedCards(card, 1);

  const handleCardClick = (cardId: string) => {
    onOpenChange(false);
    navigate(`/card/${cardId}`);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {t('related.descriptionFlexible')}
      </p>
      
      {relatedCards.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {t('related.noneFlexible')}
        </p>
      ) : (
        relatedCards.map((relatedCard) => (
          <div 
            key={relatedCard.id}
            onClick={() => handleCardClick(relatedCard.id)}
            className="flex gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            {relatedCard.imageUrl && (
              <img 
                src={relatedCard.imageUrl} 
                alt="" 
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-2">
                {relatedCard.headline}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {relatedCard.sourceName}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const SourcesContent = ({ card }: { card: NewsCard }) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t('info.sourcesDesc')}
      </p>
      
      {/* Article source */}
      <a 
        href={card.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
      >
        <div>
          <p className="font-medium">{card.sourceName}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {card.originalTitle || card.headline}
          </p>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-3" />
      </a>

      {/* Image copyright attribution */}
      {card.imageUrl && card.imageSource && (
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ImageIcon className="w-4 h-4" />
            <span>{t('info.imageCredit')}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {card.imageSource}
          </p>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {t('info.published')} {new Date(card.publishedAt).toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  );
};
