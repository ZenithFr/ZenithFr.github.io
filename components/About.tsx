'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skills = [
  'Web Dev', 'Design', 'Random Trivia', 'Tinkering', 'Breaking Things', 'Fixing Them Later'
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section id="about" className="relative py-32 px-6 md:px-10 max-w-7xl mx-auto">
      
      {/* Background Section Number */}
      <div className="absolute top-10 right-10 text-[200px] font-hero font-black text-white/5 select-none pointer-events-none">
        01
      </div>

      <div ref={containerRef} className="relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <div className="flex items-center gap-4">
            <span className="font-display font-medium text-gold tracking-widest text-sm">01 //</span>
            <h2 className="font-hero text-4xl md:text-5xl font-bold">About Me</h2>
          </div>
          <div className="w-16 h-0.5 bg-gold mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Bio Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6 text-lg md:text-xl text-muted leading-relaxed"
          >
            <p className="text-white font-medium">
              Hey! I&apos;m Allen. My brain is basically a web browser with 100 tabs open at all times.
            </p>
            <p>
              I love diving down rabbit holes, soaking up random knowledge, and figuring out how things tick.
            </p>
            <p>
              I don&apos;t have &quot;clients&quot; or &quot;business models&quot; — I just build things because learning is wildly fun. Welcome to my digital playground!
            </p>
          </motion.div>

          {/* Stats & Skills */}
          <div className="flex flex-col gap-16">
            
            <motion.div 
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {[
                { num: '∞', label: 'Curiosity' },
                { num: '100+', label: 'Late Night Ideas' },
                { num: '0', label: 'Boring Days' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.4 } }
                  }}
                  className="bg-charcoal/50 backdrop-blur-md border border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-gold/30 transition-colors"
                >
                  <div className="text-4xl font-display font-bold text-gold mb-2">{stat.num}</div>
                  <div className="text-sm font-medium text-muted uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h3 className="text-2xl font-hero font-bold mb-2">Jack of all trades</h3>
              <p className="text-muted mb-6">I can&apos;t sit still with just one thing, so I venture out for more:</p>
              
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-charcoal border border-border-subtle text-sm font-medium text-white/90 hover:text-white hover:border-gold/50 hover:bg-charcoal-light transition-all cursor-default"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
