// src/components/shared/CursorTrail.jsx
import { useEffect, useRef, useState } from 'react';
import './CursorTrail.css';

const TRAIL_LENGTH = 8;

export default function CursorTrail() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const trailPos = useRef(Array(TRAIL_LENGTH).fill({ x: -100, y: -100 }));
  const [isTouch, setIsTouch] = useState(false);
  const [cursorType, setCursorType] = useState('default');

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    let animFrame;

    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      // Detect hovered element type
      const target = e.target;
      if (
        target.closest('a') || target.closest('button') ||
        target.closest('[role="button"]') || target.closest('.magnetic-btn')
      ) {
        setCursorType('pointer');
      } else if (
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
        target.closest('p') || target.closest('h1') || target.closest('h2') ||
        target.closest('h3') || target.closest('li') || target.closest('span')
      ) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const click = (e) => {
      // Ripple burst at click point
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.left = `${posRef.current.x}px`;
        dot.style.top = `${posRef.current.y}px`;
      }

      // Ring follows with lag
      ringPosRef.current = {
        x: ringPosRef.current.x + (posRef.current.x - ringPosRef.current.x) * 0.12,
        y: ringPosRef.current.y + (posRef.current.y - ringPosRef.current.y) * 0.12,
      };

      if (ring) {
        ring.style.left = `${ringPosRef.current.x}px`;
        ring.style.top = `${ringPosRef.current.y}px`;
      }

      // Trail dots
      trailPos.current = [
        { ...posRef.current },
        ...trailPos.current.slice(0, TRAIL_LENGTH - 1),
      ];

      trailPos.current.forEach((p, i) => {
        const el = trailRefs.current[i];
        if (el) {
          el.style.left = `${p.x}px`;
          el.style.top = `${p.y}px`;
          el.style.opacity = `${1 - i / TRAIL_LENGTH}`;
          const sz = 6 - i * 0.6;
          el.style.width = `${sz}px`;
          el.style.height = `${sz}px`;
        }
      });

      animFrame = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('click', click);
    animFrame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('click', click);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot cursor-dot--${cursorType}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`cursor-ring cursor-ring--${cursorType}`}
        aria-hidden="true"
      />
      {Array(TRAIL_LENGTH).fill(null).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="cursor-trail-dot"
          aria-hidden="true"
        />
      ))}
    </>
  );
}
