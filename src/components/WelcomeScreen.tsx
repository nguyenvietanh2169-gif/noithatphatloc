import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface WelcomeScreenProps {
  onEnter?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { playAudio } = useAudio();
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Kích hoạt hiển thị tức thì (logo đã được preload trong <head> ở 126KB WebP)
    const raf = requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    // Cho phép người dùng máy tính lăn chuột (scroll wheel) hoặc bấm phím để vào trang tự nhiên
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 10 && !isExiting && !isDismissed) {
        handleStartExperience();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key) && !isExiting && !isDismissed) {
        e.preventDefault();
        handleStartExperience();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExiting, isDismissed]);

  const handleStartExperience = async () => {
    if (isExiting || isDismissed) return;

    // 1. Kích hoạt phát nhạc nền
    await playAudio();

    // 2. Fade out mượt mà trang chào mừng
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      if (onEnter) onEnter();
    }, 600);
  };

  if (isDismissed) return null;

  return (
    <div
      onClick={handleStartExperience}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none transition-opacity duration-700 ease-out bg-[#181A1D] cursor-pointer ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Vùng trung tâm: Duy nhất Logo 3D Frosted Crystal màu xanh gốc & Nút mũi tên */}
      <div className="flex flex-col items-center justify-center px-6 gap-8 sm:gap-10">
        {/* Duy nhất Logo Phát Lộc gốc kiểu 3D kết cấu kính mờ xuyên sáng, màu xanh ngọc gốc */}
        <div
          className={`transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.98]'
          }`}
        >
          <picture>
            <source srcSet="/assets/logo/phatloc-3d-rendered-full.webp" type="image/webp" />
            <img
              src="/assets/logo/phatloc-3d-rendered-full.webp"
              alt="Nội Thất Phát Lộc"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              width={965}
              height={630}
              className="h-44 sm:h-56 md:h-68 w-auto max-w-[85vw] object-contain transition-transform duration-500 hover:scale-[1.02] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
            />
          </picture>
        </div>

        {/* Nút mũi tên kích hoạt vào trang & phát nhạc */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStartExperience();
          }}
          className={`group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all duration-700 ease-out hover:scale-105 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '200ms' }}
          aria-label="Vào trang và phát nhạc"
        >
          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#7DD3FC] group-hover:text-[#BAE6FD] stroke-[2.2] transition-colors" />
        </button>
      </div>
    </div>
  );
};
