import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsCard, SportCategory } from '@/types/news';
import { cardStore } from '@/stores/cardStore';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
  category: string;
  source: string;
}

const categoryMapping: Record<string, SportCategory> = {
  football: 'football',
  basketball: 'basketball',
  tennis: 'tennis',
  cycling: 'cycling',
  motorsport: 'motorsport',
  golf: 'golf',
  athletics: 'athletics',
  boxing: 'boxing',
  rugby: 'rugby',
  cricket: 'cricket',
  hockey: 'hockey',
  swimming: 'swimming',
  general: 'football',
};

// Normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate a content hash for deduplication
function generateContentHash(title: string, description: string): string {
  const normalized = normalizeText(title + ' ' + description);
  // Simple hash based on first 100 chars
  return normalized.slice(0, 100);
}

// Check if two items are duplicates
function isDuplicate(existing: Set<string>, item: RSSItem): boolean {
  const hash = generateContentHash(item.title, item.description);
  if (existing.has(hash)) return true;
  
  // Also check by link (without query params)
  const cleanLink = item.link.split('?')[0];
  if (existing.has(cleanLink)) return true;
  
  return false;
}

function extractEntities(title: string, description: string, source: string): { 
  teams: string[], 
  players: string[], 
  events: string[],
  leagues: string[]
} {
  const teams: string[] = [];
  const players: string[] = [];
  const events: string[] = [];
  const leagues: string[] = [];
  
  const text = `${title} ${description}`;
  
  // Common team patterns - more specific
  const teamPatterns = [
    /\b(FC|AC|AS|SS|SC|CF|CD|RC)\s+\w+(?:\s+\w+)?/gi,
    /\b(Manchester\s+(?:United|City)|Liverpool|Chelsea|Arsenal|Tottenham|Barcelona|Real\s+Madrid|Bayern\s+Munich|Juventus|PSG|Inter\s+Milan|AC\s+Milan|Borussia\s+Dortmund|Ajax|Feyenoord|PSV|AZ\s+Alkmaar|Leeds|Everton|Newcastle|West\s+Ham|Aston\s+Villa)/gi,
    /\b(Lakers|Celtics|Warriors|Bucks|Heat|Nets|76ers|Knicks|Bulls|Suns|Mavericks|Clippers)\b/gi,
    /\b(Giants|Cowboys|Patriots|Chiefs|Eagles|49ers|Bills|Ravens|Seahawks|Packers|Raiders)\b/gi,
    /\b(Athletics|Yankees|Dodgers|Red\s+Sox|Cubs|Cardinals|Mets|Braves|Giants|Phillies)\b/gi,
  ];
  
  // Player name patterns (capitalized words that look like names)
  const playerPatterns = [
    /\b([A-Z][a-z]+(?:\s+(?:van\s+der|van\s+de|van|de|der))?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g,
  ];
  
  // Event patterns
  const eventPatterns = [
    /\b(World\s+Cup|Champions\s+League|Premier\s+League|La\s+Liga|Bundesliga|Serie\s+A|Ligue\s+1|Euro\s+\d{4}|Olympics|Grand\s+Prix|Wimbledon|US\s+Open|Australian\s+Open|French\s+Open|Roland\s+Garros|Tour\s+de\s+France|NBA\s+Finals|Super\s+Bowl|World\s+Series|Stanley\s+Cup|Winter\s+Olympics)\b/gi,
  ];

  // League patterns
  const leaguePatterns = [
    /\b(NBA|NFL|MLB|NHL|PGA|ATP|WTA|UFC|MLS|Eredivisie|Premier\s+League|La\s+Liga|Bundesliga|Serie\s+A|Ligue\s+1|Champions\s+League)\b/gi,
  ];
  
  teamPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) teams.push(...matches.slice(0, 2));
  });
  
  // Extract player names more carefully
  playerPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Filter out common non-player words
        const skipWords = ['The', 'This', 'That', 'From', 'With', 'After', 'Before', 'About', 'Super Bowl', 'World Cup', 'Grand Prix'];
        if (!skipWords.some(skip => match.includes(skip))) {
          players.push(match);
        }
      });
    }
  });
  
  eventPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) events.push(...matches.slice(0, 2));
  });

  leaguePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) leagues.push(...matches.slice(0, 2));
  });
  
  return { 
    teams: [...new Set(teams)].slice(0, 2), 
    players: [...new Set(players)].slice(0, 2), 
    events: [...new Set(events)].slice(0, 2),
    leagues: [...new Set(leagues)].slice(0, 1)
  };
}

function rssItemToNewsCard(item: RSSItem, index: number, existingIds: Set<string>): NewsCard {
  const category = categoryMapping[item.category] || 'football';
  const { teams, players, events, leagues } = extractEntities(item.title, item.description, item.source);
  
  // Create unique ID based on content
  const baseId = `rss-${generateContentHash(item.title, '').slice(0, 20)}-${Date.now()}`;
  let id = baseId;
  let counter = 0;
  while (existingIds.has(id)) {
    id = `${baseId}-${++counter}`;
  }
  existingIds.add(id);
  
  const tags = [];
  
  // Add sport tag
  const sportName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  tags.push({ id: `sport-${id}`, name: sportName, type: 'sport' as const, category });
  
  // Add team tags
  teams.forEach((team, i) => {
    tags.push({ id: `team-${id}-${i}`, name: team.trim(), type: 'team' as const, category });
  });
  
  // Add player tags
  players.forEach((player, i) => {
    tags.push({ id: `player-${id}-${i}`, name: player.trim(), type: 'player' as const, category });
  });
  
  // Add event tags
  events.forEach((event, i) => {
    tags.push({ id: `event-${id}-${i}`, name: event.trim(), type: 'event' as const, category });
  });

  // Add league tags
  leagues.forEach((league, i) => {
    tags.push({ id: `league-${id}-${i}`, name: league.trim(), type: 'league' as const, category });
  });
  
  // Deduplicate tags by name (case-insensitive)
  const uniqueTags = tags.filter((tag, idx, self) => 
    idx === self.findIndex(t => t.name.toLowerCase() === tag.name.toLowerCase())
  ).slice(0, 5);
  
  return {
    id,
    headline: item.title,
    summary: item.description,
    originalTitle: item.title,
    imageUrl: item.imageUrl, // Use RSS image directly
    imageSource: item.source, // Track image source for copyright
    tags: uniqueTags,
    primaryCategory: category,
    sourceUrl: item.link,
    sourceName: item.source,
    publishedAt: item.pubDate,
    aiProcessedAt: new Date().toISOString(),
    hasPeopleContext: players.length > 0,
    hasSportRules: true,
    relatedCardIds: [], // Will be computed dynamically
    fullContent: item.description,
  };
}

export function useRSSFeed(selectedCategories?: SportCategory[]) {
  const [cards, setCards] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seenContentRef = useRef<Set<string>>(new Set());
  const existingIdsRef = useRef<Set<string>>(new Set());
  const isFetchingRef = useRef(false);

  const fetchFeed = useCallback(async (append: boolean = false) => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      if (!append) setLoading(true);
      setError(null);
      
      const categories = selectedCategories?.length ? selectedCategories : undefined;
      
      console.log('Fetching RSS feed for categories:', categories);
      
      const { data, error: fnError } = await supabase.functions.invoke('rss-feed', {
        body: { categories, limit: 50 },
      });
      
      if (fnError) {
        console.error('RSS fetch error:', fnError);
        throw new Error(fnError.message);
      }
      
      if (data?.success && data.items) {
        // Filter out duplicates
        const newItems = (data.items as RSSItem[]).filter(item => {
          if (isDuplicate(seenContentRef.current, item)) {
            return false;
          }
          // Add to seen set
          seenContentRef.current.add(generateContentHash(item.title, item.description));
          seenContentRef.current.add(item.link.split('?')[0]);
          return true;
        });

        const newsCards = newItems.map((item: RSSItem, index: number) => 
          rssItemToNewsCard(item, index, existingIdsRef.current)
        );
        
        if (append) {
          setCards(prev => {
            const combined = [...prev, ...newsCards];
            cardStore.addCards(newsCards);
            return combined;
          });
        } else {
          setCards(newsCards);
          cardStore.setCards(newsCards);
        }
        
        console.log('Loaded', newsCards.length, 'unique RSS cards');
      } else {
        throw new Error(data?.error || 'Failed to fetch feed');
      }
    } catch (err) {
      console.error('RSS feed error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [selectedCategories]);

  const loadMore = useCallback(() => {
    fetchFeed(true);
  }, [fetchFeed]);

  useEffect(() => {
    // Reset seen content when categories change
    seenContentRef.current.clear();
    existingIdsRef.current.clear();
    fetchFeed();
  }, [fetchFeed]);

  return { cards, loading, error, refetch: fetchFeed, loadMore };
}
