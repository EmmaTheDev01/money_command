'use client';

import React from 'react';

interface MoneyCommandLogoProps {
  className?: string;
  variant?: 'mark' | 'full';
  theme?: 'auto' | 'light' | 'dark';
}

// Exact vectorized emblem path from the official Money Command brand asset
const EMBLEM_PATH = `
M0,16 L35,51 L35,163 L0,163 Z
M2,0 L39,0 L60,21 L60,57 L3,0 Z
M143,0 L182,0 L182,3 L120,61 L100,42 Z
M184,16 L151,49 L151,134 L184,134 Z
M71,32 L123,83 L71,134 L71,104 L93,83 L71,62 Z
M110,114 L76,148 L76,163 L110,163 Z
M123,147 L184,147 L184,163 L123,163 Z
`;

export default function MoneyCommandLogo({
  className = "h-8 w-auto",
  variant = "mark",
  theme = "auto"
}: MoneyCommandLogoProps) {
  // Theme color resolve
  let textColorClass = "text-current";
  if (theme === 'light') {
    textColorClass = "text-black";
  } else if (theme === 'dark') {
    textColorClass = "text-white";
  }

  if (variant === 'mark') {
    return (
      <svg 
        viewBox="0 0 185 164" 
        className={`${className} ${textColorClass} transition-colors`}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Money Command Logo Mark"
      >
        {/* Left vertical pillar */}
        <polygon points="0,16 35,51 35,163 0,163" />
        {/* Top-left diagonal bevel */}
        <polygon points="2,0 39,0 60,21 60,57 3,0" />
        {/* Top-right diagonal bevel */}
        <polygon points="143,0 182,0 182,3 120,61 100,42" />
        {/* Right vertical pillar */}
        <polygon points="184,16 151,49 151,134 184,134" />
        {/* Central command chevron `>` */}
        <polygon points="71,32 123,83 71,134 71,104 93,83 71,62" />
        {/* Center-bottom vertical stem */}
        <polygon points="110,114 76,148 76,163 110,163" />
        {/* Bottom-right terminal underscore `_` */}
        <rect x="123" y="147" width="61" height="16" />
      </svg>
    );
  }

  // Full Lockup: Emblem + Wordmark "MONEY COMMAND"
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className} ${textColorClass} transition-colors`}>
      <svg 
        viewBox="0 0 185 164" 
        className="h-full w-auto shrink-0"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polygon points="0,16 35,51 35,163 0,163" />
        <polygon points="2,0 39,0 60,21 60,57 3,0" />
        <polygon points="143,0 182,0 182,3 120,61 100,42" />
        <polygon points="184,16 151,49 151,134 184,134" />
        <polygon points="71,32 123,83 71,134 71,104 93,83 71,62" />
        <polygon points="110,114 76,148 76,163 110,163" />
        <rect x="123" y="147" width="61" height="16" />
      </svg>
      <span className="font-extrabold tracking-tight text-current uppercase leading-none font-sans whitespace-nowrap text-xl sm:text-2xl">
        Money Command
      </span>
    </div>
  );
}

