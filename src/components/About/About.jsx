// src/components/About/About.jsx
import { useEffect, useRef, useState } from 'react';
import { FiBriefcase, FiLayers, FiGitCommit, FiZap } from 'react-icons/fi';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import ResumeModal from './ResumeModal';
import './About.css';

const STATS = [
  { value: 5,   suffix: '+ mo', label: 'Months Experience',     Icon: FiBriefcase },
  { value: 3,   suffix: '+',  label: 'Projects Completed',    Icon: FiLayers },
  { value: 300, suffix: '+',  label: 'LeetCode Problems',     Icon: FiGitCommit },
  { value: 10,  suffix: '+',  label: 'Technologies Mastered', Icon: FiZap },
];


function CountUp({ target, suffix, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current < target) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return <span>{count}{suffix}</span>;
}

export default function About() {
  const ref = useScrollAnimation();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">About Me</h2>
          <p className="section-subtitle fade-up stagger-child">A passion for building high-performance, user-centric applications</p>
        </div>

        <div className="about__grid">
          {/* Left — Text */}
          <div className="about__left fade-left stagger-child">
            <div className="about__content">
              <p className="about__text">
                Hey! I'm <strong className="about__highlight">Gopal Muri</strong>, a passionate Junior Full Stack Developer currently working at <strong className="about__highlight">ThirdEye Data, Hubli</strong> (Jan 2026 – Present).
                I specialize in building robust web applications using <strong className="about__highlight">FastAPI &amp; Django</strong> on the backend
                and <strong className="about__highlight">React / React Native</strong> on the frontend.
              </p>
              <p className="about__text">
                Currently pursuing my <strong className="about__highlight">B.E. in Computer Science</strong> at KLS Vishwanathrao Deshpande Institute of Technology, Haliyal (CGPA: 9.12, Expected 2026), I have built projects spanning <strong className="about__highlight">AI-driven recruitment platforms</strong>, real-time crowd analytics systems, and RAG-based intelligent document assistants. Recognized as the <strong className="about__highlight">Top Performer</strong> at ThirdEye Data's Learning Path Program, I'm passionate about solving real-world problems through clean code, intelligent systems, and seamless user experiences.
              </p>
            </div>

            <div className="about__actions fade-up stagger-child">
              <button
                className="about__resume-btn"
                onClick={() => setIsResumeOpen(true)}
              >
                View Resume
              </button>
            </div>

            {/* Resume Modal */}
            <ResumeModal 
              isOpen={isResumeOpen} 
              onClose={() => setIsResumeOpen(false)} 
            />
          </div>

          {/* Right — Stats */}
          <div className="about__right" ref={statsRef}>
            <div className="about__stats">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="about__stat-card fade-up stagger-child" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="about__stat-icon">
                    <stat.Icon size={22} />
                  </div>
                  <div className="about__stat-value">
                    <CountUp target={stat.value} suffix={stat.suffix} start={statsVisible} />
                  </div>
                  <div className="about__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
