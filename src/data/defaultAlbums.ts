import { CustomerAlbum } from '../types/album';

export const INITIAL_CUSTOMER_ALBUMS: CustomerAlbum[] = [
  {
    id: 'album-lovera-minh',
    customerName: 'Gia đình Anh Minh & Chị Thảo',
    projectTitle: 'Thi Công Hoàn Thiện Trọn Gói Biệt Thự Phố Hiện Đại',
    location: 'Bình Chánh, TP.HCM',
    completedDate: 'Tháng 10/2024',
    coverImage: '/assets/real-projects/real-2.webp',
    categories: ['Tủ Bếp', 'Đảo Bếp', 'Phòng Khách', 'Tủ Rượu'],
    materialNotes: 'MDF Lõi Xanh Chống Ẩm An Cường • Cánh Kính Cường Lực Slim • Mặt Đá Trắng Vân Mây Kháng Ố',
    testimonial: 'Đội ngũ thợ Phát Lộc thi công rất tỉ mỉ, các đường ghép mòi và chỉ viền sắc nét. Đúng tiến độ bàn giao trước ngày tân gia.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    photos: [
      {
        id: 'p-1',
        url: '/assets/real-projects/real-2.webp',
        caption: 'Hệ tủ bếp chữ L tích hợp đảo bếp và tủ rượu cánh kính đèn LED sang trọng',
      },
      {
        id: 'p-2',
        url: '/assets/real-projects/real-12.webp',
        caption: 'Tủ rượu cánh kính khung nhôm Anode xám khói, ray LED âm đợt',
      },
      {
        id: 'p-3',
        url: '/assets/real-projects/real-1.webp',
        caption: 'Không gian phòng khách hiện đại, vách trang trí ốp nan gỗ kết hợp tủ kệ âm',
      },
      {
        id: 'p-4',
        url: '/assets/real-projects/real-24.webp',
        caption: 'Chi tiết hoàn thiện bản lề Hafele và ray giảm chấn trơn tru',
      },
      {
        id: 'p-5',
        url: '/assets/real-projects/real-27.webp',
        caption: 'Toàn cảnh góc bếp và đảo bếp bàn giao sau khi vệ sinh công nghiệp',
      },
    ],
  },
  {
    id: 'album-vinhomes-tuan',
    customerName: 'Anh Tuấn - Căn Hộ 3PN Masteri',
    projectTitle: 'Gói Nội Thất May Đo Full Căn Phong Cách Dark Luxury',
    location: 'Quận 9, TP.HCM',
    completedDate: 'Tháng 09/2024',
    coverImage: '/assets/real-projects/real-19.webp',
    categories: ['Tủ Quần Áo', 'Phòng Ngủ Master', 'Bàn Làm Việc'],
    materialNotes: 'Gỗ Công Nghiệp Vân Óc Chó Nhập Khẩu • Hệ Cánh Kính Tràn Viền • Đèn LED Cảm Biến Vẫy Tay',
    testimonial: 'Hệ tủ áo cánh kính làm rất chuẩn, cánh kính nhẹ tay mở êm. Rất ưng ý với sự tư vấn nhiệt tình của anh Lộc.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
    photos: [
      {
        id: 'p-6',
        url: '/assets/real-projects/real-19.webp',
        caption: 'Tủ quần áo kịch trần kết hợp khoang treo đồ và kệ bo góc trang trí',
      },
      {
        id: 'p-7',
        url: '/assets/real-projects/real-18.webp',
        caption: 'Bàn làm việc may đo góc vuông liền giá sách gỗ kịch trần đèn LED',
      },
      {
        id: 'p-8',
        url: '/assets/real-projects/real-11.webp',
        caption: 'Giường ngủ bọc nệm đầu giường tích hợp hộc kéo ray âm chứa đồ tiện lợi',
      },
      {
        id: 'p-9',
        url: '/assets/real-projects/real-15.webp',
        caption: 'Hệ tủ áo cánh kính góc L tối ưu diện tích phòng ngủ',
      },
    ],
  },
  {
    id: 'album-dongnai-hung',
    customerName: 'Gia đình Chú Hùng',
    projectTitle: 'Hệ Tủ Bếp Chống Nước & Phòng Khách Tân Cổ Điển',
    location: 'Biên Hòa, Đồng Nai',
    completedDate: 'Tháng 11/2024',
    coverImage: '/assets/real-projects/real-6.webp',
    categories: ['Tủ Bếp', 'Phòng Khách', 'Vách Tivi'],
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
];
