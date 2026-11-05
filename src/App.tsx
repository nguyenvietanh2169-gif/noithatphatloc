import React, { useState, useEffect } from 'react';
import { AudioProvider } from './context/AudioContext';
import { MusicController } from './components/MusicController';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { KineticMarquee } from './components/KineticMarquee';
import { StatsGrid } from './components/StatsGrid';
import { DesignServices } from './components/DesignServices';
import { CustomerAlbumsSection } from './components/CustomerAlbumsSection';
import { Design3DAlbumsSection } from './components/Design3DAlbumsSection';
import { CloudflareVideoSection } from './components/CloudflareVideoSection';
import { WorkshopSection } from './components/WorkshopSection';
import { StandardsSection } from './components/StandardsSection';
import { ProcessSection } from './components/ProcessSection';
import { Footer } from './components/Footer';
import { PriceEstimatorModal } from './components/PriceEstimatorModal';
import { ContactModal } from './components/ContactModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { CustomerAlbum } from './types/album';
import { getAlbums } from './utils/albumStorage';
import { Calculator, Phone, ArrowUp, Send } from 'lucide-react';

function MainApp() {
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [albums, setAlbums] = useState<CustomerAlbum[]>([]);
  const [contactModal, setContactModal] = useState<{ isOpen: boolean; tab: 'phone' | 'zalo' }>({
    isOpen: false,
    tab: 'phone',
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Tải danh sách album từ IndexedDB
  useEffect(() => {
    getAlbums().then((loadedAlbums) => {
      setAlbums(loadedAlbums);
    });
  }, []);

  // Lắng nghe URL hash '#admin' hoặc đường dẫn '/admin' để mở Admin panel trực tiếp
  useEffect(() => {
    const checkHash = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.pathname === '/admin' ||
        window.location.pathname === '/admin/'
      ) {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('popstate', checkHash);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('popstate', checkHash);
    };
  }, []);

  // Đảm bảo mỗi khi truy cập trang hoặc tải lại, luôn đưa về đỉnh trang chủ (trừ khi đang ở admin)
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash !== '#admin' && !window.location.pathname.includes('/admin')) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  React.useEffect(() => {
    let ticking = false;
    let prevShow = false;

    const checkScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 500;
          if (shouldShow !== prevShow) {
            prevShow = shouldShow;
            setShowBackToTop(shouldShow);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NẾU ĐANG Ở TRANG ADMIN: RENDER TOÀN BỘ TRANG QUẢN TRỊ ĐỘC LẬP
  if (isAdminOpen) {
    return (
      <AdminDashboardPage
        albums={albums}
        onAlbumsUpdated={setAlbums}
        onExitAdmin={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
            window.history.replaceState(null, '', '/');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#141414] flex flex-col selection:bg-[#00D0E8] selection:text-black relative overflow-x-clip">
      {/* Floating Audio Controller (Tự động xuất hiện khi người dùng bắt đầu vuốt/chạm lướt trang) */}
      <MusicController />

      {/* Navigation Bar */}
      <Navbar
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onOpenContact={(tab) => setContactModal({ isOpen: true, tab })}
      />

      <main className="flex-1">
        {/* Hero Slider with 5 Curated Images & Kinetic Text Slide */}
        <HeroSlider />

        {/* Dual Layer Kinetic Typography Marquee */}
        <KineticMarquee />

        {/* Formfield-inspired Stats & Architectural Philosophy Grid */}
        <StatsGrid />

        {/* Design Services */}
        <DesignServices />

        {/* Album Khách Hàng Thực Tế (Dạng Album Nhiều Ảnh) */}
        <CustomerAlbumsSection
          albums={albums}
          onOpenContact={(tab) => setContactModal({ isOpen: true, tab })}
        />

        {/* Album Bản Vẽ 3D Nội Thất (Dạng Album Nhiều Ảnh, thay cho ảnh chạy cũ) */}
        <Design3DAlbumsSection
          albums={albums}
          onOpenContact={(tab) => setContactModal({ isOpen: true, tab })}
        />

        {/* Cloudflare Video Showcase & Local Workshop Reels */}
        <CloudflareVideoSection />

        {/* Direct In-house Workshop & CNC Manufacturing */}
        <WorkshopSection />

        {/* 6 Core Quality Standards of Phát Lộc */}
        <StandardsSection />

        {/* 4-Step Structured Process */}
        <ProcessSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onOpenContact={(tab) => setContactModal({ isOpen: true, tab })}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = '#admin';
        }}
      />

      {/* Interactive Quotation & Cost Estimator Modal */}
      <PriceEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
      />

      {/* Contact Choice Modal (Lựa chọn hotline Mr. Lợi, Mr. Lộc, Mr. Huấn khi gọi điện hoặc chat Zalo) */}
      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal((prev) => ({ ...prev, isOpen: false }))}
        initialTab={contactModal.tab}
      />

      {/* Floating Action Buttons (Thiết kế Pill Dark Sang Trọng chuẩn theo ảnh mẫu) */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none">
        {/* Quick Estimator Button */}
        <button
          onClick={() => setIsEstimatorOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#00D0E8] hover:bg-white text-black font-semibold text-xs sm:text-[13px] tracking-wide rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Dự toán chi phí thi công"
        >
          <Calculator className="w-4 h-4 stroke-[2]" />
          <span>Báo giá nhanh</span>
        </button>

        {/* Facebook Page Button (Chuẩn thiết kế Capsule Dark + Outline Icon) */}
        <a
          href="https://www.facebook.com/noithatphatloc1"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#1F2024]/90 hover:bg-[#2A2B30] backdrop-blur-md border border-white/10 hover:border-white/25 text-[#E4E5E8] hover:text-white font-medium text-xs sm:text-[13px] tracking-wide rounded-full shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Ghé thăm Fanpage Facebook Nội Thất Phát Lộc"
        >
          <svg
            className="w-4 h-4 stroke-current fill-none stroke-[2] transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* Zalo Chat Button (Chuẩn thiết kế Capsule Dark + Paper Plane Outline Icon) */}
        <button
          onClick={() => setContactModal({ isOpen: true, tab: 'zalo' })}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#1F2024]/90 hover:bg-[#2A2B30] backdrop-blur-md border border-white/10 hover:border-white/25 text-[#E4E5E8] hover:text-white font-medium text-xs sm:text-[13px] tracking-wide rounded-full shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Chat Zalo với Phát Lộc"
        >
          <Send className="w-4 h-4 stroke-current fill-none stroke-[2] transition-transform group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span>Zalo Chat</span>
        </button>

        {/* Hotline Button (Đồng bộ Capsule Dark + Phone Outline Icon) */}
        <button
          onClick={() => setContactModal({ isOpen: true, tab: 'phone' })}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#1F2024]/90 hover:bg-[#2A2B30] backdrop-blur-md border border-white/10 hover:border-white/25 text-[#E4E5E8] hover:text-white font-medium text-xs sm:text-[13px] tracking-wide rounded-full shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Gọi Hotline Phát Lộc"
        >
          <Phone className="w-4 h-4 stroke-current fill-none stroke-[2] transition-transform group-hover:scale-110" />
          <span>Hotline</span>
        </button>

        {/* Back to top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1F2024]/90 hover:bg-white hover:text-black backdrop-blur-md text-[#E4E5E8] border border-white/10 hover:border-white/30 flex items-center justify-center shadow-xl transition-all cursor-pointer animate-in fade-in hover:scale-110 active:scale-95"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MainApp />
    </AudioProvider>
  );
}
