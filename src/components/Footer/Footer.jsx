// src/components/Footer/Footer.jsx
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowUp, FiInstagram, FiYoutube } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

import './Footer.css';

const SOCIAL_LINKS = [
  { icon: FiGithub,    href: 'https://github.com/gopalmuri',              label: 'GitHub',    hoverClass: 'github' },
  { icon: FiLinkedin, href: 'https://www.linkedin.com/in/gopalmuri',      label: 'LinkedIn',  hoverClass: 'linkedin' },
  { icon: FiTwitter,  href: 'https://x.com/MuriGopal98677',               label: 'Twitter',   hoverClass: 'twitter' },
  { icon: FiInstagram,href: 'https://instagram.com/gopalmuri',            label: 'Instagram', hoverClass: 'instagram' },
  { icon: SiLeetcode, href: 'https://leetcode.com/gopalmuri',             label: 'LeetCode',  hoverClass: 'leetcode' },
  { icon: FiYoutube,  href: 'https://youtube.com/@gopal_muri',            label: 'YouTube',   hoverClass: 'youtube' },
  { icon: FiMail,     href: 'mailto:gopalmuri2004@gmail.com',             label: 'Email',     hoverClass: 'email' },
];

export default function Footer() {


  return (
    <footer className="footer">
      {/* Animated gradient bg */}
      <div className="footer__bg" />

      <div className="footer__content">
        {/* Back to top */}
        <button
          className="footer__top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <FiArrowUp size={18} />
        </button>

        {/* Name + title */}
        <p className="footer__name">Gopal Muri</p>
        <p className="footer__role">Full Stack Developer</p>

        {/* Social links */}
        <div className="footer__social">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label, hoverClass }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`footer__social-link footer__social-link--${hoverClass}`}
              aria-label={label}
              title={label}
            >
              <Icon size={20} />
              <span className="footer__social-tooltip">{label}</span>
            </a>
          ))}
        </div>



        {/* Copyright */}
        <p className="footer__copy">
          © 2025 Gopal Muri. Designed & Built with ❤️ and React.
        </p>
      </div>
    </footer>
  );
}
