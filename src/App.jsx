// src/App.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Preloader from './components/Preloader/Preloader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Timeline from './components/Timeline/Timeline';
import Certifications from './components/Certifications/Certifications';
import Testimonials from './components/Testimonials/Testimonials';

import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ChatBot from './components/ChatBot/ChatBot';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import CursorTrail from './components/shared/CursorTrail';

// Hooks
import useTheme from './hooks/useTheme';

// ── KONAMI CODE ───────────────────────────────────────
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソ0123456789ABCDEF<>{}[]/**&&||';
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00BFFF';
      ctx.font = `${fontSize}px JetBrains Mono`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const id = setInterval(draw, 33);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="matrix-rain" aria-hidden="true">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

// ── MAIN PORTFOLIO ─────────────────────────────────────
function Portfolio() {
  const { theme, toggleTheme } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const konamiSeq = useRef([]);

  // Hide the instant HTML preloader (in index.html) as soon as React is ready
  useEffect(() => {
    if (typeof window.__hideHtmlPreloader === 'function') {
      window.__hideHtmlPreloader();
    }
  }, []);

  // Console easter egg
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      '%c🚀 Hey developer! Nice to meet you. Let\'s connect: gopalmuri2004@gmail.com',
      'color: #00BFFF; font-size: 1rem; font-weight: bold; padding: 8px;'
    );
  }, []);

  // Konami code easter egg
  const handleKeyDown = useCallback((e) => {
    konamiSeq.current = [...konamiSeq.current, e.key].slice(-KONAMI.length);
    if (konamiSeq.current.join(',') === KONAMI.join(',')) {
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 3200);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handlePreloaderDone = () => {
    setLoaded(true);
  };

  return (
    <>
      {/* Custom cursor (desktop only) */}
      <CursorTrail />

      {/* Preloader — show once per session */}
      {!loaded && <Preloader onDone={handlePreloaderDone} />}

      {/* Matrix Easter Egg */}
      {showMatrix && <MatrixRain />}

      {/* Main site */}
      <div className="app" style={{ visibility: loaded ? 'visible' : 'hidden' }}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Timeline />
          <Certifications />
          <Testimonials />

          <Contact />
        </main>

        <Footer />

        {/* Floating widgets */}
        <ChatBot />
        <MusicPlayer />
      </div>
    </>
  );
}

// ── ROOT APP WITH ROUTING ──────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}
