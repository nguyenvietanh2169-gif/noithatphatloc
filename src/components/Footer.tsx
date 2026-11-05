import React from 'react';
import { ArrowUpRight, MapPin, Phone, Mail, Clock, CreditCard, Shield } from 'lucide-react';

interface FooterProps {
  onOpenEstimator: () => void;
  onOpenContact?: (tab: 'phone' | 'zalo') => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEstimator, onOpenContact, onOpenAdmin }) => {
  return (
    <footer className="bg-[#121316] text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Big Editorial CTA Header */}
        <div className="pb-16 border-b border-white/10">
          <span className="text-[11px] font-mono-num uppercase tracking-[0.24em] text-[#00D0E8] mb-3 block">
            BẮT ĐẦU HIỆN THỰC HÓA KHÔNG GIAN SỐNG
          </span>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-[1.2] md:leading-[1.18]">
              CÙNG NHAU KIẾN TẠO <br className="hidden sm:inline" />
              <span className="text-white/40 hover:text-[#00D0E8] transition-colors cursor-pointer">
                KHÔNG GIAN SỐNG.
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onOpenEstimator}
                className="px-8 py-4 bg-[#00D0E8] hover:bg-white text-black font-semibold text-xs uppercase tracking-[0.18em] transition-all cursor-pointer shadow-lg"
              >
                Nhận dự toán miễn phí
              </button>
              <button
                onClick={() => (onOpenContact ? onOpenContact('zalo') : window.open('https://zalo.me/0585338339', '_blank'))}
                className="px-8 py-4 border border-white/30 hover:border-white text-white font-medium text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10"
              >
                <span>Nhắn tin qua Zalo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Full Width Showcase Image (Luôn phủ kín 100% bề ngang, không có viền đen hai bên) */}
        <div className="my-16 w-full overflow-hidden border border-white/10 relative rounded-xs shadow-2xl">
          <img
            src="/assets/hero/hero-5.webp"
            alt="Nội thất Phát Lộc hoàn thiện tinh xảo"
            className="w-full h-auto block opacity-95 hover:scale-[1.01] transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-[#121316] via-[#121316]/70 to-transparent text-xs font-mono-num text-white/80">
            <span>XƯỞNG NỘI THẤT PHÁT LỘC • TINH TẾ & CHUẨN MỰC KIẾN TRÚC</span>
          </div>
        </div>

        {/* Bản đồ Google Maps chỉ đường tới Trụ sở & Xưởng (Nằm lên trên các dòng thông tin) */}
        <div className="pb-16 mb-16 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-3">
            <div>
              <span className="text-[10.5px] uppercase font-mono-num tracking-[0.2em] text-[#00D0E8] block mb-1">
                BẢN ĐỒ ĐỊNH VỊ GOOGLE MAPS
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white uppercase">
                VỊ TRÍ TRỤ SỞ & XƯỞNG SẢN XUẤT PHÁT LỘC
              </h3>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=C%C3%B4ng+ty+TNHH+N%E1%BB%99i+Th%E1%BA%A5t+Ph%C3%A1t+L%E1%BB%99c%2C+28C%2F88+Khu+ph%E1%BB%91+13%2C+Tam+Hi%E1%BB%87p%2C+%C4%90%E1%BB%93ng+Nai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-[#00D0E8] text-white hover:text-black border border-white/10 hover:border-transparent text-xs font-medium uppercase tracking-wider transition-all self-start sm:self-auto shrink-0 group cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00D0E8] group-hover:text-black transition-colors" />
              <span>Chỉ đường trên Google Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-72 sm:h-80 md:h-[360px] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl bg-[#1A1A1E]">
            <iframe
              title="Bản đồ Google Maps - Vị trí Công ty TNHH Nội Thất Phát Lộc"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d70103.05637832002!2d106.82311593211381!3d10.941928471569337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd13a9734f37%3A0xe8340db4a3dd2d9d!2zQ8O0bmcgdHkgVE5ISCBO4buZaSBUaOG6pXQgUGjDoXQgTOG7mWM!5e1!3m2!1svi!2sus!4v1793004202886!5m2!1svi!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* 4 Columns Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3.5 mb-6">
              <img
                src="/assets/logo/logo-white-clean.png"
                alt="Công ty TNHH Nội Thất Phát Lộc Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
              <div>
                <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white block">
                  PHÁT LỘC
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#00D0E8] block font-mono-num font-semibold">
                  Thiết Kế & Thi Công Nội Thất
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-bold text-white tracking-wide">
                CÔNG TY TNHH NỘI THẤT PHÁT LỘC
              </p>
              <div className="text-xs font-mono-num text-white/80">
                <span className="text-white/50">MÃ SỐ THUẾ (MST):</span>{' '}
                <strong className="tracking-wider text-white text-[13px] ml-1">3604065485</strong>
              </div>
              <p className="text-xs text-white/70 max-w-sm font-light leading-relaxed pt-1">
                Chuyên tư vấn, thiết kế và thi công nội thất hiện đại trọn gói cho biệt thự, nhà phố, căn hộ cao cấp và văn phòng thương mại.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-white/60 font-mono-num">
                <Shield className="w-4 h-4 text-[#00D0E8]" />
                <span>Cam kết bảo hành kết cấu 5 năm</span>
              </div>
            </div>
          </div>

          {/* Col 2: Contact Details */}
          <div className="lg:col-span-4">
            <span className="text-[11px] font-mono-num uppercase tracking-[0.2em] text-[#00D0E8] block mb-4">
              THÔNG TIN LIÊN HỆ & TRỤ SỞ
            </span>
            <ul className="space-y-3.5 text-xs text-white/80 font-light">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00D0E8] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-white/50 font-mono-num uppercase block">ĐỊA CHỈ DOANH NGHIỆP:</span>
                  <span className="text-white font-medium leading-relaxed">
                    28C/88, Khu phố 13, Tam Hiệp, Thành phố Biên Hòa, Tỉnh Đồng Nai, Việt Nam
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#00D0E8] flex-shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <span className="text-[10px] text-white/50 font-mono-num uppercase block">HOTLINE / ZALO TƯ VẤN:</span>
                  <div className="flex flex-col gap-1 text-xs">
                    <div>
                      <span className="text-white/60">Mr. Lợi:</span>{' '}
                      <a href="tel:0585338339" className="hover:text-[#00D0E8] font-semibold tracking-wide text-white transition-colors">
                        0585 338 339
                      </a>
                    </div>
                    <div>
                      <span className="text-white/60">Mr. Lộc:</span>{' '}
                      <a href="tel:0836084719" className="hover:text-[#00D0E8] font-semibold tracking-wide text-white transition-colors">
                        0836 084 719
                      </a>
                    </div>
                    <div>
                      <span className="text-white/60">Mr. Huấn:</span>{' '}
                      <a href="tel:0908938297" className="hover:text-[#00D0E8] font-semibold tracking-wide text-white transition-colors">
                        090 893 8297
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00D0E8] flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-white/50 font-mono-num uppercase block">EMAIL LIÊN HỆ:</span>
                  <a
                    href="mailto:noithatphatloc2025@gmail.com"
                    className="text-[#00D0E8] hover:text-white font-medium transition-colors"
                  >
                    noithatphatloc2025@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 fill-[#00D0E8]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 font-mono-num uppercase block">FANPAGE FACEBOOK:</span>
                  <a
                    href="https://www.facebook.com/noithatphatloc1"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00D0E8] hover:text-white font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <span>facebook.com/noithatphatloc1</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#00D0E8] flex-shrink-0" />
                <span>Thứ 2 — Chủ Nhật: 08:00 - 18:30</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Bank & Legal */}
          <div className="lg:col-span-3">
            <span className="text-[11px] font-mono-num uppercase tracking-[0.2em] text-[#00D0E8] block mb-4">
              TÀI KHOẢN DOANH NGHIỆP
            </span>
            <div className="space-y-3.5 text-xs font-mono-num">
              <div>
                <span className="text-[10px] text-white/50 block">NGÂN HÀNG:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <CreditCard className="w-4 h-4 text-[#00D0E8]" />
                  <span className="text-white font-bold text-sm">ACB (Ngân Hàng Á Châu)</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">CHỦ TÀI KHOẢN:</span>
                <span className="font-bold text-white text-xs block mt-0.5 leading-snug">
                  CÔNG TY TNHH NỘI THẤT PHÁT LỘC
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">SỐ TÀI KHOẢN DOANH NGHIỆP:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-bold tracking-widest text-[#00D0E8] select-all">
                    8360847198
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">CHI NHÁNH:</span>
                <span className="text-white/80 block mt-0.5 text-xs">ACB — Tỉnh Đồng Nai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation to Detailed Pages */}
        <div className="py-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs font-medium uppercase tracking-wider text-white/70">
          <span className="text-[10px] text-[#00D0E8] font-mono-num">DANH MỤC DỊCH VỤ & CHÍNH SÁCH:</span>
          <a href="/gioi-thieu/" className="hover:text-[#00D0E8] transition-colors">Giới Thiệu Xưởng</a>
          <a href="/dich-vu/thiet-ke-noi-that-dong-nai/" className="hover:text-[#00D0E8] transition-colors">Thiết Kế Nội Thất</a>
          <a href="/dich-vu/thi-cong-noi-that-bien-hoa/" className="hover:text-[#00D0E8] transition-colors">Thi Công Trọn Gói</a>
          <a href="/dich-vu/dong-tu-bep-bien-hoa/" className="hover:text-[#00D0E8] transition-colors">Tủ Bếp & Tủ Quần Áo</a>
          <a href="/dich-vu/thi-cong-noi-that-bien-hoa/#phong-ngu-ke-tivi" className="hover:text-[#00D0E8] transition-colors">Giường Ngủ & Kệ Tivi</a>
          <a href="/dich-vu/dong-tu-bep-bien-hoa/#da-bep-vach-trang-tri" className="hover:text-[#00D0E8] transition-colors">Đá Bếp & Vách Trang Trí</a>
          <a href="/du-an/" className="hover:text-[#00D0E8] transition-colors">Dự Án Thực Tế</a>
          <a href="/quy-trinh-bao-gia/" className="hover:text-[#00D0E8] transition-colors">Quy Trình Báo Giá</a>
          <a href="/chinh-sach-bao-hanh/" className="hover:text-[#00D0E8] transition-colors">Bảo Hành</a>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 font-mono-num gap-4">
          <div>
            © 2026 CÔNG TY TNHH NỘI THẤT PHÁT LỘC • MST: 3604065485. BẢN QUYỀN ĐÃ ĐƯỢC BẢO HỘ.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">CHÍNH SÁCH BẢO MẬT</a>
            <a href="#" className="hover:text-white transition-colors">ĐIỀU KHOẢN DỊCH VỤ</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-white/40 hover:text-[#00D0E8] transition-colors cursor-pointer flex items-center gap-1 font-mono-num uppercase tracking-wider"
                title="Đăng nhập bảng quản trị nội bộ"
              >
                <span>QUẢN TRỊ HỆ THỐNG</span>
              </button>
            )}
            <a href="#root" className="hover:text-[#00D0E8] transition-colors">VỀ ĐẦU TRANG ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
