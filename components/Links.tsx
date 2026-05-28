'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Instagram, Mail, ArrowUpRight } from 'lucide-react';

const links = [
  {
    name: 'GitHub',
    desc: 'Code & Projects',
    href: 'https://github.com/ZenithFr',
    icon: Github,
    color: 'hover:text-[#2dba4e]', // GitHub green subtle hint
  },
  {
    name: 'Instagram',
    desc: '@allen.mkv',
    href: 'https://instagram.com/allen.mkv',
    icon: Instagram,
    color: 'hover:text-[#E1306C]',
  },
  {
    name: 'Email',
    desc: 'allensamc.s@gmail.com',
    href: 'mailto:allensamc.s@gmail.com',
    icon: Mail,
    color: 'hover:text-gold',
  }
];

function TiltCard({ link }: { link: typeof links[0] }) {
  const ref = useRef<HTMLAnchorElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative flex items-center justify-between p-6 md:p-8 rounded-2xl bg-charcoal/40 backdrop-blur-sm border border-border-subtle hover:border-gold/40 hover:bg-charcoal/60 transition-colors"
    >
      <div className="flex items-center gap-6" style={{ transform: "translateZ(30px)" }}>
        <div className={`p-4 rounded-xl bg-obsidian border border-border-subtle transition-colors duration-300 ${link.color}`}>
          <link.icon size={28} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-gold transition-colors">{link.name}</h3>
          <p className="text-muted text-sm">{link.desc}</p>
        </div>
      </div>
      
      <div 
        style={{ transform: "translateZ(20px)" }}
        className="w-10 h-10 rounded-full bg-obsidian border border-border-subtle flex items-center justify-center text-muted group-hover:bg-gold group-hover:text-obsidian group-hover:border-gold transition-all duration-300 transform group-hover:scale-110"
      >
        <ArrowUpRight size={20} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.a>
  );
}

export default function Links() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section id="links" className="relative py-32 px-6 md:px-10 max-w-5xl mx-auto">
      
      <div className="absolute top-10 left-10 text-[200px] font-hero font-black text-white/5 select-none pointer-events-none">
        02
      </div>

      <div ref={containerRef} className="relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center justify-end gap-4">
            <h2 className="font-hero text-4xl md:text-5xl font-bold">My Links</h2>
            <span className="font-display font-medium text-gold tracking-widest text-sm">// 02</span>
          </div>
          <div className="w-16 h-0.5 bg-gold mt-6 ml-auto" />
        </motion.div>

        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="flex flex-col gap-6"
          style={{ perspective: "1000px" }}
        >
          {links.map((link) => (
            <motion.div
              key={link.name}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
              }}
            >
              <TiltCard link={link} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
