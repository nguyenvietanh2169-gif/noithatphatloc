import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  category: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: '/assets/hero/hero-1.webp',
    category: 'KHÔNG GIAN BIỆT THỰ',
    title: 'SỰ HÒA QUYỆN GIỮA ÁNH SÁNG & KHÔNG GIAN',
    subtitle: 'Nội thất phòng khách hiện đại với vách lam sóng than tre và đường nét tối giản chuẩn mực.',
    location: 'Biên Hòa, Đồng Nai',
    year: '2026',
  },
  {
    id: 2,
    image: '/assets/hero/hero-2.webp',
    category: 'NỘI THẤT MỞ HIỆN ĐẠI',
    title: 'LIÊN THÔNG ĐƯƠNG ĐẠI & TINH TẾ',
    subtitle: 'Tối ưu hóa công năng sinh hoạt mở, kết nối phòng khách và khu vực đảo bếp sang trọng.',
    location: 'TP. Hồ Chí Minh',
    year: '2026',
  },
  {
    id: 3,
    image: '/assets/hero/hero-3.webp',
    category: 'PHÒNG NGỦ MASTER & LÀM VIỆC',
    title: 'CHI TIẾT ĐO NI ĐÓNG GIÀY TẠI XƯỞNG',
    subtitle: 'Hệ tủ kệ trang trí kết hợp ánh sáng hắt gián tiếp tạo chiều sâu không gian tĩnh tại.',
    location: 'Bình Dương',
    year: '2025',
  },
  {
    id: 4,
    image: '/assets/hero/hero-4.webp',
    category: 'PHÒNG NGỦ CAO CẤP',
    title: 'NGHỆ THUẬT NGHỈ DƯỠNG TRONG NHÀ PHỐ',
    subtitle: 'Vật liệu gỗ chống ẩm cao cấp cùng vách ốp đầu giường bọc da thanh lịch.',
    location: 'Đồng Nai',
    year: '2026',
  },
  {
    id: 5,
    image: '/assets/hero/hero-5.webp',
    category: 'SẢN XUẤT ĐỒ GỖ KIẾN TRÚC',
    title: 'TINH XẢO TRONG TỪNG ĐƯỜNG NÉT HOÀN THIỆN',
    subtitle: 'Cam kết chất lượng chuẩn xác 100% từ xưởng sản xuất máy móc trực tiếp của Phát Lộc.',
    location: 'Dự án thực tế',
    year: '2026',
  },
];

const AUTOPLAY_DURATION = 6000; // 6 seconds

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const lastChangeTimeRef = useRef<number>(Date.now());
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const goToSlide = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    lastChangeTimeRef.current = Date.now();
    setProgress(0);
  };

  const handleNext = () => {
    goToSlide((currentIndex + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    goToSlide((currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Robust Autoplay using timestamp diff - immune to timer freezing or background tab suspension
  useEffect(() => {
    lastChangeTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastChangeTimeRef.current;
      if (elapsed >= AUTOPLAY_DURATION) {
        lastChangeTimeRef.current = Date.now();
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      } else {
        setProgress(Math.min(100, (elapsed / AUTOPLAY_DURATION) * 100));
      }
    }, 80);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastChangeTimeRef.current = Date.now();
        setProgress(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Must be predominantly horizontal swipe > 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[88svh] sm:h-[92vh] min-h-[560px] max-h-[920px] overflow-hidden bg-[#121316] text-white select-none"
    >
      {/* Background Slides with Ken Burns subtle motion */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Image container with scale zoom */}
            <div
              className={`w-full h-full transform transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
              />
            </div>

            {/* Gradient overlays: Architectural subtle vignetting */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* Decorative Formfield-style watermark header */}
      <div className="absolute top-24 left-6 md:left-12 z-20 pointer-events-none select-none">
        <span className="font-heading text-5xl md:text-8xl font-black text-white/8 tracking-tight uppercase block leading-none">
          PHÁT LỘC
        </span>
      </div>

      {/* Hero Content Canvas */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left Column: Kinetic Text Slide */}
          <div className="lg:col-span-8 flex flex-col items-start">
            {/* Category Pill with Turquoise Accent */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00D0E8] animate-pulse" />
              <span className="text-[11px] font-mono-num font-semibold uppercase tracking-[0.2em] text-[#00D0E8]">
                {activeSlide.category}
              </span>
            </div>

            {/* Main Headline with dynamic slide animation */}
            <h1
              key={`title-${currentIndex}`}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.2] md:leading-[1.16] mb-5 transition-all duration-700 transform translate-y-0 opacity-100"
            >
              {activeSlide.title}
            </h1>

            {/* Subtitle Description */}
            <p
              key={`sub-${currentIndex}`}
              className="text-white/80 text-sm md:text-base max-w-2xl font-light leading-relaxed mb-8 transition-all duration-700 delay-100"
            >
              {activeSlide.subtitle}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3.5 bg-[#00D0E8] hover:bg-white text-[#121316] font-semibold text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
              >
                Khám phá bộ sưu tập
              </a>

              <a
                href="#video"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium text-xs uppercase tracking-[0.16em] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#00D0E8]" />
                <span>Video thực tế xưởng</span>
              </a>
            </div>
          </div>

          {/* Right Column: Slide Controls & Numbering */}
          <div className="lg:col-span-4 flex flex-col justify-end lg:items-end">
            {/* Meta info tags */}
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-white/60 font-mono-num mb-6">
              <span>ĐỊA ĐIỂM: {activeSlide.location}</span>
              <span>•</span>
              <span>NĂM: {activeSlide.year}</span>
            </div>

            {/* Counter and Navigation */}
            <div className="w-full flex items-center justify-between lg:justify-end gap-6 pt-4 border-t border-white/15">
              {/* Slide Counter: 01 / 05 */}
              <div className="flex items-baseline gap-2 font-mono-num">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  0{currentIndex + 1}
                </span>
                <span className="text-xs text-white/40">/ 0{HERO_SLIDES.length}</span>
              </div>

              {/* Progress Line */}
              <div className="flex-1 max-w-[120px] h-[2px] bg-white/20 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 bottom-0 bg-[#00D0E8] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-white/20 hover:border-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Hình trước"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-white/20 hover:border-[#00D0E8] hover:bg-[#00D0E8] hover:text-[#121316] flex items-center justify-center transition-colors cursor-pointer group"
                  aria-label="Hình tiếp theo"
                >
                  <ArrowRight className="w-4 h-4 text-white group-hover:text-[#121316]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom slide thumbnail preview indicators (desktop) */}
      <div className="absolute bottom-3 left-0 right-0 z-20 hidden md:block">
        <div className="max-w-7xl mx-auto px-12 flex items-center gap-3">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`group flex-1 py-1 text-left transition-all cursor-pointer`}
            >
              <div
                className={`h-[2px] transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-[#00D0E8]'
                    : 'bg-white/15 group-hover:bg-white/40'
                }`}
              />
              <span
                className={`text-[9px] uppercase tracking-wider block mt-1 transition-colors ${
                  idx === currentIndex ? 'text-[#00D0E8] font-bold' : 'text-white/40 group-hover:text-white/70'
                }`}
              >
                0{idx + 1} • {slide.category.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
