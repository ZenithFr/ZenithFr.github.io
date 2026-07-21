<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import Lenis from '@studio-freight/lenis';

  gsap.registerPlugin(ScrollTrigger);

  let decryptTarget;
  let lines = [];
  let marqueeContainer;

  onMount(() => {
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Link Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 2. Decrypt Animation (Custom Vanilla Scramble)
    const chars = '!<>-_\\\\/[]{}—=+*^?#_';
    let originalText = decryptTarget.innerText;
    let iterations = 0;
    
    const scrambleInterval = setInterval(() => {
      decryptTarget.innerText = originalText.split('')
        .map((letter, index) => {
          if(index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if(iterations >= originalText.length) {
        clearInterval(scrambleInterval);
      }
      iterations += 1/4; 
    }, 40);

    // 3. Line Reveal on scroll
    lines.forEach((line, i) => {
      if(line) {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          delay: i * 0.1
        });
      }
    });

    // 4. Marquee Infinite Scroll
    gsap.to(marqueeContainer, {
      xPercent: -50,
      ease: 'none',
      duration: 10,
      repeat: -1
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });
</script>

<div class="noise-overlay"></div>

<main>
  <!-- HERO SECTION -->
  <section class="hero">
    <div class="header">
      <h1 class="glitch-title">
        <span class="scramble" bind:this={decryptTarget}>ZENITH</span>
      </h1>
      <p class="subtitle">Creative &middot; Developer &middot; Designer</p>
    </div>
  </section>

  <!-- MARQUEE SECTION -->
  <div class="marquee-wrapper">
    <div class="marquee" bind:this={marqueeContainer}>
      <span class="marquee-text">TINKERING <span class="dot">&bull;</span> BREAKING THINGS <span class="dot">&bull;</span> FIXING THEM LATER <span class="dot">&bull;</span> </span>
      <span class="marquee-text">TINKERING <span class="dot">&bull;</span> BREAKING THINGS <span class="dot">&bull;</span> FIXING THEM LATER <span class="dot">&bull;</span> </span>
    </div>
  </div>

  <!-- ABOUT SECTION -->
  <section class="about">
    <div class="line-mask">
      <h2 bind:this={lines[0]}>01 // ABOUT ME</h2>
    </div>
    <div class="about-content">
      <div class="line-mask">
        <p bind:this={lines[1]}>Yo! I am Allen. All of this website, you know,</p>
      </div>
      <div class="line-mask">
        <p bind:this={lines[2]}>it is nothing but one gigantic hobby project.</p>
      </div>
      <div class="line-mask">
        <p bind:this={lines[3]}>My mind is like a web browser with 100 open tabs.</p>
      </div>
    </div>
  </section>

</main>

<style>
  .hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px solid rgba(240, 240, 240, 0.1);
  }

  .header {
    text-align: center;
  }

  .glitch-title {
    font-size: 8rem;
    font-weight: 800;
    line-height: 1;
    color: var(--secondary);
    position: relative;
  }

  /* Chromatic Aberration hover effect */
  .glitch-title:hover {
    text-shadow: 
      3px 0px 0 var(--green),
      -3px 0px 0 var(--purple);
    cursor: crosshair;
  }

  .subtitle {
    font-size: 1.2rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--green);
    margin-top: 1rem;
  }

  /* MARQUEE */
  .marquee-wrapper {
    overflow: hidden;
    white-space: nowrap;
    padding: 3rem 0;
    border-bottom: 1px solid rgba(240, 240, 240, 0.1);
    background: #080808;
  }

  .marquee {
    display: inline-block;
    will-change: transform;
  }

  .marquee-text {
    font-size: 4rem;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    color: transparent;
    -webkit-text-stroke: 1px var(--purple);
    padding-right: 2rem;
  }

  .dot {
    color: var(--green);
    -webkit-text-stroke: 0;
  }

  /* ABOUT */
  .about {
    min-height: 100vh;
    padding: 10rem 5vw;
  }

  .line-mask {
    overflow: hidden;
  }

  .about h2 {
    font-size: 2rem;
    color: var(--green);
    margin-bottom: 3rem;
  }

  .about-content p {
    font-size: 3rem;
    line-height: 1.2;
    max-width: 1200px;
    will-change: transform, opacity;
  }
</style>
