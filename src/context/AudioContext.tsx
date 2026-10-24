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

  const updateMediaSession = (playing: boolean) => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Nội Thất Phát Lộc',
          artist: 'mr LỢI (0585 338 339) • mr LỘC (0836 084 7193)',
          album: 'Thiết Kế & Thi Công Nội Thất Đương Đại',
          artwork: [
            {
              src: '/assets/logo/phatloc-lockscreen-artwork-512.jpg',
              sizes: '512x512',
              type: 'image/jpeg',
            },
            {
              src: '/assets/logo/phatloc-lockscreen-artwork-512.webp',
              sizes: '512x512',
              type: 'image/webp',
            },
            {
              src: '/assets/logo/phatloc-lockscreen-artwork-192.jpg',
              sizes: '192x192',
              type: 'image/jpeg',
            },
          ],
        });
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
      } catch (e) {
        console.warn('MediaSession metadata error:', e);
      }
    }
  };

  useEffect(() => {
    // Initialize audio element with high reliability
    const audio = new Audio('/assets/audio/background-music.m4a');
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = 'auto';

    audio.addEventListener('play', () => {
      setIsPlaying(true);
      updateMediaSession(true);
    });
    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      updateMediaSession(false);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      updateMediaSession(false);
    });

    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => {
          audio.play().catch(() => {});
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          audio.pause();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          audio.pause();
        });
      } catch (e) {
        console.warn('MediaSession handler setup error:', e);
      }
    }

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

  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    );
  };

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeInterval();
    const target = isMuted ? 0 : targetVolumeRef.current;

    // Trên điện thoại: phát tức thì, không dùng interval để tránh Safari lag/chặn volume
    if (isMobileDevice() || isMuted) {
      try {
        audio.volume = target;
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio play was interrupted:', err);
      }
      return;
    }

    // Trên desktop: Fade In êm dịu 1200ms
    try {
      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);

      const duration = 1200;
      const intervalMs = 25;
      const totalSteps = Math.max(1, Math.round(duration / intervalMs));
      const stepIncrement = target / totalSteps;

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
    const target = targetVolumeRef.current;

    // Trên điện thoại: pause tức thì ngay lập tức, giải quyết triệt để lỗi không pause được trên Safari iOS
    if (isMobileDevice() || isMuted || audio.volume <= 0.05) {
      audio.pause();
      setIsPlaying(false);
      audio.volume = target;
      return;
    }

    // Trên desktop: Fade Out êm ái 800ms
    const duration = 800;
    const intervalMs = 25;
    const currentVol = audio.volume;
    const totalSteps = Math.max(1, Math.round(duration / intervalMs));
    const stepDecrement = currentVol / totalSteps;

    let currentVal = currentVol;
    fadeIntervalRef.current = setInterval(() => {
      currentVal -= stepDecrement;
      if (currentVal <= 0.02) {
        audio.pause();
        setIsPlaying(false);
        audio.volume = target; // Phục hồi lại âm lượng ban đầu
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
