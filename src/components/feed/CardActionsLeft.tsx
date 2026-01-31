import { useState } from 'react';
import { User, HelpCircle } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { TeamButton } from './TeamButton';
import { NewsCard, NewsTag } from '@/types/news';
import { useLanguage } from '@/contexts/LanguageContext';

interface CardActionsLeftProps {
  card: NewsCard;
  onOpenSheet: (type: 'people' | 'sport' | 'related' | 'sources' | 'comments' | 'team') => void;
  onSelectTeam?: (teamName: string) => void;
}

export const CardActionsLeft = ({ card, onOpenSheet, onSelectTeam }: CardActionsLeftProps) => {
  const { t } = useLanguage();
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

  // Get all team tags
  const teamTags = card.tags.filter(tag => tag.type === 'team');
  const hasTeams = teamTags.length > 0;
  
  // Check if card mentions a player
  const hasPlayer = card.hasPeopleContext || card.tags.some(tag => tag.type === 'player');

  // Only show if there are card-specific buttons to display
  if (!hasTeams && !hasPlayer && !card.hasSportRules) {
    return null;
  }

  const handleTeamClick = (team: NewsTag, index: number) => {
    setSelectedTeamIndex(index);
    onSelectTeam?.(team.name);
    onOpenSheet('team');
  };

  return (
    <div className="absolute left-3 bottom-32 flex flex-col gap-3 z-20">
      {/* Team buttons - show individual button for each team */}
      {hasTeams && teamTags.map((team, index) => (
        <TeamButton
          key={team.id}
          teamName={team.name}
          onClick={() => handleTeamClick(team, index)}
        />
      ))}

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
