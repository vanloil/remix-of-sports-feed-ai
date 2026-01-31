import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Search, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { sportCategories } from '@/data/mockNews';
import { cn } from '@/lib/utils';

const CATEGORIES_KEY = 'sportscroll_categories';

// Extended list of all available tags
const allTags = [
  ...sportCategories,
  { id: 'ajax', name: 'Ajax', icon: '⚽' },
  { id: 'feyenoord', name: 'Feyenoord', icon: '⚽' },
  { id: 'psv', name: 'PSV', icon: '⚽' },
  { id: 'eredivisie', name: 'Eredivisie', icon: '⚽' },
  { id: 'champions_league', name: 'Champions League', icon: '⚽' },
  { id: 'max_verstappen', name: 'Max Verstappen', icon: '🏎️' },
  { id: 'f1', name: 'Formule 1', icon: '🏎️' },
  { id: 'motogp', name: 'MotoGP', icon: '🏍️' },
  { id: 'tour_de_france', name: 'Tour de France', icon: '🚴' },
  { id: 'giro', name: "Giro d'Italia", icon: '🚴' },
  { id: 'vuelta', name: 'Vuelta a España', icon: '🚴' },
  { id: 'wimbledon', name: 'Wimbledon', icon: '🎾' },
  { id: 'us_open', name: 'US Open', icon: '🎾' },
  { id: 'australian_open', name: 'Australian Open', icon: '🎾' },
  { id: 'nba', name: 'NBA', icon: '🏀' },
  { id: 'euroleague', name: 'EuroLeague', icon: '🏀' },
  { id: 'magnus_carlsen', name: 'Magnus Carlsen', icon: '♟️' },
  { id: 'world_chess', name: 'World Chess Championship', icon: '♟️' },
  { id: 'lol', name: 'League of Legends', icon: '🎮' },
  { id: 'valorant', name: 'Valorant', icon: '🎮' },
  { id: 'cs2', name: 'Counter-Strike 2', icon: '🎮' },
  { id: 'olympics', name: 'Olympische Spelen', icon: '🏅' },
  { id: 'wk_voetbal', name: 'WK Voetbal', icon: '🏆' },
  { id: 'ek_voetbal', name: 'EK Voetbal', icon: '🏆' },
  { id: 'brian_brobbey', name: 'Brian Brobbey', icon: '⚽' },
  { id: 'giannis', name: 'Giannis Antetokounmpo', icon: '🏀' },
  { id: 'tallon_griekspoor', name: 'Tallon Griekspoor', icon: '🎾' },
  { id: 'mathieu_van_der_poel', name: 'Mathieu van der Poel', icon: '🚴' },
  { id: 'milwaukee_bucks', name: 'Milwaukee Bucks', icon: '🏀' },
  { id: 'team_heretics', name: 'Team Heretics', icon: '🎮' },
];

export default function ManageInterests() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { interests, addInterest, removeInterest } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [localCategories, setLocalCategories] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (saved) {
      setLocalCategories(JSON.parse(saved));
    }
  }, []);

  // Combine local categories with auth interests
  const allActiveInterests = [...new Set([...localCategories, ...interests])];

  const filteredTags = searchQuery
    ? allTags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTags;

  // Active tags should be shown at top
  const activeTags = allTags.filter(tag => 
    allActiveInterests.includes(tag.id) || allActiveInterests.includes(tag.name)
  );
  
  const availableTags = filteredTags.filter(tag => 
    !allActiveInterests.includes(tag.id) && !allActiveInterests.includes(tag.name)
  );

  const isTagActive = (tag: typeof allTags[0]) => 
    allActiveInterests.includes(tag.id) || allActiveInterests.includes(tag.name);

  const toggleInterest = (tag: typeof allTags[0]) => {
    const isActive = isTagActive(tag);
    
    if (isActive) {
      // Remove from both
      setLocalCategories(prev => prev.filter(i => i !== tag.id && i !== tag.name));
      removeInterest(tag.name);
      removeInterest(tag.id);
    } else {
      // Add to both
      setLocalCategories(prev => [...prev, tag.id]);
      addInterest(tag.name);
    }
  };

  const handleSave = () => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(localCategories));
    navigate(-1);
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4 pt-safe-top">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">{t('interests.title')}</h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('interests.search')}
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

      {/* Active Interests - Always shown at top when no search */}
      {activeTags.length > 0 && !searchQuery && (
        <section className="px-4 mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t('interests.active')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleInterest(tag)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground"
              >
                <span>{tag.icon}</span>
                <span className="font-medium">{tag.name}</span>
                <X className="w-4 h-4" />
              </button>
            ))}
          </div>
        </section>
      )}

      {activeTags.length === 0 && !searchQuery && (
        <div className="px-4 mb-6 text-center py-4 text-muted-foreground">
          <p>{t('interests.noActive')}</p>
        </div>
      )}

      {/* Available Interests */}
      <section className="px-4 pb-24">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {searchQuery ? `Resultaten` : t('interests.available')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {(searchQuery ? filteredTags : availableTags).map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleInterest(tag)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full border transition-colors",
                isTagActive(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span>{tag.icon}</span>
              <span className="font-medium">{tag.name}</span>
              {isTagActive(tag) && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border pb-safe-bottom">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold"
        >
          {t('interests.save')}
        </button>
      </div>
    </div>
  );
}
