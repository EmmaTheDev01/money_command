'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  trigger?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrambleText({
  text,
  trigger,
  delay = 0,
  duration = 750,
  className = '',
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*!?@$';

  useEffect(() => {
    // If a controlled trigger is provided, use it
    if (trigger !== undefined) {
      setInView(trigger);
      return;
    }

    // Otherwise, auto-trigger when this element scrolls into view
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger]);

  useEffect(() => {
    if (!inView) {
      return;
    }

    let intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      const startTime = Date.now();
      const length = text.length;

      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const revealedCount = Math.floor(progress * length);

        const scrambled = text
          .split('')
          .map((char, index) => {
            if (
              char === ' ' ||
              char === '.' ||
              char === '’' ||
              char === "'" ||
              char === '-' ||
              char === '+' ||
              char === '·' ||
              char === '$' ||
              char === '(' ||
              char === ')' ||
              char === '—' ||
              char === ':' ||
              char === '&' ||
              char === '/' ||
              char === ','
            ) {
              return char;
            }
            if (index < revealedCount) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        setDisplayText(scrambled);

        if (progress >= 1) {
          clearInterval(intervalId);
          setDisplayText(text);
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [inView, text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}

