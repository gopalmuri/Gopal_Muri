// src/components/Testimonials/Testimonials.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import glimpses from '../../data/testimonials';
import './Testimonials.css';

export default function Testimonials() {
  const ref = useScrollAnimation();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const intervalRef = useRef(null);

  /* Slides = real cards + a clone of the first card at the end for seamless loop */
  const slides = [...glimpses, glimpses[0]];

  const next = useCallback(() => {
    setCurrent((c) => c + 1);
  }, []);

  const goToSlide = useCallback((i) => {
    setAnimate(true);
    setCurrent(i);
  }, []);

  /* When we land on the clone (index === glimpses.length),
     instantly jump back to index 0 without animation */
  useEffect(() => {
    if (current === glimpses.length) {
      const timer = setTimeout(() => {
        setAnimate(false);          // disable transition
        setCurrent(0);              // jump to real first
      }, 1000);                     // wait for slide-in to finish
      return () => clearTimeout(timer);
    }
  }, [current]);

  /* Re-enable animation one frame after the instant reset */
  useEffect(() => {
    if (!animate) {
      const t = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(t);
    }
  }, [animate]);

  /* Auto-scroll logic */
  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 5000); // 5 second scroll
    return () => clearInterval(intervalRef.current);
  }, [paused, next]);

  /* Dot indicator maps to real slide index */
  const dotIndex = current === glimpses.length ? 0 : current;
  const isTransitioning = animate;

  /* Helper to highlight the last word of the title */
  const renderHighlightedTitle = (title) => {
    if (!title) return null;
    const words = title.trim().split(' ');
    if (words.length <= 1) return title;
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')} <span className="glimpse__highlight">{lastWord}</span>
      </>
    );
  };

  return (
    <section id="testimonials" className="testimonials section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">Moments & Milestones</h2>
          <p className="section-subtitle fade-up stagger-child">
            A gallery of participation, major projects, and memories with friends.
          </p>
        </div>

        <div
          className="testimonials__carousel fade-up stagger-child"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="testimonials__track"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            {slides.map((t, idx) => (
              <div key={idx} className="testimonials__card">
                <div className="glimpse__image-container">
                  <img
                    src={t.image}
                    alt={t.title}
                    className="glimpse__image"
                    style={{
                      objectPosition: t.objectPosition || 'center',
                      objectFit: t.objectFit || 'cover',
                      filter: t.filter || 'none'
                    }}
                  />
                  {/* Top badge — hidden when badgeBottom is true */}
                  {!t.badgeBottom && (
                    <div className="glimpse__top-header">
                      <span className="glimpse__category" style={{ backgroundColor: t.color }}>{t.category}</span>
                    </div>
                  )}
                  <div className="glimpse__overlay">
                    {/* Bottom badge — only shown when badgeBottom is true */}
                    {t.badgeBottom && (
                      <span className="glimpse__category" style={{ backgroundColor: t.color, marginBottom: '0.5rem' }}>{t.category}</span>
                    )}
                    <h3 className="glimpse__title">{renderHighlightedTitle(t.title)}</h3>
                    <p className="glimpse__description">{t.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials__dots fade-up stagger-child">
          {glimpses.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`testimonials__dot ${i === dotIndex ? 'testimonials__dot--active' : ''}`}
              aria-label={`Go to glimpse ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
