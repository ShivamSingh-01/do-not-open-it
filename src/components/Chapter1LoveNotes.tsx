import React, { useState } from 'react';
import type { LoveNote } from '../types';
import { birthdayContent } from '../config/birthdayContent';
import { LoveNoteModal } from './LoveNoteModal';
import { Heart, Sparkles, Star, Mail, Gift, ArrowRight } from 'lucide-react';
import { playSparkleChime } from '../utils/audio';
import { launchMiniSparkles } from '../utils/confetti';

interface Chapter1LoveNotesProps {
  openedNoteIds: number[];
  onOpenNote: (id: number) => void;
  onProceedToCake: () => void;
}

export const Chapter1LoveNotes: React.FC<Chapter1LoveNotesProps> = ({
  openedNoteIds,
  onOpenNote,
  onProceedToCake
}) => {
  const [activeModalNote, setActiveModalNote] = useState<LoveNote | null>(null);

  const notes = birthdayContent.loveNotes;
  const openedCount = openedNoteIds.length;
  const allOpened = openedCount === notes.length;
  const progressPercent = Math.round((openedCount / notes.length) * 100);

  const handleCardClick = (note: LoveNote, e: React.MouseEvent<HTMLDivElement>) => {
    onOpenNote(note.id);
    setActiveModalNote(note);
    launchMiniSparkles(e.clientX, e.clientY);
  };

  const handleModalNext = () => {
    if (!activeModalNote) return;
    const currentIndex = notes.findIndex((n) => n.id === activeModalNote.id);
    if (currentIndex < notes.length - 1) {
      const nextNote = notes[currentIndex + 1];
      onOpenNote(nextNote.id);
      setActiveModalNote(nextNote);
    }
  };

  const handleModalPrev = () => {
    if (!activeModalNote) return;
    const currentIndex = notes.findIndex((n) => n.id === activeModalNote.id);
    if (currentIndex > 0) {
      const prevNote = notes[currentIndex - 1];
      setActiveModalNote(prevNote);
    }
  };

  const renderCardIcon = (icon: LoveNote['decorativeIcon']) => {
    switch (icon) {
      case 'heart':
        return <Heart size={14} color="#C92A42" fill="#FFE8EC" />;
      case 'sparkle':
        return <Sparkles size={14} color="#D4AF37" />;
      case 'star':
        return <Star size={14} color="#D4AF37" fill="#FDFBF7" />;
      case 'envelope':
        return <Mail size={14} color="#E08D9D" />;
      case 'ribbon':
      case 'rose':
      default:
        return <Gift size={14} color="#C92A42" />;
    }
  };

  return (
    <section className="chapter-section" aria-labelledby="chapter-1-title">
      {/* Hero Section */}
      <div className="chapter-hero">
        <div className="hero-badge-pill">
          <Sparkles size={14} />
          <span>{birthdayContent.heroBadge}</span>
        </div>

        <h1 id="chapter-1-title" className="hero-main-title">
          <span className="gradient-text">{birthdayContent.heroHeading}</span>
        </h1>

        <p className="hero-subtitle">{birthdayContent.heroSubheading}</p>

        <span className="hero-handwritten-signature">
          {birthdayContent.heroHandwritten}
        </span>
      </div>

      {/* Progress Tracker Card */}
      <div className="progress-card">
        <div className="progress-header">
          <span>Your Love Notes Progress</span>
          <span className="progress-count-pill">
            {openedCount} of {notes.length} discovered ({progressPercent}%)
          </span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={openedCount} aria-valuemin={0} aria-valuemax={notes.length}>
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Responsive Grid of 22 Love Cards */}
      <div className="love-notes-grid" role="list">
        {notes.map((note) => {
          const isOpened = openedNoteIds.includes(note.id);

          return (
            <div
              key={note.id}
              role="listitem"
              tabIndex={0}
              className={`love-card-item ${isOpened ? 'is-opened' : ''}`}
              onClick={(e) => handleCardClick(note, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenNote(note.id);
                  setActiveModalNote(note);
                }
              }}
              aria-label={`Love note ${note.numberLabel}: ${note.theme}. ${isOpened ? 'Already opened' : 'Click to open'}`}
            >
              <div className="love-card-top">
                <span className="card-number-badge">{note.numberLabel}</span>
                <span className="card-decor-icon" style={{ backgroundColor: `${note.sealColor}18` }}>
                  {renderCardIcon(note.decorativeIcon)}
                </span>
              </div>

              <div>
                <h2 className="card-theme-title">{note.theme}</h2>
                <p className="card-preview-text">{note.preview}</p>
              </div>

              <div className="card-bottom-indicator">
                <span>{isOpened ? 'Read again ♡' : 'Tap to open ✨'}</span>
                <span className="envelope-seal-stamp" title="Wax Seal">
                  ♡
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration Banner when all 22 opened */}
      {allOpened && (
        <div className="celebrate-all-banner">
          <h2 className="banner-title">You discovered all 22 love notes! ✨</h2>
          <p className="banner-desc">
            Every single reason is true, Ankita. But wait... this is only chapter one. There’s something special waiting just for you.
          </p>
          <button
            type="button"
            className="romantic-btn romantic-btn-primary"
            onClick={() => {
              playSparkleChime();
              onProceedToCake();
            }}
          >
            <span>Okay, my love... there's one more thing ♡</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Accessible Advance Alternative */}
      {!allOpened && (
        <div className="accessible-advance-container">
          <button
            type="button"
            className="romantic-btn romantic-btn-secondary"
            onClick={onProceedToCake}
            title="Advance directly to Make a Wish"
          >
            <span>Skip ahead to the Birthday Cake</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Love Note Modal Dialog */}
      <LoveNoteModal
        note={activeModalNote}
        onClose={() => setActiveModalNote(null)}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
        hasNext={
          activeModalNote !== null &&
          notes.findIndex((n) => n.id === activeModalNote.id) < notes.length - 1
        }
        hasPrev={
          activeModalNote !== null &&
          notes.findIndex((n) => n.id === activeModalNote.id) > 0
        }
      />
    </section>
  );
};
