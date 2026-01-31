import { useState } from 'react';
import { sportCategories } from '@/data/mockNews';
import { SportCategory } from '@/types/news';
import { cn } from '@/lib/utils';
import { ChevronRight, Zap } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (selectedCategories: SportCategory[]) => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<SportCategory[]>([]);

  const toggleCategory = (category: SportCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else {
      onComplete(selectedCategories);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="pt-safe-top px-6 pt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">SportScroll</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">
              Welkom bij<br />SportScroll
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Al het sportnieuws dat je nodig hebt, samengevoegd en vertaald door AI. 
              Scroll door eindeloos nieuws, van voetbal tot schaken.
            </p>

            <div className="space-y-4">
              <Feature 
                icon="⚡" 
                title="Slim samengevat" 
                description="AI vat artikelen samen en vertaalt naar het Nederlands"
              />
              <Feature 
                icon="🎯" 
                title="Gepersonaliseerd" 
                description="Zie meer van wat jij interessant vindt"
              />
              <Feature 
                icon="📚" 
                title="Context op aanvraag" 
                description="Leer meer over spelers, teams en spelregels"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">
              Wat interesseert je?
            </h2>
            <p className="text-muted-foreground mb-6">
              Selecteer minstens 3 categorieën. Je kunt dit later aanpassen.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {sportCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    selectedCategories.includes(category.id)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <span className="text-2xl mb-2 block">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pb-safe-bottom">
        <button
          onClick={handleContinue}
          disabled={step === 1 && selectedCategories.length < 3}
          className={cn(
            "w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2",
            "transition-all duration-200",
            (step === 0 || selectedCategories.length >= 3)
              ? "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow"
              : "bg-muted text-muted-foreground"
          )}
        >
          {step === 0 ? 'Aan de slag' : 'Start met scrollen'}
          <ChevronRight className="w-5 h-5" />
        </button>

        {step === 1 && (
          <button
            onClick={() => onComplete([])}
            className="w-full mt-3 py-3 text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            Sla over en bekijk alles
          </button>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className={cn(
            "w-2 h-2 rounded-full transition-colors",
            step === 0 ? "bg-primary" : "bg-muted"
          )} />
          <div className={cn(
            "w-2 h-2 rounded-full transition-colors",
            step === 1 ? "bg-primary" : "bg-muted"
          )} />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="flex gap-4 p-4 rounded-2xl bg-muted/50">
    <span className="text-2xl">{icon}</span>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);
