import React, { useState } from 'react';
import {
  FolderArchive,
  Image as ImageIcon,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CustomerAlbum, is3DAlbum } from '../types/album';
import { CustomerAlbumModal } from './CustomerAlbumModal';

interface CustomerAlbumsSectionProps {
  albums: CustomerAlbum[];
  onOpenContact: (tab: 'phone' | 'zalo') => void;
}

export const CustomerAlbumsSection: React.FC<CustomerAlbumsSectionProps> = ({
  albums,
  onOpenContact,
}) => {
  const [selectedAlbum, setSelectedAlbum] = useState<CustomerAlbum | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  // Lọc riêng album công trình thực tế
  const realAlbums = albums.filter((a) => !is3DAlbum(a));

  // Lấy danh sách category duy nhất
  const allCategories = [
    'Tất cả',
    ...Array.from(new Set(realAlbums.flatMap((a) => a.categories))),
  ];

  const filteredAlbums =
    activeCategory === 'Tất cả'
      ? realAlbums
      : realAlbums.filter((a) => a.categories.includes(activeCategory));

  return (
    <section id="customer-albums" className="py-20 bg-[#0F1012] text-white relative overflow-hidden">
      <div id="projects" className="absolute -top-10" />
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00D0E8]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#00D0E8] font-mono mb-1.5">
              NHẬT KÝ THI CÔNG & BÀN GIAO KHÁCH HÀNG
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">
              ALBUM CÔNG TRÌNH <span className="text-[#00D0E8]">THỰC TẾ</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
            Mỗi gia đình là một câu chuyện may đo riêng biệt. Tổng hợp bộ sưu tập hình ảnh bàn giao trọn gói từng căn hộ, nhà phố và biệt thự đã hoàn thiện 100%.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00D0E8] text-black font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 text-[#A0A2A8] hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              className="group bg-[#16171B] rounded-2xl border border-white/10 hover:border-[#00D0E8]/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#00D0E8]/10 cursor-pointer flex flex-col isolate"
              style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            >
              {/* Cover Image & Badge */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-[#16171B] mb-[-1px] isolate"
                style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
              >
                <img
                  src={album.coverImage || album.photos[0]?.url}
                  alt={album.projectTitle}
                  loading="lazy"
                  className="block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16171B] via-transparent to-black/30 pointer-events-none" />

                {/* Badge số lượng ảnh trong Album */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10 pointer-events-none">
                  <ImageIcon className="w-3.5 h-3.5 text-[#00D0E8]" />
                  <span>{album.photos.length} Ảnh</span>
                </div>

                {/* Badge địa chỉ */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#16171B]/90 backdrop-blur-md rounded-lg text-[11px] text-[#A0A2A8] border border-white/10 pointer-events-none">
                  <MapPin className="w-3 h-3 text-[#00D0E8]" />
                  <span>{album.location}</span>
                </div>
              </div>

              {/* Album Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#16171B] relative z-10">
                <div>
                  {album.customerName && (
                    <div className="text-xs text-[#00D0E8] font-mono mb-1 font-semibold uppercase tracking-wide">
                      {album.customerName}
                    </div>
                  )}

                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                    {album.projectTitle}
                  </h3>

                  {/* Thumbnail Strip (Xem trước 4 ảnh nhỏ) */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/5">
                    {album.photos.slice(0, 4).map((p, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-md overflow-hidden bg-black/40 border border-white/5"
                      >
                        <img
                          src={p.thumbnail || p.url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {i === 3 && album.photos.length > 4 && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-bold text-white">
                            +{album.photos.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Album Footer */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex flex-wrap gap-1">
                    {album.categories.slice(0, 2).map((cat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white/5 rounded text-[11px] text-[#A0A2A8]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[#00D0E8] font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Album Detail Modal */}
      <CustomerAlbumModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        onOpenContact={onOpenContact}
      />
    </section>
  );
};
