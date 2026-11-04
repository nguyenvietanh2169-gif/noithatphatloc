import { CustomerAlbum } from '../types/album';

export const INITIAL_CUSTOMER_ALBUMS: CustomerAlbum[] = [
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
