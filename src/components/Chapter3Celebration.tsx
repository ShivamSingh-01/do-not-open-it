import React, { useEffect } from 'react';
import { birthdayContent } from '../config/birthdayContent';
import { launchCelebrationConfetti } from '../utils/confetti';
import { Sparkles, Music, ArrowRight, Heart } from 'lucide-react';

interface Chapter3CelebrationProps {
  isMusicPlaying: boolean;
  onStartMusic: () => void;
  onProceedToSecret: () => void;
}

export const Chapter3Celebration: React.FC<Chapter3CelebrationProps> = ({
  isMusicPlaying,
  onStartMusic,
  onProceedToSecret
}) => {
  useEffect(() => {
    // Launch celebratory confetti & heart bursts on enter
    const cleanupConfetti = launchCelebrationConfetti(5000);

    // Try starting music if not already playing
    if (!isMusicPlaying) {
      onStartMusic();
    }

    return () => {
      cleanupConfetti();
    };
  }, [isMusicPlaying, onStartMusic]);

  const config = birthdayContent.celebrationChapter;

  return (
    <section className="celebration-wrapper" aria-labelledby="celebration-main-title">
      <div className="celebration-eyebrow">
        <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
        <span>A Fairytale Milestone</span>
        <Sparkles size={16} style={{ display: 'inline', marginLeft: 6 }} />
      </div>

      <h1 id="celebration-main-title" className="celebration-title-main">
        {config.heading}
      </h1>

      <div className="celebration-name-shimmer">
        {config.nameHeading}
      </div>

      {/* Birthday Music Controller / Autoplay fallback button */}
      {!isMusicPlaying && (
        <div style={{ margin: '16px auto', display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="romantic-btn romantic-btn-primary"
            onClick={onStartMusic}
            style={{ animation: 'bounce 2s infinite' }}
          >
            <Music size={18} />
            <span>Play our birthday song ♡</span>
          </button>
        </div>
      )}

      {/* Message Cards Deck */}
      <div className="celebration-card-deck">
        {config.messages.map((msg, idx) => (
          <p key={idx} className="celebration-message-item">
            {msg}
          </p>
        ))}

        <span className="celebration-signature">
          {config.signature}
        </span>
      </div>

      {/* Advance to Chapter 4 button */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className="romantic-btn romantic-btn-primary"
          onClick={() => {
            launchCelebrationConfetti(3000);
            onProceedToSecret();
          }}
          style={{ padding: '14px 30px', fontSize: '1.05rem' }}
        >
          <span>One Last Secret, Birthday Girl... 🎁</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#E08D9D', fontSize: '0.9rem' }}>
        <Heart size={15} fill="#E08D9D" />
        <span>Today and every day, you are endlessly celebrated</span>
      </div>
    </section>
  );
};
