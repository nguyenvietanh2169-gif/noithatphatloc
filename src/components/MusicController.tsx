import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const MusicController: React.FC = () => {
  const { isPlaying, togglePlay, hasStarted } = useAudio();

  // Xuất hiện mượt mà ngay khi người dùng bắt đầu chạm/vuốt/lướt trang
  return (
    <div
      className={`fixed bottom-6 left-6 z-40 select-none transition-all duration-700 ease-out transform ${
        hasStarted
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={togglePlay}
        className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full cursor-pointer backdrop-blur-md transition-all duration-300 border shadow-lg ${
          isPlaying
            ? 'bg-black/75 hover:bg-black border-[#00D0E8]/40 text-[#00D0E8] ring-2 ring-[#00D0E8]/20 shadow-cyan-500/10'
            : 'bg-black/65 hover:bg-black/85 border-white/10 text-white/70 hover:text-white'
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
