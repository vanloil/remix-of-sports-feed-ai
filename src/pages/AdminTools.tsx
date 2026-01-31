import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Search, X, Tag, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockNewsCards, sportCategories } from '@/data/mockNews';
import { cn } from '@/lib/utils';

export default function AdminTools() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [editedTags, setEditedTags] = useState<string[]>([]);

  const filteredCards = searchQuery
    ? mockNewsCards.filter(card => 
        card.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.headline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockNewsCards;

  const selectedCard = selectedCardId 
    ? mockNewsCards.find(card => card.id === selectedCardId) 
    : null;

  const handleSelectCard = (cardId: string) => {
    const card = mockNewsCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCardId(cardId);
      setEditedTags(card.tags.map(t => t.name));
    }
  };

  const removeTag = (tagName: string) => {
    setEditedTags(prev => prev.filter(t => t !== tagName));
  };

  const addTag = (tagName: string) => {
    if (!editedTags.includes(tagName)) {
      setEditedTags(prev => [...prev, tagName]);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log('Saving tags for card', selectedCardId, editedTags);
    setSelectedCardId(null);
    setEditedTags([]);
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4 pt-safe-top">
          <button 
            onClick={() => selectedCardId ? setSelectedCardId(null) : navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">
            {selectedCardId ? t('admin.editTags') : t('admin.title')}
          </h1>
        </div>
      </div>

      {!selectedCardId ? (
        <>
          {/* Search */}
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.searchCards')}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Cards List */}
          <div className="px-4 space-y-3">
            {filteredCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('admin.noResults')}
              </div>
            ) : (
              filteredCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card.id)}
                  className="flex gap-3 p-3 rounded-xl bg-card border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {card.imageUrl && (
                    <img 
                      src={card.imageUrl} 
                      alt="" 
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">ID: {card.id}</p>
                    <p className="font-medium line-clamp-2 text-sm">{card.headline}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {card.tags.slice(0, 3).map(tag => (
                        <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {tag.name}
                        </span>
                      ))}
                      {card.tags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 text-muted-foreground">
                          +{card.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Edit Tags View */
        <div className="px-4 py-4">
          {selectedCard && (
            <>
              {/* Card Preview */}
              <div className="flex gap-3 p-3 rounded-xl bg-card border border-border mb-6">
                {selectedCard.imageUrl && (
                  <img 
                    src={selectedCard.imageUrl} 
                    alt="" 
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">ID: {selectedCard.id}</p>
                  <p className="font-medium line-clamp-2">{selectedCard.headline}</p>
                </div>
              </div>

              {/* Current Tags */}
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Huidige tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {editedTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => removeTag(tag)}
                      className="flex items-center gap-1 px-3 py-2 rounded-full bg-primary text-primary-foreground"
                    >
                      <span>{tag}</span>
                      <X className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Available Categories to Add */}
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Categorieën toevoegen
                </h2>
                <div className="flex flex-wrap gap-2">
                  {sportCategories
                    .filter(cat => !editedTags.includes(cat.name))
                    .map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => addTag(cat.name)}
                        className="flex items-center gap-1 px-3 py-2 rounded-full border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                </div>
              </section>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold"
              >
                Tags opslaan
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
