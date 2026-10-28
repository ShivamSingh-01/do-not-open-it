import React from 'react';
import { birthdayContent } from '../config/birthdayContent';
import { GiftBox } from './GiftBox';
import { RotateCcw, Heart, Sparkles, Smile, Image as ImageIcon } from 'lucide-react';
import { playSparkleChime } from '../utils/audio';

interface Chapter4FinalSecretProps {
  onReplay: () => void;
}

export const Chapter4FinalSecret: React.FC<Chapter4FinalSecretProps> = ({ onReplay }) => {
  const config = birthdayContent.secretChapter;

  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkle':
        return <Smile size={24} color="#C92A42" />;
      case 'heart':
        return <ImageIcon size={24} color="#D4AF37" />;
      case 'rose':
      default:
        return <Heart size={24} color="#C92A42" fill="#FFE8EC" />;
    }
  };

  return (
    <section className="secret-wrapper" aria-labelledby="secret-letter-heading">
      {/* Stationery Love Letter Card */}
      <article className="secret-stationery-letter">
        <div className="secret-wax-badge" title="Wax Seal of Love">
          ♡
        </div>

        <h1 id="secret-letter-heading" className="secret-letter-heading">
          {config.heading}
        </h1>

        <div className="secret-letter-body">
          {config.letterParagraphs.map((para, idx) => {
            const isHighlight = para.includes("THIS ISN'T THE END OF YOUR SURPRISE");
            return (
              <p
                key={idx}
                className={isHighlight ? 'secret-highlight-phrase' : undefined}
              >
                {para}
              </p>
            );
          })}

          <div className="secret-letter-signoff">
            <div>{config.letterSignoff}</div>
            <div>{config.letterSignature}</div>
          </div>
        </div>
      </article>

      {/* Adorable 3D Present Box */}
      <GiftBox />

      {/* Three Decorative Keepsake Cards */}
      <div className="keepsake-cards-row" role="list">
        {config.keepsakeCards.map((card) => (
          <div
            key={card.id}
            role="listitem"
            className="keepsake-card-item"
            style={{ backgroundColor: card.accent }}
          >
            <div>{renderCardIcon(card.icon)}</div>
            <h2 className="keepsake-card-title">{card.title}</h2>
            <p className="keepsake-card-sub">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Replay Footer Section */}
      <div className="replay-footer-section">
        <button
          type="button"
          className="romantic-btn romantic-btn-secondary"
          onClick={() => {
            playSparkleChime();
            onReplay();
          }}
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          <RotateCcw size={18} />
          <span>Relive our little love story ↺</span>
        </button>

        <p className="made-with-love-tag">
          <Sparkles size={16} style={{ display: 'inline', marginRight: 6 }} />
          Created with love, just for you, Ankita ♡
        </p>
      </div>
    </section>
  );
};
