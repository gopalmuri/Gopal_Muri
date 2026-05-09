// src/components/shared/Toast.jsx
import { useEffect, useState } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${type} ${visible ? 'toast--show' : 'toast--hide'}`}>
      <span className="toast__icon">{type === 'success' ? '✅' : '❌'}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={() => { setVisible(false); setTimeout(onClose, 400); }}>×</button>
    </div>
  );
}
