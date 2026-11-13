import { CustomerAlbum } from '../types/album';

export const INITIAL_CUSTOMER_ALBUMS: CustomerAlbum[] = [
  // =========================================================================
  // 1. ALBUM CÔNG TRÌNH THỰC TẾ (REAL PROJECTS)
  // =========================================================================
  {
    id: 'album-dongnai-hung',
    customerName: 'Gia đình Chú Hùng',
    projectTitle: 'Hệ Tủ Bếp Chống Nước & Phòng Khách Tân Cổ Điển',
    location: 'Biên Hòa, Đồng Nai',
    completedDate: 'Tháng 11/2024',
    coverImage: '/assets/real-projects/real-6.webp',
    categories: ['Tủ Bếp', 'Phòng Khách', 'Vách Tivi'],
    albumType: 'real',
    materialNotes: 'Thùng Nhựa Picomat Chống Nước 100% • Cánh Phủ Acrylic Bóng Gương Không Đường Line',
    testimonial: 'Nhà gần xưởng nên ghé xem gỗ trực tiếp trước khi làm. Phát Lộc làm đúng loại gỗ cam kết, bảo hành chu đáo.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    photos: [
      {
        id: 'p-10',
        url: '/assets/real-projects/real-6.webp',
        caption: 'Hệ tủ bếp phủ Acrylic bóng gương sáng bóng, chống bám dầu mỡ',
      },
      {
        id: 'p-11',
        url: '/assets/real-projects/real-8.webp',
        caption: 'Kệ tivi phòng khách treo tường kết hợp vách lam sóng trang trí',
      },
      {
        id: 'p-12',
        url: '/assets/real-projects/real-10.webp',
        caption: 'Tủ giày kết hợp ghế ngồi thay giày tại sảnh bước vào nhà',
      },
      {
        id: 'p-13',
        url: '/assets/real-projects/real-17.webp',
        caption: 'Góc tủ rượu và quầy bar nhỏ phân cách phòng khách với phòng ăn',
      },
    ],
  },
  {
    id: 'album-bienhoa-tuan',
    customerName: 'Gia đình Anh Tuấn',
    projectTitle: 'Hoàn Thiện Trọn Gói Nhà Phố Biên Hòa 3 Tầng',
    location: 'Tam Hiệp, Biên Hòa',
    completedDate: 'Tháng 12/2024',
    coverImage: '/assets/real-projects/real-2.webp',
    categories: ['Tủ Bếp & Đảo Bếp', 'Tủ Quần Áo', 'Kệ Tivi'],
    albumType: 'real',
    materialNotes: 'MDF Lõi Xanh Chống Ẩm An Cường Phủ Melamine • Cánh Kính Khung Nhôm Slim Đèn LED',
    testimonial: 'Thi công sắc nét, bàn giao đúng tiến độ trước Tết. Đội ngũ thợ của xưởng nội thất Phát Lộc rất nhiệt tình và chu đáo.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    photos: [
      {
        id: 'p-20',
        url: '/assets/real-projects/real-2.webp',
        caption: 'Hệ tủ bếp kết hợp bàn đảo và tủ rượu cánh kính đèn LED sang trọng',
      },
      {
        id: 'p-21',
        url: '/assets/real-projects/real-19.webp',
        caption: 'Tủ quần áo kịch trần thùng gỗ melamine phối cánh trắng & kệ góc cong CNC',
      },
      {
        id: 'p-22',
        url: '/assets/real-projects/real-28.webp',
        caption: 'Phòng ngủ master với combo giường bọc nệm và tủ áo kịch trần đèn LED',
      },
      {
        id: 'p-23',
        url: '/assets/real-projects/real-33.webp',
        caption: 'Hệ vách kệ tivi gỗ bo cong đèn LED và tủ trang trí kịch trần',
      },
      {
        id: 'p-24',
        url: '/assets/real-projects/real-20.webp',
        caption: 'Không gian bếp Acrylic bóng gương kịch trần mở rộng tầm nhìn',
      },
    ],
  },
  {
    id: 'album-phuong-vinhomes',
    customerName: 'Chị Mai Phương',
    projectTitle: 'Nội Thất May Đo Căn Hộ 3 Phòng Ngủ Vinhomes',
    location: 'Quận 9, TP.HCM',
    completedDate: 'Tháng 01/2025',
    coverImage: '/assets/real-projects/real-12.webp',
    categories: ['Phòng Khách', 'Tủ Rượu Cánh Kính', 'Phòng Làm Việc'],
    albumType: 'real',
    materialNotes: 'MDF Phủ Melamine Chống Trầy Xước • Khung Nhôm Anode Xám Khói Nhập Khẩu',
    testimonial: 'Giá xưởng trực tiếp rẻ hơn các công ty thiết kế trung gian 25-30% mà chất lượng hoàn thiện sắc sảo từng góc cạnh.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
    photos: [
      {
        id: 'p-30',
        url: '/assets/real-projects/real-12.webp',
        caption: 'Tủ rượu cánh kính khung nhôm đèn LED âm đợt vân gỗ óc chó cao cấp',
      },
      {
        id: 'p-31',
        url: '/assets/real-projects/real-18.webp',
        caption: 'Bàn làm việc đôi may đo liền hệ giá sách kịch trần tích hợp LED',
      },
      {
        id: 'p-32',
        url: '/assets/real-projects/real-21.webp',
        caption: 'Hệ tủ áo cánh kính phản quang kết hợp đèn cảm ứng chuyển động',
      },
      {
        id: 'p-33',
        url: '/assets/real-projects/real-22.webp',
        caption: 'Vách ốp đầu giường bọc da êm ái kết hợp lam gỗ trang trí',
      },
    ],
  },

  // =========================================================================
  // 2. ALBUM BẢN VẼ 3D NỘI THẤT (3D DESIGNS)
  // =========================================================================
  {
    id: 'album-3d-waterfront-villa',
    customerName: 'Biệt Thự Đơn Lập Aqua City',
    projectTitle: 'Phối Cảnh 3D Biệt Thự Waterfront Biên Hòa — Hiện Đại Luxury',
    location: 'Long Hưng, Biên Hòa',
    completedDate: 'Bản vẽ 3D 2025',
    coverImage: '/assets/projects/project-3d-4.webp',
    categories: ['Bản Vẽ 3D', 'Biệt Thự', 'Tủ Áo Cánh Kính', 'Phòng Khách'],
    albumType: '3d',
    materialNotes: 'Cốt gỗ MDF lõi xanh chống ẩm An Cường, cánh kính khung nhôm anode xám khói, đá nung kết & đèn LED âm tủ 3000K.',
    testimonial: 'Bản vẽ 3D bóc tách chi tiết kỹ thuật chuẩn xác, thi công thực tế tại xưởng cam kết giống 98% phối cảnh render.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    photos: [
      {
        id: 'p-3d-4',
        url: '/assets/projects/project-3d-4.webp',
        caption: 'Hệ tủ áo cánh kính khung nhôm đèn LED thùng gỗ An Cường',
      },
      {
        id: 'p-3d-8',
        url: '/assets/projects/project-3d-8.webp',
        caption: 'Phòng khách thông tầng phong cách hiện đại với vách ốp đá & lam gỗ',
      },
      {
        id: 'p-3d-11',
        url: '/assets/projects/project-3d-11.webp',
        caption: 'Không gian phòng ngủ master với hệ tủ áo chữ L cánh kính tràn viền',
      },
      {
        id: 'p-3d-18',
        url: '/assets/projects/project-3d-18.webp',
        caption: 'Bàn trang điểm treo tường bo cong mềm mại kết hợp gương LED cảm ứng',
      },
      {
        id: 'p-3d-27',
        url: '/assets/projects/project-3d-27.webp',
        caption: 'Hệ tủ rượu cánh kính cao cấp kết hợp vách lam gỗ trang trí phòng khách',
      },
      {
        id: 'p-3d-14',
        url: '/assets/projects/project-3d-14.webp',
        caption: 'Tủ quần áo cánh kính góc L tối ưu diện tích phòng thay đồ biệt thự',
      },
    ],
  },
  {
    id: 'album-3d-penthouse-swanbay',
    customerName: 'Penthouse The Peak Swanbay',
    projectTitle: 'Thiết Kế 3D Căn Hộ Penthouse — Tone Gỗ Trầm & Kính Khói',
    location: 'Đảo Đại Phước, Nhơn Trạch',
    completedDate: 'Bản vẽ 3D 2025',
    coverImage: '/assets/projects/project-3d-1.webp',
    categories: ['Bản Vẽ 3D', 'Căn Hộ', 'Phòng Bếp', 'Phòng Khách'],
    albumType: '3d',
    materialNotes: 'Gỗ MDF phủ Melamine cao cấp vân óc chó sẫm màu, nẹp kim loại mạ PVD vàng đồng và kính cường lực chống chói.',
    testimonial: 'Phối cảnh 3D trực quan giúp chủ nhà hình dung toàn diện tỷ lệ ánh sáng, công năng tủ kệ và chất liệu hoàn thiện.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    photos: [
      {
        id: 'p-3d-1',
        url: '/assets/projects/project-3d-1.webp',
        caption: 'Phối cảnh tổng thể phòng khách và bếp liên hoàn căn hộ Penthouse',
      },
      {
        id: 'p-3d-2',
        url: '/assets/projects/project-3d-2.webp',
        caption: 'Hệ vách tivi ốp tấm than tre kết hợp lò sưởi hơi nước 3D thẩm mỹ',
      },
      {
        id: 'p-3d-3',
        url: '/assets/projects/project-3d-3.webp',
        caption: 'Khu vực quầy bar và tủ lưu trữ rượu cao cấp kịch trần',
      },
      {
        id: 'p-3d-5',
        url: '/assets/projects/project-3d-5.webp',
        caption: 'Kệ trang trí âm tường phòng khách tích hợp ray LED chiếu sáng mềm mại',
      },
      {
        id: 'p-3d-6',
        url: '/assets/projects/project-3d-6.webp',
        caption: 'Góc thư giãn cạnh cửa kính ban công ngắm trọn cảnh quan sông Đồng Nai',
      },
    ],
  },
  {
    id: 'album-3d-walkin-closet',
    customerName: 'Phòng Thay Đồ Walk-in Closet',
    projectTitle: 'Bộ Sưu Tập 3D Tủ Áo Cánh Kính Khung Nhôm & Phòng Thay Đồ',
    location: 'Biên Hòa, Đồng Nai',
    completedDate: 'Bản vẽ 3D 2025',
    coverImage: '/assets/projects/project-3d-15.webp',
    categories: ['Bản Vẽ 3D', 'Tủ Áo Cánh Kính', 'Phòng Ngủ'],
    albumType: '3d',
    materialNotes: 'Khung nhôm Slim Anode xám khói, kính cường lực 5mm, đợt kệ bọc da simili cao cấp, cảm biến mở cánh tự bật đèn.',
    testimonial: 'Giải pháp tủ áo cánh kính chuẩn tỷ lệ may đo, tối ưu công năng để túi xách, đồng hồ và trang phục sang trọng.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    photos: [
      {
        id: 'p-3d-15',
        url: '/assets/projects/project-3d-15.webp',
        caption: 'Phối cảnh phòng thay đồ chữ U với đảo phụ kiện đặt giữa phòng',
      },
      {
        id: 'p-3d-13',
        url: '/assets/projects/project-3d-13.webp',
        caption: 'Hệ tủ áo cánh kính màu trà chống tia UV bảo vệ trang phục cao cấp',
      },
      {
        id: 'p-3d-16',
        url: '/assets/projects/project-3d-16.webp',
        caption: 'Đảo phụ kiện trang sức bọc nỉ êm ái mặt kính trong suốt',
      },
      {
        id: 'p-3d-17',
        url: '/assets/projects/project-3d-17.webp',
        caption: 'Chi tiết bản lề âm mộc và ray trượt giảm chấn chuẩn xưởng',
      },
      {
        id: 'p-3d-10',
        url: '/assets/projects/project-3d-10.webp',
        caption: 'Góc tủ giày và tủ trưng bày nón mũ phối đèn LED hắt khe ấm áp',
      },
    ],
  },
  {
    id: 'album-3d-kitchen-modern',
    customerName: 'Bếp Đảo Phong Cách Bắc Âu',
    projectTitle: 'Phối Cảnh 3D Tủ Bếp Thùng Picomat & Bàn Đảo Đa Năng',
    location: 'TP. Hồ Chí Minh',
    completedDate: 'Bản vẽ 3D 2025',
    coverImage: '/assets/projects/project-3d-21.webp',
    categories: ['Bản Vẽ 3D', 'Phòng Bếp', 'Tủ Bếp'],
    albumType: '3d',
    materialNotes: 'Thùng tủ nhựa Picomat chống nước 100%, cánh phủ Acrylic bóng gương noline, mặt đá nung kết Vicostone chống ố vàng.',
    testimonial: 'Mặt bằng công năng bếp được bố trí theo tam giác vàng thao tác nấu nướng cực kỳ khoa học và tiện lợi.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    photos: [
      {
        id: 'p-3d-21',
        url: '/assets/projects/project-3d-21.webp',
        caption: 'Phối cảnh tổng thể hệ tủ bếp chữ L có bàn đảo kết hợp bàn ăn 6 ghế',
      },
      {
        id: 'p-3d-20',
        url: '/assets/projects/project-3d-20.webp',
        caption: 'Hệ tủ kho đồ khô thông minh 6 tầng và khoang tủ lạnh Side-by-side',
      },
      {
        id: 'p-3d-22',
        url: '/assets/projects/project-3d-22.webp',
        caption: 'Bàn đảo bếp ốp đá vân mây tích hợp chậu rửa âm và ổ cắm điện âm bàn',
      },
      {
        id: 'p-3d-23',
        url: '/assets/projects/project-3d-23.webp',
        caption: 'Chi tiết khoang hút mùi và giá bát nâng hạ tay nâng đôi Blum',
      },
      {
        id: 'p-3d-24',
        url: '/assets/projects/project-3d-24.webp',
        caption: 'Đèn LED thanh ray nam châm thả trần tạo điểm nhấn ấm cúng cho phòng ăn',
      },
    ],
  },
  {
    id: 'album-3d-living-wall',
    customerName: 'Nhà Phố Hiện Đại Tam Hiệp',
    projectTitle: 'Thiết Kế 3D Vách Nan Gỗ CNC & Hệ Tủ Kệ Tivi Âm Tường',
    location: 'Tam Hiệp, Biên Hòa',
    completedDate: 'Bản vẽ 3D 2025',
    coverImage: '/assets/projects/project-3d-28.webp',
    categories: ['Bản Vẽ 3D', 'Phòng Khách', 'Vách Tivi'],
    albumType: '3d',
    materialNotes: 'Lam gỗ nhựa composite kết hợp nẹp inox vàng gương 304, tủ kệ tivi treo MDF kháng ẩm An Cường.',
    testimonial: 'Thiết kế tinh gọn, giấu trọn toàn bộ dây điện và thiết bị âm thanh tạo không gian phòng khách gọn gàng và thoáng đãng.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
    photos: [
      {
        id: 'p-3d-28',
        url: '/assets/projects/project-3d-28.webp',
        caption: 'Hệ vách tivi lam gỗ nan nhỏ phối tấm ốp vân đá cẩm thạch sang trọng',
      },
      {
        id: 'p-3d-29',
        url: '/assets/projects/project-3d-29.webp',
        caption: 'Kệ tivi treo không chân bo tròn góc an toàn cho trẻ nhỏ',
      },
      {
        id: 'p-3d-30',
        url: '/assets/projects/project-3d-30.webp',
        caption: 'Vách ngăn cầu thang bằng lam gỗ CNC kết hợp tủ để giày dép và mũ bảo hiểm',
      },
      {
        id: 'p-3d-25',
        url: '/assets/projects/project-3d-25.webp',
        caption: 'Phối cảnh góc nhìn từ cửa chính hướng vào phòng khách đón ánh sáng',
      },
      {
        id: 'p-3d-26',
        url: '/assets/projects/project-3d-26.webp',
        caption: 'Trần thạch cao giật cấp hắt ánh sáng vàng nắng ấm áp',
      },
    ],
  },
];
