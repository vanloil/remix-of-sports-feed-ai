import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Tags, 
  Bell, 
  Globe, 
  Shield, 
  Moon, 
  Sun,
  ChevronRight,
  Wrench,
  LogOut
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    document.documentElement.classList.toggle('dark', newValue);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
          <h1 className="text-xl font-bold">{t('settings.title')}</h1>
        </div>
      </div>

      {/* Settings sections */}
      <div className="px-4 py-6 space-y-6">
        {/* Preferences */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t('settings.preferences')}
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <SettingsItem
              icon={<Tags className="w-5 h-5 text-primary" />}
              label={t('settings.manageInterests')}
              description={t('settings.manageInterestsDesc')}
              onClick={() => navigate('/manage-interests')}
              showArrow
            />
            <SettingsItem
              icon={<Bell className="w-5 h-5 text-accent" />}
              label={t('settings.notifications')}
              description={t('settings.notificationsDesc')}
              trailing={
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              }
            />
            <SettingsItem
              icon={<Globe className="w-5 h-5 text-sport-local" />}
              label={t('settings.language')}
              description={language === 'nl' ? 'Nederlands' : 'English'}
              onClick={() => navigate('/language')}
              showArrow
              isLast
            />
          </div>
        </section>

        {/* Display */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t('settings.display')}
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <SettingsItem
              icon={darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-accent" />}
              label={t('settings.darkMode')}
              description={t('settings.darkModeDesc')}
              trailing={
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              }
            />
            <SettingsItem
              icon={<Shield className="w-5 h-5 text-sport-football" />}
              label={t('settings.profanityFilter')}
              description={t('settings.profanityFilterDesc')}
              trailing={
                <Switch checked={profanityFilter} onCheckedChange={setProfanityFilter} />
              }
              isLast
            />
          </div>
        </section>

        {/* Admin */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
            {t('settings.admin')}
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <SettingsItem
              icon={<Wrench className="w-5 h-5 text-muted-foreground" />}
              label={t('settings.adminTools')}
              description={t('settings.adminToolsDesc')}
              onClick={() => navigate('/admin')}
              showArrow
              isLast
            />
          </div>
        </section>

        {/* Logout */}
        {user && (
          <section>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('auth.logout')}
            </button>
          </section>
        )}

        {/* App info */}
        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>SportScroll v1.0.0</p>
          <p className="mt-1">{t('app.tagline')}</p>
        </div>
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
  isLast?: boolean;
}

const SettingsItem = ({ 
  icon, 
  label, 
  description, 
  trailing, 
  onClick, 
  showArrow,
  isLast 
}: SettingsItemProps) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 text-left",
        onClick && "hover:bg-muted/50 transition-colors",
        !isLast && "border-b border-border"
      )}
    >
      <div className="p-2 rounded-xl bg-muted">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {trailing}
      {showArrow && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </Component>
  );
};
