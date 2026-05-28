'use client';

import { useState } from 'react';
import LenisProvider from '@/components/LenisProvider';
import Loader from '@/components/Loader';
import CursorGlow from '@/components/CursorGlow';
import ThreeBackground from '@/components/ThreeBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Links from '@/components/Links';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <LenisProvider>
      <CursorGlow />
      
      {/* Anime.js Stagger Loader */}
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      {/* Main Content wrapper - hidden until loaded */}
      <div className={`relative min-h-screen transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* WebGL Background */}
        {!loading && <ThreeBackground />}
        
        {/* CSS Grain Overlay */}
        <div className="grain-overlay" />
        
        {/* Navbar */}
        <Navbar />
        
        <main className="relative z-10 flex flex-col">
          <Hero />
          <About />
          <Links />
          <Contact />
        </main>
        
        <Footer />
        
      </div>
    </LenisProvider>
  );
}
