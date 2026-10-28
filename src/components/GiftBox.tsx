import React, { useState } from 'react';
import { birthdayContent } from '../config/birthdayContent';
import { playSparkleChime } from '../utils/audio';
import { launchMiniSparkles } from '../utils/confetti';
import { Sparkles, Gift } from 'lucide-react';

export const GiftBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen) {
      setIsOpen(true);
      playSparkleChime();
      launchMiniSparkles(e.clientX, e.clientY);
    }
  };

  return (
    <div className="gift-interactive-section">
      <p style={{ color: '#8E1B2D', fontWeight: 600, fontSize: '0.98rem', marginBottom: 10 }}>
        {isOpen ? 'Surprise Unwrapped! ✨' : birthdayContent.secretChapter.giftPrompt}
      </p>

      {/* 3D-styled interactive gift box */}
      <div
        className={`gift-box-3d ${isOpen ? 'is-open' : ''}`}
        onClick={handleOpenGift}
        role="button"
        tabIndex={0}
        aria-label="Tap to open the birthday gift box"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              playSparkleChime();
            }
          }
        }}
      >
        <div className="gift-box-body">
          <div className="gift-ribbon-v" />
          <div className="gift-ribbon-h" />
        </div>

        <div className="gift-box-lid">
          <div className="gift-ribbon-v" />
          <div className="gift-bow">🎀</div>
        </div>
      </div>

      {/* Secret message revealed */}
      {isOpen && (
        <div className="gift-revealed-banner" role="status">
          <Sparkles size={18} style={{ display: 'inline', marginRight: 8 }} />
          <span>{birthdayContent.secretChapter.giftSecretText}</span>
        </div>
      )}

      {!isOpen && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#C92A42', fontSize: '0.86rem' }}>
          <Gift size={14} />
          <span>Tap the ribbon to unwrap</span>
        </div>
      )}
    </div>
  );
};
