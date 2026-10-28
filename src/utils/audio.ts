/**
 * Audio Engine: Web Audio API Synthesizer & Microphone Blowing Detection
 * No external audio files required, runs 100% reliably in any modern browser.
 * Also supports optional user-provided custom MP3 audio.
 */

// Shared audio context for sound effects and music
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

// ==========================================
// 1. SOUND EFFECTS (Delicate, Romantic Chimes)
// ==========================================

export function playSparkleChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.45);
    });
  } catch {
    // Graceful silent fallback if Web Audio is restricted
  }
}

export function playCardOpenSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Soft paper-whisper / warm bell tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch {
    // Ignore
  }
}

export function playCountdownBeep(num: number): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freq = num === 1 ? 880 : num === 2 ? 659.25 : 523.25;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Ignore
  }
}

export function playCandleExtinguishSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Breath puff noise + celestial chord
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);

    // Warm celestial resolution chord (G4, B4, D5, G5)
    [392.00, 493.88, 587.33, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.1);

      gain.gain.setValueAtTime(0.001, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.15 + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.1);
      osc.stop(now + 1.3);
    });
  } catch {
    // Ignore
  }
}

// ==========================================
// 2. ROMANTIC BIRTHDAY MUSIC BOX SYNTHESIZER
// ==========================================

// Happy Birthday melody notes: [pitch, durationInBeats]
// Key of F / C friendly, warm romantic music box arrangement
const BIRTHDAY_MELODY: Array<{ note: number; duration: number }> = [
  // "Happy Birthday to you"
  { note: 261.63, duration: 0.75 }, // C4
  { note: 261.63, duration: 0.25 }, // C4
  { note: 293.66, duration: 1.0 },  // D4
  { note: 261.63, duration: 1.0 },  // C4
  { note: 349.23, duration: 1.0 },  // F4
  { note: 329.63, duration: 2.0 },  // E4

  // "Happy Birthday to you"
  { note: 261.63, duration: 0.75 }, // C4
  { note: 261.63, duration: 0.25 }, // C4
  { note: 293.66, duration: 1.0 },  // D4
  { note: 261.63, duration: 1.0 },  // C4
  { note: 392.00, duration: 1.0 },  // G4
  { note: 349.23, duration: 2.0 },  // F4

  // "Happy Birthday dear Ankita"
  { note: 261.63, duration: 0.75 }, // C4
  { note: 261.63, duration: 0.25 }, // C4
  { note: 523.25, duration: 1.0 },  // C5
  { note: 440.00, duration: 1.0 },  // A4
  { note: 349.23, duration: 1.0 },  // F4
  { note: 329.63, duration: 1.0 },  // E4
  { note: 293.66, duration: 2.0 },  // D4

  // "Happy Birthday to you!"
  { note: 466.16, duration: 0.75 }, // Bb4
  { note: 466.16, duration: 0.25 }, // Bb4
  { note: 440.00, duration: 1.0 },  // A4
  { note: 349.23, duration: 1.0 },  // F4
  { note: 392.00, duration: 1.0 },  // G4
  { note: 349.23, duration: 2.5 }   // F4
];

export class RomanticMusicPlayer {
  private isPlaying = false;
  private isMuted = false;
  private currentTimeout: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private masterGain: GainNode | null = null;
  private customAudioPath?: string;
  private onStateChangeCallback?: (playing: boolean, muted: boolean) => void;

  constructor(customAudioPath?: string) {
    this.customAudioPath = customAudioPath;
  }

  public setOnStateChange(cb: (playing: boolean, muted: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  private notify() {
    this.onStateChangeCallback?.(this.isPlaying, this.isMuted);
  }

  public async start(): Promise<boolean> {
    if (this.isPlaying) return true;

    // Check if custom audio is configured and usable
    if (this.customAudioPath && this.customAudioPath.trim() !== '') {
      try {
        if (!this.customAudio) {
          this.customAudio = new Audio(this.customAudioPath);
          this.customAudio.loop = true;
          this.customAudio.volume = this.isMuted ? 0 : 0.6;
        }
        await this.customAudio.play();
        this.isPlaying = true;
        this.notify();
        return true;
      } catch {
        // Fall back to Web Audio music box
      }
    }

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      this.isPlaying = true;
      this.scheduleLoop(0);
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  private scheduleLoop(noteIndex: number) {
    if (!this.isPlaying) return;

    const item = BIRTHDAY_MELODY[noteIndex];
    const beatSeconds = 0.55; // Gentle, lullaby/music box tempo
    const duration = item.duration * beatSeconds;

    this.playMusicBoxTone(item.note, duration);

    const nextIndex = (noteIndex + 1) % BIRTHDAY_MELODY.length;
    // Add a tiny romantic pause between loops
    const pause = nextIndex === 0 ? 1200 : 0;

    this.currentTimeout = window.setTimeout(() => {
      this.scheduleLoop(nextIndex);
    }, (duration * 1000) + pause);
  }

  private playMusicBoxTone(freq: number, duration: number) {
    if (!this.masterGain || this.isMuted) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Fundamental tone (sine)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // 2. Bell overtone (harmonic chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.003, now); // Slightly detuned harmonic for music-box sparkle

    // Envelope
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 1.5, 0.8));

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 0.9, 0.5));

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    const stopTime = now + Math.max(duration * 1.6, 1.0);
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.currentTimeout !== null) {
      window.clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : 0.6;
    }
    if (this.masterGain) {
      const ctx = getAudioContext();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

// Global music player singleton
export const romanticMusicPlayer = new RomanticMusicPlayer();

// ==========================================
// 3. MICROPHONE BLOWING DETECTION
// ==========================================

export interface BlowDetectorSession {
  stop: () => void;
}

export function startMicrophoneBlowDetection(
  onBlowDetected: () => void,
  onAudioLevel?: (level: number) => void,
  onError?: (error: Error) => void
): BlowDetectorSession {
  let stream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let animationFrameId: number | null = null;
  let consecutiveBlowFrames = 0;
  let isStopped = false;

  const cleanup = () => {
    isStopped = true;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    if (source) {
      source.disconnect();
      source = null;
    }
    if (analyser) {
      analyser.disconnect();
      analyser = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(() => {});
      audioContext = null;
    }
  };

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    onError?.(new Error('Microphone access is not supported in this browser.'));
    return { stop: cleanup };
  }

  navigator.mediaDevices
    .getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    })
    .then((mediaStream) => {
      if (isStopped) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }
      stream = mediaStream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioContextClass();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2;

      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudio = () => {
        if (isStopped || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        // Calculate average energy in lower/mid frequency spectrum (100Hz - 2000Hz)
        // Blowing creates broad wind turbulence energy across bins 2 to 35
        let sum = 0;
        const lowEnd = 2;
        const highEnd = Math.min(40, bufferLength);
        for (let i = lowEnd; i < highEnd; i++) {
          sum += dataArray[i];
        }
        const average = sum / (highEnd - lowEnd);
        const normalizedLevel = Math.min(average / 140, 1.0);

        onAudioLevel?.(normalizedLevel);

        // Threshold for sustained breath/blow
        if (normalizedLevel > 0.42) {
          consecutiveBlowFrames++;
          // Need sustained blow of ~10 consecutive frames (~160ms) to prevent accidental pop
          if (consecutiveBlowFrames >= 10) {
            cleanup();
            onBlowDetected();
            return;
          }
        } else {
          consecutiveBlowFrames = Math.max(0, consecutiveBlowFrames - 1);
        }

        animationFrameId = requestAnimationFrame(checkAudio);
      };

      animationFrameId = requestAnimationFrame(checkAudio);
    })
    .catch((err) => {
      cleanup();
      onError?.(err instanceof Error ? err : new Error(String(err)));
    });

  return { stop: cleanup };
}
