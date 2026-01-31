import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const FeedHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none pt-safe-top">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo/Brand */}
        <div className="text-white font-bold text-xl text-shadow">
          SportScroll
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Profile button */}
          <button
            onClick={() => navigate(user ? '/profile' : '/auth')}
            className="p-2.5 rounded-full glass-dark hover:bg-white/20 transition-colors"
            aria-label="Profile"
          >
            {user ? (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => navigate('/settings')}
            className="p-2.5 rounded-full glass-dark hover:bg-white/20 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
