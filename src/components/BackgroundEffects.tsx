import React, { useEffect, useState } from 'react';

interface BackgroundEffectsProps {
  reducedMotion: boolean;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ reducedMotion }) => {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [hasMouse] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  });

  useEffect(() => {
    if (!hasMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouse]);

  return (
    <>
      {/* Ambient background glowing orbs */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Desktop romantic heart follower */}
      {hasMouse && cursorPos && !reducedMotion && (
        <div
          className="cursor-heart-follower"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            opacity: 0.85
          }}
          aria-hidden="true"
        >
          💖
        </div>
      )}
    </>
  );
};
