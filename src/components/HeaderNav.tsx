import React from 'react';
import type { Chapter } from '../types';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';

interface HeaderNavProps {
  currentChapter: Chapter;
  onSelectChapter: (chapter: Chapter) => void;
  unlockedChapters: Chapter[];
  isMusicPlaying: boolean;
  isMuted: boolean;
  onToggleMusic: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentChapter,
  onSelectChapter,
  unlockedChapters,
  isMusicPlaying,
  isMuted,
  onToggleMusic,
  reducedMotion,
  onToggleReducedMotion
}) => {
  const chapters: Array<{ id: Chapter; label: string; icon: string }> = [
    { id: 'love-notes', label: '22 Reasons', icon: '💌' },
    { id: 'make-a-wish', label: 'Make a Wish', icon: '🎂' },
    { id: 'celebration', label: 'Birthday!', icon: '🎉' },
    { id: 'final-secret', label: 'Secret Letter', icon: '🎁' }
  ];

  return (
    <header className="top-nav" role="banner">
      <div className="nav-brand">
        <Heart size={18} fill="#C92A42" stroke="none" />
        <span>Ankita</span>
        <span className="nav-brand-badge">turning 22</span>
      </div>

      {/* Chapter Navigation Pills */}
      <nav className="chapter-nav-pills" aria-label="Surprise chapters">
        {chapters.map((chap) => {
          const isUnlocked = unlockedChapters.includes(chap.id);
          const isActive = currentChapter === chap.id;

          return (
            <button
              key={chap.id}
              type="button"
              className={`chapter-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => isUnlocked && onSelectChapter(chap.id)}
              disabled={!isUnlocked}
              title={isUnlocked ? `Go to ${chap.label}` : 'Unlock this chapter by progressing'}
              aria-current={isActive ? 'step' : undefined}
            >
              <span>{chap.icon}</span>
              <span className="label">{chap.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Audio & Motion Controls */}
      <div className="nav-actions">
        <button
          type="button"
          className={`icon-btn ${!isMuted && isMusicPlaying ? 'active' : ''}`}
          onClick={onToggleMusic}
          aria-label={isMuted ? 'Unmute birthday song' : 'Mute birthday song'}
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          type="button"
          className={`icon-btn ${reducedMotion ? 'active' : ''}`}
          onClick={onToggleReducedMotion}
          aria-label={reducedMotion ? 'Enable smooth animations' : 'Reduce animations'}
          title={reducedMotion ? 'Animations reduced' : 'Toggle reduced motion'}
        >
          <Sparkles size={18} />
        </button>
      </div>
    </header>
  );
};
