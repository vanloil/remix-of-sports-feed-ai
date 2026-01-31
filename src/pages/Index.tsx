import { useState, useEffect } from 'react';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Feed } from '@/components/feed/Feed';
import { SportCategory } from '@/types/news';

const ONBOARDING_KEY = 'sportscroll_onboarding_complete';
const CATEGORIES_KEY = 'sportscroll_categories';

const Index = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<SportCategory[]>([]);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem(ONBOARDING_KEY) === 'true';
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    setHasCompletedOnboarding(completed);
    if (savedCategories) {
      setSelectedCategories(JSON.parse(savedCategories));
    }
  }, []);

  const handleOnboardingComplete = (categories: SportCategory[]) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    setSelectedCategories(categories);
    setHasCompletedOnboarding(true);
  };

  // Loading state
  if (hasCompletedOnboarding === null) {
    return (
      <div className="min-h-[100dvh] bg-feed-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Show the feed
  return <Feed selectedCategories={selectedCategories} />;
};

export default Index;
