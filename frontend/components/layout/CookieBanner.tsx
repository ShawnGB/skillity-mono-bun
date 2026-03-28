'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const STORAGE_KEY = 'cookie_consent';

type ConsentChoice = 'accepted' | 'declined';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function handleChoice(choice: ConsentChoice) {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-4 py-4 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Wir verwenden notwendige Cookies für die Authentifizierung. Weitere
          Cookies (z. B. Analyse) setzen wir nur mit Ihrer Zustimmung ein.
          Mehr dazu in unserer{' '}
          <Link to="/datenschutz" className="underline hover:text-foreground">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChoice('declined')}
          >
            Nur notwendige
          </Button>
          <Button size="sm" onClick={() => handleChoice('accepted')}>
            Alle akzeptieren
          </Button>
        </div>
      </div>
    </div>
  );
}
