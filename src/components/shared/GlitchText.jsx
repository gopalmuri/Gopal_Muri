// src/components/shared/GlitchText.jsx
import './GlitchText.css';

export default function GlitchText({ text, className = '', tag: Tag = 'h1' }) {
  return (
    <Tag
      className={`glitch-text ${className}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
