'use client';

import { useEffect, useState } from 'react';
import CodePlayground from './components/CodePlayground';

type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  url: string;
  action: string;
  mark: string;
  className: string;
  tags: string[];
};

const projects: Project[] = [
  {
    number: '02',
    name: 'WorldHistora',
    category: 'INTERACTIVE HISTORY EXPLORER',
    description:
      'A map-led way to explore the stories behind places, from ancient civilizations to the events that shaped the world.',
    url: 'https://worldhistora.vercel.app/',
    action: 'Explore the world',
    mark: 'WH',
    className: 'worldhistora',
    tags: ['Interactive map', 'AI timelines', 'Discovery']
  },
  {
    number: '03',
    name: 'Beat Machine',
    category: 'MUSIC · CREATIVE TOOL',
    description:
      'A browser-based beat sequencer. Build patterns, adjust BPM, shuffle rhythms, and experiment with a melody pad.',
    url: 'https://beatmachinemusic.vercel.app/',
    action: 'Make some beats',
    mark: 'BM',
    className: 'beatmachine',
    tags: ['Step sequencer', 'BPM control', 'Creative coding']
  },
  {
    number: '04',
    name: 'ScamShield BD',
    category: 'DIGITAL SAFETY · BANGLADESH',
    description:
      'A community-focused platform to check suspicious phone numbers, mobile financial service accounts, bank details, and links.',
    url: 'https://scam-shield-bd.vercel.app/',
    action: 'Check the platform',
    mark: 'S/',
    className: 'scamshield',
    tags: ['Risk lookup', 'Community reports', 'Bangladesh']
  },
  {
    number: '05',
    name: 'Discipline Engine',
    category: 'PRODUCTIVITY · ACCOUNTABILITY',
    description:
      'A goal and discipline system built around streaks, progress, penalties, and friend-based accountability.',
    url: 'https://discipline-engine-study.vercel.app/',
    action: 'Build discipline',
    mark: 'DE',
    className: 'discipline',
    tags: ['Goal tracking', 'Streaks', 'Accountability']
  }
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 12.5 12 4M4.5 4H12v7.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 1.7 7.1L21 12l-7.3 2.9L12 22l-1.7-7.1L3 12l7.3-2.9L12 2Z" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card reveal ${project.className}`}>
      <div className="project-art" aria-hidden="true">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-mark">{project.mark}</div>
        <span className="art-corner top-left">{project.number} / 05</span>
        <span className="art-corner bottom-right">LIVE PROJECT ↗</span>
        {project.className === 'worldhistora' && (
          <div className="world-dots">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </div>
        )}
        {project.className === 'beatmachine' && (
          <div className="beat-bars">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
        )}
        {project.className === 'scamshield' && (
          <div className="shield-lines"><span>CHECK</span><b>✓</b><small>TRUST / VERIFY</small></div>
        )}
        {project.className === 'discipline' && (
          <div className="discipline-ring"><strong>01</strong><span>STAY<br />CONSISTENT</span></div>
        )}
      </div>
      <div className="project-info">
        <div className="project-meta"><span>{project.category}</span><span>{project.number}</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <a className="text-link" href={project.url} target="_blank" rel="noreferrer">
          {project.action}<ArrowUpRight />
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('irfan-portfolio-theme-v5');
    const nextTheme = saved === 'dark' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (progress) progress.style.transform = `scaleX(${value})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const followers = Array.from(document.querySelectorAll<HTMLElement>('.cursor-follower'));
    let frame = 0;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.35;
    const positions = followers.map(() => ({ x: pointerX, y: pointerY }));
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
    };
    const animateFollowers = () => {
      followers.forEach((follower, index) => {
        const point = positions[index];
        const lag = 0.12 + index * 0.025;
        point.x += (pointerX - point.x) * lag;
        point.y += (pointerY - point.y) * lag;
        const angle = Math.atan2(pointerY - point.y, pointerX - point.x) * (180 / Math.PI);
        follower.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) rotate(${angle}deg) scale(${1 - index * 0.09})`;
      });
      frame = window.requestAnimationFrame(animateFollowers);
    };
    if (finePointer && followers.length) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      frame = window.requestAnimationFrame(animateFollowers);
    }

    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('pointermove', onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem('irfan-portfolio-theme-v5', nextTheme);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('connect.irfanhossain@gmail.com');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = 'mailto:connect.irfanhossain@gmail.com';
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-layer" aria-hidden="true">
        {['cursor-a', 'cursor-b', 'cursor-c', 'cursor-d', 'cursor-e'].map((name) => (
          <span className={`cursor-follower ${name}`} key={name}><i /></span>
        ))}
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Irfan Nishat home">
          <span className="brand-symbol">IN<span>.</span></span>
          <span className="brand-name">IRFAN NISHAT<small>DEVELOPER PORTFOLIO</small></span>
        </a>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
        <nav className={menuOpen ? 'main-nav menu-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#playground" onClick={closeMenu}>Playground</a>
          <a href="#work" onClick={closeMenu}>Selected work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#process" onClick={closeMenu}>Approach</a>
          <a href="#contact" onClick={closeMenu}>Contact <ArrowUpRight /></a>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
          <span className="theme-icon">{theme === 'light' ? '☾' : '☼'}</span>
          <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
        </button>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow reveal"><span className="status-dot" /> INDEPENDENT DEVELOPER <i /> BANGLADESH</div>
            <h1 className="reveal delay-1">Ideas into <em>digital</em><br />experiences<span className="period">.</span></h1>
            <p className="hero-description reveal delay-2">I&apos;m <strong>Irfan Hossain Nishat</strong> — I design and build useful web experiences, from ambitious storefronts to interactive tools that solve real problems.</p>
            <div className="hero-actions reveal delay-3">
              <a className="button button-primary" href="#work">Explore my work <ArrowUpRight /></a>
              <a className="button button-quiet" href="#contact">Let&apos;s talk <span>↗</span></a>
            </div>
            <div className="hero-foot reveal delay-3"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /><span>01 — 05</span></div>
          </div>

          <div className="hero-visual reveal delay-2" aria-label="An animated digital blueprint illustration">
            <div className="visual-topline"><span>FIELD NOTES / 001</span><span>VISUAL STUDY <i /></span></div>
            <div className="blueprint-stage">
              <svg className="blueprint-svg" viewBox="0 0 640 560" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="beam" x1="80" y1="90" x2="560" y2="470" gradientUnits="userSpaceOnUse"><stop stopColor="#E7A766"/><stop offset="1" stopColor="#79A9A0"/></linearGradient>
                </defs>
                <path className="blueprint-path path-a" d="M112 155 300 56 514 170 325 278 112 155Z" />
                <path className="blueprint-path path-b" d="M112 155v225l213 124V278" />
                <path className="blueprint-path path-c" d="m325 278 189-108v225L325 504" />
                <path className="blueprint-path path-d" d="m185 197 188-109m-188 164 188-109m-188 163 188-109M252 117v226m73-265v227m73-188v225m72-187v226" />
                <path className="blueprint-path path-e" d="m112 267 213 124 189-108M112 324l213 123 189-108" />
                <path className="blueprint-path path-f" d="m300 56 1 105m213 9-91 53M112 380l103-59" />
                <circle className="blueprint-node node-a" cx="112" cy="155" r="5"/><circle className="blueprint-node node-b" cx="300" cy="56" r="5"/><circle className="blueprint-node node-c" cx="514" cy="170" r="5"/><circle className="blueprint-node node-d" cx="325" cy="504" r="5"/>
              </svg>
              <div className="build-panel panel-main"><span className="panel-kicker">SYSTEM / 001</span><div className="panel-heading">MAKE IT<br /><b>MEANINGFUL.</b></div><div className="panel-bottom"><span>IDEA → INTERFACE</span><span>100%</span></div><div className="panel-progress"><i /></div></div>
              <div className="build-panel panel-small"><span>STRUCTURE</span><b>01—05</b><div className="mini-squares"><i /><i /><i /><i /><i /><i /></div></div>
              <div className="build-chip chip-a"><i /> DESIGN THINKING</div>
              <div className="build-chip chip-b"><i /> INTERACTION</div>
              <div className="build-chip chip-c"><i /> DEVELOPMENT</div>
              <span className="coordinate coordinate-a">23°49&apos; N</span><span className="coordinate coordinate-b">90°24&apos; E</span>
            </div>
            <div className="visual-bottomline"><span>FIG. 01 / DIGITAL ARCHITECTURE</span><span>DESIGN / STRUCTURE / DETAIL</span></div>
          </div>
        </section>

        <CodePlayground />

        <section className="work-section section-shell" id="work">
          <div className="section-heading reveal">
            <div><span className="section-index">01 / SELECTED WORK</span><h2>A few things<br />I&apos;ve <em>put into motion.</em></h2></div>
            <p>Different ideas. Different challenges. One goal: make the web more useful, expressive, and enjoyable.</p>
          </div>

          <article className="featured-project reveal">
            <div className="featured-visual">
              <div className="fragre-glow" />
              <div className="featured-label"><span>FEATURED PROJECT / 01</span><span>CO-FOUNDER &amp; DEVELOPER</span></div>
              <div className="perfume-scene" aria-hidden="true">
                <div className="perfume-shadow" />
                <div className="perfume-bottle"><div className="bottle-cap" /><div className="bottle-neck" /><div className="bottle-body"><span>FRAGRÉ</span><b>DE RIVA</b><small>EAU DE PARFUM</small></div></div>
                <div className="bottle-reflection" />
                <div className="scent-orbit orbit-left" /><div className="scent-orbit orbit-right" />
              </div>
              <div className="featured-bottom"><span>CRAFTED FOR PRESENCE.</span><span>CHOSEN FOR IDENTITY.</span></div>
            </div>
            <div className="featured-info">
              <div className="featured-kicker"><span className="featured-star"><SparkIcon /></span><span>01 — THE FLAGSHIP</span></div>
              <h3>Fragré<br /><em>de Riva.</em></h3>
              <p>A premium fragrance storefront built around brand identity, product discovery, and a polished shopping experience. A real business project where commerce meets craft.</p>
              <div className="featured-details"><div><small>ROLE</small><strong>Co-founder / Developer</strong></div><div><small>FOCUS</small><strong>E-commerce · Brand experience</strong></div></div>
              <a className="button button-featured" href="https://www.fragrederiva.shop/" target="_blank" rel="noreferrer">Visit Fragré de Riva <ArrowUpRight /></a>
              <span className="featured-url">FRAGREDERIVA.SHOP</span>
            </div>
          </article>

          <div className="project-grid">{projects.map((project) => <ProjectCard project={project} key={project.number} />)}</div>
          <div className="work-endnote reveal"><span>05 PROJECTS</span><span>BUILT WITH CURIOSITY, REFINED WITH CARE.</span><span>↗</span></div>
        </section>

        <section className="about-section" id="about">
          <div className="section-shell about-inner">
            <div className="about-left reveal"><span className="section-index">02 / A LITTLE ABOUT ME</span><div className="about-stamp"><span>IN</span><i>✳</i></div><p className="about-caption">CURIOUS BY DEFAULT.<br />BUILDER BY CHOICE.</p></div>
            <div className="about-right reveal delay-1"><h2>I like turning<br />“what if?” into<br /><em>“here it is.”</em></h2><p>I&apos;m Irfan Hossain Nishat, an independent developer from Bangladesh. I enjoy taking an idea from a rough thought to a working product — figuring out the details, building the experience, and improving it until it feels right.</p><p>My projects move across e-commerce, creative tools, digital safety, history, and productivity. I&apos;m interested in the space where thoughtful design and practical technology meet.</p><div className="about-signature">Irfan Hossain Nishat <span>— ALWAYS LEARNING</span></div></div>
          </div>
        </section>

        <section className="process-section section-shell" id="process">
          <div className="section-heading reveal"><div><span className="section-index">03 / HOW I APPROACH IT</span><h2>From first thought<br />to <em>finished detail.</em></h2></div><p>Good digital work is more than making something look good. It should make sense, feel natural, and work reliably.</p></div>
          <div className="process-grid">
            <div className="process-step reveal"><span>01</span><div className="step-icon">⌁</div><h3>Understand</h3><p>Start with the idea, the people it serves, and the problem worth solving.</p></div>
            <div className="process-step reveal delay-1"><span>02</span><div className="step-icon">◇</div><h3>Shape</h3><p>Give the idea a clear structure, a distinct visual language, and a useful flow.</p></div>
            <div className="process-step reveal delay-2"><span>03</span><div className="step-icon">⌘</div><h3>Build</h3><p>Turn the design into a responsive, interactive, and dependable experience.</p></div>
            <div className="process-step reveal delay-3"><span>04</span><div className="step-icon">↗</div><h3>Refine</h3><p>Test the details, polish the interactions, and keep making it better.</p></div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="section-shell contact-inner">
            <div className="contact-topline reveal"><span>04 / HAVE AN IDEA?</span><span>MY INBOX IS OPEN <i /></span></div>
            <div className="contact-content reveal"><span className="contact-small">LET&apos;S MAKE SOMETHING THAT MATTERS.</span><h2>Have a good<br /><em>one in mind?</em></h2><a className="contact-email" href="mailto:connect.irfanhossain@gmail.com">connect.irfanhossain@gmail.com <ArrowUpRight /></a><div className="contact-actions"><a className="button button-primary" href="mailto:connect.irfanhossain@gmail.com">Start a conversation <ArrowUpRight /></a><button className="button button-outline" type="button" onClick={copyEmail}>{copied ? 'Email copied ✓' : 'Copy email'} <span>⌘</span></button></div></div>
            <div className="contact-footer"><span>IRFAN HOSSAIN NISHAT</span><span>MADE WITH INTENTION · © {new Date().getFullYear()}</span><a href="#top">BACK TO TOP ↑</a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><span>IN<span>.</span> — DIGITAL BUILDER</span><span>THANKS FOR SCROLLING.</span><span>END OF PAGE / 05</span></footer>
    </>
  );
}
