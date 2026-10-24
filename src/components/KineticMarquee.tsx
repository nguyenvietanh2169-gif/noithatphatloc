import React from 'react';

export const KineticMarquee: React.FC = () => {
  const itemsLine1 = [
    'THIẾT KẾ NỘI THẤT HIỆN ĐẠI',
    'XƯỞNG SẢN XUẤT TRỰC TIẾP',
    'VẬT LIỆU CAO CẤP CHÍNH HÃNG',
    'THI CÔNG TRỌN GÓI CHÌA KHÓA TRAO TAY',
    'CHUẨN XÁC 100% THEO PHỐI CẢNH 3D',
    'BẢO HÀNH 5 NĂM & BẢO TRÌ TRỌN ĐỜI',
  ];

  const itemsLine2 = [
    'NỘI THẤT PHÁT LỘC',
    'THI CÔNG BIỆT THỰ & CĂN HỘ CAO CẤP',
    'HỆ CÁNH KÍNH & VÁCH THAN TRE',
    'MÁY MÓC HIỆN ĐẠI ĐỒNG BỘ',
    'ĐỘI NGŨ THỢ MỘC GIÀU TÂM HUYẾT',
    'TỐI ƯU CÔNG NĂNG & CHI PHÍ THI CÔNG',
  ];

  return (
    <div className="w-full bg-[#121316] text-[#F8F7F4] py-6 overflow-hidden border-y border-white/10 select-none">
      {/* Top track: Slides Left */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee-left flex items-center">
          {[...itemsLine1, ...itemsLine1].map((text, index) => (
            <div key={`m1-${index}`} className="flex items-center mx-8">
              <span className="font-heading text-sm md:text-base font-semibold tracking-[0.16em] uppercase text-white/90 hover:text-[#00D0E8] transition-colors cursor-default leading-none">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle thin separator line */}
      <div className="h-[1px] bg-white/5 my-4" />

      {/* Bottom track: Slides Right */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee-right flex items-center">
          {[...itemsLine2, ...itemsLine2].map((text, index) => (
            <div key={`m2-${index}`} className="flex items-center mx-8">
              <span className="font-heading text-xs md:text-sm font-medium tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors cursor-default leading-none">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
