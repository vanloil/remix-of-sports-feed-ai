import { NewsCard } from '@/types/news';

// Global card store for sharing cards between components
class CardStore {
  private cards: Map<string, NewsCard> = new Map();
  private listeners: Set<() => void> = new Set();

  setCards(cards: NewsCard[]) {
    cards.forEach(card => {
      this.cards.set(card.id, card);
    });
    this.notifyListeners();
  }

  addCards(cards: NewsCard[]) {
    cards.forEach(card => {
      if (!this.cards.has(card.id)) {
        this.cards.set(card.id, card);
      }
    });
    this.notifyListeners();
  }

  getCard(id: string): NewsCard | undefined {
    return this.cards.get(id);
  }

  getAllCards(): NewsCard[] {
    return Array.from(this.cards.values());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Find related cards with flexible matching - returns cards with any overlap
  // Sorted by overlap count (desc), then by time (newest first)
  findRelatedCards(card: NewsCard, minOverlap: number = 1): NewsCard[] {
    const cardTagNames = new Set(card.tags.map(t => t.name.toLowerCase()));
    const cardCategory = card.primaryCategory;
    
    const relatedWithScore = Array.from(this.cards.values())
      .filter(c => c.id !== card.id)
      .map(c => {
        const cTagNames = c.tags.map(t => t.name.toLowerCase());
        let overlap = cTagNames.filter(name => cardTagNames.has(name)).length;
        
        // Bonus point for same category
        if (c.primaryCategory === cardCategory) {
          overlap += 0.5;
        }
        
        return { card: c, overlap };
      })
      .filter(({ overlap }) => overlap >= minOverlap)
      .sort((a, b) => {
        // First by overlap count (desc), then by time (LIFO - newest first)
        if (b.overlap !== a.overlap) return b.overlap - a.overlap;
        return new Date(b.card.publishedAt).getTime() - new Date(a.card.publishedAt).getTime();
      })
      .slice(0, 10); // Limit to 10 related cards

    return relatedWithScore.map(({ card }) => card);
  }
}

export const cardStore = new CardStore();
