import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';

export interface VideoReelItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  src: string; // Đường dẫn file video nội bộ / fallback
  cfId?: string; // Cloudflare Stream Video ID (ví dụ: b1234567890abcdef...)
  cfUrl?: string; // Cloudflare R2 / CDN URL (ví dụ: https://pub-xxx.r2.dev/reel-1.mp4)
  thumb: string;
  badge: string;
}

export const CloudflareVideoSection: React.FC = () => {
  // Danh sách toàn bộ 12 thước phim công trình (chuẩn xác 100% nội dung video thực tế)
  const videoPlaylist: VideoReelItem[] = [
    {
      id: 'v1',
      title: 'VÁCH TRANG TRÍ PHÒNG KHÁCH & KỆ TIVI BỆT',
      subtitle: 'Hệ vách ốp tia chớp phối lò sưởi 3D & kệ tivi phòng khách',
      duration: '0:10',
      src: '/assets/videos/reel-1.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-1.webp',
      badge: 'Phòng Khách',
    },
    {
      id: 'v2',
      title: 'HỆ KỆ TỦ SÁCH & TRƯNG BÀY ĐÈN LED ÂM',
      subtitle: 'Kệ trang trí màu đen kịch trần tích hợp ngăn kéo & ray LED âm',
      duration: '0:06',
      src: '/assets/videos/reel-2.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-2.webp',
      badge: 'Kệ Sách & Trang Trí',
    },
    {
      id: 'v3',
      title: 'KHÔNG GIAN PHÒNG ĂN & BÀN ĂN 10 GHẾ',
      subtitle: 'Toàn cảnh bộ bàn ăn 10 ghế da liền kề phòng khách biệt thự',
      duration: '0:10',
      src: '/assets/videos/reel-3.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-3.webp',
      badge: 'Phòng Ăn Biệt Thự',
    },
    {
      id: 'v4',
      title: 'TỦ RƯỢU CÁNH KÍNH KHUNG NHÔM ĐÈN LED',
      subtitle: 'Cánh kính xám khói, khung nhôm anode & đợt kệ LED âm',
      duration: '0:10',
      src: '/assets/videos/reel-4.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-4.webp',
      badge: 'Tủ Rượu Cao Cấp',
    },
    {
      id: 'v5',
      title: 'TOÀN CẢNH VÁCH TIVI & LÒ SƯỞI TRANG TRÍ',
      subtitle: 'Góc quay cận cảnh hệ vách trang trí & kệ tivi phòng khách',
      duration: '0:10',
      src: '/assets/videos/reel-5.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-5.webp',
      badge: 'Phòng Khách',
    },
    {
      id: 'v6',
      title: 'BỘ BÀN ĂN CAO CẤP & TỦ RƯỢU CÁNH KÍNH',
      subtitle: 'Không gian phòng ăn sang trọng liền khối hệ tủ rượu đèn LED',
      duration: '0:11',
      src: '/assets/videos/reel-6.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-6.webp',
      badge: 'Bàn Ăn & Tủ Rượu',
    },
    {
      id: 'v7',
      title: 'HỆ VÁCH TIVI BO CONG PHỐI LAM SÓNG GỖ',
      subtitle: 'Thiết kế bo cong mềm mại, tích hợp kệ tivi bệt vân óc chó',
      duration: '0:04',
      src: '/assets/videos/reel-7.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-7.webp',
      badge: 'Kệ Tivi & Vách Gỗ',
    },
    {
      id: 'v8',
      title: 'HỆ TỦ KỆ SÁCH KỊCH TRẦN GỖ VÂN ÓC CHÓ',
      subtitle: 'Hệ tủ chia nhiều đợt gắn đèn LED hắt từng ngăn sang trọng',
      duration: '0:06',
      src: '/assets/videos/reel-8.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-8.webp',
      badge: 'Tủ Kệ Sách Gỗ',
    },
    {
      id: 'v9',
      title: 'CẬN CẢNH GÓC BO CONG VÁCH TIVI CNC',
      subtitle: 'Chi tiết hoàn thiện đường cong mượt mà & vách lam sóng gỗ',
      duration: '0:08',
      src: '/assets/videos/reel-9.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-9.webp',
      badge: 'Gia Công Bo Cong',
    },
    {
      id: 'v10',
      title: 'HỆ VÁCH ỐP TRANG TRÍ NẸP CHỈ KIM LOẠI',
      subtitle: 'Vách ốp phẳng kịch trần phối chỉ âm sang trọng hiện đại',
      duration: '0:05',
      src: '/assets/videos/reel-10.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-10.webp',
      badge: 'Vách Ốp Nội Thất',
    },
    {
      id: 'v11',
      title: 'HOÀN THIỆN VÁCH ỐP PHÒNG KHÁCH HIỆN ĐẠI',
      subtitle: 'Nghiệm thu bề mặt vách phẳng phiu chuẩn kỹ thuật thợ',
      duration: '0:04',
      src: '/assets/videos/reel-11.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-11.webp',
      badge: 'Nghiệm Thu Thực Tế',
    },
    {
      id: 'v12',
      title: 'TỔNG THỂ HỆ VÁCH KỆ TIVI & LAM GỖ TRANG TRÍ',
      subtitle: 'Toàn cảnh không gian vách tivi bo cong và hệ lam gỗ hoàn thiện',
      duration: '0:05',
      src: '/assets/videos/reel-12.mp4',
      cfId: '',
      cfUrl: '',
      thumb: '/assets/videos/thumbs/reel-12.webp',
      badge: 'Vách Tivi Hoàn Thiện',
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState<VideoReelItem>(videoPlaylist[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playlistContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef<boolean>(true);

  // Cấu hình phát video inline mượt mà tại khung trên điện thoại (ngăn iOS/Android tự phóng to toàn màn hình)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('x5-video-player-type', 'h5');
    video.setAttribute('x5-video-player-fullscreen', 'false');
    // @ts-ignore
    video.playsInline = true;

    const handleFullscreen = (e: Event) => {
      e.preventDefault();
      if (typeof (video as any).webkitExitFullscreen === 'function') {
        try {
          (video as any).webkitExitFullscreen();
        } catch (_) {}
      }
    };

    video.addEventListener('webkitbeginfullscreen', handleFullscreen);
    return () => {
      video.removeEventListener('webkitbeginfullscreen', handleFullscreen);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }

    // Không tự động cuộn khi mount lần đầu để tránh việc trình duyệt bị nhảy trang xuống giữa
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Cuộn mượt dải danh sách ngang nội bộ đến video đang chọn (KHÔNG dùng scrollIntoView vì sẽ làm giật cuộn cả trang window)
    if (activeItemRef.current && playlistContainerRef.current) {
      const container = playlistContainerRef.current;
      const activeEl = activeItemRef.current;
      const targetScrollLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [selectedVideo]);

  const handleNextVideo = () => {
    const currentIndex = videoPlaylist.findIndex((v) => v.id === selectedVideo.id);
    const nextIndex = (currentIndex + 1) % videoPlaylist.length;
    setSelectedVideo(videoPlaylist[nextIndex]);
  };

  const handlePrevVideo = () => {
    const currentIndex = videoPlaylist.findIndex((v) => v.id === selectedVideo.id);
    const prevIndex = (currentIndex - 1 + videoPlaylist.length) % videoPlaylist.length;
    setSelectedVideo(videoPlaylist[prevIndex]);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const activeStreamSrc = selectedVideo.cfUrl?.trim() || selectedVideo.src;

  return (
    <section id="video" className="py-20 md:py-32 bg-[#121316] text-white border-b border-white/10 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00D0E8]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono-num uppercase tracking-[0.24em] text-[#00D0E8] mb-2 block">
              GÓC NHÌN TOÀN CẢNH THỰC TẾ ({videoPlaylist.length} THƯỚC PHIM)
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-[1.2]">
              THƯỚC PHIM CÔNG TRÌNH.
            </h2>
          </div>
          <div className="text-xs text-white/60 font-light max-w-md">
            Toàn bộ video được ghi hình trực tiếp tại xưởng sản xuất và công trình thực tế, hiển thị trọn vẹn chi tiết từng góc cạnh nội thất.
          </div>
        </div>

        {/* Vertical Reel Cinema Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Main Vertical Video Player (9:16) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] group">
              {selectedVideo.cfId ? (
                <iframe
                  src={`https://iframe.videodelivery.net/${selectedVideo.cfId}?autoplay=true&muted=${isMuted}&loop=true&controls=true`}
                  className="w-full h-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={activeStreamSrc}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    disablePictureInPicture
                    controls={false}
                    {...({
                      'webkit-playsinline': 'true',
                      'x5-playsinline': 'true',
                      'x5-video-player-type': 'h5',
                      'x5-video-player-fullscreen': 'false',
                    } as any)}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={togglePlay}
                  />

                  {/* Top Bar Overlay */}
                  <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-end pointer-events-none z-10">
                    <span className="text-[10px] uppercase font-mono-num bg-white/15 backdrop-blur-md px-2.5 py-1 text-white rounded-full">
                      {selectedVideo.badge}
                    </span>
                  </div>

                  {/* Play/Pause Center Indicator on hover */}
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer bg-black/20"
                  >
                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </div>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2.5 z-10">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D0E8] transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={togglePlay}
                          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-black text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
                          aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-black text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
                          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-mono-num text-white/80 block">
                          {selectedVideo.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Prev / Next Bar */}
            <div className="flex items-center justify-between w-full max-w-[320px] sm:max-w-[360px] mt-3 px-1">
              <button
                onClick={handlePrevVideo}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95"
                title="Thước phim trước"
                aria-label="Thước phim trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-mono-num text-[#00D0E8] tracking-wider font-semibold">
                {String(videoPlaylist.findIndex((v) => v.id === selectedVideo.id) + 1).padStart(2, '0')} / {String(videoPlaylist.length).padStart(2, '0')}
              </span>

              <button
                onClick={handleNextVideo}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95"
                title="Thước phim tiếp theo"
                aria-label="Thước phim tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Video Caption */}
            <div className="mt-3 text-center max-w-[340px]">
              <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wide">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-white/60 font-light mt-1">
                {selectedVideo.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Playlist of Vertical Reel Cards */}
          <div className="lg:col-span-7 flex flex-col gap-3 w-full min-w-0">
            {/* Dải cuộn ngang trên Mobile (không bẫy cuộn dọc trang, cao chỉ ~85px) & Lưới 2 cột trên Desktop */}
            <div
              ref={playlistContainerRef}
              className="flex lg:grid lg:grid-cols-2 gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[580px] pb-3 pt-1 scrollbar-none snap-x snap-mandatory overscroll-x-contain"
            >
              {videoPlaylist.map((item) => {
                const isSelected = selectedVideo.id === item.id;
                return (
                  <div
                    key={item.id}
                    ref={isSelected ? activeItemRef : null}
                    onClick={() => setSelectedVideo(item)}
                    className={`w-[230px] sm:w-[250px] lg:w-auto shrink-0 snap-start p-2 sm:p-2.5 border transition-all cursor-pointer flex gap-2.5 items-center rounded-xs select-none ${
                      isSelected
                        ? 'bg-white/15 border-[#00D0E8] shadow-[0_0_15px_rgba(0,208,232,0.15)] ring-1 ring-[#00D0E8]/30'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {/* 9:16 vertical thumbnail */}
                    <div className="relative w-12 sm:w-14 aspect-[9/16] shrink-0 bg-black overflow-hidden rounded-xs border border-white/10">
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="w-full h-full object-cover pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                            isSelected ? 'bg-[#00D0E8] text-black scale-110' : 'bg-white/30 text-white'
                          }`}
                        >
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono-num bg-black/80 px-1 py-0.2 text-white/90">
                        {item.duration}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-0.5 flex items-center justify-between gap-1">
                        <span className="text-[9px] uppercase font-mono-num text-[#00D0E8] truncate">
                          {item.badge}
                        </span>
                        {isSelected && (
                          <span className="text-[8px] font-mono-num bg-[#00D0E8]/20 text-[#00D0E8] px-1.5 py-0.2 rounded-full shrink-0">
                            ĐANG PHÁT
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading text-xs font-bold text-white line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-white/50 line-clamp-1 mt-0.5 font-light">
                        {item.subtitle}
                      </p>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-[#00D0E8] translate-x-0.5' : 'text-white/30'}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
