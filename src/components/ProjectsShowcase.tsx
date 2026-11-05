import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowDown,
} from 'lucide-react';
import realPhotosData from '../data/realPhotos.json';

interface ProjectItem {
  id: string;
  title: string;
  category: 'real';
  image: string;
  location: string;
  roomCategory: string;
  roomType: 'living' | 'bedroom' | 'kitchen' | 'wardrobe' | 'workshop' | 'wall';
  spec?: string;
  tags?: string[];
}

// TOÀN BỘ ẢNH THỰC TẾ (100% Chụp tại công trình & xưởng sau khi hoàn thiện)
const REAL_PROJECTS: ProjectItem[] = realPhotosData.map((item, idx) => {
  let roomType: 'living' | 'bedroom' | 'kitchen' | 'wardrobe' | 'workshop' | 'wall' = 'living';
  let materialSpec = 'MDF lõi xanh chống ẩm An Cường • Phủ Melamine cao cấp';
  let hardware = 'Bản lề giảm chấn Hafele • Ray âm êm ái';

  if (item.category.includes('Bếp') || item.category.includes('Ăn')) {
    roomType = 'kitchen';
    materialSpec = 'Thùng chống nước Picomat / MDF lõi xanh • Mặt đá & Kính ốp';
    hardware = 'Ray âm Blum giảm chấn • Tay nâng đôi';
  } else if (
    item.category.includes('Tủ Áo') ||
    item.category.includes('Quần Áo') ||
    item.category.includes('Cánh Kính')
  ) {
    roomType = 'wardrobe';
    materialSpec = 'Khung nhôm Slim Anode xám khói • Kính cường lực & LED âm';
    hardware = 'Bản lề cánh kính cao cấp • Cảm biến vẫy tay';
  } else if (
    item.category.includes('Ngủ') ||
    item.category.includes('Giường') ||
    item.category.includes('Làm Việc')
  ) {
    roomType = 'bedroom';
    materialSpec = 'Gỗ MDF chống ẩm phủ Melamine vân óc chó / sồi tự nhiên';
    hardware = 'Phụ kiện liên kết âm mộc thẩm mỹ';
  } else if (
    item.category.includes('Lam') ||
    item.category.includes('Vách') ||
    item.category.includes('Than Tre')
  ) {
    roomType = 'wall';
    materialSpec = 'Hệ vách nan gỗ CNC / vách than tre • Nẹp chỉ kim loại PVD';
    hardware = 'Xương trợ lực kiên cố';
  } else if (item.category.includes('Rượu') || item.category.includes('Kệ Tivi')) {
    roomType = 'living';
    materialSpec = 'Khung nhôm cánh kính cường lực • Thùng vân gỗ óc chó';
    hardware = 'Ray LED nhôm định hình hắt sáng âm đợt';
  }

  return {
    id: item.id,
    title: item.title,
    category: 'real',
    image: item.image,
    location: item.location,
    roomCategory: item.category,
    roomType,
    spec: materialSpec,
    tags: [
      `№ ${(idx + 1).toString().padStart(2, '0')}`,
      item.location,
      hardware.split('•')[0].trim(),
    ],
  };
});

// Thẻ Card công trình thực tế (Tỷ lệ 3:4 chuẩn tạp chí kiến trúc)
const RealProjectCard: React.FC<{
  project: ProjectItem;
  index: number;
  onOpenLightbox: () => void;
}> = ({ project, index, onOpenLightbox }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const staggerDelay = `${(index % 3) * 120}ms`;

  return (
    <article
      ref={cardRef}
      onClick={onOpenLightbox}
      style={{
        transitionDelay: isVisible ? staggerDelay : '0ms',
      }}
      className={`group bg-white rounded-xs border border-black/8 hover:border-[#00A8BC]/40 shadow-xs hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer transform transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-16 scale-[0.97]'
      }`}
    >
      {/* Khung ảnh nguyên bản 3:4 */}
      <div className="aspect-[3/4] relative bg-[#EDEBE6] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-104 pointer-events-none"
          loading="lazy"
        />

        {/* Lớp phủ điện ảnh nhẹ khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Nút phóng to Lightbox nghệ thuật */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md">
          <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>

        {/* Huy hiệu danh mục không gian */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs bg-[#00A8BC] text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider font-mono-num shadow-sm">
            {project.roomCategory}
          </span>
        </div>
      </div>

      {/* Thẻ chú thích kiến trúc bên dưới ảnh */}
      <div className="p-2.5 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between bg-white border-t border-black/5">
        <div>
          <div className="flex items-center justify-between text-[8.5px] sm:text-[10px] md:text-[10.5px] font-mono text-[#8C8980] mb-1 uppercase tracking-wider">
            <span className="truncate max-w-[85px] sm:max-w-none">{project.roomCategory}</span>
            <span className="truncate max-w-[65px] sm:max-w-none">{project.location}</span>
          </div>

          <h3 className="font-heading text-xs sm:text-sm md:text-[15px] font-bold text-[#141414] group-hover:text-[#00A8BC] transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
            {project.title}
          </h3>
        </div>

        {/* Thông số kỹ thuật vật liệu & phụ kiện may đo */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-black/6 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] sm:text-[10.5px] text-[#55565B] font-light">
            <span className="text-[#8C8980] text-[8.5px] sm:text-[10px] font-mono uppercase tracking-wider">
              Vật liệu:
            </span>
            <span className="font-medium text-[#222] truncate max-w-[95px] sm:max-w-[210px] text-right">
              {project.spec?.split('•')[0] || 'MDF chống ẩm An Cường'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10.5px] text-[#55565B] font-light">
            <span className="text-[#8C8980] text-[8.5px] sm:text-[10px] font-mono uppercase tracking-wider">
              Gia công:
            </span>
            <span className="text-[#00A8BC] font-mono-num font-medium text-[8.5px] sm:text-[10.5px]">
              Xưởng Phát Lộc
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export const ProjectsShowcase: React.FC = () => {
  // Real Projects State
  const [realFilter, setRealFilter] = useState<
    'all' | 'living' | 'bedroom' | 'kitchen' | 'wall_workshop'
  >('all');
  const [visibleRealCount, setVisibleRealCount] = useState<number>(6);

  // Lightbox Modal
  const [lightboxData, setLightboxData] = useState<{
    list: ProjectItem[];
    index: number;
  } | null>(null);

  // Lọc ảnh thực tế
  const filteredRealList = REAL_PROJECTS.filter((p) => {
    if (realFilter === 'all') return true;
    if (realFilter === 'bedroom') return p.roomType === 'bedroom' || p.roomType === 'wardrobe';
    if (realFilter === 'kitchen') return p.roomType === 'kitchen';
    if (realFilter === 'living') return p.roomType === 'living';
    if (realFilter === 'wall_workshop') return p.roomType === 'wall' || p.roomType === 'workshop';
    return true;
  });

  const displayedRealList = filteredRealList.slice(0, visibleRealCount);

  // Phím tắt Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxData) return;
      if (e.key === 'Escape') setLightboxData(null);
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  const handleNextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxData) {
      setLightboxData({
        ...lightboxData,
        index: (lightboxData.index + 1) % lightboxData.list.length,
      });
    }
  };

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxData) {
      setLightboxData({
        ...lightboxData,
        index: (lightboxData.index - 1 + lightboxData.list.length) % lightboxData.list.length,
      });
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* HÌNH ẢNH CÔNG TRÌNH THỰC TẾ (PHONG CÁCH TẠP CHÍ KIẾN TRÚC EDITORIAL)       */}
      {/* ========================================================================= */}
      <section id="projects" className="py-20 sm:py-28 bg-[#F4F3EF] border-b border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          {/* Header Tạp Chí Kiến Trúc */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-black/10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00A8BC]" />
                <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] font-mono-num">
                  ARCHITECTURAL LOOKBOOK • HỒ SƠ THI CÔNG NGUYÊN BẢN
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] leading-[1.2] uppercase">
                HÌNH ẢNH NỘI THẤT THỰC TẾ.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#55565B] max-w-md font-light leading-relaxed">
              100% hình ảnh thực tế thi công tại công trình được lưu giữ nguyên bản tỷ lệ chiều cao kịch trần (3:4), tôn vinh tay nghề thợ mộc và kỹ nghệ hoàn thiện của Phát Lộc.
            </p>
          </div>

          {/* Filter Bar Tạp Chí */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none whitespace-nowrap text-xs">
            <button
              onClick={() => {
                setRealFilter('all');
                setVisibleRealCount(6);
              }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'all'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Tất cả công trình ({REAL_PROJECTS.length})
            </button>
            <button
              onClick={() => {
                setRealFilter('bedroom');
                setVisibleRealCount(6);
              }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'bedroom'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Tủ Áo Cánh Kính & Phòng Ngủ
            </button>
            <button
              onClick={() => {
                setRealFilter('kitchen');
                setVisibleRealCount(6);
              }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'kitchen'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Tủ Bếp & Đảo Bếp May Đo
            </button>
            <button
              onClick={() => {
                setRealFilter('living');
                setVisibleRealCount(6);
              }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'living'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Kệ Tivi & Tủ Rượu Sang Trọng
            </button>
            <button
              onClick={() => {
                setRealFilter('wall_workshop');
                setVisibleRealCount(6);
              }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'wall_workshop'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-xs'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Vách Lam Gỗ & Nghệ Thuật Ốp
            </button>
          </div>

          {/* LƯỚI TẠP CHÍ KIẾN TRÚC EDITORIAL */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
            {displayedRealList.map((project, idx) => (
              <RealProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpenLightbox={() => setLightboxData({ list: filteredRealList, index: idx })}
              />
            ))}
          </div>

          {/* NÚT XEM THÊM ẢNH THỰC TẾ */}
          {visibleRealCount < filteredRealList.length && (
            <div className="text-center pt-12 mt-4">
              <button
                onClick={() => setVisibleRealCount((prev) => prev + 6)}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#141414] hover:bg-[#00A8BC] text-white font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer rounded-full shadow-lg hover:shadow-cyan-500/20 active:scale-95"
              >
                <span>Mở thêm hồ sơ công trình (Còn {filteredRealList.length - visibleRealCount} ảnh)</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxData !== null && (
        <div
          onClick={() => setLightboxData(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8 animate-in fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxData(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50 shadow-lg"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrevLightbox}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50 shadow-lg"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNextLightbox}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50 shadow-lg"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Photo Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center"
          >
            <img
              src={lightboxData.list[lightboxData.index].image}
              alt={lightboxData.list[lightboxData.index].title}
              className="max-w-full max-h-[78vh] object-contain rounded-md shadow-2xl block"
            />
            <div className="mt-3.5 text-center text-white max-w-2xl px-2">
              <span className="text-[10px] uppercase font-mono bg-[#00D0E8] text-black font-bold px-2.5 py-0.5 rounded-full mr-2">
                HÌNH ẢNH NỘI THẤT THỰC TẾ
              </span>
              <span className="font-heading text-sm sm:text-base font-bold">
                {lightboxData.list[lightboxData.index].title}
              </span>
              <span className="text-xs text-white/60 font-mono block mt-1">
                {lightboxData.list[lightboxData.index].location} • ({lightboxData.index + 1} /{' '}
                {lightboxData.list.length})
              </span>
              {lightboxData.list[lightboxData.index].spec && (
                <p className="text-[11px] text-white/70 font-light mt-1.5 italic">
                  {lightboxData.list[lightboxData.index].spec}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
