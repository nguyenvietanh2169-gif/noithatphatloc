import React, { useState } from 'react';
import {
  Layers,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  ArrowRight,
  Eye,
  Maximize2,
  FolderArchive,
  Compass,
} from 'lucide-react';
import { CustomerAlbum, is3DAlbum } from '../types/album';
import { CustomerAlbumModal } from './CustomerAlbumModal';

interface Design3DAlbumsSectionProps {
  albums: CustomerAlbum[];
  onOpenContact: (tab: 'phone' | 'zalo') => void;
}

export const Design3DAlbumsSection: React.FC<Design3DAlbumsSectionProps> = ({
  albums,
  onOpenContact,
}) => {
  const [selectedAlbum, setSelectedAlbum] = useState<CustomerAlbum | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  // Lọc riêng danh sách album 3D
  const design3DAlbums = albums.filter((a) => is3DAlbum(a));

  // Lấy các category duy nhất của 3D (loại bỏ nhãn chung "Bản Vẽ 3D" để các filter cụ thể hơn)
  const categoriesSet = new Set<string>();
  design3DAlbums.forEach((album) => {
    album.categories.forEach((cat) => {
      if (cat !== 'Bản Vẽ 3D' && cat !== 'Phối Cảnh 3D') {
        categoriesSet.add(cat);
      }
    });
  });

  const allCategories = ['Tất cả', ...Array.from(categoriesSet)];

  const filteredAlbums =
    activeCategory === 'Tất cả'
      ? design3DAlbums
      : design3DAlbums.filter((a) => a.categories.includes(activeCategory));

  return (
    <section
      id="concept-3d"
      className="py-16 sm:py-24 bg-[#07080A] text-white border-b border-white/10 overflow-hidden relative"
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00D0E8]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#0057FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#00D0E8] font-mono mb-1.5">
              THIẾT KẾ PHỐI CẢNH 3D
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">
                ALBUM BẢN VẼ <span className="text-[#00D0E8]">3D NỘI THẤT</span>
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                ({filteredAlbums.length} album)
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 max-w-md font-light leading-relaxed">
            Phối cảnh 3D may đo theo từng không gian thực tế, chuẩn công năng và sẵn sàng gia công xuất xưởng.
          </p>
        </div>

        {/* Filter Bar */}
        {allCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 custom-scrollbar">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#00D0E8] text-black font-semibold shadow-sm'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Albums Grid */}
        {filteredAlbums.length === 0 ? (
          <div className="py-12 text-center bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-neutral-400">Chưa có album nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredAlbums.map((album) => {
              const photoCount = album.photos?.length || 0;
              const coverSrc = album.coverImage || album.photos[0]?.url;

              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="group bg-[#111216] rounded-xl border border-white/10 hover:border-[#00D0E8]/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col isolate"
                  style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                >
                  {/* Cover Image & Badges (mb-[-1px] và bg-[#111216] triệt tiêu hoàn toàn đường kẻ chớp chân ảnh) */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-[#111216] mb-[-1px] isolate"
                    style={{ transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                  >
                    <img
                      src={coverSrc}
                      alt={album.projectTitle}
                      loading="lazy"
                      className="block w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-black/30 pointer-events-none" />

                    {/* Badge: Số lượng ảnh */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 bg-black/75 backdrop-blur-md rounded-full text-[11px] font-medium text-white border border-white/10 pointer-events-none">
                      <Layers className="w-3 h-3 text-[#00D0E8]" />
                      <span>{photoCount} ảnh 3D</span>
                    </div>

                    {/* Badge: Địa điểm */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-[#111216]/90 backdrop-blur-md rounded text-[11px] text-neutral-300 border border-white/10 pointer-events-none">
                      <MapPin className="w-3 h-3 text-[#00D0E8]" />
                      <span>{album.location}</span>
                    </div>
                  </div>

                  {/* Album Body - Tối giản, không ngợp chữ */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#111216] relative z-10">
                    <div>
                      {/* Tên chủ công trình / Dự án */}
                      {album.customerName && (
                        <div className="text-xs text-[#00D0E8] font-mono mb-1 font-semibold uppercase tracking-wide">
                          {album.customerName}
                        </div>
                      )}

                      {/* Tiêu đề ngắn gọn, rõ ràng */}
                      <h3 className="text-base font-bold text-white group-hover:text-[#00D0E8] transition-colors line-clamp-2 leading-snug">
                        {album.projectTitle}
                      </h3>

                      {/* Dải 4 thumbnail */}
                      {photoCount > 1 && (
                        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/5">
                          {album.photos.slice(0, 4).map((p, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded overflow-hidden bg-black/40 border border-white/5"
                            >
                              <img
                                src={p.thumbnail || p.url}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              {i === 3 && photoCount > 4 && (
                                <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[10px] font-bold text-white">
                                  +{photoCount - 4}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Album Card Footer */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5">
                      <div className="flex flex-wrap gap-1">
                        {album.categories
                          .filter((c) => c !== 'Bản Vẽ 3D' && c !== 'Phối Cảnh 3D')
                          .slice(0, 2)
                          .map((cat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-white/5 rounded text-[11px] text-neutral-400"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[#00D0E8] font-medium group-hover:translate-x-0.5 transition-transform">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
