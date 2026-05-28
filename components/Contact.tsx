'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram } from 'lucide-react';

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  return (
    <section id="contact" className="relative py-32 px-6 md:px-10 max-w-4xl mx-auto text-center">
      
      <div ref={containerRef} className="relative z-10 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="font-display font-medium text-gold tracking-widest text-sm mb-4 block">03 // GET IN TOUCH</span>
          <h2 className="font-hero text-5xl md:text-7xl font-bold">Catch Me Here</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12"
        >
          Want to share a random fun fact, talk about tech, or just say hi? Drop into my DMs on Instagram!
        </motion.p>

        <motion.a
          href="https://instagram.com/allen.mkv"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-[#E1306C] rounded-full text-white font-display font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(225,48,108,0.3)] hover:shadow-[0_0_60px_rgba(225,48,108,0.5)] transition-shadow"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          
          <Instagram size={24} className="relative z-10" />
          <span className="relative z-10">@allen.mkv</span>
        </motion.a>

      </div>

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none -z-10" />

    </section>
  );
}
