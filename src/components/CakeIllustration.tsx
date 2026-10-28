import React from 'react';

interface CakeIllustrationProps {
  isBlownOut: boolean;
}

export const CakeIllustration: React.FC<CakeIllustrationProps> = ({ isBlownOut }) => {
  return (
    <div className="cake-stage-container" aria-label="Birthday cake with lit candle">
      {/* Plate */}
      <div className="cake-plate" />

      {/* Bottom tier */}
      <div className="cake-tier-bottom">
        <div className="cake-frosting-drips" />
        <div className="cake-pearls-row">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="cake-pearl" />
          ))}
        </div>
      </div>

      {/* Top tier */}
      <div className="cake-tier-top">
        <div className="cake-frosting-drips" />
        <div className="cake-pearls-row">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cake-pearl" />
          ))}
        </div>
      </div>

      {/* Candle */}
      <div className="candle-wrapper">
        {!isBlownOut && <div className="candle-flame" aria-hidden="true" />}
        {isBlownOut && <div className="candle-smoke" aria-hidden="true" />}
        <div className="candle-wick" />
        <div className="candle-stick" />
      </div>
    </div>
  );
};
