import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, User, Bookmark, LogOut, Tags } from 'lucide-react';
import { mockNewsCards } from '@/data/mockNews';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, bookmarks, interests } = useAuth();
  const { t } = useLanguage();

  const bookmarkedCards = mockNewsCards.filter(card => bookmarks.includes(card.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

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
          <h1 className="text-xl font-bold">{t('profile.title')}</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Interests Section */}
        {interests.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Tags className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('profile.interests')}</h3>
              <span className="text-sm text-muted-foreground">({interests.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Bookmarks Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{t('profile.bookmarks')}</h3>
            <span className="text-sm text-muted-foreground">({bookmarkedCards.length})</span>
          </div>

          {bookmarkedCards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>{t('profile.noBookmarks')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarkedCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className="flex gap-3 p-3 rounded-xl bg-card border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {card.imageUrl && (
                    <img 
                      src={card.imageUrl} 
                      alt="" 
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2">{card.headline}</p>
                    <p className="text-sm text-muted-foreground mt-1">{card.sourceName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {t('auth.logout')}
        </button>
      </div>
    </div>
  );
}
