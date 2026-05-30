// src/components/Skills/Skills.jsx
import { useState, useEffect, useRef } from 'react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import skills from '../../data/skills';
import './Skills.css';

const TABS = ['frontend', 'backend', 'database', 'tools', 'core'];
const TAB_LABELS = { frontend: 'Frontend', backend: 'Backend', database: 'Database', tools: 'Tools', core: 'Core' };

// Tech logo icons for the 3D rotating globe — 8 icons for clean spacing
const GLOBE_ICONS = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',          label: 'Python'   },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',            label: 'React'    },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain-wordmark.svg',    label: 'Django', needsWhiteBg: true },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',              label: 'Java'     },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', label: 'JS'       },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',          label: 'Docker'   },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg',   label: 'MySQL', needsWhiteBg: true },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',        label: 'FastAPI'  },
];


/* Smooth rAF sphere component */
function IconGlobe() {
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);

  const angleRef = useRef(0);
  const rafRef   = useRef(null);


  useEffect(() => {
    /* 2D flat ring — radius of orbit in px */
    const ORBIT_R = 165;
    const N       = GLOBE_ICONS.length;
    const SPEED = 0.004; // slow graceful rotation

    function tick() {
      angleRef.current += SPEED;
      const base = angleRef.current - Math.PI / 2; // start at 12-o'clock

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = base + (2 * Math.PI * i) / N;
        const x = Math.cos(angle) * ORBIT_R;
        const y = Math.sin(angle) * ORBIT_R;
        /* counter-rotate bubble so label stays upright */
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-angleRef.current}rad)`;
        el.style.opacity   = '1';
        el.style.zIndex    = '1';
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="skills__globe">
      <div className="skills__globe-stage" ref={containerRef}>
        {/* Orbit ring */}
        <div className="skills__globe-ring" />
        <div className="skills__globe-center">
          <div className="skills__globe-earth-3d" />
        </div>

        {GLOBE_ICONS.map((icon, i) => (
          <div
            key={icon.label}
            ref={el => itemRefs.current[i] = el}
            className="skills__globe-item"
          >
            <img
              src={icon.src}
              alt={icon.label}
              className="skills__globe-icon"
              style={icon.needsWhiteBg ? { backgroundColor: 'rgba(255,255,255,0.95)', padding: '4px', borderRadius: '4px' } : {}}
              draggable={false}
            />
            <span className="skills__globe-name">{icon.label}</span>
          </div>
        ))}
      </div>
      <p className="skills__globe-label">Skills Universe</p>
    </div>
  );
}

export default function Skills() {
  const ref = useScrollAnimation();
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <section id="skills" className="skills section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">My Skills</h2>
          <p className="section-subtitle fade-up stagger-child">Technologies I work with every day</p>
        </div>

        <div className="skills__layout">
          {/* Left — Tabs + Pills */}
          <div className="skills__left">
            {/* Tab navigation */}
            <div className="skills__tabs fade-up stagger-child">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`skills__tab ${activeTab === tab ? 'skills__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Skill pills */}
            <div className="skills__pills">
              {skills[activeTab].map((skill, i) => (
                <div
                  key={skill.name}
                  className="skills__pill fade-up stagger-child"
                  style={{ animationDelay: `${i * 80}ms`, transitionDelay: `${i * 80}ms` }}
                >
                  <div className="skills__pill-header">
                    <span className="skills__pill-icon">{skill.icon}</span>
                    <span className="skills__pill-name">{skill.name}</span>
                    <span className="skills__pill-level">{skill.level}%</span>
                  </div>
                  <div className="skills__progress-track">
                    <div
                      className="skills__progress-bar"
                      style={{ '--target-width': `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Icon Globe */}
          <div className="skills__right fade-right stagger-child">
            <IconGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
