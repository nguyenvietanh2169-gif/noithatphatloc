import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const PROCESS_STEPS = [
  {
    number: '01',
    code: 'KHẢO SÁT & TƯ VẤN',
    title: 'Khảo Sát Hiện Trạng & Thấu Hiểu Nhu Cầu',
    description: 'Đội ngũ kiến trúc sư Phát Lộc đo đạc hiện trạng thực địa, lắng nghe thói quen sinh hoạt và phong cách mong muốn của gia chủ để định hình đề bài thiết kế chuẩn xác.',
    image: '/assets/workshop/workshop-3.webp',
  },
  {
    number: '02',
    code: 'THIẾT KẾ 3D',
    title: 'Phát Triển Ý Tưởng & Phối Cảnh 3D',
    description: 'Thiết kế bố trí mặt bằng công năng thông minh, lên phối cảnh 3D trực quan từng góc nhìn và chỉ định vật liệu thực tế có thể sản xuất được.',
    image: '/assets/projects/project-3d-4.webp',
  },
  {
    number: '03',
    code: 'SẢN XUẤT TẠI XƯỞNG',
    title: 'Bóc Tách Bản Vẽ & Sản Xuất Tại Xưởng',
    description: 'Bóc tách chi tiết kỹ thuật 2D, lập trình máy cắt ván chính xác đến từng milimet, ép dán cạnh nẹp nhiệt và kiểm tra lắp ráp thử tại xưởng sản xuất.',
    image: '/assets/workshop/workshop-4.webp',
  },
  {
    number: '04',
    code: 'LẮP ĐẶT & BÀN GIAO',
    title: 'Vận Chuyển, Lắp Đặt & Nghiệm Thu',
    description: 'Vận chuyển đóng gói chống trầy xước, lắp đặt hoàn thiện sạch sẽ tại công trình, nghiệm thu từng chi tiết và kích hoạt chế độ bảo hành 5 năm.',
    image: '/assets/projects/project-real-5.webp',
  },
];

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="py-24 md:py-32 bg-[#F8F7F4] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] mb-2 block">
              QUY TRÌNH CHUYÊN NGHIỆP 4 BƯỚC
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] uppercase leading-[1.2]">
              QUY TRÌNH THỰC HIỆN.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#686762] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Minh bạch từng giai đoạn, chuẩn xác từng chi tiết giúp khách hàng an tâm tuyệt đối về chất lượng và tiến độ bàn giao.
          </p>
        </div>

        {/* 4 Steps Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="group bg-white border border-black/10 p-6 flex flex-col justify-between hover:border-black/30 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Step Image */}
                <div className="w-full h-44 overflow-hidden bg-[#ECEAE3] mb-6">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Number & Code */}
                <div className="flex items-center justify-between pb-3 border-b border-black/8 mb-4">
                  <span className="font-mono-num text-2xl font-bold text-[#141414] group-hover:text-[#00A8BC] transition-colors">
                    {step.number}
                  </span>
                  <span className="text-[9px] uppercase font-mono-num text-[#84827D] tracking-widest">
                    {step.code}
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-[#141414] mb-3 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-[#525357] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/6 flex items-center justify-between text-[11px] font-mono-num text-[#84827D]">
                <span>TIÊU CHUẨN PHÁT LỘC</span>
                <span className="w-2 h-2 rounded-full bg-[#00D0E8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
