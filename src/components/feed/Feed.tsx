import { useEffect, useRef, useState, useCallback } from 'react';
import { FeedCard } from './FeedCard';
import { NewsCard, SportCategory } from '@/types/news';
import { FeedHeader } from './FeedHeader';
import { useRSSFeed } from '@/hooks/useRSSFeed';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  selectedCategories?: SportCategory[];
}

export const Feed = ({ selectedCategories }: FeedProps) => {
  const { cards: rssCards, loading, error, loadMore } = useRSSFeed(selectedCategories);
  const [cards, setCards] = useState<NewsCard[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreThreshold = 5; // Load more when 5 cards from end

  // Use RSS cards when available
  useEffect(() => {
    if (rssCards.length > 0) {
      setCards(rssCards);
    }
  }, [rssCards]);

  // Background loading when near end
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || loading) return;
    setIsLoadingMore(true);
    loadMore();
    // Reset loading state after a delay
    setTimeout(() => setIsLoadingMore(false), 2000);
  }, [isLoadingMore, loading, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const cardHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / cardHeight);
      
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }

      // Infinite scroll - load more in background when near end
      if (newIndex >= cards.length - loadMoreThreshold && !isLoadingMore) {
        handleLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex, cards.length, isLoadingMore, handleLoadMore]);

  // Loading state
  if (loading && cards.length === 0) {
    return (
      <div className="relative h-[100dvh] w-full bg-feed-bg flex items-center justify-center">
        <FeedHeader />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-white/60 text-sm">Loading sports news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full bg-feed-bg">
      {/* Header with profile and settings buttons */}
      <FeedHeader />

      {/* Feed container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll scroll-snap-container hide-scrollbar"
      >
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className="h-[100dvh] w-full"
          >
            <FeedCard 
              card={card} 
              isActive={index === activeIndex}
            />
          </div>
        ))}
        
        {/* Loading indicator at bottom */}
        {isLoadingMore && (
          <div className="h-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
