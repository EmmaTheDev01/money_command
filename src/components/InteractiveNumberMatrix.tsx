'use client';

import React, { useRef, useEffect, useState, useId } from 'react';

export interface MatrixPerson {
  handle: string;
  name: string;
  role: string;
  img: string;
  color?: string;
}

const DEFAULT_PEOPLE: MatrixPerson[] = [
  { handle: '@sarah.founder', name: 'Sarah Chen', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', color: '#fb923c' },
  { handle: '@marcus.dev', name: 'Marcus Vance', role: 'Freelance Engineer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', color: '#10b981' },
  { handle: '@elena.cpa', name: 'Elena Rostova', role: 'Chartered Accountant', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', color: '#38bdf8' },
  { handle: '@david.agency', name: 'David Miller', role: 'Studio Founder', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', color: '#a855f7' },
  { handle: '@alex.cfo', name: 'Alex McLean', role: 'Lead Architect', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', color: '#f43f5e' },
  { handle: '@chloe.ops', name: 'Chloe Dubois', role: 'Growth Lead', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', color: '#fbbf24' },
  { handle: '@liam.tech', name: 'Liam Wilson', role: 'CTO & Co-founder', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', color: '#34d399' },
  { handle: '@maya.design', name: 'Maya Patel', role: 'Product Designer', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', color: '#e879f9' },
];

// Finance & Command glyph paths for dot rendering
const GLYPH_PATHS = [
  // Circle / Dot
  'M 12 4 A 8 8 0 1 1 11.99 4 Z',
  // Chevron / Command Prompt '>'
  'M 8 6 L 16 12 L 8 18 L 10 20 L 20 12 L 10 4 Z',
  // Currency Dollar / Cent glyph
  'M 12 2 L 12 22 M 16 7 C 16 4.5 14 3.5 12 3.5 C 9.5 3.5 8 5 8 7 C 8 11 16 10 16 14 C 16 16.5 14.5 18 12 18 C 9 18 7.5 16 7.5 14',
  // Diamond / Ledger token
  'M 12 4 L 20 12 L 12 20 L 4 12 Z'
];

interface Dot {
  x: number;
  y: number;
  glyph: number;
  person: number; // -1 if no person
  color: string;
}

interface InteractiveNumberMatrixProps {
  value?: number | string;
  people?: MatrixPerson[];
  className?: string;
}

export default function InteractiveNumberMatrix({
  value = 80412,
  people = DEFAULT_PEOPLE,
  className = '',
}: InteractiveNumberMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Active hover tooltip state
  const [hoveredPerson, setHoveredPerson] = useState<MatrixPerson | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Preload Person Images
    const loadedImages: HTMLImageElement[] = people.map((p) => {
      const img = new Image();
      img.src = p.img;
      img.crossOrigin = 'anonymous';
      return img;
    });

    const glyph2dPaths = GLYPH_PATHS.map((p) => new Path2D(p));

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let gridStep = 13;
    let animId = 0;
    let isVisible = true;

    // Mouse lens tracking
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 64,
      targetActive: 0,
      active: 0,
      isHovering: false,
    };

    // Color theme cache
    let themeColors = {
      ink: '#ffffff',
      muted: '#71717a',
      bg: '#050505',
      accent: '#fb923c',
    };

    const updateThemeColors = () => {
      const isDark = document.documentElement.dataset.theme !== 'light';
      themeColors = {
        ink: isDark ? '#ffffff' : '#09090b',
        muted: isDark ? 'rgba(255, 255, 255, 0.42)' : 'rgba(0, 0, 0, 0.42)',
        bg: isDark ? '#121215' : '#ffffff',
        accent: '#fb923c',
      };
    };

    updateThemeColors();

    // Deterministic pseudo-random
    const pseudoRandom = (seed: number) => {
      const s = Math.sin(seed * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    };

    // Format text
    const displayText = typeof value === 'number' 
      ? new Intl.NumberFormat('en-CA').format(value)
      : String(value);

    // Rasterize and generate dot matrix
    const generateMatrix = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 160);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const isMobile = width < 640;
      gridStep = isMobile ? 11 : width < 1024 ? 13 : 15;
      mouse.radius = isMobile ? 48 : 64;

      // Off-screen canvas for text sampling
      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.round(width);
      offCanvas.height = Math.round(height);
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      // Dynamic Font Sizing to fit nicely
      const baseFont = '800 100px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      offCtx.font = baseFont;
      const initialMeasure = offCtx.measureText(displayText);
      const measuredWidth = initialMeasure.width > 0 ? initialMeasure.width : 360;
      
      const targetWidth = width * (isMobile ? 0.94 : 0.88);
      const calculatedFontSize = Math.min((targetWidth / measuredWidth) * 100, height * 0.82);
      
      offCtx.font = `800 ${Math.round(calculatedFontSize)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#000000';
      offCtx.fillText(displayText, width / 2, height / 2);

      // Sample Alpha Buffer
      const intWidth = Math.round(width);
      const intHeight = Math.round(height);
      const imgData = offCtx.getImageData(0, 0, intWidth, intHeight).data;
      const newDots: Dot[] = [];
      let pointIdx = 0;

      for (let y = gridStep / 2; y < height; y += gridStep) {
        for (let x = gridStep / 2; x < width; x += gridStep) {
          const px = Math.round(x);
          const py = Math.round(y);
          const idx = (py * intWidth + px) * 4 + 3;
          const alpha = imgData[idx] || 0;

          if (alpha > 60) {
            pointIdx++;
            const rand = pseudoRandom(pointIdx + 11);
            const isPerson = rand < 0.045; // ~4.5% chance of being an avatar
            const personIdx = isPerson ? Math.floor(pseudoRandom(pointIdx + 37) * people.length) : -1;
            const personColor = isPerson ? people[personIdx].color || '#fb923c' : '';

            newDots.push({
              x,
              y,
              glyph: Math.floor(pseudoRandom(pointIdx + 7) * GLYPH_PATHS.length),
              person: personIdx,
              color: personColor,
            });
          }
        }
      }

      dots = newDots;
    };

    generateMatrix();

    // Animation Loop
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;

      // Ambient wandering lens when not hovering
      if (!mouse.isHovering) {
        const centerY = height / 2;
        mouse.x = width * (0.5 + 0.32 * Math.sin(elapsed / 2800));
        mouse.y = centerY + 28 * Math.sin(elapsed / 1900);
        mouse.targetActive = 0.85;
      }

      // Smooth lerp lens active state
      mouse.active += (mouse.targetActive - mouse.active) * 0.12;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const baseRadius = gridStep * 0.32;
      let closestPerson: MatrixPerson | null = null;
      let minPersonDist = Infinity;
      let closestPersonPos = { x: 0, y: 0 };

      // Draw Dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dist = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
        const lensEffect = mouse.active > 0.01 && dist < mouse.radius 
          ? (1 - dist / mouse.radius) * mouse.active 
          : 0;

        // Displace outward magnetically
        const renderX = lensEffect > 0 ? mouse.x + (dot.x - mouse.x) * (1 + lensEffect * 0.6) : dot.x;
        const renderY = lensEffect > 0 ? mouse.y + (dot.y - mouse.y) * (1 + lensEffect * 0.6) : dot.y;
        const scale = 1 + lensEffect * 1.4;

        if (dot.person >= 0) {
          // Render Avatar Circle
          const person = people[dot.person];
          const img = loadedImages[dot.person];
          const avatarSize = baseRadius * 1.5 * scale;

          if (lensEffect > 0.1 && dist < minPersonDist) {
            minPersonDist = dist;
            closestPerson = person;
            closestPersonPos = { x: renderX, y: renderY };
          }

          // Border ring with person's accent color
          ctx.beginPath();
          ctx.arc(renderX, renderY, avatarSize + 1.5, 0, Math.PI * 2);
          ctx.fillStyle = person.color || '#fb923c';
          ctx.fill();

          if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(renderX, renderY, avatarSize, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, renderX - avatarSize, renderY - avatarSize, avatarSize * 2, avatarSize * 2);
            ctx.restore();
          } else {
            // Fallback initial
            ctx.beginPath();
            ctx.arc(renderX, renderY, avatarSize, 0, Math.PI * 2);
            ctx.fillStyle = '#27272a';
            ctx.fill();
          }
        } else {
          // Render Glyphs or Clean Dots
          const r = baseRadius * scale;
          const isHighlighted = lensEffect > 0.15;

          ctx.fillStyle = isHighlighted ? themeColors.accent : themeColors.muted;
          ctx.globalAlpha = isHighlighted ? 0.95 : 0.75;

          if (isHighlighted && dot.glyph > 0) {
            // Draw vector glyph icon
            ctx.save();
            const glyphScale = (r * 2.2) / 24;
            ctx.translate(renderX - (12 * glyphScale), renderY - (12 * glyphScale));
            ctx.scale(glyphScale, glyphScale);
            ctx.fill(glyph2dPaths[dot.glyph]);
            ctx.restore();
          } else {
            // High-precision smooth circle
            ctx.beginPath();
            ctx.arc(renderX, renderY, r, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalAlpha = 1;
        }
      }

      ctx.restore();

      // Tooltip sync
      if (mouse.isHovering && closestPerson && minPersonDist < mouse.radius * 0.9) {
        setHoveredPerson(closestPerson);
        setTooltipPos({ x: closestPersonPos.x, y: closestPersonPos.y });
      } else if (!mouse.isHovering || minPersonDist >= mouse.radius) {
        setHoveredPerson(null);
      }

      if (isVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    // Event Listeners: Mouse Move & Hover
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX >= rect.left && 
        clientX <= rect.right && 
        clientY >= rect.top && 
        clientY <= rect.bottom
      ) {
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.targetActive = 1;
        mouse.isHovering = true;
      } else {
        mouse.targetActive = 0;
        mouse.isHovering = false;
      }
    };

    const onPointerLeave = () => {
      mouse.targetActive = 0;
      mouse.isHovering = false;
    };

    // Touch Support
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.targetActive = 1;
      mouse.isHovering = true;
    };

    const onTouchEnd = () => {
      mouse.targetActive = 0;
      mouse.isHovering = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      generateMatrix();
    });
    resizeObserver.observe(container);

    // Theme Mutation Observer
    const themeObserver = new MutationObserver(() => {
      updateThemeColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    // Intersection Observer
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    });
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [value, people]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-[21/8] min-h-[220px] max-h-[380px] flex items-center justify-center select-none cursor-crosshair overflow-visible ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-label={`Interactive financial dot matrix showing ${value}`}
        className="w-full h-full block pointer-events-none"
      />

      {/* Floating Monospace Tooltip on Hover */}
      {hoveredPerson && (
        <div
          ref={tooltipRef}
          style={{
            transform: `translate3d(${tooltipPos.x + 18}px, ${tooltipPos.y - 18}px, 0)`,
            transition: 'transform 0.08s ease-out, opacity 0.15s ease-out',
          }}
          className="absolute top-0 left-0 pointer-events-none z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/95 border border-border shadow-xl backdrop-blur-md animate-in fade-in duration-150"
        >
          <span 
            className="w-2 h-2 rounded-full shrink-0" 
            style={{ backgroundColor: hoveredPerson.color || '#fb923c' }} 
          />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-mono font-bold text-foreground leading-tight">
              {hoveredPerson.handle}
            </span>
            <span className="text-[9px] font-mono text-muted-foreground leading-tight">
              {hoveredPerson.role} &middot; Verified
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

