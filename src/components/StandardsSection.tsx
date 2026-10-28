import React from 'react';

export const StandardsSection: React.FC = () => {
  const standards = [
    {
      number: '01',
      title: 'Chính xác, có tốc độ',
      badge: 'Công nghệ CNC • Đúng tiến độ',
      desc: 'Bóc tách bản vẽ và gia công máy CNC chính xác từng milimet, khớp nối khít khao giấu mí. Quy trình sản xuất kỷ luật đảm bảo tiến độ bàn giao đúng hẹn tuyệt đối.',
    },
    {
      number: '02',
      title: 'Sự sạch sẽ',
      badge: 'Bọc lót chống xước • Không gian tinh tươm',
      desc: 'Khu vực thi công được che chắn, bọc lót chống trầy cẩn thận. Đội ngũ thợ dọn dẹp hút bụi sạch sẽ mỗi ngày và bàn giao công trình tinh tươm, gia chủ có thể vào ở ngay.',
    },
    {
      number: '03',
      title: 'Sự thân thiện, tận tâm',
      badge: 'Tư vấn trung thực • Hết lòng vì khách',
      desc: 'Tư vấn thật lòng về vật liệu và giải pháp tối ưu chi phí. Đội ngũ Phát Lộc luôn coi ngôi nhà của khách hàng như tổ ấm của chính mình, chu đáo và nhiệt thành từ tâm.',
    },
    {
      number: '04',
      title: 'Quan trọng từng chi tiết nhỏ',
      badge: 'Mí dán không lộ keo • Ray trượt êm mượt',
      desc: 'Chăm chút tỉ mỉ từng mét chỉ nẹp dán nhiệt không tì vết, khe hở cánh tủ đều tăm tắp, ray ngăn kéo trượt êm mượt và bản lề giảm chấn vận hành hoàn hảo qua năm tháng.',
    },
    {
      number: '05',
      title: 'Mọi thứ chỉnh chu, tỉ mỉ',
      badge: 'Lắp ráp thử tại xưởng • Kiểm định nghiêm ngặt',
      desc: 'Tất cả sản phẩm nội thất đều được lắp ráp thử và căn chỉnh kỹ lưỡng 100% tại xưởng trước khi xuất kho, đảm bảo không có bất kỳ sai sót nào khi lên công trình.',
    },
    {
      number: '06',
      title: 'An tâm dịch vụ',
      badge: 'Bảo hành 5 năm • Hỗ trợ kỹ thuật 24h',
      desc: 'Chính sách bảo hành kết cấu 5 năm, xử lý phát sinh nhanh chóng trong 24h và đồng hành bảo trì định kỳ trọn đời, mang đến sự an tâm tuyệt đối cho mọi gia chủ.',
    },
  ];

  return (
    <section id="standards" className="py-20 md:py-28 bg-[#121214] text-white relative overflow-hidden border-b border-white/10">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D0E8]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header - Đồng bộ phong cách các hạng mục khác */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 pb-8 border-b border-white/10 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] mb-2 block font-mono-num">
              QUY CHUẨN THI CÔNG & HOÀN THIỆN
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-[1.2]">
              TIÊU CHUẨN PHÁT LỘC.
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/80 font-light leading-relaxed">
              6 nguyên tắc cốt lõi định hình chất lượng gia công và chuẩn mực phục vụ trong từng không gian sống.
            </p>
          </div>

          <p className="text-xs md:text-sm text-white/60 max-w-md font-light leading-relaxed">
            Mỗi sản phẩm xuất xưởng và từng mét vuông hoàn thiện đều phải thỏa mãn nghiêm ngặt 6 tiêu chuẩn cốt lõi — cam kết danh dự của đội ngũ <strong>Nội thất Phát Lộc</strong>.
          </p>
        </div>

        {/* 6 Standards Grid - Tối giản không icon, bo tròn nhẹ các góc dịu mắt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standards.map((item) => (
            <div
              key={item.number}
              className="group relative bg-[#18181B] hover:bg-[#1E1E22] border border-white/10 hover:border-[#00D0E8]/40 p-7 md:p-8 flex flex-col justify-between transition-all duration-300 rounded-2xl shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D0E8]/0 to-transparent group-hover:via-[#00D0E8] transition-all duration-500" />

              <div>
                {/* Card Header: Number only */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="font-mono-num text-3xl md:text-4xl font-light text-white/30 group-hover:text-[#00D0E8] transition-colors">
                    {item.number}
                  </span>
                </div>

                {/* Standard Title */}
                <h3 className="font-heading text-lg md:text-xl font-bold text-white uppercase mb-3 leading-snug group-hover:text-[#00D0E8] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-[13px] text-white/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Badge */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] md:text-[10.5px] uppercase font-mono-num text-white/50 tracking-wider">
                  {item.badge}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D0E8] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
