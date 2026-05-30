// src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';

const useScrollAnimation = (options = {}) => {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('animate-in');
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe the element itself
    observer.observe(element);

    // Stagger children
    const children = element.querySelectorAll('.stagger-child');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 100}ms`;
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
};

export default useScrollAnimation;
