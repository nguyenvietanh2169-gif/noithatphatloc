import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Calendar,
  Layers,
  Quote,
  Sparkles,
  Phone,
  Send,
  Video,
  Grid,
  Play,
} from 'lucide-react';
import { CustomerAlbum, AlbumPhoto } from '../types/album';

interface CustomerAlbumModalProps {
  album: CustomerAlbum | null;
  onClose: () => void;
  onOpenContact: (tab: 'phone' | 'zalo') => void;
}

function cleanCaption(caption?: string): string | null {
  if (!caption || !caption.trim()) return null;
  const trimmed = caption.trim();
  // Bỏ các chuỗi số dài của tên tệp tải về từ điện thoại / Facebook / máy ảnh
  if (/\d{6,}/.test(trimmed)) return null;
  if (/^[\d\s-_.]+$/.test(trimmed)) return null;
  if (/^(img|dsc|photo|video|file|screenshot|image)[\d\s-_.]*$/i.test(trimmed)) return null;
  return trimmed;
}

export const CustomerAlbumModal: React.FC<CustomerAlbumModalProps> = ({
  album,
  onClose,
  onOpenContact,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'lightbox'>('grid');

  useEffect(() => {
    if (album) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [album]);

  // Phím tắt điều hướng trong Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!album) return;
      if (e.key === 'Escape') {
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        } else {
          onClose();
        }
      }
      if (selectedPhotoIndex !== null) {
        if (e.key === 'ArrowRight') {
          setSelectedPhotoIndex((prev) =>
            prev === null ? 0 : (prev + 1) % album.photos.length
          );
        }
        if (e.key === 'ArrowLeft') {
          setSelectedPhotoIndex((prev) =>
            prev === null ? 0 : (prev - 1 + album.photos.length) % album.photos.length
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [album, selectedPhotoIndex, onClose]);

  if (!album) return null;

  const currentPhoto: AlbumPhoto | null =
    selectedPhotoIndex !== null ? album.photos[selectedPhotoIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Lightbox Overlay khi phóng to 1 ảnh */}
      {selectedPhotoIndex !== null && currentPhoto && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-150">
          {/* Top Bar Lightbox */}
          <div className="flex items-center justify-between text-white/90 z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#00D0E8] text-black font-semibold text-xs rounded-full">
                {selectedPhotoIndex + 1} / {album.photos.length}
              </span>
              <p className="text-sm font-medium text-white/90 hidden sm:block truncate max-w-md">
                {cleanCaption(currentPhoto.caption) || album.projectTitle}
              </p>
            </div>
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Đóng xem to (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Lightbox */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden select-none">
            <button
              onClick={() =>
                setSelectedPhotoIndex(
                  (selectedPhotoIndex - 1 + album.photos.length) % album.photos.length
                )
              }
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 hover:bg-[#00D0E8] hover:text-black text-white backdrop-blur-md transition-all cursor-pointer z-10"
              title="Ảnh trước (Mũi tên trái)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {currentPhoto.type === 'video' ? (
              <video
                src={currentPhoto.url}
                controls
                autoPlay
                playsInline
                className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || 'Ảnh công trình'}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
              />
            )}

            <button
              onClick={() =>
                setSelectedPhotoIndex((selectedPhotoIndex + 1) % album.photos.length)
              }
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 hover:bg-[#00D0E8] hover:text-black text-white backdrop-blur-md transition-all cursor-pointer z-10"
              title="Ảnh tiếp theo (Mũi tên phải)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar Lightbox */}
          <div className="text-center text-white/80 text-xs sm:text-sm max-w-2xl mx-auto px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            {currentPhoto.caption ? (
              <p>{currentPhoto.caption}</p>
            ) : (
              <p className="text-white/50">Chụp thực tế tại {album.location}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl h-full sm:h-[90vh] bg-[#121316] text-[#E4E5E8] rounded-none sm:rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#18191E]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00D0E8] animate-pulse" />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00D0E8]">
                Album Khách Hàng Thực Tế
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight line-clamp-1">
                {album.customerName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Hero Banner Thông tin công trình */}
          <div className="bg-[#18191E] border border-white/10 rounded-2xl p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D0E8]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {album.projectTitle}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#A0A2A8]">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-[#00D0E8]" />
                  <span>{album.location}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-[#00D0E8]" />
                  <span>{album.completedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  <Grid className="w-3.5 h-3.5 text-[#00D0E8]" />
                  <span>{album.photos.length} hình ảnh thực tế</span>
                </div>
              </div>

              {/* Badges Hạng mục */}
              <div className="flex flex-wrap gap-2 pt-1">
                {album.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-[#00D0E8]/10 text-[#00D0E8] border border-[#00D0E8]/20 rounded-md font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Thông số vật liệu */}
              {album.materialNotes && (
                <div className="flex items-start gap-2.5 p-3.5 bg-black/40 rounded-xl border border-white/5 text-xs text-[#C8C9CE]">
                  <Layers className="w-4 h-4 text-[#00D0E8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Quy cách & Vật liệu: </span>
                    <span>{album.materialNotes}</span>
                  </div>
                </div>
              )}

              {/* Lời nhận xét của khách */}
              {album.testimonial && (
                <div className="flex items-start gap-3 p-4 bg-[#00D0E8]/5 border-l-2 border-[#00D0E8] rounded-r-xl text-xs sm:text-sm italic text-[#E4E5E8]">
                  <Quote className="w-4 h-4 text-[#00D0E8] shrink-0 mt-0.5" />
                  <p>"{album.testimonial}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Video bàn giao nếu có */}
          {album.videoUrl && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#00D0E8]" />
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Video Thực Tế Bàn Giao
                </h4>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                {album.videoUrl.includes('youtube.com') || album.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={album.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title="Video bàn giao"
                  />
                ) : (
                  <video
                    src={album.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* Lưới hình ảnh Album */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00D0E8]" />
                Bộ Sưu Tập Ảnh Hoàn Thiện ({album.photos.length})
              </h4>
              <span className="text-xs text-white/50">
                Click vào ảnh để phóng to toàn màn hình
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {album.photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-[#00D0E8]/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#00D0E8]/10"
                >
                  <img
                    src={photo.thumbnail || photo.url}
                    alt={photo.caption || `Ảnh ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Nút Play nhận biết nếu là video */}
                  {photo.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#00D0E8] group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
                    {cleanCaption(photo.caption) && (
                      <p className="text-xs text-white line-clamp-2 font-medium mb-1">
                        {cleanCaption(photo.caption)}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#00D0E8] font-semibold">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Xem toàn màn hình</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Modal: Kêu gọi hành động */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#18191E] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-white/70 text-center sm:text-left">
            Bạn muốn may đo nội thất theo phong cách của công trình này?
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenContact('zalo');
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Mẫu Qua Zalo</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenContact('phone');
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#00D0E8] hover:bg-white text-black text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Tư Vấn Báo Giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
