import { useState, useEffect, useCallback } from 'react';

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return { route, navigate };
}

function parseHash(): { path: string; segments: string[] } {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const segments = raw.split('/').filter(Boolean);
  return { path: raw, segments };
}
