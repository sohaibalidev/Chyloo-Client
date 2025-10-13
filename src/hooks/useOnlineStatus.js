import { useState, useCallback } from 'react';

export default function useServerStatus(url) {
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      setIsServerOnline(res.ok && data.status === 'ok');
    } catch {
      setIsServerOnline(false);
    } finally {
      setIsChecking(false);
    }
  }, [url]);

  return { isServerOnline, isChecking, checkServerStatus };
}
