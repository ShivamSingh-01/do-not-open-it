export type Chapter = 'love-notes' | 'make-a-wish' | 'celebration' | 'final-secret';

export interface LoveNote {
  id: number;
  numberLabel: string;
  theme: string;
  preview: string;
  message: string;
  decorativeIcon: 'heart' | 'sparkle' | 'ribbon' | 'envelope' | 'rose' | 'star';
  sealColor: string;
}

export interface KeepsakeCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
}

export interface BirthdayConfig {
  recipientName: string;
  age: number;
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroHandwritten: string;
  loveNotes: LoveNote[];
  wishChapter: {
    messages: string[];
    instruction: string;
    wishMadeText: string;
  };
  celebrationChapter: {
    heading: string;
    nameHeading: string;
    messages: string[];
    signature: string;
  };
  secretChapter: {
    heading: string;
    letterParagraphs: string[];
    letterSignoff: string;
    letterSignature: string;
    giftSecretText: string;
    giftPrompt: string;
    keepsakeCards: KeepsakeCard[];
  };
  audio: {
    songTitle: string;
    customAudioPath?: string;
    musicBoxBpm: number;
  };
}
