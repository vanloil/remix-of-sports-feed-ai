export type SportCategory = 
  | 'football'
  | 'basketball'
  | 'tennis'
  | 'chess'
  | 'cycling'
  | 'motorsport'
  | 'esports'
  | 'local'
  | 'hockey'
  | 'baseball'
  | 'golf'
  | 'athletics'
  | 'swimming'
  | 'boxing'
  | 'mma'
  | 'rugby'
  | 'cricket';

export interface NewsTag {
  id: string;
  name: string;
  type: 'sport' | 'team' | 'player' | 'event' | 'league';
  category?: SportCategory;
}

export interface NewsCard {
  id: string;
  headline: string;
  summary: string;
  originalTitle?: string;
  imageUrl?: string;
  imageSource?: string; // For copyright attribution
  videoUrl?: string;
  tags: NewsTag[];
  primaryCategory: SportCategory;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  aiProcessedAt: string;
  hasPeopleContext: boolean;
  hasSportRules: boolean;
  relatedCardIds: string[];
  fullContent?: string;
  translatedSummary?: string; // Pre-translated summary
  isAd?: boolean;
  adData?: {
    advertiser: string;
    cta: string;
    ctaUrl: string;
  };
}

export interface UserPreferences {
  selectedTags: string[];
  hasCompletedOnboarding: boolean;
  profanityFilterEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  hasLiked: boolean;
  replies: Comment[];
  createdAt: string;
}
