'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProStatus {
  isPro: boolean;
  loading: boolean;
  email: string | null;
  activate: (email: string) => Promise<{ isPro: boolean; message: string }>;
}

export function useProStatus(): ProStatus {
  const [isPro, setIsPro] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pro/activate')
      .then((r) => r.json())
      .then((data) => {
        setIsPro(data.isPro || false);
        setEmail(data.email || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activate = useCallback(async (emailInput: string) => {
    const res = await fetch('/api/pro/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput }),
    });
    const data = await res.json();
    if (data.isPro) {
      setIsPro(true);
      setEmail(emailInput);
    }
    return data;
  }, []);

  return { isPro, loading, email, activate };
}
