import LoadingSpinner from '@/components/ui/loadingSpinner';
import { useEffect, useRef, useState } from 'react';

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: {
    sitekey: string;
    theme: 'auto';
    size: 'flexible';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    jmportTurnstileLoaded?: () => void;
  }
}

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile';
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

let turnstileScript: Promise<TurnstileApi> | null = null;

const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScript) return turnstileScript;

  turnstileScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    window.jmportTurnstileLoaded = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }

      reject(new Error('Turnstile did not load'));
    };

    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=jmportTurnstileLoaded';
    script.async = true;
    script.onerror = () => reject(new Error('Turnstile could not be loaded'));
    document.head.appendChild(script);
  });

  return turnstileScript;
};

const TurnstileWidget = ({ onTokenChange }: TurnstileWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onTokenChange });
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    callbacks.current = { onTokenChange };
  }, [onTokenChange]);

  useEffect(() => {
    if (!siteKey || !container.current) return;

    let widgetId: string | undefined;
    let disposed = false;

    void loadTurnstile()
      .then((turnstile) => {
        if (disposed || !container.current) return;

        widgetId = turnstile.render(container.current, {
          sitekey: siteKey,
          theme: 'auto',
          size: 'flexible',
          callback: (token) => callbacks.current.onTokenChange(token),
          'expired-callback': () => callbacks.current.onTokenChange(''),
          'error-callback': () => {
            callbacks.current.onTokenChange('');
            setLoadError(true);
          },
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setLoadError(true);
      });

    return () => {
      disposed = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, []);

  if (!siteKey || loadError) {
    return <p className="text-sm text-destructive">Security check is unavailable. Please refresh and try again.</p>;
  }

  return (
    <div className="relative min-h-16">
      <div ref={container} className={isLoading ? "invisible min-h-16" : "min-h-16"} />
      {isLoading && (
        <LoadingSpinner
          aria-label="Loading security check"
          className="size-6 text-muted-foreground"
          containerClassName="absolute inset-0 rounded-md border bg-muted/30"
        />
      )}
    </div>
  );
};

export default TurnstileWidget;
