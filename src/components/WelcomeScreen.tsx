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
    // Fade in logo dần dần khi vừa mở web
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleStartExperience = async () => {
    // 1. Kích hoạt phát nhạc nền
    await playAudio();

    // 2. Fade out mượt mà trang chào mừng
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      if (onEnter) onEnter();
    }, 700);
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none transition-opacity duration-700 ease-out bg-[#181A1D] ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Vùng trung tâm: Duy nhất Logo 3D Frosted Crystal màu xanh gốc fade-in lên dần dần & Nút mũi tên */}
      <div className="flex flex-col items-center justify-center px-6 gap-10 sm:gap-12">
        {/* Duy nhất Logo Phát Lộc gốc kiểu 3D kết cấu kính mờ xuyên sáng, màu xanh ngọc gốc */}
        <div
          className={`transition-all duration-1000 ease-out cursor-pointer ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          onClick={handleStartExperience}
        >
          <img
            src="/assets/logo/phatloc-3d-rendered-full.png?v=frontal"
            alt="Nội Thất Phát Lộc"
            className="h-48 sm:h-60 md:h-72 w-auto max-w-[85vw] object-contain transition-transform duration-500 hover:scale-[1.02] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
          />
        </div>

        {/* Nút mũi tên: màu xanh nhạt, nền kính mờ, đứng im, quay qua phải */}
        <button
          onClick={handleStartExperience}
          className={`group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ transitionDelay: '300ms' }}
          aria-label="Vào trang và phát nhạc"
        >
          <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#7DD3FC] group-hover:text-[#BAE6FD] stroke-[2.2] transition-colors" />
        </button>
      </div>
    </div>
  );
};
