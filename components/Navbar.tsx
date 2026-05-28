'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleTheme } from '@/lib/theme';
import { Moon, Sun, Menu, X, Github, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'eclipse'>('dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Initial theme check
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'eclipse') setTheme('eclipse');

    const handleThemeChange = () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'eclipse' ? 'eclipse' : 'dark');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('themechange', handleThemeChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Links', href: '#links' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex justify-between items-center ${
          scrolled 
            ? 'py-4 px-6 md:px-10 bg-charcoal/80 backdrop-blur-xl border-b border-border-subtle' 
            : 'py-6 px-6 md:px-10 bg-transparent'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 z-[101]">
          <div className="w-9 h-9 rounded bg-gold flex items-center justify-center font-display font-bold text-white text-base">
            Z
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">ZENITH</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-muted hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <a href="https://github.com/ZenithFr" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
            <Github size={18} />
          </a>
          <a href="https://instagram.com/allen.mkv" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
            <Instagram size={18} />
          </a>
        </div>

        <div className="flex items-center gap-4 z-[101]">
          <button 
            onClick={() => {
              toggleTheme();
              setTheme(theme === 'eclipse' ? 'dark' : 'eclipse');
            }}
            className="w-10 h-10 rounded-full bg-charcoal border border-border-subtle flex items-center justify-center text-white hover:border-gold/50 transition-colors relative overflow-hidden"
            aria-label="Toggle Theme"
          >
            <motion.div
              initial={false}
              animate={{
                rotate: theme === 'eclipse' ? -90 : 0,
                scale: theme === 'eclipse' ? 0 : 1,
                opacity: theme === 'eclipse' ? 0 : 1
              }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Moon size={18} />
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                rotate: theme === 'eclipse' ? 0 : 90,
                scale: theme === 'eclipse' ? 1 : 0,
                opacity: theme === 'eclipse' ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Sun size={18} />
            </motion.div>
          </button>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-obsidian flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <Link 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-display font-bold text-white hover:text-gold transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-6 mt-4"
            >
              <a href="https://github.com/ZenithFr" target="_blank" rel="noopener noreferrer" className="p-3 bg-charcoal rounded-full text-white">
                <Github size={24} />
              </a>
              <a href="https://instagram.com/allen.mkv" target="_blank" rel="noopener noreferrer" className="p-3 bg-charcoal rounded-full text-white">
                <Instagram size={24} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
