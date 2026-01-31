import { useState, useCallback } from "react";
import { NewsCard } from "@/types/news";
import { NewsCardContent } from "./NewsCardContent";
import { CardActionsLeft } from "./CardActionsLeft";
import { CardActionsRight } from "./CardActionsRight";
import { InfoSheet } from "./InfoSheet";

interface FeedCardProps {
  card: NewsCard;
  isActive: boolean;
}

export const FeedCard = ({ card, isActive }: FeedCardProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<"people" | "sport" | "related" | "sources" | "comments" | "team" | null>(
    null,
  );
  const [commentCount, setCommentCount] = useState(() => {
    // Get initial comment count from localStorage
    const stored = localStorage.getItem(`comments_${card.id}`);
    if (stored) {
      const comments = JSON.parse(stored);
      const countAll = (comments: any[]): number =>
        comments.reduce((total, c) => total + 1 + countAll(c.replies || []), 0);
      return countAll(comments);
    }
    return 0;
  });

  const handleOpenSheet = (type: "people" | "sport" | "related" | "sources" | "comments" | "team") => {
    setSheetType(type);
    setSheetOpen(true);
  };

  const handleCommentCountChange = useCallback((count: number) => {
    setCommentCount(count);
  }, []);

  return (
    <div className="relative w-full h-full scroll-snap-item bg-feed-bg">
      {/* Background Image */}
      {card.imageUrl && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${card.imageUrl})` }}>
          {/* Overlay for better text readability */}
        </div>
      )}

      {/* Fallback gradient background if no image */}
      {!card.imageUrl && <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />}

      {/* Content */}
      <NewsCardContent card={card} />

      {/* Action buttons - split into left (card-specific) and right (app actions) */}
      {!card.isAd && (
        <>
          <CardActionsLeft card={card} onOpenSheet={handleOpenSheet} />
          <CardActionsRight card={card} onOpenSheet={handleOpenSheet} commentCount={commentCount} />
        </>
      )}

      {/* Info Sheet */}
      <InfoSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        type={sheetType}
        card={card}
        onCommentCountChange={handleCommentCountChange}
      />
    </div>
  );
};
