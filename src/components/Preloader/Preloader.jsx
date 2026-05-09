// src/components/Preloader/Preloader.jsx
import { useEffect, useRef, useState } from 'react';
import './Preloader.css';

const ICONS = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',          label: 'Python'   },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',            label: 'React'    },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',             label: 'Django'   },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',              label: 'Java'     },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',          label: 'Docker'   },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',  label: 'JS'       },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',            label: 'MySQL'    },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',                label: 'Git'      },
];

const STARTS = [
  [-700,   0],
  [ 700,   0],
  [   0, -600],
  [   0,  600],
  [-580, -480],
  [ 580, -480],
  [-580,  480],
  [ 580,  480],
];

const ORBIT = ICONS.map((_, i) => {
  const a = (i / ICONS.length) * 2 * Math.PI - Math.PI / 2;
  return [Math.round(Math.cos(a) * 185), Math.round(Math.sin(a) * 185)];
});

// Each character starts from a specific off-screen direction
const WORDS = [
  { word: 'GOPAL', origins: [
    { tx: '-120vw', ty: '-40vh', r: '-45deg' },  // G
    { tx:  '0vw',  ty: '-120vh', r:  '20deg' },  // O
    { tx:  '120vw', ty: '-50vh', r:  '60deg' },  // P
    { tx: '-100vw', ty:  '60vh', r: '-30deg' },  // A
    { tx:  '0vw',   ty:  '120vh', r: '-15deg' }, // L
  ]},
  { word: 'MURI', origins: [
    { tx: '-80vw',  ty: '-80vh', r:  '90deg' },  // M
    { tx:  '0vw',   ty: '-100vh', r: '-50deg' }, // U
    { tx:  '100vw', ty:  '0vh',  r:  '30deg' },  // R
    { tx:  '80vw',  ty:  '80vh', r: '-70deg' },  // I
  ]},
];

// Flat list for ref indexing
const CHAR_ORIGINS = [
  { tx: '-120vw', ty: '-40vh', r: '-45deg' },
  { tx:  '0vw',  ty: '-120vh', r:  '20deg' },
  { tx:  '120vw', ty: '-50vh', r:  '60deg' },
  { tx: '-100vw', ty:  '60vh', r: '-30deg' },
  { tx:  '0vw',   ty:  '120vh', r: '-15deg' },
  { tx: '-80vw',  ty: '-80vh', r:  '90deg' },
  { tx:  '0vw',   ty: '-100vh', r: '-50deg' },
  { tx:  '100vw', ty:  '0vh',  r:  '30deg' },
  { tx:  '80vw',  ty:  '80vh', r: '-70deg' },
];

// Flat characters (no space — words are separate spans)
const CHARS = ['G','O','P','A','L','M','U','R','I'];

export default function Preloader({ onDone }) {
  const [progress, setProgress]     = useState(0);
  const [phase, setPhase]           = useState('idle');  // idle | entry | sweep | exit
  const [exiting, setExiting]       = useState(false);
  const [sweepActive, setSweepActive] = useState(false);

  const iconRefs = useRef([]);
  const ringRef  = useRef(null);
  const charRefs = useRef([]);

  // ── Progress bar ────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); return 100; }
        return Math.min(p + (p < 70 ? 1.8 + Math.random() * 1.5 : 0.4 + Math.random()), 100);
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  // ── Main animation sequence ──────────────────────────────────────────────────
  useEffect(() => {
    const els  = iconRefs.current;
    const ring = ringRef.current;

    // — Step 0: place icons at scatter positions, no transition —
    els.forEach((el, i) => {
      if (!el) return;
      const [sx, sy] = STARTS[i];
      el.style.transition = 'none';
      el.style.opacity    = '1';
      el.style.transform  = `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px))`;
    });

    // — Step 1 (60ms): icons fly to orbit —
    const t1 = setTimeout(() => {
      els.forEach((el, i) => {
        if (!el) return;
        const [ox, oy] = ORBIT[i];
        el.style.transition = `transform 1.8s cubic-bezier(0.25, 0.8, 0.25, 1) ${i * 60}ms`;
        el.style.transform  = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
      });
    }, 60);

    // — Step 2 (2400ms): icons orbit spin starts; Phase 1 — chars scatter→enter —
    const t2 = setTimeout(() => {
      if (ring) ring.style.animation = 'plRingSpin 2.8s linear infinite';
      els.forEach(el => {
        if (!el) return;
        const b = el.querySelector('.pl-bubble');
        if (b) b.style.animation = 'plCounterSpin 2.8s linear infinite';
      });
      setPhase('entry');  // trigger CSS: chars fly in from scatter positions
    }, 2400);

    // — Step 3 (3800ms): Phase 2 — chars are aligned; Phase 3 — light sweep —
    const t3 = setTimeout(() => {
      setSweepActive(true); // trigger the sweep bar animation
      // Speed up orbit spin
      if (ring) ring.style.animationDuration = '0.55s';
      els.forEach(el => {
        if (!el) return;
        const b = el.querySelector('.pl-bubble');
        if (b) {
          b.style.animationDuration = '0.55s';
          b.classList.add('pl-bubble--glow');
        }
      });
      // Per-character glow activated by staggered JS
      charRefs.current.forEach((el, i) => {
        if (!el) return;
        setTimeout(() => el.classList.add('pl-char--lit'), i * 90);
      });
    }, 3800);

    // — Step 4 (5600ms): exit —
    const t4 = setTimeout(() => {
      setProgress(100);
      setExiting(true);
      setTimeout(onDone, 1000);
    }, 5600);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  const pct = Math.floor(progress);
  // Zero-padded display e.g. 007 → 100
  const pctDisplay = String(pct).padStart(3, '0');

  return (
    <div className={`preloader${exiting ? ' preloader--exit' : ''}`}>

      {/* Ambient glow */}
      <div className="pl-glow" />

      {/* ── Orbit ring ── */}
      <div className="pl-ring" ref={ringRef}>
        {ICONS.map((icon, i) => (
          <div
            key={icon.label}
            ref={el => (iconRefs.current[i] = el)}
            className="pl-icon"
          >
            <div className="pl-bubble">
              <img
                src={icon.src}
                alt={icon.label}
                className="pl-img"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Tagline above name ── */}
      <div className={`pl-tagline-top ${phase === 'entry' ? 'pl-tagline-top--visible' : ''} ${exiting ? 'pl-tagline-top--exit' : ''}`}>
        <span className="pl-tag-line">✦ FULL STACK DEVELOPER &amp; AI ENGINEER ✦</span>
      </div>

      {/* ── Cinematic title ── */}
      <div className={`pl-title ${phase === 'entry' ? 'pl-title--visible' : ''} ${exiting ? 'pl-title--exit' : ''}`}>

        {/* The light sweep streak */}
        <div className={`pl-sweep-bar ${sweepActive ? 'pl-sweep-bar--active' : ''}`} />

        {/* GOPAL word */}
        <span className="pl-word">
          {WORDS[0].word.split('').map((char, i) => (
            <span
              key={i}
              ref={el => (charRefs.current[i] = el)}
              className="pl-char"
              style={{
                '--ox': WORDS[0].origins[i].tx,
                '--oy': WORDS[0].origins[i].ty,
                '--or': WORDS[0].origins[i].r,
                '--delay': `${i * 0.09}s`,
              }}
            >
              {char}
            </span>
          ))}
        </span>

        {/* MURI word */}
        <span className="pl-word">
          {WORDS[1].word.split('').map((char, i) => (
            <span
              key={i + 5}
              ref={el => (charRefs.current[i + 5] = el)}
              className="pl-char"
              style={{
                '--ox': WORDS[1].origins[i].tx,
                '--oy': WORDS[1].origins[i].ty,
                '--or': WORDS[1].origins[i].r,
                '--delay': `${(i + 5) * 0.09}s`,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>

      {/* ── Subtitle below name ── */}
      <div className={`pl-tagline-bottom ${phase === 'entry' ? 'pl-tagline-bottom--visible' : ''} ${exiting ? 'pl-tagline-bottom--exit' : ''}`}>
        <span className="pl-sub-dot" />
        <span className="pl-sub-text">BUILDING THE FUTURE, ONE LINE AT A TIME</span>
        <span className="pl-sub-dot" />
      </div>

      {/* ── Progress bar ── */}
      <div className="pl-bottom">
        <div className="pl-track">
          <div className="pl-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="pl-pct-wrap">
          <span className="pl-pct-label">LOADING</span>
          <span className="pl-pct">
            <span className="pl-pct-num">{pctDisplay}</span>
            <span className="pl-pct-sym">%</span>
          </span>
        </div>
        <p className="pl-label">Initializing experience &mdash; please wait</p>
      </div>

      {/* Exit panels */}
      <div className="pl-panel pl-panel--top" />
      <div className="pl-panel pl-panel--bottom" />
    </div>
  );
}
