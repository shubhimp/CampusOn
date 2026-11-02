import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Prioritize URL query param e.g. ?theme=dark or ?theme=light
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme === 'dark' || urlTheme === 'light') {
          localStorage.setItem('campuson_theme', urlTheme);
          return urlTheme;
        }
        // 2. Local storage
        const stored = localStorage.getItem('campuson_theme');
        if (stored === 'dark' || stored === 'light') {
          return stored;
        }
      } catch (e) {}
    }
    // Default theme matching Pro Skilll (Obsidian Dark with Golden Yellow)
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
    try {
      localStorage.setItem('campuson_theme', theme);
    } catch (e) {}

    // Sync URL parameter without page reload
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('theme') !== theme) {
        url.searchParams.set('theme', theme);
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {}
  }, [theme]);

  // Listen for browser navigation changes or search param modifications
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme');
        if (urlTheme && (urlTheme === 'dark' || urlTheme === 'light') && urlTheme !== theme) {
          setTheme(urlTheme);
        }
      } catch (e) {}
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode);
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
