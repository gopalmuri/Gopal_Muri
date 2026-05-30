// src/components/Certifications/Certifications.jsx
import useScrollAnimation from '../../hooks/useScrollAnimation';
import certifications from '../../data/certifications';
import './Certifications.css';

export default function Certifications() {
  const ref = useScrollAnimation();

  return (
    <section id="certifications" className="certifications section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">Certifications</h2>
          <p className="section-subtitle fade-up stagger-child">
            Verified credentials from industry-leading platforms
          </p>
        </div>

        <div className="certs__grid">
          {certifications.map((cert, i) => (
            <div
              key={cert.id}
              className="cert-card fade-up stagger-child"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="cert-card__inner">
                {/* Front */}
                <div className="cert-card__front">
                  <div className="cert-card__ribbon">Verified ✓</div>

                  <div
                    className="cert-card__icon"
                    style={{ color: cert.color, background: `${cert.color}15` }}
                  >
                    {cert.logo ? (
                      <img 
                        src={cert.logo} 
                        alt={cert.issuer} 
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        style={{ 
                          width: cert.logoFit === 'contain' ? '80%' : '100%',
                          height: cert.logoFit === 'contain' ? '80%' : '100%',
                          objectFit: cert.logoFit || 'cover',
                          filter: cert.invertIcon ? 'brightness(0) invert(1) drop-shadow(0px 0px 4px rgba(255,255,255,0.3))' : 'none'
                        }} 
                      />
                    ) : null}
                    <span style={{ display: cert.logo ? 'none' : 'block' }}>{cert.emoji}</span>
                  </div>

                  <h3 className="cert-card__name">{cert.name}</h3>
                  <p className="cert-card__issuer">{cert.issuer}</p>
                  <p className="cert-card__date">{cert.date}</p>

                  <p className="cert-card__hint">Hover to see details →</p>
                </div>

                {/* Back */}
                <div className="cert-card__back cert-card__back--image">
                  <div className="cert-card__img-wrapper">
                    <img src={cert.image} alt={cert.name} className="cert-card__img" />
                  </div>
                  <div className="cert-card__back-overlay">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-card__link"
                      style={{ '--cert-color': cert.color }}
                    >
                      View Certificate →
                    </a>
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
