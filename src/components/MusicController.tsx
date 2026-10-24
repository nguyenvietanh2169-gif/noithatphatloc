import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const MusicController: React.FC = () => {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* Nút Play/Pause tối giản: chỉ có icon, không để chữ, nhạt màu và kính mờ */}
      <button
        onClick={togglePlay}
        className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full cursor-pointer backdrop-blur-md transition-all duration-300 border ${
          isPlaying
            ? 'bg-black/25 hover:bg-black/40 border-white/15 text-[#7DD3FC] shadow-sm'
            : 'bg-black/20 hover:bg-black/35 border-white/10 text-white/70 hover:text-white shadow-sm'
        }`}
        title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
        aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current stroke-[2]" />
        ) : (
          <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current translate-x-0.5 stroke-[2]" />
        )}
      </button>
    </div>
  );
};
