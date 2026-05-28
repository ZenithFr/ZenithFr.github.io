'use client';

import { Github, Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-border-subtle mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="text-muted text-sm font-medium">
          © {new Date().getFullYear()} Zenith. Crafted with passion.
        </div>

        <div className="flex items-center gap-6">
          <motion.a 
            href="https://github.com/ZenithFr" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -3, color: '#fff' }}
            className="text-muted transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </motion.a>
          
          <motion.a 
            href="https://instagram.com/allen.mkv" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -3, color: '#E1306C' }}
            className="text-muted transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </motion.a>
          
          <motion.a 
            href="mailto:allensamc.s@gmail.com"
            whileHover={{ y: -3, color: '#d4af37' }}
            className="text-muted transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
          </motion.a>
        </div>

      </div>
    </footer>
  );
}
