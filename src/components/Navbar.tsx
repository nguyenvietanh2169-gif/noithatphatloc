import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface NavbarProps {
  onOpenEstimator: () => void;
  onOpenContact?: (tab: 'phone' | 'zalo') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEstimator, onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPlaying, togglePlay } = useAudio();

  useEffect(() => {
    let ticking = false;
    let prevScrolled = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 40;
          if (shouldScroll !== prevScrolled) {
            prevScrolled = shouldScroll;
            setIsScrolled(shouldScroll);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'TRIẾT LÝ', href: '#philosophy' },
    { label: 'DỊCH VỤ', href: '#services' },
    { label: 'BẢN VẼ 3D', href: '#concept-3d' },
    { label: 'ẢNH THỰC TẾ', href: '#projects' },
    { label: 'XƯỞNG GỖ', href: '#workshop' },
    { label: 'TIÊU CHUẨN', href: '#standards' },
    { label: 'QUY TRÌNH', href: '#process' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-black/8 py-2.5 md:py-3 shadow-xs'
            : 'bg-[#F8F7F4]/80 backdrop-blur-xs py-3.5 md:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 flex items-center justify-between gap-4">
          {/* Brand Logo - Gọn gàng, sang trọng, không chiếm quá nhiều bề ngang */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0 group">
            <img
              src="/assets/logo/logo-turquoise-clean.png"
              alt="Công ty TNHH Nội Thất Phát Lộc Logo"
              className="h-10 sm:h-12 xl:h-13 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-lg sm:text-xl xl:text-[22px] font-black tracking-tight text-[#141414] leading-none">
                PHÁT LỘC
              </span>
              <span className="text-[9px] sm:text-[10px] xl:text-[10.5px] uppercase tracking-[0.18em] text-[#00A8BC] font-bold mt-1 whitespace-nowrap">
                Thiết Kế & Thi Công
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Thoáng đãng, không bị ngắt dòng chữ */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-7 text-[11px] xl:text-[12px] uppercase tracking-[0.1em] xl:tracking-[0.14em] font-medium text-[#2A2B2E]">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="whitespace-nowrap hover:text-[#00A8BC] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#00A8BC] hover:after:w-full after:transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {/* Minimalist Audio Control Icon Button */}
            <button
              onClick={togglePlay}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
                isPlaying
                  ? 'border-black/15 bg-black/[0.06] text-[#00A8BC]'
                  : 'border-black/10 bg-black/[0.03] text-neutral-600 hover:text-black'
              }`}
              title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
              aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current stroke-[2]" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5 stroke-[2]" />
              )}
            </button>

            <button
              onClick={onOpenEstimator}
              className="px-3 xl:px-4 py-2 text-[10.5px] xl:text-[11px] uppercase tracking-[0.12em] font-semibold border border-black/20 hover:border-black bg-transparent hover:bg-black hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Dự toán chi phí
            </button>

            <button
              onClick={() => (onOpenContact ? onOpenContact('phone') : (window.location.href = 'tel:0585338339'))}
              className="flex items-center gap-1.5 px-3.5 xl:px-4 py-2 text-[10.5px] xl:text-[11px] uppercase tracking-[0.12em] font-semibold bg-[#141414] text-white hover:bg-[#00D0E8] hover:text-black transition-colors whitespace-nowrap cursor-pointer"
              title="Hotline hỗ trợ Mr. Lợi & Mr. Lộc"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Liên hệ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#141414] hover:text-[#00A8BC]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F8F7F4] pt-24 px-6 pb-8 flex flex-col justify-between overflow-y-auto lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C8980]">
              Menu điều hướng
            </span>
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-heading text-2xl tracking-tight text-[#141414] hover:text-[#00A8BC] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-black/10 mt-6">
            {/* Minimalist Audio Control for Mobile Drawer */}
            <button
              onClick={togglePlay}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-medium transition-all backdrop-blur-md ${
                isPlaying
                  ? 'border-black/15 bg-black/[0.05] text-[#008A9B]'
                  : 'border-black/10 bg-black/[0.02] text-neutral-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current stroke-[2]" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5 stroke-[2]" />
                )}
                <span>{isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}</span>
              </div>
            </button>

            {/* Thông tin pháp lý & liên hệ công ty */}
            <div className="text-[11px] text-[#55565B] space-y-1 bg-black/[0.03] p-3 rounded-xs border border-black/5">
              <span className="font-bold text-[#141414] block">CÔNG TY TNHH NỘI THẤT PHÁT LỘC</span>
              <span className="font-mono-num text-[#00A8BC] font-semibold block">MST: 3604065485</span>
              <span className="block text-[10.5px] leading-relaxed text-[#6E7075]">
                Đ/C: 28C/88, Khu phố 13, Phường Long Bình, Tỉnh Đồng Nai, Việt Nam
              </span>
              <a href="mailto:noithatphatloc2025@gmail.com" className="block text-[10.5px] text-[#00A8BC] hover:underline font-medium">
                Email: noithatphatloc2025@gmail.com
              </a>
              <a
                href="https://www.facebook.com/noithatphatloc1"
                target="_blank"
                rel="noreferrer"
                className="block text-[10.5px] text-[#00A8BC] hover:underline font-medium"
              >
                Facebook: facebook.com/noithatphatloc1
              </a>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEstimator();
              }}
              className="w-full py-3 text-center text-xs uppercase tracking-[0.16em] font-semibold border border-black/20 hover:bg-black hover:text-white transition-colors"
            >
              Báo giá & Dự toán
            </button>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <a
                href="tel:0585338339"
                className="py-2.5 text-center text-[11px] sm:text-xs uppercase tracking-[0.1em] font-semibold bg-[#141414] text-white flex items-center justify-center gap-1 rounded-xs"
              >
                <Phone className="w-3 h-3 text-[#00D0E8] shrink-0" />
                <span>Mr. Lợi</span>
              </a>
              <a
                href="tel:0836084719"
                className="py-2.5 text-center text-[11px] sm:text-xs uppercase tracking-[0.1em] font-semibold bg-[#141414] text-white flex items-center justify-center gap-1 rounded-xs"
              >
                <Phone className="w-3 h-3 text-[#00D0E8] shrink-0" />
                <span>Mr. Lộc</span>
              </a>
              <a
                href="tel:0908938297"
                className="py-2.5 text-center text-[11px] sm:text-xs uppercase tracking-[0.1em] font-semibold bg-[#141414] text-white flex items-center justify-center gap-1 rounded-xs"
              >
                <Phone className="w-3 h-3 text-[#00D0E8] shrink-0" />
                <span>Mr. Huân</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
