'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [percent, setPercent] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    // Simulate loading percentage
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 10) + 5;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
      }
      setPercent(currentPercent);
    }, 150);

    // Stagger grid animation (Anime.js signature effect)
    const introTl = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        setTimeout(() => {
          // Finish animation
          anime.timeline({
            easing: 'easeOutExpo',
            complete: () => {
              setIsVisible(false);
              setTimeout(onComplete, 500); // Wait for unmount
            },
          })
            .add({
              targets: '.stagger-cell',
              scale: [
                { value: 1.2, easing: 'easeOutSine', duration: 200 },
                { value: 0, easing: 'easeInOutQuad', duration: 500 },
              ],
              opacity: [1, 0],
              delay: anime.stagger(30, { grid: [10, 10], from: 'center' }),
            })
            .add({
              targets: '.loader-wipe-left',
              translateX: [0, '-100%'],
              duration: 800,
              easing: 'easeInOutExpo',
            }, '-=300')
            .add({
              targets: '.loader-wipe-right',
              translateX: [0, '100%'],
              duration: 800,
              easing: 'easeInOutExpo',
            }, '-=800');
        }, 800); // Hold at 100%
      },
    });

    introTl.add({
      targets: '.stagger-cell',
      scale: [
        { value: 0.1, easing: 'easeOutSine', duration: 300 },
        { value: 1, easing: 'easeInOutQuad', duration: 600 },
      ],
      opacity: [0, 1],
      delay: anime.stagger(50, { grid: [10, 10], from: 'center' }),
    });

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-obsidian z-10" />
          
          <div className="relative z-30 flex flex-col items-center gap-8">
            <h1 className="font-hero text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 animate-pulse-glow">
              ZENITH
            </h1>
            
            <div className="flex items-center justify-center w-[100px] h-[100px]">
              <div ref={gridRef} className="flex flex-wrap w-full h-full gap-[2px]">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="stagger-cell" />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="w-[180px] h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ ease: "linear", duration: 0.2 }}
                />
              </div>
              <span className="font-display text-sm font-semibold text-muted min-w-[40px] text-right">
                {percent}%
              </span>
            </div>
          </div>

          <div className="loader-wipe-left absolute top-0 left-0 w-1/2 h-full bg-obsidian z-20" />
          <div className="loader-wipe-right absolute top-0 right-0 w-1/2 h-full bg-obsidian z-20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
