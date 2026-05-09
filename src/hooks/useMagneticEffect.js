// src/hooks/useMagneticEffect.js
import { useRef, useCallback } from 'react';

const useMagneticEffect = (strength = 0.4, range = 80) => {
  const elementRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = elementRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX ** 2 + distY ** 2);

    if (dist < range) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        el.style.transform = `translate(${distX * strength}px, ${distY * strength}px)`;
      });
    }
  }, [strength, range]);

  const handleMouseLeave = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transform = 'translate(0px, 0px)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, 500);
  }, []);

  return { elementRef, handleMouseMove, handleMouseLeave };
};

export default useMagneticEffect;
