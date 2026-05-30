// src/components/Projects/Projects.jsx
import { useState, useRef } from 'react';
import { FiStar, FiGitBranch, FiEye, FiCode, FiExternalLink } from 'react-icons/fi';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import './Projects.css';

// REPLACE with your actual GitHub username
const GITHUB_USERNAME = 'gopalmuri'; // REPLACE

const LANGUAGE_COLORS = {
  Python: '#3776AB', JavaScript: '#F7DF1E', Java: '#E76F00',
  TypeScript: '#3178C6', HTML: '#E34F26', CSS: '#1572B6',
  Shell: '#89E051', null: '#888',
};

const RESUME_PROJECTS = [
  {
    id: 1,
    name: 'HiringAI Platform',
    description: 'AI-driven recruitment platform screening 100+ resumes using Sentence Transformers, ChromaDB semantic search, and Vapi for AI voice interviews.',
    language: 'Python',
    stargazers_count: 14,
    forks_count: 3,
    watchers_count: 5,
    html_url: 'https://github.com/gopalmuri/HiringAI',
    homepage: 'https://hiring-ai-blush.vercel.app/',
    image: '/assets/projects/hiringai.png'
  },
  {
    id: 2,
    name: 'Real-Time Crowd Analytics',
    description: 'AI system using OpenCV and MobileNetSSD for person detection, tracking, crowd density estimation, and gender classification from live video feeds.',
    language: 'Python',
    stargazers_count: 8,
    forks_count: 2,
    watchers_count: 3,
    html_url: 'https://github.com/gopalmuri/Crowd-Analytics',
    homepage: '',
    image: '/assets/projects/crowd_analytics.png'
  },
  {
    id: 3,
    name: 'AI Document Assistant (RAG)',
    description: 'AI-powered document assistant processing 100+ PDFs using text extraction, chunking, and ChromaDB vector embeddings, delivering citation-grounded answers with <500ms latency.',
    language: 'Python',
    stargazers_count: 12,
    forks_count: 4,
    watchers_count: 6,
    html_url: 'https://github.com/gopalmuri',
    homepage: 'https://docquery-ai-app.onrender.com/',
    image: '/assets/projects/rag_assistant.png'
  }
];

function TiltCard({ children, style, className }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Increased tilt range for a more dramatic 3D effect (max 20 degrees)
    const tiltX = ((y - centerY) / centerY) * -18; 
    const tiltY = ((x - centerX) / centerX) * 18;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glare effect: follows mouse opposite to tilt */}
      <div 
         className="tilt-glare" 
         style={{ 
           opacity: isHovered ? 0.6 : 0,
           transform: `translate3d(${(tilt.y / 18) * 100}px, ${(tilt.x / -18) * 100}px, 150px)`
         }} 
      />
      
      {/* Content wrapper with base Z-index */}
      <div className="tilt-card-inner">
        {children}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="project-card project-card--skeleton">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--line skeleton--short" />
      <div className="skeleton skeleton--badges" />
      <div className="skeleton skeleton--btn" />
    </div>
  );
}

export default function Projects() {
  const ref = useScrollAnimation();
  const repos = RESUME_PROJECTS;
  const loading = false;
  const error = null;
  return (
    <section id="projects" className="projects section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">My Projects</h2>
          <p className="section-subtitle fade-up stagger-child">
            Live from GitHub — real code, real impact
          </p>
        </div>

        {/* Filter buttons removed */}

        {/* Cards grid */}
        {loading ? (
          <div className="projects__grid">
            {Array(3).fill(null).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="projects__error">
            <p>⚠️ Could not load GitHub projects.</p>
          </div>
        ) : repos.length === 0 ? (
          <div className="projects__error">
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="projects__grid">
            {repos.slice(0, 6).map((repo, i) => (
              <TiltCard
                key={repo.id}
                className="project-card fade-up stagger-child"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Language indicator */}
                <div className="project-card__lang-indicator" style={{ background: LANGUAGE_COLORS[repo.language] || '#888' }} />

                {/* Image Banner: Deepest layer */}
                {repo.image && (
                  <div className="project-card__image-wrapper">
                    <img src={repo.image} alt={repo.name} className="project-card__image" />
                    <div className="project-card__image-overlay"></div>
                  </div>
                )}

                {/* Content Section: Floating layers */}
                <div className="project-card__content-wrapper">
                  <h3 className="project-card__name">{repo.name}</h3>

                <p className="project-card__desc">
                  {repo.description || 'No description available.'}
                </p>

                {/* Stats: Mid layer */}
                <div className="project-card__stats">
                  <span>
                    <span className="lang-dot" style={{ background: LANGUAGE_COLORS[repo.language] || '#888' }} />
                    {repo.language || 'Unknown'}
                  </span>
                  <span><FiStar size={13} /> {repo.stargazers_count}</span>
                  <span><FiGitBranch size={13} /> {repo.forks_count}</span>
                  <span><FiEye size={13} /> {repo.watchers_count}</span>
                </div>

                {/* Actions: Highest layer */}
                <div className="project-card__actions">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__btn project-card__btn--code"
                  >
                    <FiCode size={14} /> View Code
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__btn project-card__btn--demo"
                    >
                      <FiExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="projects__github-link">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn magnetic-btn--outline"
            >
              🐙 View All on GitHub
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
