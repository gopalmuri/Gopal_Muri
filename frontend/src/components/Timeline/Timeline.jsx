// src/components/Timeline/Timeline.jsx
import { useEffect, useRef } from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import timeline from '../../data/timeline';
import './Timeline.css';

export default function Timeline() {
  const ref = useScrollAnimation();
  const lineRef = useRef(null);

  // Animate the vertical line drawing on scroll
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          line.style.setProperty('--line-height', '100%');
          observer.unobserve(line);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="timeline" className="timeline section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">My Journey</h2>
          <p className="section-subtitle fade-up stagger-child">
            The path that shaped who I am as a developer
          </p>
        </div>

        <div className="timeline__wrapper">
          {/* Animated central line */}
          <div className="timeline__line" ref={lineRef} />

          {/* Events */}
          {timeline.map((item, i) => (
            <div
              key={item.id}
              className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'} ${item.type === 'work' ? 'timeline__item--work' : 'timeline__item--edu'} fade-up stagger-child`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >


              {/* Card — outer is the 3D perspective wrapper, inner clips content */}
              <div className="timeline__card-outer">
                <div className="timeline__card">
                  <div className="timeline__card-header">
                    <div className="timeline__header-info">
                      <span className="timeline__year">{item.year}</span>
                      <span className={`timeline__type-badge timeline__type-badge--${item.type}`}>
                        {item.icon} {item.type === 'work' ? 'Work' : 'Education'}
                      </span>
                    </div>
                    {item.logo && (
                      <div className="timeline__logo-wrapper">
                        <img src={item.logo} alt={item.org} className="timeline__logo" />
                      </div>
                    )}
                  </div>
                  
                  <div className="timeline__card-body">
                    <h3 className="timeline__title">{item.title}</h3>
                    <p className="timeline__org">{item.org}</p>
                    <p className="timeline__desc">{item.desc}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
