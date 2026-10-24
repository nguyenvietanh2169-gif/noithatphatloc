import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  playAudio: () => Promise<void>;
  pauseAudio: () => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.55);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetVolumeRef = useRef<number>(0.55);

  // Keep targetVolumeRef in sync
  useEffect(() => {
    targetVolumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    // Initialize audio element with high reliability
    const audio = new Audio('/assets/audio/background-music.m4a');
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = 'auto';

    audio.addEventListener('ended', () => setIsPlaying(false));

    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const clearFadeInterval = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const isMobile = () => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  };

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeInterval();

    const target = isMuted ? 0 : targetVolumeRef.current;

    // Detect if browser allows volume adjustment
    let supportsVolumeRamp = true;
    try {
      const test = audio.volume;
      audio.volume = Math.min(1, test * 0.99);
      if (audio.volume === test && isMobile()) {
        supportsVolumeRamp = false;
      }
    } catch {
      supportsVolumeRamp = false;
    }

    try {
      if (!supportsVolumeRamp || isMuted) {
        audio.volume = target;
        await audio.play();
        setIsPlaying(true);
        return;
      }

      // Smooth Fade In (máy tính: 1200ms, điện thoại nếu hỗ trợ: 600ms)
      const duration = isMobile() ? 600 : 1200;
      const intervalMs = 25;
      const totalSteps = Math.max(1, Math.round(duration / intervalMs));
      const stepIncrement = target / totalSteps;

      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);

      let currentVal = 0;
      fadeIntervalRef.current = setInterval(() => {
        currentVal += stepIncrement;
        if (currentVal >= target) {
          audio.volume = target;
          clearFadeInterval();
        } else {
          audio.volume = Math.min(target, currentVal);
        }
      }, intervalMs);
    } catch (err) {
      console.warn('Audio play request was blocked or interrupted:', err);
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeInterval();

    const currentVol = audio.volume;
    const target = targetVolumeRef.current;

    // If muted or audio not audible or on mobile without volume support, pause directly
    if (isMuted || currentVol <= 0.05) {
      audio.pause();
      setIsPlaying(false);
      audio.volume = target;
      return;
    }

    // Smooth Fade Out (máy tính: 800ms, điện thoại: 350ms)
    const duration = isMobile() ? 350 : 800;
    const intervalMs = 25;
    const totalSteps = Math.max(1, Math.round(duration / intervalMs));
    const stepDecrement = currentVol / totalSteps;

    let currentVal = currentVol;
    fadeIntervalRef.current = setInterval(() => {
      currentVal -= stepDecrement;
      if (currentVal <= 0.02) {
        audio.pause();
        setIsPlaying(false);
        audio.volume = target; // Restore base volume for future playback
        clearFadeInterval();
      } else {
        audio.volume = Math.max(0, currentVal);
      }
    }, intervalMs);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    targetVolumeRef.current = clamped;
    if (audioRef.current && !fadeIntervalRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        togglePlay,
        playAudio,
        pauseAudio,
        toggleMute,
        setVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
