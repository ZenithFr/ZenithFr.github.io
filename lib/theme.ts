'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'eclipse'>('dark');

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'eclipse';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme === 'eclipse' ? 'eclipse' : 'dark');
    }
  }, []);

  return theme;
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'eclipse' ? 'dark' : 'eclipse';
  
  if (newTheme === 'eclipse') {
    document.documentElement.setAttribute('data-theme', 'eclipse');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark'); // Or removeAttribute depending on setup
  }
  
  localStorage.setItem('theme', newTheme);
  // Dispatch a custom event so hooks can listen if needed
  window.dispatchEvent(new Event('themechange'));
}
