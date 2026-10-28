import React, { useState, useEffect, useRef } from 'react';
import { birthdayContent } from '../config/birthdayContent';
import { CakeIllustration } from './CakeIllustration';
import { Mic, Wind, Sparkles, ArrowRight, Heart } from 'lucide-react';
import {
  startMicrophoneBlowDetection,
  type BlowDetectorSession,
  playCountdownBeep,
  playCandleExtinguishSound
} from '../utils/audio';
import { launchMiniSparkles } from '../utils/confetti';

interface Chapter2MakeAWishProps {
  onWishCompleted: () => void;
}

export const Chapter2MakeAWish: React.FC<Chapter2MakeAWishProps> = ({ onWishCompleted }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [showWishMadeText, setShowWishMadeText] = useState(false);

  const blowSessionRef = useRef<BlowDetectorSession | null>(null);

  const messages = birthdayContent.wishChapter.messages;

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      if (blowSessionRef.current) {
        blowSessionRef.current.stop();
        blowSessionRef.current = null;
      }
    };
  }, []);

  // Countdown timer logic
  useEffect(() => {
    let timer: number;
    if (isCountingDown) {
      playCountdownBeep(countdownValue);
      if (countdownValue > 1) {
        timer = window.setTimeout(() => {
          setCountdownValue((prev) => prev - 1);
        }, 1000);
      } else {
        timer = window.setTimeout(() => {
          setIsCountingDown(false);
          // Activate mic prompt or ready state
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdownValue]);

  // Handle extinguishing the candle
  const extinguishCandle = () => {
    if (isBlownOut) return;

    // Stop mic listening if active
    if (blowSessionRef.current) {
      blowSessionRef.current.stop();
      blowSessionRef.current = null;
    }
    setIsListeningMic(false);
    setIsBlownOut(true);

    playCandleExtinguishSound();

    // Launch celebratory particle bursts around the cake
    const rect = document.querySelector('.cake-stage-container')?.getBoundingClientRect();
    if (rect) {
      launchMiniSparkles(rect.left + rect.width / 2, rect.top + 40);
    }

    setTimeout(() => {
      setShowWishMadeText(true);
    }, 600);

    // Transition to Chapter 3 after enjoying the wish moment
    setTimeout(() => {
      onWishCompleted();
    }, 2800);
  };

  // Start real microphone detection
  const handleStartMic = () => {
    setMicError(null);
    setIsListeningMic(true);

    blowSessionRef.current = startMicrophoneBlowDetection(
      () => {
        // Success: blow detected
        extinguishCandle();
      },
      (level) => {
        setAudioLevel(level);
      },
      (err) => {
        setIsListeningMic(false);
        setMicError('Microphone unavailable or permission denied. No problem! Use the tap button below ♡');
        console.warn('Microphone error:', err);
      }
    );
  };

  return (
    <section className="wish-scene-wrapper" aria-labelledby="wish-title">
      <h1 id="wish-title" style={{ display: 'none' }}>Make a Wish</h1>

      {/* Sequential message reveal */}
      <div className="wish-message-flipper">
        <h2 className="wish-sequence-text" key={stepIndex}>
          {showWishMadeText
            ? birthdayContent.wishChapter.wishMadeText
            : messages[stepIndex]}
        </h2>
      </div>

      {/* Cake illustration with flickering candle or smoke */}
      <CakeIllustration isBlownOut={isBlownOut} />

      {/* Step 1 to 3 progression before countdown */}
      {!isBlownOut && stepIndex < messages.length - 1 && !isCountingDown && (
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="romantic-btn romantic-btn-primary"
            onClick={() => setStepIndex((prev) => Math.min(prev + 1, messages.length - 1))}
          >
            <span>Continue</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Final step: "Take a deep breath and blow out your candle ♡" */}
      {!isBlownOut && stepIndex === messages.length - 1 && !isCountingDown && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* Countdown activation button */}
          {countdownValue === 3 && !isListeningMic && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <button
                type="button"
                className="romantic-btn romantic-btn-primary"
                onClick={() => setIsCountingDown(true)}
              >
                <Sparkles size={18} />
                <span>I'm ready! (Start countdown)</span>
              </button>

              <button
                type="button"
                className="romantic-btn romantic-btn-secondary"
                onClick={extinguishCandle}
              >
                <Wind size={18} />
                <span>Tap to blow out the candle ♡</span>
              </button>
            </div>
          )}

          {/* After countdown finishes: active blowing options */}
          {(countdownValue === 1 || isListeningMic) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 10 }}>
              {!isListeningMic ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="romantic-btn romantic-btn-primary"
                    onClick={handleStartMic}
                  >
                    <Mic size={18} />
                    <span>Blow into your microphone 🎙️</span>
                  </button>

                  <button
                    type="button"
                    className="romantic-btn romantic-btn-secondary"
                    onClick={extinguishCandle}
                  >
                    <Wind size={18} />
                    <span>Tap to blow out the candle ♡</span>
                  </button>
                </div>
              ) : (
                <div className="mic-status-box" role="status" aria-live="polite">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#C92A42', fontWeight: 600 }}>
                    <Mic size={18} />
                    <span>Listening... blow gently on your phone! 💨</span>
                  </div>
                  <div className="mic-level-bar">
                    <div
                      className="mic-level-fill"
                      style={{ width: `${Math.round(audioLevel * 100)}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="romantic-btn romantic-btn-secondary"
                    onClick={extinguishCandle}
                    style={{ marginTop: 6, padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    <span>Or just tap here to blow it out ♡</span>
                  </button>
                </div>
              )}

              {micError && (
                <p style={{ color: '#8B1E3F', fontSize: '0.86rem', maxWidth: 400, marginTop: 4 }}>
                  {micError}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Countdown overlay numbers */}
      {isCountingDown && (
        <div className="countdown-overlay">
          <div className="countdown-number" key={countdownValue}>
            {countdownValue}
          </div>
          <p style={{ color: '#8E1B2D', fontWeight: 600 }}>Get ready to blow... ✨</p>
          <button
            type="button"
            className="romantic-btn romantic-btn-secondary"
            onClick={() => {
              setIsCountingDown(false);
              extinguishCandle();
            }}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Skip countdown
          </button>
        </div>
      )}

      {/* Wish made celebration message */}
      {showWishMadeText && (
        <div style={{ marginTop: 24, animation: 'fadeIn 0.6s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#C92A42' }}>
            <Heart size={20} fill="#C92A42" />
            <span style={{ fontFamily: 'var(--font-script)', fontSize: '2rem' }}>
              Your wish is flying to the stars...
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
