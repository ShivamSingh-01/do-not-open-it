import React, { useEffect } from 'react';
import type { LoveNote } from '../types';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { playCardOpenSound } from '../utils/audio';

interface LoveNoteModalProps {
  note: LoveNote | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const LoveNoteModal: React.FC<LoveNoteModalProps> = ({
  note,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  useEffect(() => {
    if (note) {
      playCardOpenSound();
    }
  }, [note]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };

    if (note) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [note, hasNext, hasPrev, onClose, onNext, onPrev]);

  if (!note) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-note-title"
    >
      <div
        className="modal-stationery-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-ribbon-decor" aria-hidden="true" />

        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close note"
        >
          <X size={20} />
        </button>

        {/* Header Metadata */}
        <div className="modal-header-meta">
          <span className="modal-number">{note.numberLabel}</span>
          <span className="modal-theme-badge">
            <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
            {note.theme}
          </span>
        </div>

        <h3 id="modal-note-title" style={{ display: 'none' }}>
          Love Note {note.numberLabel}: {note.theme}
        </h3>

        {/* Letter content */}
        <div className="modal-letter-content">
          <span className="modal-quote-icon">“</span>
          <p className="modal-message-text">{note.message}</p>
        </div>

        {/* Navigation Footer */}
        <div className="modal-footer-nav">
          <button
            type="button"
            className="romantic-btn romantic-btn-secondary"
            onClick={onPrev}
            disabled={!hasPrev}
            style={{ visibility: hasPrev ? 'visible' : 'hidden', padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            type="button"
            className="romantic-btn romantic-btn-primary"
            onClick={hasNext ? onNext : onClose}
            style={{ padding: '8px 20px', fontSize: '0.88rem' }}
          >
            {hasNext ? (
              <>
                <span>Next Note</span>
                <ChevronRight size={16} />
              </>
            ) : (
              <>
                <span>All Notes Seen</span>
                <Heart size={16} fill="#FFF" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
