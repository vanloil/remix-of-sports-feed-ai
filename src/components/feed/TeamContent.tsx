import { useState, useEffect } from 'react';
import { Users, ExternalLink, Loader2 } from 'lucide-react';
import { NewsCard } from '@/types/news';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface TeamContentProps {
  card: NewsCard;
  onOpenPlayer: (playerName: string) => void;
}

interface TeamData {
  title: string;
  extract: string;
  thumbnail: string | null;
  sourceUrl: string;
}

interface MockPlayer {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
}

// Mock team players data
const getMockPlayers = (teamName: string): MockPlayer[] => {
  const playersByTeam: Record<string, MockPlayer[]> = {
    'Ajax': [
      { id: 'p1', name: 'Brian Brobbey', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', position: 'Spits' },
      { id: 'p2', name: 'Steven Bergwijn', imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop', position: 'Aanvaller' },
      { id: 'p3', name: 'Jorrel Hato', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', position: 'Verdediger' },
      { id: 'p4', name: 'Kenneth Taylor', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', position: 'Middenvelder' },
      { id: 'p5', name: 'Remko Pasveer', imageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop', position: 'Keeper' },
      { id: 'p6', name: 'Devyne Rensch', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', position: 'Verdediger' },
      { id: 'p7', name: 'Steven Berghuis', imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150&h=150&fit=crop', position: 'Middenvelder' },
    ],
    'Feyenoord': [
      { id: 'p1', name: 'Santiago Giménez', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', position: 'Spits' },
      { id: 'p2', name: 'Lutsharel Geertruida', imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop', position: 'Verdediger' },
      { id: 'p3', name: 'Quinten Timber', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', position: 'Middenvelder' },
      { id: 'p4', name: 'Justin Bijlow', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', position: 'Keeper' },
      { id: 'p5', name: 'Calvin Stengs', imageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop', position: 'Aanvaller' },
    ],
    'Milwaukee Bucks': [
      { id: 'p1', name: 'Giannis Antetokounmpo', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', position: 'Forward' },
      { id: 'p2', name: 'Damian Lillard', imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop', position: 'Guard' },
      { id: 'p3', name: 'Khris Middleton', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', position: 'Forward' },
      { id: 'p4', name: 'Brook Lopez', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', position: 'Center' },
      { id: 'p5', name: 'Bobby Portis', imageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop', position: 'Forward' },
    ],
  };

  // Find matching team or return generic players
  const matchedTeam = Object.keys(playersByTeam).find(team => 
    teamName.toLowerCase().includes(team.toLowerCase()) || 
    team.toLowerCase().includes(teamName.toLowerCase())
  );

  return matchedTeam ? playersByTeam[matchedTeam] : [
    { id: 'p1', name: 'Speler 1', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', position: 'Speler' },
    { id: 'p2', name: 'Speler 2', imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop', position: 'Speler' },
    { id: 'p3', name: 'Speler 3', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', position: 'Speler' },
  ];
};

export const TeamContent = ({ card, onOpenPlayer }: TeamContentProps) => {
  const { t, language } = useLanguage();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teamTag = card.tags.find(tag => tag.type === 'team');
  const teamName = teamTag?.name || '';
  const players = getMockPlayers(teamName);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamName) {
        setIsLoading(false);
        setError(t('info.noData'));
        return;
      }

      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase.functions.invoke('wikipedia', {
          body: { query: teamName, language, type: 'team' }
        });

        if (fetchError) throw fetchError;

        if (data?.success && data?.data) {
          setTeamData(data.data);
        } else {
          setError(data?.error || t('info.noData'));
        }
      } catch (err) {
        console.error('Failed to fetch team data:', err);
        setError(t('info.noData'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamName, language, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">{t('info.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team header with logo */}
      <div className="flex items-center gap-4">
        {teamData?.thumbnail ? (
          <img 
            src={teamData.thumbnail} 
            alt={teamData.title}
            className="w-20 h-20 rounded-xl object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
            <Users className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{teamData?.title || teamName}</h3>
          <p className="text-sm text-muted-foreground">{t('team.info')}</p>
        </div>
      </div>
      
      {/* Team description */}
      {teamData?.extract && (
        <div className="prose prose-sm dark:prose-invert">
          <p className="text-foreground leading-relaxed">{teamData.extract}</p>
        </div>
      )}

      {/* Players section */}
      <div>
        <h4 className="font-semibold mb-4">{t('team.players')}</h4>
        
        {/* Honeycomb grid */}
        <div className="honeycomb-grid">
          {players.map((player, index) => (
            <button
              key={player.id}
              onClick={() => onOpenPlayer(player.name)}
              className="honeycomb-cell group"
              style={{ 
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="relative">
                <img 
                  src={player.imageUrl} 
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all"
                />
              </div>
              <span className="text-xs font-medium text-center mt-2 line-clamp-1">
                {player.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {player.position}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Wikipedia source link */}
      {teamData?.sourceUrl && (
        <a 
          href={teamData.sourceUrl}
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
