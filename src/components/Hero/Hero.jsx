import { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import MagneticButton from '../shared/MagneticButton';
import ParticleBackground from '../shared/ParticleBackground';
import './Hero.css';

/* ── DROP YOUR IMAGES into /public/hero-bg/ and list filenames here ── */
const BG_IMAGES = [
  '/hero-bg/bg1.jpeg',
  '/hero-bg/bg2.jpeg',
  '/hero-bg/bg3.jpeg',
  '/hero-bg/bg4.jpeg',
];

/* Per-image background-position overrides (undefined = use CSS default) */
const BG_POSITIONS = {
  '/hero-bg/bg3.jpeg': 'center 35%',
};
/* -------------------------------------------------------------------- */

const TYPEWRITER_WORDS = [
  'Full Stack Engineer',
  'Building scalable web apps',
];

const WORKFLOW_ITEMS = [
  'Learn',
  'Research',
  'Design',
  'Iterate',
  'Develop',
  'Test',
  'Deploy',
];

// Social links
const SOCIAL_LINKS = [
  { img: '/assets/social/github.png',    href: 'https://github.com/gopalmuri',              label: 'GitHub' },
  { img: '/assets/social/linkedin.png',  href: 'https://www.linkedin.com/in/gopalmuri',      label: 'LinkedIn' },
  { img: '/assets/social/x.png',         href: 'https://x.com/MuriGopal98677',                label: 'Twitter' },
  { img: '/assets/social/instagram.png', href: 'https://instagram.com/gopalmuri',            label: 'Instagram' },
  { img: '/assets/social/leetcode.svg',  href: 'https://leetcode.com/gopalmuri',             label: 'LeetCode' },
  { img: '/assets/social/youtube.png',   href: 'https://www.youtube.com/@gopal_muri',                label: 'YouTube' },
  { img: '/assets/social/gmail.png',     href: 'mailto:gopalmuri2004@gmail.com',             label: 'Email' },
];

function useTypewriter(words) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkTimer = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    const word = words[index];
    if (!deleting && subIndex === word.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const speed = deleting ? 50 : 80;
    const t = setTimeout(
      () => setSubIndex((s) => s + (deleting ? -1 : 1)),
      speed
    );
    return () => clearTimeout(t);
  }, [subIndex, index, deleting, words]);

  return `${words[index].slice(0, subIndex)}${blink ? '|' : ' '}`;
}

export default function Hero() {
  const typed = useTypewriter(TYPEWRITER_WORDS);

  /* ── Background slideshow ── */
  const [bgIndex, setBgIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(bgIndex);
      setBgIndex((i) => (i + 1) % BG_IMAGES.length);
      setFading(true);
      setTimeout(() => setFading(false), 1200); // match CSS transition
    }, 5000); // change every 5s
    return () => clearInterval(timer);
  }, [bgIndex]);

  return (
    <section id="hero" className="hero">
      {/* Slideshow background layers */}
      {prevIndex !== null && (
        <div
          className="hero__bg"
          style={{
            backgroundImage: `url(${BG_IMAGES[prevIndex]})`,
            opacity: fading ? 0 : 1,
            transition: 'opacity 1.2s ease',
            ...(BG_POSITIONS[BG_IMAGES[prevIndex]] && { backgroundPosition: BG_POSITIONS[BG_IMAGES[prevIndex]] }),
          }}
        />
      )}
      <div
        className="hero__bg"
        style={{
          backgroundImage: `url(${BG_IMAGES[bgIndex]})`,
          opacity: 1,
          zIndex: prevIndex !== null ? 0 : 1,
          ...(BG_POSITIONS[BG_IMAGES[bgIndex]] && { backgroundPosition: BG_POSITIONS[BG_IMAGES[bgIndex]] }),
        }}
      />

      {/* Particles */}
      <ParticleBackground />

      <div className="hero__content">
        {/* LEFT — Animated circular tech stack */}
        <div className="hero__right">
          <div className="hero__photo-container">
            {/* Spinning rings */}
            <div className="hero__ring hero__ring--outer" />
            <div className="hero__ring hero__ring--inner" />

            {/* Profile photo with glowing border */}
            <div className="hero__photo-wrapper">
              <img
                src="/gm-logo.png"
                alt="GM Logo"
                className="hero__photo"
              />
            </div>

            {/* Orbiting Workflow Items */}
            {WORKFLOW_ITEMS.map((tag, i) => (
              <div
                key={tag}
                className="hero__badge"
                style={{
                  '--angle': `${i * (360 / WORKFLOW_ITEMS.length) - 90}deg`,
                  '--delay': `${i * 0.4}s`,
                }}
              >
                <span className="hero__badge-label">{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Text + CTA */}
        <div className="hero__left">
          <p className="hero__greeting">Hi there, I'm</p>
          <h1 className="hero__name">Gopal Muri</h1>
          <div className="hero__typewriter">
            <span>{typed}</span>
          </div>
          <p className="hero__bio">
            I craft powerful, scalable web applications that solve real problems.
            Passionate about clean code, elegant architecture, and continuous learning.
          </p>

          <div className="hero__cta">
            <MagneticButton
              className="magnetic-btn--primary hero__btn-primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </MagneticButton>
            <MagneticButton
              className="magnetic-btn--outline hero__btn-outline"
              href="/resume.pdf"
              download="Gopal_Muri_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </MagneticButton>
          </div>

          {/* Social links */}
          <div className="hero__social">
            {SOCIAL_LINKS.map(({ img, href, label }) => (
              <a
                key={label}
                href={href}
                className="hero__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
              >
                <img src={img} alt={label} className="hero__social-icon" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <button
        className="hero__scroll-arrow"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to about section"
      >
        <FiChevronDown size={28} />
      </button>
    </section>
  );
}
