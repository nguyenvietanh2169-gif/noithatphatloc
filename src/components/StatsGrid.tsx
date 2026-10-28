import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StatsGrid: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 md:py-28 bg-[#F8F7F4] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] mb-4 block">
                TRIẾT LÝ KIẾN TRÚC & THI CÔNG
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] leading-[1.22] md:leading-[1.2] uppercase mb-8">
                ĐỊNH HÌNH KHÔNG GIAN BẰNG SỰ RÕ RÀNG VÀ CHỈN CHU.
              </h2>
            </div>

            <div className="pt-6 border-t border-black/10">
              <p className="text-sm md:text-base text-[#4A4B4F] leading-relaxed max-w-xl font-light">
                Tại <strong>Nội thất Phát Lộc</strong>, chúng tôi tự hào là xưởng chuyên sâu <strong>nội thất Biên Hòa</strong> và <strong>nội thất Đồng Nai</strong> uy tín. Với xưởng sản xuất trực tiếp khép kín, Phát Lộc mang đến các sản phẩm <strong>nội thất giá xưởng, nội thất giá gốc</strong> chuẩn xác từng milimet theo bản vẽ 3D, tối ưu 20-30% chi phí trung gian cho mọi gia đình.
              </p>

              <div className="mt-8 flex items-center gap-6">
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-[#141414] hover:text-[#00A8BC] transition-colors group"
                >
                  <span>Tìm hiểu năng lực thiết kế</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 2x2 Hairline Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 border-t border-l border-black/15 bg-white/40">
              {/* Stat 1 */}
              <div className="p-8 md:p-10 border-r border-b border-black/15 flex flex-col justify-between min-h-[190px] hover:bg-white transition-colors duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#84827D] font-mono-num">
                    01 • KINH NGHIỆM
                  </span>
                </div>
                <div className="mt-6">
                  <span className="font-mono-num text-5xl md:text-6xl font-light text-[#141414] tracking-tight block">
                    10<span className="text-[#00A8BC] font-normal">+</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#55565B] font-semibold mt-2 block">
                    Năm Kinh Nghiệm Xưởng
                  </span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-8 md:p-10 border-r border-b border-black/15 flex flex-col justify-between min-h-[190px] hover:bg-white transition-colors duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#84827D] font-mono-num">
                    02 • DỰ ÁN
                  </span>
                </div>
                <div className="mt-6">
                  <span className="font-mono-num text-5xl md:text-6xl font-light text-[#141414] tracking-tight block">
                    280<span className="text-[#00A8BC] font-normal">+</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#55565B] font-semibold mt-2 block">
                    Dự Án Đã Bàn Giao
                  </span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-8 md:p-10 border-r border-b border-black/15 flex flex-col justify-between min-h-[190px] hover:bg-white transition-colors duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#84827D] font-mono-num">
                    03 • XƯỞNG SẢN XUẤT
                  </span>
                </div>
                <div className="mt-6">
                  <span className="font-mono-num text-5xl md:text-6xl font-light text-[#141414] tracking-tight block">
                    100<span className="text-[#00A8BC] font-normal">%</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#55565B] font-semibold mt-2 block">
                    Sản Xuất Tại Xưởng
                  </span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-8 md:p-10 border-r border-b border-black/15 flex flex-col justify-between min-h-[190px] hover:bg-white transition-colors duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#84827D] font-mono-num">
                    04 • ĐỐI TÁC
                  </span>
                </div>
                <div className="mt-6">
                  <span className="font-mono-num text-5xl md:text-6xl font-light text-[#141414] tracking-tight block">
                    45<span className="text-[#00A8BC] font-normal">+</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#55565B] font-semibold mt-2 block">
                    Đối Tác & Nhà Cung Cấp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
