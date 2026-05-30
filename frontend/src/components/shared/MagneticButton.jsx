// src/components/shared/MagneticButton.jsx
import { useRef, useCallback } from 'react';
import './MagneticButton.css';

export default function MagneticButton({ children, className = '', onClick, href, target, rel, type = 'button', disabled }) {
  const btnRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (el) el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = btnRef.current;
    if (el) {
      el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.transform = 'translate(0px, 0px)';
      setTimeout(() => { if (el) el.style.transition = ''; }, 500);
    }
  }, []);

  const commonProps = {
    ref: btnRef,
    className: `magnetic-btn ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return (
      <a {...commonProps} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
