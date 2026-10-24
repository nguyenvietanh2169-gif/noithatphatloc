import React from 'react';
import { ArrowUpRight, Compass, Hammer, Layers, Lightbulb } from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  engTitle: string;
  description: string;
  image: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'design',
    number: '01',
    title: 'THIẾT KẾ NỘI THẤT 3D KIẾN TRÚC',
    engTitle: 'KHÔNG GIAN SỐNG TINH TẾ & HIỆN ĐẠI',
    description: 'Nghiên cứu công năng, mặt bằng bố trí và dựng phối cảnh 3D sống động theo đúng gu thẩm mỹ và ngân sách của gia chủ.',
    image: '/assets/projects/project-3d-1.webp',
    features: ['Khảo sát hiện trạng chi tiết', 'Phối cảnh 3D độ phân giải cao', 'Bản vẽ kỹ thuật thi công 2D'],
    icon: Compass,
  },
  {
    id: 'millwork',
    number: '02',
    title: 'SẢN XUẤT ĐỒ GỖ TRỰC TIẾP TẠI XƯỞNG',
    engTitle: 'GIA CÔNG ĐỒ GỖ TRỰC TIẾP TẠI XƯỞNG',
    description: 'Sở hữu nhà xưởng quy mô với dàn máy cắt CNC tự động, máy dán cạnh PUR không đường line và buồng sơn chuẩn công nghiệp.',
    image: '/assets/workshop/workshop-1.webp',
    features: ['Gỗ MDF lõi xanh chống ẩm cao cấp', 'Cánh kính khung nhôm Slim siêu mỏng', 'Phụ kiện ray trượt giảm chấn cao cấp'],
    icon: Layers,
  },
  {
    id: 'lighting',
    number: '03',
    title: 'GIẢI PHÁP VẬT LIỆU & ÁNH SÁNG',
    engTitle: 'TỔNG HÒA VẬT LIỆU CAO CẤP & ÁNH SÁNG',
    description: 'Tư vấn sử dụng tấm ốp than tre, lam sóng nghệ thuật, đá thiêu kết vân mây kết hợp hệ thống LED hắt đa tầng.',
    image: '/assets/projects/project-3d-3.webp',
    features: ['Ốp than tre nano chống cháy', 'Hệ LED định hình kiến trúc', 'Đá nhân tạo chống trầy ố'],
    icon: Lightbulb,
  },
];

export const DesignServices: React.FC = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-[#F8F7F4] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] mb-2 block">
              DỊCH VỤ CHUYÊN NGHIỆP
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] uppercase leading-[1.2]">
              DỊCH VỤ THIẾT KẾ & THI CÔNG.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#686762] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Quy trình khép kín từ bản vẽ ý tưởng đến xưởng chế tác trực tiếp giúp tiết kiệm đến 20-30% chi phí trung gian cho khách hàng.
          </p>
        </div>

        {/* Services Grid with 3 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group bg-white p-8 md:p-10 border border-black/10 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-black/30"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-black/8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00D0E8]/15 flex items-center justify-center text-[#00A8BC]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono-num text-xs tracking-widest text-[#84827D]">
                        {srv.number}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono-num text-[#84827D]">
                      NỘI THẤT PHÁT LỘC
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="mt-8 mb-6">
                    <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-[#141414] group-hover:text-[#00A8BC] transition-colors leading-tight">
                      {srv.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C8A84] block mt-1">
                      {srv.engTitle}
                    </span>
                    <p className="text-sm text-[#505156] mt-4 font-light leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  {/* Features Pill */}
                  <ul className="space-y-2 mb-8">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-[#2A2B2E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D0E8]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service Image with Crisp Zoom Effect */}
                <div className="relative w-full h-56 md:h-64 overflow-hidden mt-2 bg-[#EAE8E2]">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
