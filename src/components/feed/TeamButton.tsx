import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamButtonProps {
  teamName: string;
  onClick: () => void;
}

interface TeamInfo {
  thumbnail: string | null;
}

// Cache for team thumbnails to avoid repeated API calls
const teamThumbnailCache = new Map<string, string | null>();

export const TeamButton = ({ teamName, onClick }: TeamButtonProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamThumbnail = async () => {
      // Check cache first
      if (teamThumbnailCache.has(teamName)) {
        setThumbnail(teamThumbnailCache.get(teamName) || null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('wikipedia', {
          body: { query: teamName, language: 'en', type: 'team' }
        });

        if (!error && data?.success && data?.data?.thumbnail) {
          teamThumbnailCache.set(teamName, data.data.thumbnail);
          setThumbnail(data.data.thumbnail);
        } else {
          teamThumbnailCache.set(teamName, null);
        }
      } catch (err) {
        console.error('Failed to fetch team thumbnail:', err);
        teamThumbnailCache.set(teamName, null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamThumbnail();
  }, [teamName]);

  // Get short team name for display (max 10 chars)
  const shortName = teamName.length > 10 ? teamName.slice(0, 10) + '...' : teamName;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
    >
      <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-lg group-hover:border-white/40 transition-colors">
        {isLoading ? (
          <div className="w-full h-full bg-muted animate-pulse rounded-full" />
        ) : thumbnail ? (
          <img 
            src={thumbnail} 
            alt={teamName}
            className="w-full h-full object-cover"
          />
        ) : (
          <Users className="w-5 h-5 text-white" />
        )}
      </div>
      <span className="text-[10px] text-white/70 font-medium text-center max-w-[60px] truncate">
        {shortName}
      </span>
    </button>
  );
};
