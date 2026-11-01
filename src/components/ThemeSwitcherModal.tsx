'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export const THEMES = [
  { id: 'rosy-sage', name: 'Rosy Sage', previewBg: '#2d5a43', previewDot: '#e07a5f', isDark: false },
  { id: 'midnight-slate', name: 'Midnight Slate', previewBg: '#0b0f19', previewDot: '#818cf8', isDark: true },
  { id: 'blush-gold', name: 'Blush & Gold', previewBg: '#f4ece2', previewDot: '#c99351', isDark: false },
  { id: 'minimalist-white', name: 'Minimalist White', previewBg: '#ffffff', previewDot: '#4f46e5', isDark: false },
  { id: 'ocean-blue', name: 'Ocean Blue', previewBg: '#f0f7ff', previewDot: '#0284c7', isDark: false },
  { id: 'forest-dark', name: 'Forest Dark', previewBg: '#0a1610', previewDot: '#22c55e', isDark: true },
  { id: 'midnight-purple', name: 'Midnight Purple', previewBg: '#0f0b18', previewDot: '#a855f7', isDark: true },
  { id: 'soft-pink', name: 'Soft Pink', previewBg: '#fdf5f7', previewDot: '#ec4899', isDark: false },
];

export const ThemeSwitcherModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeTheme, setActiveTheme] = useState('midnight-slate');

  useEffect(() => {
    const current = document.documentElement.dataset.theme || 'midnight-slate';
    setActiveTheme(current);
  }, []);

  const selectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.dataset.theme = themeId;
    try {
      localStorage.setItem('budgetflow_theme', themeId);
      localStorage.setItem('theme', themeId.includes('dark') || themeId.includes('midnight') ? 'dark' : 'light');
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Multiple Beautiful Themes</h3>
              <p className="text-xs text-muted-foreground">Choose from the official 8 BudgetFlow color palettes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground font-medium"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((t) => {
            const isSelected = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTheme(t.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 bg-secondary/80'
                    : 'border-border bg-card hover:border-muted-foreground/30 hover:bg-secondary/40'
                }`}
              >
                <div
                  className="w-full h-12 rounded-xl flex items-center justify-center relative shadow-xs border border-border/20"
                  style={{ backgroundColor: t.previewBg }}
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: t.previewDot }}
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground block truncate">{t.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize font-mono">
                    {t.isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

