import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'nl' | 'en';

interface Translations {
  [key: string]: {
    nl: string;
    en: string;
  };
}

const translations: Translations = {
  // General
  'app.name': { nl: 'SportScroll', en: 'SportScroll' },
  'app.tagline': { nl: 'Gemaakt met ❤️ voor sportfans', en: 'Made with ❤️ for sports fans' },
  
  // Auth
  'auth.login': { nl: 'Inloggen', en: 'Login' },
  'auth.signup': { nl: 'Registreren', en: 'Sign up' },
  'auth.logout': { nl: 'Uitloggen', en: 'Logout' },
  'auth.email': { nl: 'E-mailadres', en: 'Email address' },
  'auth.password': { nl: 'Wachtwoord', en: 'Password' },
  'auth.name': { nl: 'Naam', en: 'Name' },
  'auth.noAccount': { nl: 'Nog geen account?', en: "Don't have an account?" },
  'auth.hasAccount': { nl: 'Al een account?', en: 'Already have an account?' },
  'auth.loginRequired': { nl: 'Log in om reacties te bekijken en plaatsen', en: 'Login to view and post comments' },
  'auth.loginToSave': { nl: 'Log in om artikelen op te slaan', en: 'Login to save articles' },
  
  // Settings
  'settings.title': { nl: 'Instellingen', en: 'Settings' },
  'settings.preferences': { nl: 'Voorkeuren', en: 'Preferences' },
  'settings.manageInterests': { nl: 'Interesses beheren', en: 'Manage interests' },
  'settings.manageInterestsDesc': { nl: 'Pas je favoriete sporten en onderwerpen aan', en: 'Customize your favorite sports and topics' },
  'settings.notifications': { nl: 'Meldingen', en: 'Notifications' },
  'settings.notificationsDesc': { nl: 'Ontvang updates over gevolgde onderwerpen', en: 'Receive updates about followed topics' },
  'settings.language': { nl: 'Taal', en: 'Language' },
  'settings.display': { nl: 'Weergave', en: 'Display' },
  'settings.darkMode': { nl: 'Donkere modus', en: 'Dark mode' },
  'settings.darkModeDesc': { nl: 'Verander het uiterlijk van de app', en: 'Change the appearance of the app' },
  'settings.profanityFilter': { nl: 'Scheldwoordenfilter', en: 'Profanity filter' },
  'settings.profanityFilterDesc': { nl: 'Verberg ongepaste reacties', en: 'Hide inappropriate comments' },
  'settings.admin': { nl: 'Admin', en: 'Admin' },
  'settings.adminTools': { nl: 'Beheerderstools', en: 'Admin tools' },
  'settings.adminToolsDesc': { nl: 'Tags corrigeren en content modereren', en: 'Correct tags and moderate content' },
  
  // Profile
  'profile.title': { nl: 'Profiel', en: 'Profile' },
  'profile.bookmarks': { nl: 'Opgeslagen artikelen', en: 'Saved articles' },
  'profile.noBookmarks': { nl: 'Je hebt nog geen artikelen opgeslagen', en: "You haven't saved any articles yet" },
  'profile.interests': { nl: 'Jouw interesses', en: 'Your interests' },
  
  // Feed
  'feed.share': { nl: 'Delen', en: 'Share' },
  'feed.linkCopied': { nl: 'Link gekopieerd!', en: 'Link copied!' },
  'feed.player': { nl: 'Speler', en: 'Player' },
  'feed.team': { nl: 'Team', en: 'Team' },
  'feed.rules': { nl: 'Regels', en: 'Rules' },
  'feed.related': { nl: 'Gerelateerd', en: 'Related' },
  'feed.sources': { nl: 'Bronnen', en: 'Sources' },
  'feed.comments': { nl: 'Reacties', en: 'Comments' },
  
  // Tags
  'tags.added': { nl: '{tag} toegevoegd aan je interesses', en: '{tag} added to your interests' },
  'tags.alreadyAdded': { nl: 'Deze tag staat al in je interesses', en: 'This tag is already in your interests' },
  
  // Info sheets
  'info.aboutPerson': { nl: 'Over de persoon', en: 'About the person' },
  'info.aboutSport': { nl: 'Over de sport', en: 'About the sport' },
  'info.aboutTeam': { nl: 'Over het team', en: 'About the team' },
  'info.relatedNews': { nl: 'Gerelateerd nieuws', en: 'Related news' },
  'info.sources': { nl: 'Bronnen', en: 'Sources' },
  'info.sourcesDesc': { nl: 'Dit artikel is samengesteld op basis van de volgende bronnen:', en: 'This article was compiled from the following sources:' },
  'info.published': { nl: 'Gepubliceerd:', en: 'Published:' },
  'info.loading': { nl: 'Informatie laden...', en: 'Loading information...' },
  'info.noData': { nl: 'Geen informatie beschikbaar', en: 'No information available' },
  'info.wikiSource': { nl: 'Bron: Wikipedia', en: 'Source: Wikipedia' },
  'info.imageCredit': { nl: 'Afbeelding', en: 'Image credit' },
  
  // Team
  'team.info': { nl: 'Teaminformatie', en: 'Team information' },
  'team.players': { nl: 'Spelers', en: 'Players' },
  'team.back': { nl: 'Terug naar team', en: 'Back to team' },
  
  // Player types
  'player.footballer': { nl: 'Voetballer', en: 'Footballer' },
  'player.chessPlayer': { nl: 'Schaakspeler', en: 'Chess player' },
  'player.cyclist': { nl: 'Wielrenner', en: 'Cyclist' },
  'player.driver': { nl: 'Coureur', en: 'Racing driver' },
  'player.tennisPlayer': { nl: 'Tennisser', en: 'Tennis player' },
  'player.basketballPlayer': { nl: 'Basketballer', en: 'Basketball player' },
  
  // Comments
  'comments.write': { nl: 'Schrijf een reactie...', en: 'Write a comment...' },
  'comments.writeReply': { nl: 'Schrijf een antwoord...', en: 'Write a reply...' },
  'comments.post': { nl: 'Plaatsen', en: 'Post' },
  'comments.reply': { nl: 'Reageren', en: 'Reply' },
  'comments.empty': { nl: 'Nog geen reacties. Wees de eerste!', en: 'No comments yet. Be the first!' },
  
  // Expandable content
  'readMore': { nl: 'Lees meer', en: 'Read more' },
  'showLess': { nl: 'Toon minder', en: 'Show less' },
  'loading': { nl: 'Laden...', en: 'Loading...' },
  
  // Time
  'time.justNow': { nl: 'Zojuist', en: 'Just now' },
  
  // Card
  'card.notFound': { nl: 'Kaart niet gevonden', en: 'Card not found' },
  'card.backToFeed': { nl: 'Terug naar de feed', en: 'Back to the feed' },
  
  // Related
  'related.description': { nl: 'Meer nieuws over dezelfde onderwerpen (min. 4 overlappende tags)', en: 'More news about the same topics (min. 4 overlapping tags)' },
  'related.none': { nl: 'Geen gerelateerde artikelen gevonden met voldoende overlappende tags', en: 'No related articles found with enough overlapping tags' },
  
  // Onboarding
  'onboarding.welcome': { nl: 'Welkom bij', en: 'Welcome to' },
  'onboarding.intro': { nl: 'Al het sportnieuws dat je nodig hebt, samengevoegd en vertaald door AI. Scroll door eindeloos nieuws, van voetbal tot schaken.', en: 'All the sports news you need, aggregated and translated by AI. Scroll through endless news, from football to chess.' },
  'onboarding.smartSummary': { nl: 'Slim samengevat', en: 'Smart summaries' },
  'onboarding.smartSummaryDesc': { nl: 'AI vat artikelen samen en vertaalt naar het Nederlands', en: 'AI summarizes articles and translates to Dutch' },
  'onboarding.personalized': { nl: 'Gepersonaliseerd', en: 'Personalized' },
  'onboarding.personalizedDesc': { nl: 'Zie meer van wat jij interessant vindt', en: 'See more of what interests you' },
  'onboarding.context': { nl: 'Context op aanvraag', en: 'Context on demand' },
  'onboarding.contextDesc': { nl: 'Leer meer over spelers, teams en spelregels', en: 'Learn more about players, teams and rules' },
  'onboarding.getStarted': { nl: 'Aan de slag', en: 'Get started' },
  'onboarding.startScrolling': { nl: 'Start met scrollen', en: 'Start scrolling' },
  'onboarding.whatInterests': { nl: 'Wat interesseert je?', en: 'What interests you?' },
  'onboarding.selectCategories': { nl: 'Selecteer minstens 3 categorieën. Je kunt dit later aanpassen.', en: 'Select at least 3 categories. You can change this later.' },
  'onboarding.skipAll': { nl: 'Sla over en bekijk alles', en: 'Skip and view everything' },
  
  // Admin
  'admin.title': { nl: 'Beheerderstools', en: 'Admin tools' },
  'admin.searchCards': { nl: 'Zoek op kaart ID...', en: 'Search by card ID...' },
  'admin.editTags': { nl: 'Tags bewerken', en: 'Edit tags' },
  'admin.noResults': { nl: 'Geen kaarten gevonden', en: 'No cards found' },
  
  // Interests
  'interests.title': { nl: 'Interesses beheren', en: 'Manage interests' },
  'interests.search': { nl: 'Zoek interesses...', en: 'Search interests...' },
  'interests.active': { nl: 'Actieve interesses', en: 'Active interests' },
  'interests.available': { nl: 'Beschikbare interesses', en: 'Available interests' },
  'interests.save': { nl: 'Opslaan', en: 'Save' },
  'interests.noActive': { nl: 'Nog geen interesses geselecteerd', en: 'No interests selected yet' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'sportscroll_language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
