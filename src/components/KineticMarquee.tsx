import React from 'react';

export const KineticMarquee: React.FC = () => {
  const itemsLine1 = [
    'NỘI THẤT BIÊN HÒA — ĐỒNG NAI',
    'NỘI THẤT GIÁ XƯỞNG GIÁ GỐC 100%',
    'XƯỞNG SẢN XUẤT TRỰC TIẾP',
    'THIẾT KẾ NỘI THẤT ĐỒNG NAI',
    'THI CÔNG NỘI THẤT BIÊN HÒA',
    'BẢO HÀNH KẾT CẤU 5 NĂM',
  ];

  const itemsLine2 = [
    'XƯỞNG GỖ NỘI THẤT PHÁT LỘC',
    'NỘI THẤT GIÁ GỐC KHÔNG QUA TRUNG GIAN',
    'TỦ BẾP MDF • TỦ ÁO CÁNH KÍNH • VÁCH TIVI',
    'MÁY MÓC CNC HIỆN ĐẠI ĐỒNG BỘ',
    'ĐỘI NGŨ THỢ MỘC BIÊN HÒA GIÀU KINH NGHIỆM',
    'TIẾT KIỆM 20-30% CHI PHÍ THI CÔNG',
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
