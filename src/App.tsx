import React, { useState, useEffect, useCallback } from 'react';
import type { Chapter } from './types';
import { BackgroundEffects } from './components/BackgroundEffects';
import { HeaderNav } from './components/HeaderNav';
import { Chapter1LoveNotes } from './components/Chapter1LoveNotes';
import { Chapter2MakeAWish } from './components/Chapter2MakeAWish';
import { Chapter3Celebration } from './components/Chapter3Celebration';
import { Chapter4FinalSecret } from './components/Chapter4FinalSecret';
import { romanticMusicPlayer } from './utils/audio';

export const App: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState<Chapter>('love-notes');
  const [unlockedChapters, setUnlockedChapters] = useState<Chapter[]>(['love-notes']);
  
  // Persist opened notes in local storage so refresh doesn't lose progress
  const [openedNoteIds, setOpenedNoteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('ankita_opened_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Sync music state from player
  useEffect(() => {
    romanticMusicPlayer.setOnStateChange((playing, muted) => {
      setIsMusicPlaying(playing);
      setIsMuted(muted);
    });
  }, []);

  // Save opened note IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ankita_opened_notes', JSON.stringify(openedNoteIds));
    } catch {
      // Ignore
    }
  }, [openedNoteIds]);

  // Handle opening a love card
  const handleOpenNote = useCallback((id: number) => {
    setOpenedNoteIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // Chapter unlocking helper
  const unlockChapter = useCallback((chapter: Chapter) => {
    setUnlockedChapters((prev) => (prev.includes(chapter) ? prev : [...prev, chapter]));
  }, []);

  // Transition to Chapter 2: Make a Wish
  const handleProceedToCake = useCallback(() => {
    unlockChapter('make-a-wish');
    setCurrentChapter('make-a-wish');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [unlockChapter]);

  // Transition to Chapter 3: Celebration
  const handleWishCompleted = useCallback(() => {
    unlockChapter('celebration');
    setCurrentChapter('celebration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [unlockChapter]);

  // Transition to Chapter 4: Secret Letter
  const handleProceedToSecret = useCallback(() => {
    unlockChapter('final-secret');
    setCurrentChapter('final-secret');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [unlockChapter]);

  // Replay from beginning
  const handleReplay = useCallback(() => {
    setCurrentChapter('love-notes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Music controls
  const handleStartMusic = useCallback(async () => {
    await romanticMusicPlayer.start();
  }, []);

  const handleToggleMusic = useCallback(async () => {
    if (!isMusicPlaying) {
      await romanticMusicPlayer.start();
    } else {
      romanticMusicPlayer.toggleMute();
    }
  }, [isMusicPlaying]);

  const handleToggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev);
  }, []);

  return (
    <div className={`app-root ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Background visual ambiance & cursor follower */}
      <BackgroundEffects reducedMotion={reducedMotion} />

      {/* Top Navigation & Controls */}
      <HeaderNav
        currentChapter={currentChapter}
        onSelectChapter={(chap) => {
          setCurrentChapter(chap);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unlockedChapters={unlockedChapters}
        isMusicPlaying={isMusicPlaying}
        isMuted={isMuted}
        onToggleMusic={handleToggleMusic}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {/* Main Experience Chapters */}
      <main className="site-main" role="main">
        {currentChapter === 'love-notes' && (
          <Chapter1LoveNotes
            openedNoteIds={openedNoteIds}
            onOpenNote={handleOpenNote}
            onProceedToCake={handleProceedToCake}
          />
        )}

        {currentChapter === 'make-a-wish' && (
          <Chapter2MakeAWish onWishCompleted={handleWishCompleted} />
        )}

        {currentChapter === 'celebration' && (
          <Chapter3Celebration
            isMusicPlaying={isMusicPlaying}
            onStartMusic={handleStartMusic}
            onProceedToSecret={handleProceedToSecret}
          />
        )}

        {currentChapter === 'final-secret' && (
          <Chapter4FinalSecret onReplay={handleReplay} />
        )}
      </main>
    </div>
  );
};

export default App;
