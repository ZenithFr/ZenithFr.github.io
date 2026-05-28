'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { motion } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current || !titleRef.current) return;

    // Entrance Animation (similar to original GSAP cinematic)
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // Initial state set for letters
    gsap.set(lettersRef.current, { 
      opacity: 0, 
      y: 120, 
      rotateX: -90, 
      scale: 0.5,
      filter: 'blur(12px)' 
    });

    tl.to(lettersRef.current, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      stagger: {
        each: 0.08,
        from: 'center'
      },
      ease: 'back.out(1.4)'
    });

    // Accent lines expand
    tl.to('.hero-line-accent', {
      opacity: 1,
      width: '220px',
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');

    // Continuous floating on the title container
    gsap.to(titleRef.current, {
      y: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 2.5
    });

    // Background gradient shift on letters
    gsap.to(lettersRef.current, {
      backgroundPosition: '0% 100%',
      duration: 3,
      stagger: {
        each: 0.2,
        repeat: -1,
        yoyo: true
      },
      ease: 'sine.inOut',
      delay: 2
    });

    // Scroll parallax effect
    gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: 150,
      opacity: 0,
    });

    // Mouse proximity glow for letters (desktop only)
    if (!window.matchMedia('(hover: none)').matches) {
      const handleMouseMove = (e: MouseEvent) => {
        lettersRef.current.forEach((letter) => {
          if (!letter) return;
          const rect = letter.getBoundingClientRect();
          const letterCenterX = rect.left + rect.width / 2;
          const letterCenterY = rect.top + rect.height / 2;
          const dx = e.clientX - letterCenterX;
          const dy = e.clientY - letterCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 300;
          const proximity = Math.max(0, 1 - distance / maxDist);

          gsap.to(letter, {
            y: -proximity * 8,
            scale: 1 + proximity * 0.05,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      };

      const handleMouseLeave = () => {
        gsap.to(lettersRef.current, {
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto'
        });
      };

      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        containerRef.current?.removeEventListener('mousemove', handleMouseMove);
        containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const subtitleWords = ['Creative', '·', 'Developer', '·', 'Designer'];

  return (
    <section ref={containerRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Decorative large orb behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Top Accent Line */}
        <div className="hero-line-accent w-0 h-[2px] bg-gold rounded-full opacity-0 mb-6" />

        <h1 ref={titleRef} className="font-hero text-[clamp(48px,14vw,220px)] font-black leading-[0.9] tracking-tighter m-0 flex items-center justify-center" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
          {'ZENITH'.split('').map((char, i) => (
            <span 
              key={i}
              ref={(el) => {
                if (el) lettersRef.current[i] = el;
              }}
              data-char={char}
              className="zenith-letter"
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Bottom Accent Line */}
        <div className="hero-line-accent w-0 h-[2px] bg-gold rounded-full opacity-0 mt-6 mb-8" />

        {/* Subtitle with Framer Motion stagger */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } }
          }}
          className="flex items-center gap-3 md:gap-4 font-display text-sm md:text-lg font-medium text-muted uppercase tracking-[0.2em]"
        >
          {subtitleWords.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { y: 20, opacity: 0, scale: word === '·' ? 0 : 1 },
                visible: { 
                  y: 0, 
                  opacity: 1, 
                  scale: 1,
                  transition: { type: 'spring', stiffness: 200, damping: 20 }
                }
              }}
              className={word === '·' ? 'text-gold' : ''}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-charcoal-light/50 backdrop-blur-sm text-xs font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
          Available for collaboration
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[30px] h-[50px] rounded-full border-2 border-muted/50 flex justify-center p-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-scroll-bounce" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted font-display">Scroll</span>
      </motion.div>

    </section>
  );
}
