import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Files, Search, GitBranch, Blocks } from 'lucide-react';
import Path from '../components/Path';
import Why from '../components/Why';
import Roadmaps from '../components/Roadmaps';
import Join from '../components/Join';
const signals = [
  ['01', 'Learn by doing', 'not watching'],
  ['02', 'Progress you can see', 'every week'],
  ['03', 'Made for curious people', 'at any starting point'],
];

const stack = ['Python', 'JavaScript', 'HTML & CSS', 'SQL', 'Git'];

// ---------------------------------------------------------------------------
// Shared Tailwind class strings (colors, fonts and easing come from @theme in index.css)
// ---------------------------------------------------------------------------
const pad = 'px-[max(clamp(24px,6vw,96px),calc((100vw-1200px)/2))]';
const eyebrow = 'flex items-center gap-[9px] font-plex text-[10px] uppercase tracking-[0.1em]';
const eyebrowDot = 'inline-block size-[7px] bg-signal';
const monoLabel = 'font-plex text-[9px] uppercase tracking-[0.08em]';
const navLink = 'text-[13px] text-muted transition-colors duration-180 hover:text-ink';
const wordmark = 'inline-flex items-center gap-[10px] text-[18px] font-bold tracking-[-0.07em]';
const btn = 'inline-flex items-center justify-center gap-[14px] border text-[13px] font-semibold tracking-[-0.02em] transition duration-180 hover:-translate-y-[3px]';
const btnInk = 'border-transparent bg-ink text-paper hover:bg-ink-soft hover:shadow-[4px_4px_0_var(--color-signal)]';
const btnSignal = 'min-h-[57px] border-transparent bg-signal px-6 text-ink hover:bg-signal-soft hover:shadow-[5px_5px_0_var(--color-ink)]';
const gridLines = (gap, color) =>
  ({ background: `repeating-linear-gradient(90deg, transparent 0, transparent ${gap}px, ${color} ${gap + 1}px), repeating-linear-gradient(0deg, transparent 0, transparent ${gap}px, ${color} ${gap + 1}px)` });

// Scroll reveal: the observer below adds `is-visible` to every [data-reveal] element.
const revealBase = 'opacity-0 transition-[opacity,translate] duration-[760ms] ease-harbor motion-reduce:translate-none motion-reduce:opacity-100 [&.is-visible]:translate-none [&.is-visible]:opacity-100';
const revealLeft = `${revealBase} -translate-x-6 max-[720px]:translate-x-0 max-[720px]:translate-y-7`;
const revealRight = `${revealBase} translate-x-6 max-[720px]:translate-x-0 max-[720px]:translate-y-7`;


function BeaconMark({ dark = false }) {
  return (
    <span className="relative inline-block h-[26px] w-[27px]" aria-hidden="true">
      <i className="absolute left-[7px] top-[3px] block h-[5px] w-[13px] bg-signal"></i>
      <b className={`absolute left-[5px] top-[10px] block h-[5px] w-[17px] ${dark ? 'bg-paper' : 'bg-ink'}`}></b>
      <em className={`absolute bottom-px left-[8px] block size-0 border-x-[5px] border-b-[5px] border-x-transparent ${dark ? 'border-b-paper' : 'border-b-ink'}`}></em>
    </span>
  );
}

// Source shown in the hero's code editor: each line is a list of [token type, text]
// pairs. It mirrors the website mockup revealed under the cursor, line for line.
const heroCode = [
  [['k', 'import '], ['v', 'Artwork '], ['k', 'from '], ['s', "'./Artwork'"]],
  [],
  [['k', 'export default '], ['b', 'function '], ['f', 'Hero'], ['x', '() {']],
  [['k', '  return '], ['x', '(']],
  [['p', '    <'], ['t', 'section '], ['a', 'className'], ['x', '='], ['s', '"hero"'], ['p', '>']],
  [['p', '      <'], ['t', 'span '], ['a', 'className'], ['x', '='], ['s', '"badge"'], ['p', '>'], ['x', '✦ New — 2026 collection'], ['p', '</'], ['t', 'span'], ['p', '>']],
  [['p', '      <'], ['t', 'h1'], ['p', '>']],
  [['x', '        Design that '], ['p', '<'], ['t', 'em'], ['p', '>'], ['x', 'feels alive.'], ['p', '</'], ['t', 'em'], ['p', '>']],
  [['p', '      </'], ['t', 'h1'], ['p', '>']],
  [['p', '      <'], ['t', 'p'], ['p', '>'], ['x', 'A small studio crafting warm, joyful websites.'], ['p', '</'], ['t', 'p'], ['p', '>']],
  [['p', '      <'], ['t', 'button '], ['a', 'className'], ['x', '='], ['s', '"primary"'], ['p', '>'], ['x', 'Get started →'], ['p', '</'], ['t', 'button'], ['p', '>']],
  [['p', '      <'], ['t', 'button '], ['a', 'className'], ['x', '='], ['s', '"ghost"'], ['p', '>'], ['x', 'View work'], ['p', '</'], ['t', 'button'], ['p', '>']],
  [['p', '      <'], ['c', 'Artwork '], ['p', '/>']],
  [['p', '    </'], ['t', 'section'], ['p', '>']],
  [['x', '  )']],
  [['x', '}']],
];
const currentCodeLine = 7;

export default function Home({ onOpen, go }) {
  // ---------------------------------------------------------------------------
  // 1. Header Scroll State
  // ---------------------------------------------------------------------------
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setIsScrolled(current > 12);
      if (current < 12 || current < lastScroll) {
        setIsHidden(false);
      } else if (current > 120) {
        setIsHidden(true);
      }
      lastScroll = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Intersection Observer (Scroll Reveal Animations)
  // ---------------------------------------------------------------------------
  const mainRef = useRef(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealItems = el.querySelectorAll('[data-reveal]');
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  // ---------------------------------------------------------------------------
  // 4. Burn Demo Interactivity (Pointer Reveal Effect)
  // ---------------------------------------------------------------------------
  const burnDemoRef = useRef(null);
  const [burnClasses, setBurnClasses] = useState([]);
  const burnStateRef = useRef({
    lastX: 53,
    lastY: 48,
    lastTime: performance.now(),
    lastClientX: 0,
    lastClientY: 0,
    frame: 0,
    burnReady: false,
    pointerInside: false,
  });

  const paintReveal = (x, y, size) => {
    if (!burnDemoRef.current) return;
    burnDemoRef.current.style.setProperty('--burn-x', `${x}%`);
    burnDemoRef.current.style.setProperty('--burn-y', `${y}%`);
    burnDemoRef.current.style.setProperty('--burn-size', `${size}px`);
  };

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const s = burnStateRef.current;
    s.lastTime = performance.now();

    const timer1 = setTimeout(() => {
      setBurnClasses(['is-burning']);

      const timer2 = setTimeout(() => {
        s.burnReady = true;
        setBurnClasses((prev) => [...prev.filter((c) => c !== 'is-burning'), 'is-burned']);
        paintReveal(s.lastX, s.lastY, 0);

        if (s.pointerInside) {
          setBurnClasses((prev) => [...prev, 'is-hovering', 'is-active']);
          paintReveal(s.lastX, s.lastY, 144);
        }
      }, 1840);

      return () => clearTimeout(timer2);
    }, 850);

    return () => {
      clearTimeout(timer1);
      cancelAnimationFrame(s.frame);
    };
  }, []);

  const handlePointerEnter = (e) => {
    const s = burnStateRef.current;
    s.pointerInside = true;
    if (!burnDemoRef.current) return;

    const bounds = burnDemoRef.current.getBoundingClientRect();
    s.lastClientX = e.clientX;
    s.lastClientY = e.clientY;
    s.lastX = ((e.clientX - bounds.left) / bounds.width) * 100;
    s.lastY = ((e.clientY - bounds.top) / bounds.height) * 100;

    if (s.burnReady) {
      setBurnClasses((prev) => Array.from(new Set([...prev, 'is-hovering', 'is-active'])));
      paintReveal(s.lastX, s.lastY, 144);
    }
  };

  const handlePointerMove = (e) => {
    const s = burnStateRef.current;
    if (!burnDemoRef.current) return;

    const bounds = burnDemoRef.current.getBoundingClientRect();
    const now = performance.now();
    const elapsed = Math.max(now - s.lastTime, 16);
    const velocity = Math.hypot(e.clientX - s.lastClientX, e.clientY - s.lastClientY) / elapsed;
    const size = Math.min(190, Math.max(124, 132 + velocity * 22));
    const nextX = Math.max(5, Math.min(95, ((e.clientX - bounds.left) / bounds.width) * 100));
    const nextY = Math.max(7, Math.min(93, ((e.clientY - bounds.top) / bounds.height) * 100));

    s.lastX = nextX;
    s.lastY = nextY;
    s.lastClientX = e.clientX;
    s.lastClientY = e.clientY;
    s.lastTime = now;

    cancelAnimationFrame(s.frame);
    s.frame = requestAnimationFrame(() => {
      if (s.burnReady) paintReveal(s.lastX, s.lastY, size);
    });
  };

  const handlePointerLeave = () => {
    const s = burnStateRef.current;
    s.pointerInside = false;
    setBurnClasses((prev) => prev.filter((c) => c !== 'is-hovering' && c !== 'is-active'));
    if (s.burnReady) paintReveal(s.lastX, s.lastY, 0);
  };

  return (
    <div className="overflow-x-clip bg-paper font-grotesk text-ink antialiased selection:bg-signal selection:text-ink [&_:is(a,button):focus-visible]:outline-[3px] [&_:is(a,button):focus-visible]:outline-offset-4 [&_:is(a,button):focus-visible]:outline-signal">
      {/* Header: sticks to the top, slides away on scroll down and returns on scroll up */}
      <div className={`sticky top-0 z-20 transition-transform duration-300 ${isHidden && !mobileOpen ? '-translate-y-full' : ''}`}>
        <header
          className={`flex h-[82px] items-center justify-between border-b border-line bg-paper/85 backdrop-blur-md transition-shadow duration-300 max-[720px]:h-[72px] ${pad} ${isScrolled ? 'shadow-[0_12px_30px_-20px_rgba(18,20,26,0.45)]' : ''}`}
          data-header
        >
          <a className={wordmark} href="#top" aria-label="Code Harbor home">
            <BeaconMark />
            <span>
              code<span className="font-medium text-muted">harbor</span>
            </span>
          </a>

          <nav className="ml-20 flex gap-[clamp(20px,3vw,48px)] max-[980px]:ml-5 max-[720px]:hidden" aria-label="Primary navigation">
            <a className={navLink} href="#paths">Learning paths</a>
            <a className={navLink} href="#proof">Why Harbor</a>
            <a className={navLink} href="#method">Roadmap of the lesson's</a>
          </nav>

          <div className="flex items-center gap-[22px] max-[720px]:hidden">
            <Link className={navLink} to="/login">Sign in</Link>
            <a className={`${btn} ${btnInk} min-h-[42px] px-[18px]`} href="#paths">
              Start learning <span aria-hidden="true">↗</span>
            </a>
          </div>

          <button
            className="hidden cursor-pointer flex-col gap-[5px] py-2 pl-2 max-[720px]:flex"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            data-menu-toggle
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className={`block h-0.5 w-6 bg-ink transition-transform duration-200 ${mobileOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-ink transition-transform duration-200 ${mobileOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`}></span>
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </header>

        {/* Mobile Drawer Navigation */}
        <div
          className={`absolute top-full z-[19] hidden w-full flex-col overflow-hidden bg-paper px-6 transition-[max-height,padding] duration-300 ease-harbor max-[720px]:flex ${mobileOpen ? 'max-h-[350px] border-b border-line pb-6 pt-[18px]' : 'max-h-0'}`}
          id="mobile-nav"
          data-mobile-nav
        >
          {[['#paths', 'Learning paths'], ['#method', 'How it works'], ['#proof', 'Why Harbor']].map(([href, label]) => (
            <a className="flex justify-between border-b border-line py-4 text-[18px]" href={href} key={href} onClick={() => setMobileOpen(false)}>
              {label} <span>↗</span>
            </a>
          ))}
          <div className="flex items-center justify-between pt-[18px]">
            <Link className="font-plex text-[10px] uppercase" to="/login" onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <a className={`${btn} ${btnInk} min-h-[40px] px-[13px] text-[12px]`} href="#paths" onClick={() => setMobileOpen(false)}>
              Start learning <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Section Content */}
      <main id="top" ref={mainRef}>
        {/* Hero Section */}
        <section className={`relative grid min-h-[720px] grid-cols-[minmax(300px,0.88fr)_minmax(480px,1.12fr)] items-center gap-[clamp(40px,6vw,110px)] py-[100px] max-[980px]:block max-[980px]:min-h-0 max-[980px]:py-20 max-[720px]:pb-[66px] max-[720px]:pt-[74px] ${pad}`}>
          {/* Backdrop: faint grid plus two soft color glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-[12%] -top-[18%] size-[560px] rounded-full bg-signal/25 blur-[120px]"></div>
            <div className="absolute -bottom-[30%] left-[22%] size-[460px] rounded-full bg-sage/25 blur-[120px]"></div>
            <div
              className="absolute left-0 top-0 h-[360px] w-[55%] opacity-70 [mask-image:linear-gradient(90deg,black,transparent_76%)]"
              style={gridLines(31, 'rgba(18, 20, 26, 0.045)')}
            ></div>
          </div>

          <div className={`relative z-[1] max-w-[600px] ${revealLeft}`} data-reveal>
            <div className={`${eyebrow} text-muted`}>
              <span className={eyebrowDot}></span> A learning platform for builders
            </div>
            <h1 className="mb-[29px] mt-7 max-w-[740px] text-[length:clamp(54px,5.6vw,84px)] font-medium leading-[0.92] tracking-[-0.085em] max-[720px]:mt-6 max-[720px]:text-[length:clamp(56px,15vw,92px)]">
              Make the first thing you build <span className="text-ember">count.</span>
            </h1>
            <p className="max-w-[460px] text-[length:clamp(17px,1.6vw,21px)] leading-[1.55] text-ink/75 max-[720px]:text-[16px]">
              A calmer, clearer way to learn programming. Pick a path, practice in small steps, and watch your confidence compound.
            </p>
            <div className="mt-[38px] flex flex-wrap items-center gap-[26px]">
              <a className={`${btn} ${btnSignal}`} href="#paths">
                Explore the paths <span aria-hidden="true">↗</span>
              </a>
              <a className="inline-flex items-center gap-[10px] font-plex text-[11px] uppercase text-muted transition-colors duration-180 hover:text-ink" href="#method">
                <span className="inline-flex size-[25px] items-center justify-center rounded-full border border-ink/30 pl-0.5 text-[8px]">▶</span> See how it works
              </a>
            </div>
            <div className="mt-7 flex items-center gap-[10px] font-plex text-[10px] text-muted">
              <span className="inline-flex size-4 items-center justify-center bg-sage font-grotesk font-bold text-ink" aria-hidden="true">✓</span>
              <span>No credit card. Your first lesson is on us.</span>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5" aria-label="What you can learn here">
              {stack.map((name) => (
                <li className="border border-line bg-white/70 px-[10px] py-[6px] font-plex text-[10px] uppercase tracking-[0.06em] text-ink/80" key={name}>
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`hero-stage ${revealRight}`}
            data-reveal
            aria-label="Move your cursor across the code editor to see the website that code builds"
          >
            <div className="stage-grid" aria-hidden="true"></div>
            <div
              ref={burnDemoRef}
              className={`burn-demo ${burnClasses.join(' ')}`}
              data-burn-demo
              onPointerEnter={handlePointerEnter}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              {/* The code: a VS Code style editor holding the page's source */}
              <div className="backend-layer" aria-hidden="true">
                <div className="demo-window vsc">
                  <div className="vsc-titlebar">
                    <span className="window-dots"><i></i><i></i><i></i></span>
                    <span className="vsc-title">Hero.jsx — aurora-studio</span>
                  </div>
                  <div className="vsc-activity">
                    <Files size={17} strokeWidth={1.6} className="is-active" />
                    <Search size={17} strokeWidth={1.6} />
                    <GitBranch size={17} strokeWidth={1.6} />
                    <Blocks size={17} strokeWidth={1.6} />
                  </div>
                  <div className="vsc-explorer">
                    <span className="vsc-explorer-title">Explorer</span>
                    <span className="vsc-file is-folder">▾ aurora-studio</span>
                    <span className="vsc-file is-folder is-nested">▾ src</span>
                    <span className="vsc-file is-deep is-open"><b className="ext-jsx"></b>Hero.jsx</span>
                    <span className="vsc-file is-deep"><b className="ext-jsx"></b>Artwork.jsx</span>
                    <span className="vsc-file is-deep"><b className="ext-jsx"></b>App.jsx</span>
                    <span className="vsc-file is-deep"><b className="ext-css"></b>styles.css</span>
                    <span className="vsc-file is-nested"><b className="ext-html"></b>index.html</span>
                    <span className="vsc-file is-nested"><b className="ext-json"></b>package.json</span>
                  </div>
                  <div className="vsc-main">
                    <div className="vsc-tabs">
                      <span className="vsc-tab is-active"><b className="ext-jsx"></b>Hero.jsx<i>×</i></span>
                      <span className="vsc-tab"><b className="ext-css"></b>styles.css</span>
                    </div>
                    <div className="vsc-editor">
                      {heroCode.map((line, i) => (
                        <span className={`vsc-line ${i === currentCodeLine ? 'is-current' : ''}`} key={i}>
                          {line.map(([type, text], j) => (
                            <span className={`tk-${type}`} key={j}>{text}</span>
                          ))}
                          {i === currentCodeLine && <span className="vsc-caret"></span>}
                        </span>
                      ))}
                    </div>
                    <div className="vsc-terminal">
                      <div className="vsc-terminal-tabs">
                        <span>Problems</span>
                        <span>Output</span>
                        <span className="is-active">Terminal</span>
                      </div>
                      <p><span className="dim">$</span> npm run dev</p>
                      <p><span className="ok">VITE</span> ready in 212 ms</p>
                      <p><span className="ok">➜</span> Local: <span className="url">http://localhost:5173/</span></p>
                    </div>
                  </div>
                  <div className="vsc-status">
                    <span>⎇ main</span>
                    <span>Ln 8, Col 45 · Spaces: 2 · JavaScript JSX</span>
                  </div>
                </div>
              </div>

              {/* The design: the website that the code above renders */}
              <div className="frontend-layer" aria-hidden="true">
                <div className="demo-window site">
                  <div className="site-chrome">
                    <span className="window-dots"><i></i><i></i><i></i></span>
                    <span className="site-url">localhost:5173</span>
                  </div>
                  <div className="site-nav">
                    <span className="site-logo"><i></i>aurora</span>
                    <div className="site-links">
                      <span>Work</span>
                      <span>Studio</span>
                      <span>Journal</span>
                    </div>
                    <span className="site-nav-cta">Let's talk</span>
                  </div>
                  <div className="site-hero">
                    <div className="site-copy">
                      <span className="site-badge"><b>✦</b> New — 2026 collection</span>
                      <h3>Design that <em>feels alive.</em></h3>
                      <p>A small studio crafting warm, joyful websites.</p>
                      <div className="site-actions">
                        <span className="site-btn site-btn-primary">Get started →</span>
                        <span className="site-btn site-btn-ghost">View work</span>
                      </div>
                    </div>
                    <div className="site-art">
                      <div className="site-art-card"></div>
                      <div className="site-art-chip">
                        <span>Happy visitors</span>
                        <strong>+38%</strong>
                      </div>
                      <span className="site-art-pill"><i></i> Live</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="burn-ring" aria-hidden="true"><span>live preview</span></div>
              <div className="burn-hint">
                <span className="hint-cross">+</span> hover to see the design
              </div>
            </div>

            <div className="stage-annotation annotation-top">
              <span>01</span><i></i><span>the code you write</span>
            </div>
            <div className="stage-annotation annotation-bottom">
              <span>02</span><i></i><span>the design it becomes</span>
            </div>
          </div>
        </section>

        {/* Signal Strip */}
        <section className={`grid grid-cols-3 bg-ink py-[27px] text-paper max-[720px]:block max-[720px]:py-[7px] ${pad}`} aria-label="Platform highlights">
          {signals.map(([index, title, note], i) => (
            <div
              className={`flex items-baseline gap-[9px] text-[13px] max-[980px]:flex-wrap max-[980px]:gap-y-1 max-[720px]:min-h-[50px] max-[720px]:border-b max-[720px]:border-line-light max-[720px]:py-[17px] ${i > 0 ? 'border-l border-line-light pl-9 max-[980px]:pl-5 max-[720px]:border-l-0 max-[720px]:pl-0' : ''}`}
              key={index}
            >
              <span className="font-plex text-[10px] text-signal">{index}</span>
              <strong className="font-medium">{title}</strong>
              <span className="font-plex text-[10px] text-paper/65 max-[720px]:ml-auto">{note}</span>
            </div>
          ))}
        </section>

        {/* Paths Section: searchable, filterable course gallery */}
        <Path pad={pad} eyebrow={eyebrow} eyebrowDot={eyebrowDot} btn={btn} />

        {/* Why Harbor: auto-advancing feature tour */}
        <Why />

        {/* Career roadmaps: pick a profession, see the order to learn its tools */}
        <Roadmaps />

        {/* Closing call to action */}
        <Join />
      </main>

      {/* Footer */}
      <footer className={`bg-ink pb-6 pt-[52px] text-paper ${pad}`}>
        <div className="flex min-h-[160px] flex-wrap items-start justify-between gap-x-16 gap-y-10">
          <a className={`${wordmark} self-start`} href="#top">
            <BeaconMark dark />
            <span>code<span className="font-medium text-paper/60">harbor</span></span>
          </a>
          <div className="grid grid-cols-3 gap-x-16 gap-y-8 max-[720px]:w-full max-[720px]:gap-x-6 max-[420px]:grid-cols-2">
            {[
              ['Explore', [['#paths', 'Learning paths'], ['#method', 'The method']]],
              ['Company', [['#proof', 'About Harbor'], ['#signin', 'Contact']]],
              ['Follow', [['#top', 'Instagram ↗'], ['#top', 'YouTube ↗']]],
            ].map(([heading, links]) => (
              <div className="flex flex-col gap-3" key={heading}>
                <span className={`${monoLabel} mb-[5px] text-signal`}>{heading}</span>
                {links.map(([href, label]) => (
                  <a className="font-plex text-[10px] uppercase text-paper/70 transition-colors duration-180 hover:text-paper" href={href} key={label}>{label}</a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[30px] flex justify-between border-t border-line-light pt-5 font-plex text-[9px] uppercase text-paper/60 max-[720px]:mt-10 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-3 max-[720px]:leading-[1.35]">
          <span>© 2025 Code Harbor</span>
          <span>Made for curious minds, everywhere.</span>
          <span>
            <a className="hover:text-paper" href="#top">Privacy</a> · <a className="hover:text-paper" href="#top">Terms</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
