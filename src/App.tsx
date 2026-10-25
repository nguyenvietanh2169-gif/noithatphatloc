import React, { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { MusicController } from './components/MusicController';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { KineticMarquee } from './components/KineticMarquee';
import { StatsGrid } from './components/StatsGrid';
import { DesignServices } from './components/DesignServices';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { CloudflareVideoSection } from './components/CloudflareVideoSection';
import { WorkshopSection } from './components/WorkshopSection';
import { ProcessSection } from './components/ProcessSection';
import { Footer } from './components/Footer';
import { PriceEstimatorModal } from './components/PriceEstimatorModal';
import { ContactModal } from './components/ContactModal';
import { Calculator, MessageCircle, Phone, ArrowUp } from 'lucide-react';

function MainApp() {
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [contactModal, setContactModal] = useState<{ isOpen: boolean; tab: 'phone' | 'zalo' }>({
    isOpen: false,
    tab: 'phone',
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Đảm bảo mỗi khi truy cập trang hoặc tải lại, luôn đưa về đỉnh trang chủ
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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

        {/* Selected Projects with Horizontal Sliding Gallery */}
        <ProjectsShowcase />

        {/* Cloudflare Video Showcase & Local Workshop Reels */}
        <CloudflareVideoSection />

        {/* Direct In-house Workshop & CNC Manufacturing */}
        <WorkshopSection />

        {/* 4-Step Structured Process */}
        <ProcessSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onOpenContact={(tab) => setContactModal({ isOpen: true, tab })}
      />

      {/* Interactive Quotation & Cost Estimator Modal */}
      <PriceEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
      />

      {/* Contact Choice Modal (Lựa chọn 2 hotline mr LỢI & mr LỘC khi gọi điện hoặc chat Zalo) */}
      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal((prev) => ({ ...prev, isOpen: false }))}
        initialTab={contactModal.tab}
      />

      {/* Floating Action Buttons (Sticky Right Corner) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Quick Estimator Button */}
        <button
          onClick={() => setIsEstimatorOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-[#00D0E8] hover:bg-black hover:text-white text-black font-semibold text-xs uppercase tracking-wider rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer"
          title="Dự toán chi phí thi công"
        >
          <Calculator className="w-4 h-4" />
          <span className="hidden md:inline">Báo giá nhanh</span>
        </button>

        {/* Zalo Contact (Mở popup lựa chọn 2 hotline mr LỢI / mr LỘC) */}
        <button
          onClick={() => setContactModal({ isOpen: true, tab: 'zalo' })}
          className="w-12 h-12 rounded-full bg-[#0068FF] hover:bg-[#0052cc] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
          title="Chat Zalo với mr LỢI (0585 338 339) hoặc mr LỘC (0836 084 7193)"
          aria-label="Chat Zalo với Phát Lộc"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>

        {/* Direct Call (Mở popup lựa chọn 2 hotline mr LỢI / mr LỘC) */}
        <button
          onClick={() => setContactModal({ isOpen: true, tab: 'phone' })}
          className="w-12 h-12 rounded-full bg-[#141414] text-white flex items-center justify-center shadow-lg hover:bg-[#00D0E8] hover:text-black transition-colors cursor-pointer"
          title="Gọi Hotline mr LỢI (0585 338 339) hoặc mr LỘC (0836 084 7193)"
          aria-label="Gọi điện thoại hotline Phát Lộc"
        >
          <Phone className="w-5 h-5 fill-current" />
        </button>

        {/* Back to top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white text-black border border-black/10 flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-all cursor-pointer animate-in fade-in"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
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
