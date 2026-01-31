import { User, HelpCircle, Users } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { NewsCard } from '@/types/news';
import { useLanguage } from '@/contexts/LanguageContext';

interface CardActionsLeftProps {
  card: NewsCard;
  onOpenSheet: (type: 'people' | 'sport' | 'related' | 'sources' | 'comments' | 'team') => void;
}

export const CardActionsLeft = ({ card, onOpenSheet }: CardActionsLeftProps) => {
  const { t } = useLanguage();

  // Check if card mentions a team
  const hasTeam = card.tags.some(tag => tag.type === 'team');
  // Check if card mentions a player
  const hasPlayer = card.hasPeopleContext || card.tags.some(tag => tag.type === 'player');

  // Only show if there are card-specific buttons to display
  if (!hasTeam && !hasPlayer && !card.hasSportRules) {
    return null;
  }

  return (
    <div className="absolute left-3 bottom-32 flex flex-col gap-4 z-20">
      {/* Team button */}
      {hasTeam && (
        <ActionButton
          icon={<Users className="w-6 h-6" />}
          label={t('feed.team')}
          onClick={() => onOpenSheet('team')}
        />
      )}

      {/* Player button */}
      {hasPlayer && (
        <ActionButton
          icon={<User className="w-6 h-6" />}
          label={t('feed.player')}
          onClick={() => onOpenSheet('people')}
        />
      )}

      {/* Sport rules button */}
      {card.hasSportRules && (
        <ActionButton
          icon={<HelpCircle className="w-6 h-6" />}
          label={t('feed.rules')}
          onClick={() => onOpenSheet('sport')}
        />
      )}
    </div>
  );
};
