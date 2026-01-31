import { NewsCard, SportCategory } from '@/types/news';

export const sportCategories: { id: SportCategory; name: string; icon: string }[] = [
  { id: 'football', name: 'Voetbal', icon: '⚽' },
  { id: 'basketball', name: 'Basketbal', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'chess', name: 'Schaken', icon: '♟️' },
  { id: 'cycling', name: 'Wielrennen', icon: '🚴' },
  { id: 'motorsport', name: 'Motorsport', icon: '🏎️' },
  { id: 'esports', name: 'Esports', icon: '🎮' },
  { id: 'local', name: 'Lokaal', icon: '📍' },
  { id: 'hockey', name: 'Hockey', icon: '🏑' },
  { id: 'athletics', name: 'Atletiek', icon: '🏃' },
  { id: 'swimming', name: 'Zwemmen', icon: '🏊' },
  { id: 'boxing', name: 'Boksen', icon: '🥊' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
];

export const mockNewsCards: NewsCard[] = [
  {
    id: '1',
    headline: 'Ajax wint spectaculaire wedstrijd tegen Feyenoord met 3-2',
    summary: 'In een zenuwslopende Klassieker wist Ajax dankzij een late treffer van Brian Brobbey de overwinning te pakken. De wedstrijd kende vijf doelpunten en twee rode kaarten.',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
    tags: [
      { id: 't1', name: 'Ajax', type: 'team', category: 'football' },
      { id: 't2', name: 'Feyenoord', type: 'team', category: 'football' },
      { id: 't3', name: 'Brian Brobbey', type: 'player', category: 'football' },
      { id: 't4', name: 'Eredivisie', type: 'league', category: 'football' },
    ],
    primaryCategory: 'football',
    sourceUrl: 'https://nos.nl',
    sourceName: 'NOS Sport',
    publishedAt: '2024-01-15T20:45:00Z',
    aiProcessedAt: '2024-01-15T21:00:00Z',
    hasPeopleContext: true,
    hasSportRules: true,
    relatedCardIds: ['2', '5'],
  },
  {
    id: '2',
    headline: 'Magnus Carlsen verbreekt record met 125 opeenvolgende overwinningen',
    summary: 'De Noorse schaakgrootmeester heeft geschiedenis geschreven met zijn 125e achtereenvolgende zege in rapid-schaken. Experts noemen het een ongekende prestatie.',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80',
    tags: [
      { id: 't5', name: 'Magnus Carlsen', type: 'player', category: 'chess' },
      { id: 't6', name: 'Schaken', type: 'sport', category: 'chess' },
      { id: 't7', name: 'Wereldrecord', type: 'event', category: 'chess' },
    ],
    primaryCategory: 'chess',
    sourceUrl: 'https://chess.com',
    sourceName: 'Chess.com',
    publishedAt: '2024-01-15T18:30:00Z',
    aiProcessedAt: '2024-01-15T18:45:00Z',
    hasPeopleContext: true,
    hasSportRules: true,
    relatedCardIds: ['8'],
  },
  {
    id: '3',
    headline: 'Mathieu van der Poel wint voor de vierde keer het WK veldrijden',
    summary: 'In dominant stijl reed Van der Poel weg van de concurrentie op het WK in Liévin. De Nederlandse kampioen finishte met meer dan een minuut voorsprong.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    tags: [
      { id: 't8', name: 'Mathieu van der Poel', type: 'player', category: 'cycling' },
      { id: 't9', name: 'WK Veldrijden', type: 'event', category: 'cycling' },
      { id: 't10', name: 'Nederland', type: 'team', category: 'cycling' },
    ],
    primaryCategory: 'cycling',
    sourceUrl: 'https://wielerflits.nl',
    sourceName: 'Wielerflits',
    publishedAt: '2024-01-14T16:00:00Z',
    aiProcessedAt: '2024-01-14T16:15:00Z',
    hasPeopleContext: true,
    hasSportRules: true,
    relatedCardIds: ['6'],
  },
  {
    id: '4',
    headline: 'Max Verstappen start ontwikkeling eigen raceteam voor 2026',
    summary: 'De drievoudig wereldkampioen heeft aangekondigd een eigen raceteam op te richten. Het team zal deelnemen aan de Formule 2 en mogelijk doorgroeien naar hogere klassen.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    tags: [
      { id: 't11', name: 'Max Verstappen', type: 'player', category: 'motorsport' },
      { id: 't12', name: 'Formule 2', type: 'league', category: 'motorsport' },
      { id: 't13', name: 'Raceteam', type: 'event', category: 'motorsport' },
    ],
    primaryCategory: 'motorsport',
    sourceUrl: 'https://motorsport.com',
    sourceName: 'Motorsport.com',
    publishedAt: '2024-01-14T12:00:00Z',
    aiProcessedAt: '2024-01-14T12:15:00Z',
    hasPeopleContext: true,
    hasSportRules: false,
    relatedCardIds: [],
  },
  {
    id: '5',
    headline: 'Nederlandse esports team wint League of Legends World Championship',
    summary: 'Team Heretics, met een volledig Nederlandse line-up, heeft de wereldtitel binnengehaald na een spannende finale tegen het Zuid-Koreaanse T1.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    tags: [
      { id: 't14', name: 'Team Heretics', type: 'team', category: 'esports' },
      { id: 't15', name: 'League of Legends', type: 'event', category: 'esports' },
      { id: 't16', name: 'World Championship', type: 'event', category: 'esports' },
    ],
    primaryCategory: 'esports',
    sourceUrl: 'https://esportsinsider.com',
    sourceName: 'Esports Insider',
    publishedAt: '2024-01-13T22:00:00Z',
    aiProcessedAt: '2024-01-13T22:15:00Z',
    hasPeopleContext: false,
    hasSportRules: true,
    relatedCardIds: [],
  },
  {
    id: 'ad1',
    headline: 'Ontdek de nieuwe Nike Air Max collectie',
    summary: 'Presteer op je best met de nieuwste sportschoenen. Nu beschikbaar in alle maten en kleuren.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    tags: [{ id: 'ad-t1', name: 'Sportkleding', type: 'sport', category: 'athletics' }],
    primaryCategory: 'athletics',
    sourceUrl: 'https://nike.com',
    sourceName: 'Nike',
    publishedAt: '2024-01-15T00:00:00Z',
    aiProcessedAt: '2024-01-15T00:00:00Z',
    hasPeopleContext: false,
    hasSportRules: false,
    relatedCardIds: [],
    isAd: true,
    adData: {
      advertiser: 'Nike',
      cta: 'Shop Nu',
      ctaUrl: 'https://nike.com/air-max',
    },
  },
  {
    id: '6',
    headline: 'Lokale held: Twentse darter wint PDC Tour event',
    summary: 'Danny van Tansen uit Enschede heeft verrassend het PDC Players Championship gewonnen. De 24-jarige versloeg wereldkampioen Luke Humphries in de finale.',
    imageUrl: 'https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=800&q=80',
    tags: [
      { id: 't17', name: 'PDC', type: 'league', category: 'local' },
      { id: 't18', name: 'Darts', type: 'sport', category: 'local' },
      { id: 't19', name: 'Enschede', type: 'team', category: 'local' },
    ],
    primaryCategory: 'local',
    sourceUrl: 'https://tubantia.nl',
    sourceName: 'Tubantia',
    publishedAt: '2024-01-13T19:30:00Z',
    aiProcessedAt: '2024-01-13T19:45:00Z',
    hasPeopleContext: true,
    hasSportRules: true,
    relatedCardIds: [],
  },
  {
    id: '7',
    headline: 'Giannis Antetokounmpo leidt Bucks naar 15e zege op rij',
    summary: 'Met 42 punten en 12 rebounds was de Griekse superster opnieuw beslissend. Milwaukee staat nu bovenaan in de Eastern Conference.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    tags: [
      { id: 't20', name: 'Giannis Antetokounmpo', type: 'player', category: 'basketball' },
      { id: 't21', name: 'Milwaukee Bucks', type: 'team', category: 'basketball' },
      { id: 't22', name: 'NBA', type: 'league', category: 'basketball' },
    ],
    primaryCategory: 'basketball',
    sourceUrl: 'https://nba.com',
    sourceName: 'NBA.com',
    publishedAt: '2024-01-13T05:00:00Z',
    aiProcessedAt: '2024-01-13T05:15:00Z',
    hasPeopleContext: true,
    hasSportRules: true,
    relatedCardIds: [],
  },
  {
    id: '8',
    headline: 'Tallon Griekspoor bereikt halve finale Australian Open',
    summary: 'De Nederlandse tennisser schreef geschiedenis door als eerste Nederlander in 20 jaar de halve finale van een Grand Slam te bereiken.',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
    tags: [
      { id: 't23', name: 'Tallon Griekspoor', type: 'player', category: 'tennis' },
      { id: 't24', name: 'Australian Open', type: 'event', category: 'tennis' },
      { id: 't25', name: 'Grand Slam', type: 'league', category: 'tennis' },
    ],
    primaryCategory: 'tennis',
    sourceUrl: 'https://tennisworld.nl',
    sourceName: 'Tennis World',
    publishedAt: '2024-01-12T10:00:00Z',
    aiProcessedAt: '2024-01-12T10:15:00Z',
    hasPeopleContext: true,
    hasSportRules: true,
    relatedCardIds: [],
  },
];

export const getShuffledFeed = (selectedCategories?: SportCategory[]): NewsCard[] => {
  let cards = [...mockNewsCards];
  
  if (selectedCategories && selectedCategories.length > 0) {
    // Prioritize selected categories but include some others for discovery
    cards = cards.sort((a, b) => {
      const aSelected = selectedCategories.includes(a.primaryCategory);
      const bSelected = selectedCategories.includes(b.primaryCategory);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return Math.random() - 0.5;
    });
  } else {
    // Shuffle randomly
    cards = cards.sort(() => Math.random() - 0.5);
  }
  
  return cards;
};
