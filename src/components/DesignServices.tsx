import React from 'react';
import { Compass, Hammer, Layers, Tv, ChefHat, Building2 } from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'thiet-ke-noi-that-dong-nai',
    number: '01',
    title: 'THIẾT KẾ NỘI THẤT ĐỒNG NAI',
    subTitle: 'KHẢO SÁT TẬN NƠI & PHỐI CẢNH 3D CHI TIẾT',
    description: 'Tư vấn chuyên sâu, khảo sát hiện trạng công trình trực tiếp tại các huyện thị Đồng Nai. Lên layout mặt bằng công năng và dựng phối cảnh 3D sống động theo đúng ngân sách.',
    image: '/assets/projects/project-3d-1.webp',
    features: ['Khảo sát hiện trạng tận nơi', 'Bản vẽ phối cảnh 3D chân thực', 'Hồ sơ kỹ thuật thi công 2D bóc tách'],
    icon: Compass,
  },
  {
    id: 'thi-cong-noi-that-bien-hoa',
    number: '02',
    title: 'THI CÔNG NỘI THẤT BIÊN HÒA',
    subTitle: 'TRỌN GÓI TRỰC TIẾP TẠI XƯỞNG KHÔNG TRUNG GIAN',
    description: 'Thi công trọn gói cho biệt thự, nhà phố, chung cư tại Biên Hòa. Tự chủ 100% từ xưởng sản xuất, bàn giao chuẩn xác từng milimet so với bản vẽ, tối ưu 20-30% chi phí.',
    image: '/assets/workshop/workshop-1.webp',
    features: ['Tiết kiệm 20-30% phí trung gian', 'Đội ngũ thợ xưởng tay nghề cao', 'Bàn giao đúng hạn, bọc lót tinh tươm'],
    icon: Hammer,
  },
  {
    id: 'tu-bep-mdf',
    number: '03',
    title: 'THI CÔNG TỦ BẾP MDF CHỐNG ẨM',
    subTitle: 'CÁNH ACRYLIC NOLINE & THÙNG CHỐNG NƯỚC',
    description: 'Chuyên sản xuất tủ bếp chữ I, L, U kịch trần. Thùng gỗ MDF lõi xanh chống ẩm An Cường hoặc nhựa Picomat chống nước tuyệt đối, cánh phủ Acrylic bóng gương dán cạnh không đường line.',
    image: '/assets/projects/project-3d-3.webp',
    features: ['MDF lõi xanh chống ẩm cao cấp', 'Cánh Acrylic noline & Melamine', 'Thùng chậu rửa Picomat chống nước 100%'],
    icon: ChefHat,
  },
  {
    id: 'tu-ao-canh-kinh',
    number: '04',
    title: 'TỦ ÁO CÁNH KÍNH & TỦ KỊCH TRẦN',
    subTitle: 'KHUNG NHÔM SLIM ANODE & ĐÈN LED CẢM BIẾN',
    description: 'Thiết kế tủ quần áo may đo kịch trần tối ưu không gian lưu trữ. Hệ cánh kính cường lực khung nhôm Slim xám khói, tích hợp ray LED âm tủ và phụ kiện ray trượt giảm chấn êm ái.',
    image: '/assets/projects/project-3d-4.webp',
    features: ['Khung nhôm Slim Anode xám khói', 'Kính cường lực an toàn chống xước', 'Đèn LED cảm biến vẫy tay thông minh'],
    icon: Layers,
  },
  {
    id: 'vach-tivi',
    number: '05',
    title: 'VÁCH TIVI LAM SÓNG & THAN TRE',
    subTitle: 'ĐIỂM NHẤN SANG TRỌNG CHO PHÒNG KHÁCH',
    description: 'Thi công vách tivi hiện đại kết hợp tấm ốp sợi than tre đa năng, lam sóng nghệ thuật, đá thiêu kết vân mây tự nhiên và hệ thống đèn LED hắt đa tầng tạo chiều sâu không gian.',
    image: '/assets/projects/project-3d-13.webp',
    features: ['Tấm ốp than tre chống cháy & chống ẩm', 'Lam sóng vân gỗ sắc nét', 'Đá thiêu kết vân mây & LED hắt giấu mí'],
    icon: Tv,
  },
  {
    id: 'tong-the-cong-trinh',
    number: '06',
    title: 'NỘI THẤT GỖ MAY ĐO TẠI XƯỞNG',
    subTitle: 'DÀN MÁY CNC & BẢO HÀNH 5 NĂM',
    description: 'Gia công toàn bộ hệ giường ngủ, bàn làm việc, tủ giày, tủ rượu, bàn trang điểm đồng bộ chất liệu và tone màu. Cam kết chứng chỉ nguồn gốc gỗ minh bạch và bảo hành dài hạn.',
    image: '/assets/workshop/workshop-6.webp',
    features: ['Máy CNC cắt mộng chuẩn xác milimet', 'Keo dán nhiệt PUR kháng ẩm bền bỉ', 'Bảo hành kết cấu 5 năm'],
    icon: Building2,
  },
];

export const DesignServices: React.FC = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-[#F8F7F4] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-black/10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] mb-2 block font-mono-num">
              DỊCH VỤ SẢN XUẤT & THI CÔNG TRỰC TIẾP
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] uppercase leading-[1.2]">
              DỊCH VỤ NỘI THẤT PHÁT LỘC.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#686762] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Chuyên sâu thiết kế nội thất tại Đồng Nai và thi công trực tiếp tại Biên Hòa: tủ bếp MDF chống ẩm, tủ áo cánh kính, vách tivi hiện đại với giá gốc tại xưởng sản xuất.
          </p>
        </div>

        {/* Services Grid with 6 Balanced Cards (3 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                id={srv.id}
                className="group bg-white p-7 md:p-8 border border-black/10 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-black/30 rounded-xs"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-5 border-b border-black/8">
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
                  <div className="mt-6 mb-5">
                    <h3 className="font-heading text-lg md:text-xl font-bold tracking-tight text-[#141414] group-hover:text-[#00A8BC] transition-colors leading-tight">
                      {srv.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C8A84] block mt-1.5 font-mono-num">
                      {srv.subTitle}
                    </span>
                    <p className="text-xs sm:text-[13px] text-[#505156] mt-3 font-light leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  {/* Features Pill */}
                  <ul className="space-y-2 mb-6">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-[#2A2B2E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D0E8] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service Image with Crisp Zoom Effect */}
                <div className="relative w-full h-48 md:h-52 overflow-hidden mt-2 bg-[#EAE8E2] rounded-xs">
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
