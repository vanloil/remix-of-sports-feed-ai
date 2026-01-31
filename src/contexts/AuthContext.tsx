import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  bookmarks: string[];
  toggleBookmark: (cardId: string) => void;
  interests: string[];
  addInterest: (tagName: string) => void;
  removeInterest: (tagName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'sportscroll_auth';
const USERS_KEY = 'sportscroll_users';
const BOOKMARKS_KEY = 'sportscroll_bookmarks';
const INTERESTS_KEY = 'sportscroll_interests';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      setUser(parsed);
      
      // Load user's bookmarks
      const savedBookmarks = localStorage.getItem(`${BOOKMARKS_KEY}_${parsed.id}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      // Load user's interests
      const savedInterests = localStorage.getItem(`${INTERESTS_KEY}_${parsed.id}`);
      if (savedInterests) {
        setInterests(JSON.parse(savedInterests));
      }
    }

    // Also load global interests for non-logged-in users
    const globalInterests = localStorage.getItem(INTERESTS_KEY);
    if (globalInterests && !savedAuth) {
      setInterests(JSON.parse(globalInterests));
    }

    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { password: string; name: string }> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, { password: string; name: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    if (users[email]) {
      return { success: false, error: 'Dit e-mailadres is al geregistreerd' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Wachtwoord moet minimaal 6 tekens zijn' };
    }

    users[email] = { password, name };
    saveUsers(users);

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
    };

    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    
    return { success: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    if (!users[email]) {
      return { success: false, error: 'Geen account gevonden met dit e-mailadres' };
    }

    if (users[email].password !== password) {
      return { success: false, error: 'Ongeldig wachtwoord' };
    }

    const loggedInUser: User = {
      id: crypto.randomUUID(),
      email,
      name: users[email].name,
    };

    setUser(loggedInUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(loggedInUser));
    
    // Load user's bookmarks
    const savedBookmarks = localStorage.getItem(`${BOOKMARKS_KEY}_${loggedInUser.id}`);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setBookmarks([]);
    setInterests([]);
    localStorage.removeItem(AUTH_KEY);
  };

  const addInterest = (tagName: string) => {
    if (interests.includes(tagName)) return;
    
    const newInterests = [...interests, tagName];
    setInterests(newInterests);
    
    if (user) {
      localStorage.setItem(`${INTERESTS_KEY}_${user.id}`, JSON.stringify(newInterests));
    } else {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(newInterests));
    }
  };

  const removeInterest = (tagName: string) => {
    const newInterests = interests.filter(i => i !== tagName);
    setInterests(newInterests);
    
    if (user) {
      localStorage.setItem(`${INTERESTS_KEY}_${user.id}`, JSON.stringify(newInterests));
    } else {
      localStorage.setItem(INTERESTS_KEY, JSON.stringify(newInterests));
    }
  };

  const toggleBookmark = (cardId: string) => {
    if (!user) return;
    
    const newBookmarks = bookmarks.includes(cardId)
      ? bookmarks.filter(id => id !== cardId)
      : [...bookmarks, cardId];
    
    setBookmarks(newBookmarks);
    localStorage.setItem(`${BOOKMARKS_KEY}_${user.id}`, JSON.stringify(newBookmarks));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, bookmarks, toggleBookmark, interests, addInterest, removeInterest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
