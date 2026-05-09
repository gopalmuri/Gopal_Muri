// src/hooks/useVisitorCount.js
import { useState, useEffect } from 'react';

const useVisitorCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Read existing count
    const stored = parseInt(localStorage.getItem('portfolio_visitor_count') || '1200', 10);

    // Only increment once per session
    const visited = sessionStorage.getItem('portfolio_visited');
    if (!visited) {
      const newCount = stored + 1;
      localStorage.setItem('portfolio_visitor_count', newCount.toString());
      sessionStorage.setItem('portfolio_visited', 'true');
      setCount(newCount);
    } else {
      setCount(stored);
    }
  }, []);

  const formatCount = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  return { count, formatted: formatCount(count) };
};

export default useVisitorCount;
