// src/components/Navbar/Navbar.jsx
import { useState, useEffect, useCallback } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

import navLogo from '../../assets/images/nav_bar.png';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Milestones', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);



  // Shrink + glassmorph on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((href) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          {/* Logo */}
          <a className="navbar__logo" href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src={navLogo} alt="GM Logo" className="navbar__logo-img" />
          </a>

          {/* Desktop links */}
          <ul className="navbar__links">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="navbar__controls">


            {/* Theme toggle */}
            <button
              className="navbar__theme-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className={`navbar__theme-icon ${theme === 'dark' ? 'navbar__theme-icon--active' : ''}`}>
                <FiMoon />
              </span>
              <span className={`navbar__theme-icon ${theme === 'light' ? 'navbar__theme-icon--active' : ''}`}>
                <FiSun />
              </span>
            </button>

            {/* Hamburger */}
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <ul className="mobile-menu__links">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label} style={{ transitionDelay: `${i * 60}ms` }}>
              <a
                href={link.href}
                className={`mobile-menu__link ${activeSection === link.href.slice(1) ? 'mobile-menu__link--active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
