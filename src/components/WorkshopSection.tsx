import React from 'react';
import { Check, ShieldCheck, Cpu, Clock, Factory } from 'lucide-react';

export const WorkshopSection: React.FC = () => {
  const advantages = [
    {
      icon: Cpu,
      title: 'Dàn Máy CNC Tự Động Hóa',
      desc: 'Cắt gọt chính xác từng khớp mộng, đường rãnh đèn LED giấu mí đạt độ thẩm mỹ tinh xảo.',
    },
    {
      icon: Factory,
      title: 'Quy Mô Xưởng Sản Xuất Trực Tiếp',
      desc: 'Không qua bất kỳ đơn vị trung gian nào, khách hàng có thể ghé trực tiếp xưởng xem quy trình sản xuất.',
    },
    {
      icon: ShieldCheck,
      title: '100% Gỗ Chống Ẩm Cao Cấp',
      desc: 'Cam kết xuất trình hóa đơn chứng chỉ ván MDF lõi xanh chống ẩm, phủ Melamine/Laminate/Acrylic cao cấp.',
    },
    {
      icon: Clock,
      title: 'Bảo Hành 5 Năm & Bảo Trì Định Kỳ',
      desc: 'Hỗ trợ thay thế phụ kiện bản lề, ray kéo và hiệu chỉnh cánh tủ nhanh chóng trong vòng 24h.',
    },
  ];

  return (
    <section id="workshop" className="py-24 md:py-32 bg-[#F3F1EC] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Asymmetric Gallery Showcase */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="w-full h-64 md:h-80 overflow-hidden bg-black/10 border border-black/10">
                <img
                  src="/assets/workshop/workshop-1.webp"
                  alt="Xưởng mộc Phát Lộc hiện đại"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="w-full h-44 md:h-52 overflow-hidden bg-black/10 border border-black/10">
                <img
                  src="/assets/workshop/workshop-2.webp"
                  alt="Máy CNC gia công chính xác"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="w-full h-44 md:h-52 overflow-hidden bg-black/10 border border-black/10">
                <img
                  src="/assets/workshop/workshop-5.webp"
                  alt="Thợ lành nghề Phát Lộc"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="w-full h-64 md:h-80 overflow-hidden bg-black/10 border border-black/10">
                <img
                  src="/assets/workshop/workshop-6.webp"
                  alt="Không gian hoàn thiện xuất xưởng"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Content & Value Propositions */}
          <div className="lg:col-span-6">
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] mb-2 block">
              NĂNG LỰC SẢN XUẤT NỘI BỘ
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] uppercase leading-[1.22] md:leading-[1.2] mb-6">
              XƯỞNG GỖ NỘI THẤT SẢN XUẤT TRỰC TIẾP.
            </h2>
            <p className="text-sm md:text-base text-[#525357] font-light leading-relaxed mb-8">
              Khác với những đơn vị chỉ làm thương mại thiết kế rồi thuê xưởng ngoài gia công, <strong>Nội thất Phát Lộc</strong> tự chủ 100% dây chuyền sản xuất đồ gỗ tại Biên Hòa, Đồng Nai. Nhờ đó, chúng tôi cam kết cung cấp <strong>nội thất giá xưởng, nội thất giá gốc</strong> chuẩn xác từng góc cạnh so với bản vẽ 3D với mức giá tốt nhất khu vực.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/10">
              {advantages.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#00D0E8]/15 flex items-center justify-center text-[#00A8BC]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-heading text-sm font-bold text-[#141414]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#55565B] font-light leading-relaxed pl-9">
                      {item.desc}
                    </p>
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
