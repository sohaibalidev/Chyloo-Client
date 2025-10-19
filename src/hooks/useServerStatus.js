import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '@/config/app.config';

export default function useServerStatus(url = `${BASE_URL}/api/health`) {
  const [isServerOnline, setIsServerOnline] = useState(null);
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

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  return { isServerOnline, isChecking, checkServerStatus };
}
