import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
] as const;

export default function LanguageSettings() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

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
          <h1 className="text-xl font-bold">{t('settings.language')}</h1>
        </div>
      </div>

      {/* Language Options */}
      <div className="px-4 py-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors",
                index !== languages.length - 1 && "border-b border-border"
              )}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="flex-1 font-medium">{lang.name}</span>
              {language === lang.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
