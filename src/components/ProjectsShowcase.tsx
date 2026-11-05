import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Box,
  MapPin,
  ArrowDown,
  Sparkles,
  LayoutGrid,
  ArrowUpRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import realPhotosData from '../data/realPhotos.json';

interface ProjectItem {
  id: string;
  title: string;
  category: 'real' | '3d';
  image: string;
  location: string;
  roomCategory: string;
  roomType: 'living' | 'bedroom' | 'kitchen' | 'wardrobe' | 'workshop' | 'wall';
  spec?: string;
  tags?: string[];
}

// 1. TOÀN BỘ ẢNH THỰC TẾ (100% Chụp tại công trình & xưởng sau khi hoàn thiện)
const REAL_PROJECTS: ProjectItem[] = realPhotosData.map((item, idx) => {
  let roomType: 'living' | 'bedroom' | 'kitchen' | 'wardrobe' | 'workshop' | 'wall' = 'living';
  let materialSpec = 'MDF lõi xanh chống ẩm An Cường • Phủ Melamine cao cấp';
  let hardware = 'Bản lề giảm chấn Hafele • Ray âm êm ái';
  
  if (item.category.includes('Bếp') || item.category.includes('Ăn')) {
    roomType = 'kitchen';
    materialSpec = 'Thùng chống nước Picomat / MDF lõi xanh • Mặt đá & Kính ốp';
    hardware = 'Ray âm Blum giảm chấn • Tay nâng đôi';
  } else if (item.category.includes('Tủ Áo') || item.category.includes('Quần Áo') || item.category.includes('Cánh Kính')) {
    roomType = 'wardrobe';
    materialSpec = 'Khung nhôm Slim Anode xám khói • Kính cường lực & LED âm';
    hardware = 'Bản lề cánh kính cao cấp • Cảm biến vẫy tay';
  } else if (item.category.includes('Ngủ') || item.category.includes('Giường') || item.category.includes('Làm Việc')) {
    roomType = 'bedroom';
    materialSpec = 'Gỗ MDF chống ẩm phủ Melamine vân óc chó / sồi tự nhiên';
    hardware = 'Phụ kiện liên kết âm mộc thẩm mỹ';
  } else if (item.category.includes('Lam') || item.category.includes('Vách') || item.category.includes('Than Tre')) {
    roomType = 'wall';
    materialSpec = 'Hệ vách nan gỗ CNC / vách than tre • Nẹp chỉ kim loại PVD';
    hardware = 'Xương trợ lực kiên cố';
  } else if (item.category.includes('Rượu') || item.category.includes('Kệ Tivi')) {
    roomType = 'living';
    materialSpec = 'Khung nhôm cánh kính cường lực • Thùng vân gỗ óc chó';
    hardware = 'Ray LED nhôm định hình hắt sáng âm đợt';
  }

  return {
    id: item.id,
    title: item.title,
    category: 'real',
    image: item.image,
    location: item.location,
    roomCategory: item.category,
    roomType,
    spec: materialSpec,
    tags: [
      `№ ${(idx + 1).toString().padStart(2, '0')}`,
      item.location,
      hardware.split('•')[0].trim()
    ],
  };
});

// 2. BỘ SƯU TẬP BẢN VẼ 3D (30 Mẫu phối cảnh nội thất gỗ may đo phong cách Fashion Editorial)
const PROJECTS_3D: ProjectItem[] = [
  {
    id: 'p-3d-4',
    title: 'Hệ Tủ Áo Cánh Kính Khung Nhôm Đèn LED Thùng Gỗ An Cường',
    category: '3d',
    roomCategory: 'Tủ Áo Cánh Kính',
    roomType: 'wardrobe',
    image: '/assets/projects/project-3d-4.webp',
    location: 'Đồng Nai',
    spec: 'Cốt gỗ MDF lõi xanh chống ẩm An Cường, cánh kính khung nhôm anode xám khói & đợt đèn LED âm tủ.',
    tags: ['MDF Lõi Xanh', 'Nhôm Anode Khói', 'LED Âm Tủ 3000K', 'Bespoke Fit'],
  },
  {
    id: 'p-3d-27',
    title: 'Hệ Tủ Rượu Cánh Kính Cao Cấp Kết Hợp Vách Lam Gỗ Trang Trí',
    category: '3d',
    roomCategory: 'Tủ Rượu & Lam Gỗ',
    roomType: 'living',
    image: '/assets/projects/project-3d-27.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Gỗ MDF phủ Melamine cao cấp, đợt để rượu chữ X & đèn LED thanh nhôm định hình.',
    tags: ['Melamine Cao Cấp', 'Lam Gỗ CNC', 'Kính Cường Lực', 'Luxury Bar'],
  },
  {
    id: 'p-3d-8',
    title: 'Hệ Tủ Áo Cánh Kính Bo Góc CNC Liền Bàn Phấn & Đợt Kệ Gỗ',
    category: '3d',
    roomCategory: 'Tủ Áo Cánh Kính',
    roomType: 'wardrobe',
    image: '/assets/projects/project-3d-8.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Góc bo cong CNC mềm mại, cánh kính khung nhôm xám khói & ray giảm chấn êm ái.',
    tags: ['Bo Cong CNC', 'Ray Giảm Chấn', 'Bàn Phấn Liền Khối', 'Haute Minimalist'],
  },
  {
    id: 'p-3d-3',
    title: 'Không Gian Tủ Bếp Kịch Trần & Đảo Bếp Gỗ Hiện Đại',
    category: '3d',
    roomCategory: 'Tủ Bếp & Bàn Đảo',
    roomType: 'kitchen',
    image: '/assets/projects/project-3d-3.webp',
    location: 'Bình Dương',
    spec: 'Tủ bếp gỗ kịch trần, trần nan gỗ & đợt kệ trang trí đèn LED định hình cao cấp.',
    tags: ['Chống Nước Picomat', 'Bàn Đảo Đa Năng', 'Kịch Trần 2.8m', 'Smart Kitchen'],
  },
  {
    id: 'p-3d-11',
    title: 'Combo Giường Ngủ Gỗ Hiện Đại & Tủ Áo Cánh Kính Kịch Trần',
    category: '3d',
    roomCategory: 'Phòng Ngủ Master',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-11.webp',
    location: 'Đồng Nai',
    spec: 'Giường gỗ khung gia cố chịu lực & tủ áo tích hợp kệ để túi xách đèn LED spotlight.',
    tags: ['Phòng Ngủ Master', 'Khung Giường Chịu Lực', 'Spotlight Kệ Túi', 'Tone Trầm'],
  },
  {
    id: 'p-3d-18',
    title: 'Hệ Bàn Làm Việc Đôi May Đo Liền Giá Sách Gỗ Kịch Trần Đèn LED',
    category: '3d',
    roomCategory: 'Bàn Làm Việc & Kệ Sách',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-18.webp',
    location: 'Đồng Nai',
    spec: 'Gỗ MDF chống ẩm, hệ đợt giá sách chịu lực may đo kịch trần tối ưu không gian.',
    tags: ['Bàn Làm Việc Đôi', 'Kệ Sách Kịch Trần', 'Đèn Hắt Âm', 'Studio Work'],
  },
  {
    id: 'p-3d-14',
    title: 'Hệ Tủ Áo Cánh Kính Kịch Trần Thùng Gỗ Phủ Melamine Chống Ẩm',
    category: '3d',
    roomCategory: 'Tủ Áo Cánh Kính',
    roomType: 'wardrobe',
    image: '/assets/projects/project-3d-14.webp',
    location: 'Biên Hòa',
    spec: 'Thùng gỗ MDF lõi xanh chống ẩm, kính cường lực xám khói chống trầy.',
    tags: ['Kính Cường Lực', 'MDF Lõi Xanh', 'Chống Trầy Xước', 'Full Height'],
  },
  {
    id: 'p-3d-1',
    title: 'Hệ Tủ Rượu Cánh Kính Đèn LED & Kệ Tivi Gỗ Phòng Khách',
    category: '3d',
    roomCategory: 'Tủ Rượu & Kệ Tivi',
    roomType: 'living',
    image: '/assets/projects/project-3d-1.webp',
    location: 'Biên Hòa, Đồng Nai',
    spec: 'Gỗ MDF chống ẩm vân trầm, hệ đợt trưng bày có ray đèn LED âm cao cấp.',
    tags: ['Kệ Tivi Liền Khối', 'Tủ Rượu Kính', 'Vân Gỗ Óc Chó', 'Living Concept'],
  },
  {
    id: 'p-3d-28',
    title: 'Hệ Tủ Bếp Chữ L Cánh Acrylic Không Đường Line & Bàn Ăn Gỗ',
    category: '3d',
    roomCategory: 'Tủ Bếp & Bàn Ăn',
    roomType: 'kitchen',
    image: '/assets/projects/project-3d-28.webp',
    location: 'Long Thành, Đồng Nai',
    spec: 'Thùng gỗ kháng ẩm, cánh Acrylic bóng gương dán cạnh nẹp không đường line.',
    tags: ['Acrylic Noline', 'Tủ Bếp Chữ L', 'Gỗ Kháng Ẩm', 'Bàn Ăn 6 Ghế'],
  },
  {
    id: 'p-3d-30',
    title: 'Hệ Tủ Bếp Hiện Đại Kèm Bàn Đảo Gỗ & Tủ Ly Kính Đèn LED',
    category: '3d',
    roomCategory: 'Tủ Bếp & Bàn Đảo',
    roomType: 'kitchen',
    image: '/assets/projects/project-3d-30.webp',
    location: 'Biên Hòa, Đồng Nai',
    spec: 'Đảo bếp thùng gỗ tiện ích kết hợp tủ ly chén cánh kính đèn LED âm tủ.',
    tags: ['Đảo Bếp Bar', 'Tủ Ly Đèn LED', 'Phụ Kiện Eurogold', 'Modern White'],
  },
  {
    id: 'p-3d-6',
    title: 'Giường Bay Khung Gỗ Chịu Lực & Vách Lam Gỗ Đầu Giường',
    category: '3d',
    roomCategory: 'Giường Ngủ & Vách Lam',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-6.webp',
    location: 'Biên Hòa',
    spec: 'Khung giường giấu chân chịu lực cao & vách lam gỗ nẹp LED hắt ấm cúng.',
    tags: ['Giường Bay Floating', 'Lam Gỗ Đầu Giường', 'LED Hắt Ẩn', 'Master Suite'],
  },
  {
    id: 'p-3d-13',
    title: 'Hệ Vách Kệ Tivi Lam Gỗ Liền Tủ Rượu Cánh Kính Sang Trọng',
    category: '3d',
    roomCategory: 'Kệ Tivi & Tủ Rượu',
    roomType: 'living',
    image: '/assets/projects/project-3d-13.webp',
    location: 'Long Thành, Đồng Nai',
    spec: 'Hệ lam gỗ trang trí liền khối tủ rượu kính đèn LED định hình cao cấp.',
    tags: ['Vách Lam Gỗ Liền Tủ', 'Đèn Định Hình', 'Sang Trọng', 'Tối Ưu Góc Nhìn'],
  },
  {
    id: 'p-3d-2',
    title: 'Hệ Tủ Kệ Tivi Gỗ Treo Tường Tích Hợp Đèn LED Âm Hiện Đại',
    category: '3d',
    roomCategory: 'Kệ Tivi Gỗ',
    roomType: 'living',
    image: '/assets/projects/project-3d-2.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Gỗ MDF lõi xanh chống ẩm An Cường, kệ treo giấu vít thẩm mỹ cao.',
    tags: ['Treo Tường Giấu Vít', 'MDF An Cường', 'Gọn Gàng', 'Living Mood'],
  },
  {
    id: 'p-3d-7',
    title: 'Combo Giường Ngủ Gỗ Master Liền Kề Tủ Áo & Bàn Trang Điểm',
    category: '3d',
    roomCategory: 'Phòng Ngủ Master',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-7.webp',
    location: 'Đồng Nai',
    spec: 'Hệ module gỗ liên hoàn tối ưu diện tích phòng ngủ theo chuẩn nhân trắc học.',
    tags: ['Module Liên Hoàn', 'Chuẩn Nhân Trắc', 'Tone Màu Ấm', 'Bespoke Bedroom'],
  },
  {
    id: 'p-3d-10',
    title: 'Giường Ngủ Gỗ MDF Vân Óc Chó & Vách Lam Gỗ Đầu Giường',
    category: '3d',
    roomCategory: 'Giường Ngủ & Vách Lam',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-10.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Gỗ công nghiệp vân óc chó sang trọng & vách lam gỗ trang trí sắc nét.',
    tags: ['Vân Óc Chó Walnut', 'Vách Đầu Giường', 'Gỗ Lõi Xanh', 'Elegance'],
  },
  {
    id: 'p-3d-12',
    title: 'Bàn Trang Điểm Treo Tường Bo Góc Gỗ MDF Liền Hệ Tủ',
    category: '3d',
    roomCategory: 'Bàn Trang Điểm',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-12.webp',
    location: 'Bình Dương',
    spec: 'Mặt bàn gỗ bo cong an toàn, ngăn kéo ray bi 3 tầng mở êm nhẹ nhàng.',
    tags: ['Bo Cong An Toàn', 'Ray Mở Toàn Phần', 'Gỗ Chống Ẩm', 'Vanity Table'],
  },
  {
    id: 'p-3d-15',
    title: 'Bàn Trang Điểm Gỗ Óc Chó May Đo Liền Khối Hệ Tủ Áo',
    category: '3d',
    roomCategory: 'Bàn Trang Điểm',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-15.webp',
    location: 'Đồng Nai',
    spec: 'Thiết kế liền mạch may đo chuẩn kích thước phòng, vân gỗ ấm cúng.',
    tags: ['Liền Khối Hệ Tủ', 'Vân Gỗ Tự Nhiên', 'May Đo Chuẩn Xác', 'Chic'],
  },
  {
    id: 'p-3d-16',
    title: 'Bàn Trang Điểm Gỗ Đón Sáng Tự Nhiên & Kệ Đợt Gỗ Đèn LED',
    category: '3d',
    roomCategory: 'Bàn Trang Điểm',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-16.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Hệ đợt gỗ trưng bày có ray đèn LED âm hắt sáng tinh tế.',
    tags: ['Đón Sáng Cửa Sổ', 'Kệ Đợt Trang Điểm', 'LED Hắt Dịu', 'Aesthetic'],
  },
  {
    id: 'p-3d-17',
    title: 'Giường Ngủ Gỗ Master Đối Xứng Tinh Tế & 2 Táp Gỗ Đón Sáng',
    category: '3d',
    roomCategory: 'Phòng Ngủ Master',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-17.webp',
    location: 'Biên Hòa',
    spec: 'Khung giường gỗ kiên cố, 2 táp đầu giường đồng bộ tone màu gỗ nội thất.',
    tags: ['Thiết Kế Đối Xứng', 'Táp Đầu Giường Đồng Bộ', 'Kết Cấu Bền Vững', 'Master'],
  },
  {
    id: 'p-3d-19',
    title: 'Góc Bàn Làm Việc Gỗ May Đo & Hệ Kệ Sách Treo Tường',
    category: '3d',
    roomCategory: 'Bàn Làm Việc',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-19.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Gỗ công nghiệp bề mặt chống trầy xước, ngăn kéo chứa đồ tiện dụng.',
    tags: ['Bàn Làm Việc May Đo', 'Kệ Treo Tường', 'Chống Trầy Melamine', 'Smart Desk'],
  },
  {
    id: 'p-3d-20',
    title: 'Phòng Ngủ Master Hiện Đại Với Giường Gỗ & Hệ Táp Đầu Giường',
    category: '3d',
    roomCategory: 'Phòng Ngủ Master',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-20.webp',
    location: 'Bình Dương',
    spec: 'Gỗ MDF lõi xanh bề mặt vân gỗ tự nhiên, thiết kế tối giản hiện đại.',
    tags: ['Phong Cách Hiện Đại', 'MDF Lõi Xanh', 'Giường Master', 'Warm Tone'],
  },
  {
    id: 'p-3d-21',
    title: 'Thiết Kế Phòng Ngủ Tone Ghi Gỗ Với Tủ Áo Cánh Kính Hiện Đại',
    category: '3d',
    roomCategory: 'Phòng Ngủ Master',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-21.webp',
    location: 'Long Thành, Đồng Nai',
    spec: 'Hệ tủ áo khung nhôm cánh kính kết hợp cốt gỗ MDF chống ẩm An Cường.',
    tags: ['Tone Ghi Xám', 'Cánh Kính Xám Khói', 'Gỗ An Cường', 'Haute Couture'],
  },
  {
    id: 'p-3d-22',
    title: 'Giường Ngủ Gỗ Hiện Đại Liền Táp & Bàn Làm Việc Liền Ban Công',
    category: '3d',
    roomCategory: 'Phòng Ngủ Hiện Đại',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-22.webp',
    location: 'Biên Hòa',
    spec: 'Khung gỗ chắc chắn kết hợp tab đầu giường và bàn làm việc đồng bộ.',
    tags: ['View Ban Công', 'Bàn Làm Việc Liền Tab', 'Không Gian Mở', 'Tối Giản'],
  },
  {
    id: 'p-3d-23',
    title: 'Hệ Vách Lam Gỗ Ngăn Cầu Thang Tích Hợp Kệ Tivi Gỗ Đa Năng',
    category: '3d',
    roomCategory: 'Vách Lam & Kệ Tivi',
    roomType: 'living',
    image: '/assets/projects/project-3d-23.webp',
    location: 'TP. Hồ Chí Minh',
    spec: 'Hệ cột lam gỗ kiên cố kết hợp tủ kệ tivi lưu trữ gọn gàng thẩm mỹ.',
    tags: ['Ngăn Cầu Thang', 'Kệ Tivi Đa Năng', 'Lam Gỗ Sồi / MDF', 'Kiến Trúc Mở'],
  },
  {
    id: 'p-3d-24',
    title: 'Hệ Vách Lam Gỗ Trang Trí Liền Tủ Kệ Lưu Trữ Phòng Khách',
    category: '3d',
    roomCategory: 'Lam Gỗ & Tủ Kệ',
    roomType: 'living',
    image: '/assets/projects/project-3d-24.webp',
    location: 'Đồng Nai',
    spec: 'Lam gỗ tự nhiên tẩm sấy kỹ lưỡng kết hợp hệ tủ gỗ để đồ bên dưới.',
    tags: ['Tủ Kệ Dưới', 'Lam Trang Trí', 'Xử Lý Sấy Chống Cong', 'Phòng Khách'],
  },
  {
    id: 'p-3d-25',
    title: 'Bộ Bàn Ghế Gỗ Tự Nhiên & Hệ Lam Gỗ Trang Trí Thông Tầng',
    category: '3d',
    roomCategory: 'Bàn Ghế & Lam Gỗ',
    roomType: 'living',
    image: '/assets/projects/project-3d-25.webp',
    location: 'Bình Dương',
    spec: 'Gỗ tự nhiên xử lý tẩm sấy chống cong vênh mối mọt, nan gỗ CNC chuẩn xác.',
    tags: ['Nan Gỗ CNC', 'Thông Tầng Sang Trọng', 'Gỗ Tự Nhiên Tuyển Chọn', 'Văn Hóa Mộc'],
  },
  {
    id: 'p-3d-26',
    title: 'Hệ Vách Lam Gỗ Phân Chia Không Gian Kèm Kệ Sách Trang Trí',
    category: '3d',
    roomCategory: 'Lam Gỗ & Kệ Sách',
    roomType: 'living',
    image: '/assets/projects/project-3d-26.webp',
    location: 'Biên Hòa',
    spec: 'Vách gỗ thông minh tạo độ mở không gian mà vẫn đảm bảo tính riêng tư.',
    tags: ['Phân Chia Không Gian', 'Kệ Sách Trang Trí', 'Riêng Tư & Thoáng Đãng', 'Mộc Tinh Tế'],
  },
  {
    id: 'p-3d-29',
    title: 'Hệ Tủ Bếp Gỗ Acrylic Chữ L Kịch Trần May Đo Chuẩn Từng Mét',
    category: '3d',
    roomCategory: 'Tủ Bếp Cao Cấp',
    roomType: 'kitchen',
    image: '/assets/projects/project-3d-29.webp',
    location: 'Đồng Nai',
    spec: 'Thùng gỗ nhựa Picomat khoang chậu rửa & thùng MDF lõi xanh chống ẩm.',
    tags: ['Acrylic Trắng Sứ', 'Chống Nước 100%', 'Bếp Chữ L', 'Kịch Trần May Đo'],
  },
  {
    id: 'p-3d-5',
    title: 'Hệ Tủ Gỗ Chống Nước Tích Hợp Khoang Máy Giặt & Kệ Mộc Tiện Ích',
    category: '3d',
    roomCategory: 'Tủ Kệ Gỗ Đa Năng',
    roomType: 'living',
    image: '/assets/projects/project-3d-5.webp',
    location: 'Long Thành, Đồng Nai',
    spec: 'Gỗ nhựa Picomat siêu chịu nước, bề mặt phủ vân gỗ sáng chống ẩm mốc.',
    tags: ['Picomat Siêu Chịu Nước', 'Tích Hợp Máy Giặt', 'Tối Ưu Logia / Ban Công', 'Đa Năng'],
  },
  {
    id: 'p-3d-9',
    title: 'Toàn Cảnh Phòng Ngủ Master: Giường Ngủ Gỗ & Tủ Quần Áo Kịch Trần',
    category: '3d',
    roomCategory: 'Phòng Ngủ Master',
    roomType: 'bedroom',
    image: '/assets/projects/project-3d-9.webp',
    location: 'Biên Hòa, Đồng Nai',
    spec: 'Thi công trọn gói nội thất gỗ phòng ngủ đồng bộ màu sắc và chất liệu.',
    tags: ['Thi Công Trọn Gói', 'Đồng Bộ Màu Gỗ', 'Không Gian Master 25m2', 'Full Set'],
  },
];

interface RealProjectCardProps {
  project: ProjectItem;
  index: number;
  onOpenLightbox: () => void;
}

const RealProjectCard: React.FC<RealProjectCardProps> = ({ project, index, onOpenLightbox }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project.id]);

  // Hiệu ứng cascade so le (stagger) 90ms mỗi ảnh trong từng đợt 6 ảnh
  const staggerDelay = `${(index % 6) * 90}ms`;

  return (
    <article
      ref={cardRef}
      onClick={onOpenLightbox}
      style={{
        transitionDelay: isVisible ? staggerDelay : '0ms',
      }}
      className={`group bg-white rounded-xs border border-black/8 hover:border-[#00A8BC]/40 shadow-xs hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer transform transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-16 scale-[0.97]'
      }`}
    >
      {/* Khung ảnh nguyên bản 3:4 (Không crop trần/sàn, trọn vẹn kiến trúc kịch trần) */}
      <div className="aspect-[3/4] relative bg-[#EDEBE6] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-104 pointer-events-none"
          loading="lazy"
        />

        {/* Lớp phủ điện ảnh nhẹ khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Nút phóng to Lightbox nghệ thuật */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md">
          <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>

        {/* Huy hiệu danh mục không gian */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs bg-[#00A8BC] text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider font-mono-num shadow-sm">
            {project.roomCategory}
          </span>
        </div>
      </div>

      {/* Thẻ chú thích kiến trúc bên dưới ảnh (Architectural Museum Index Plaque) */}
      <div className="p-2.5 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between bg-white border-t border-black/5">
        <div>
          <div className="flex items-center justify-between text-[8.5px] sm:text-[10px] md:text-[10.5px] font-mono text-[#8C8980] mb-1 uppercase tracking-wider">
            <span className="truncate max-w-[85px] sm:max-w-none">{project.roomCategory}</span>
            <span className="truncate max-w-[65px] sm:max-w-none">{project.location}</span>
          </div>

          <h3 className="font-heading text-xs sm:text-sm md:text-[15px] font-bold text-[#141414] group-hover:text-[#00A8BC] transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
            {project.title}
          </h3>
        </div>

        {/* Thông số kỹ thuật vật liệu & phụ kiện may đo */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-black/6 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] sm:text-[10.5px] text-[#55565B] font-light">
            <span className="text-[#8C8980] text-[8.5px] sm:text-[10px] font-mono uppercase tracking-wider">Vật liệu:</span>
            <span className="font-medium text-[#222] truncate max-w-[95px] sm:max-w-[210px] text-right">
              {project.spec?.split('•')[0] || 'MDF chống ẩm An Cường'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10.5px] text-[#55565B] font-light">
            <span className="text-[#8C8980] text-[8.5px] sm:text-[10px] font-mono uppercase tracking-wider">Gia công:</span>
            <span className="text-[#00A8BC] font-mono-num font-medium text-[8.5px] sm:text-[10.5px]">
              Xưởng Phát Lộc
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export const ProjectsShowcase: React.FC = () => {
  // 1. CHẾ ĐỘ HIỂN THỊ DUAL-MODE CHO ẢNH 3D: 'runway' (3D Carousel kiểu LOWT) vs 'moodboard' (Lưới)
  const [displayMode, setDisplayMode] = useState<'runway' | 'moodboard'>('runway');
  const [filter3D, setFilter3D] = useState<'all' | 'living' | 'bedroom' | 'kitchen'>('all');
  const [active3DIndex, setActive3DIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch Swipe Refs cho Mobile (độ nhạy cao, không re-render, phân biệt tuyệt đối cuộn dọc và vuốt ngang)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);

  // Ref cho dải thumbnail cuộn ngang (Filmstrip)
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // 2. REAL PROJECTS STATE (Lưới ảnh thực tế công trình phía dưới)
  const [realFilter, setRealFilter] = useState<'all' | 'living' | 'bedroom' | 'kitchen' | 'wall_workshop'>('all');
  const [visibleRealCount, setVisibleRealCount] = useState<number>(6);

  // 3. LIGHTBOX MODAL
  const [lightboxData, setLightboxData] = useState<{ list: ProjectItem[]; index: number } | null>(null);

  // Danh sách 3D đã lọc
  const filtered3DList = PROJECTS_3D.filter((p) => {
    if (filter3D === 'all') return true;
    if (filter3D === 'living') return p.roomType === 'living';
    if (filter3D === 'bedroom') return p.roomType === 'bedroom' || p.roomType === 'wardrobe';
    if (filter3D === 'kitchen') return p.roomType === 'kitchen';
    return true;
  });

  // Khi chuyển bộ lọc, reset index về 0
  useEffect(() => {
    setActive3DIndex(0);
  }, [filter3D]);

  // Điều hướng 3D Carousel xoay tròn (Circular Carousel kiểu LOWT)
  const handleNext3D = () => {
    if (filtered3DList.length <= 1) return;
    setActive3DIndex((prev) => (prev + 1) % filtered3DList.length);
  };

  const handlePrev3D = () => {
    if (filtered3DList.length <= 1) return;
    setActive3DIndex((prev) => (prev - 1 + filtered3DList.length) % filtered3DList.length);
  };

  const handleSelectCard = (index: number) => {
    if (index === active3DIndex) {
      setLightboxData({ list: filtered3DList, index });
    } else {
      setActive3DIndex(index);
    }
  };

  // Tính toán khoảng cách offset tương đối theo vòng tròn (Circular relative offset logic từ LOWT)
  const getCardOffset = (idx: number) => {
    let offset = idx - active3DIndex;
    const half = Math.floor(filtered3DList.length / 2);
    while (offset < -half) offset += filtered3DList.length;
    while (offset > filtered3DList.length - 1 - half) offset -= filtered3DList.length;
    return offset;
  };

  // Tính toán Style 3D Perspective chuẩn xác từ project LOWT
  const getCard3DStyle = (offset: number): React.CSSProperties => {
    let transform = '';
    let zIndex = 1;
    let filter = 'none';
    let opacity = 1;
    let pointerEvents: 'auto' | 'none' = 'auto';

    if (offset === 0) {
      // Active Center card (Nổi bật nhất ở giữa, to và rõ nét trên cả điện thoại)
      transform = isMobile
        ? 'translateZ(75px) scale(1.05)'
        : 'translateZ(95px) scale(1.12)';
      zIndex = 20;
    } else if (offset === -1) {
      // Thẻ liền kề bên trái
      transform = isMobile
        ? 'translateX(-115px) translateZ(-25px) rotateY(16deg) scale(0.82)'
        : 'translateX(-220px) translateZ(0px) rotateY(22deg) scale(0.88)';
      zIndex = 10;
      filter = 'brightness(0.38) blur(0.8px)';
    } else if (offset === -2) {
      // Thẻ phía xa bên trái
      transform = isMobile
        ? 'translateX(-190px) translateZ(-65px) rotateY(24deg) scale(0.68)'
        : 'translateX(-390px) translateZ(-80px) rotateY(36deg) scale(0.76)';
      zIndex = 5;
      filter = 'brightness(0.2) blur(2px)';
    } else if (offset === 1) {
      // Thẻ liền kề bên phải
      transform = isMobile
        ? 'translateX(115px) translateZ(-25px) rotateY(-16deg) scale(0.82)'
        : 'translateX(220px) translateZ(0px) rotateY(-22deg) scale(0.88)';
      zIndex = 10;
      filter = 'brightness(0.38) blur(0.8px)';
    } else if (offset === 2) {
      // Thẻ phía xa bên phải
      transform = isMobile
        ? 'translateX(190px) translateZ(-65px) rotateY(-24deg) scale(0.68)'
        : 'translateX(390px) translateZ(-80px) rotateY(-36deg) scale(0.76)';
      zIndex = 5;
      filter = 'brightness(0.2) blur(2px)';
    } else {
      // Các thẻ ẩn ngầm phía sau (Offset >= 3 hoặc <= -3)
      const dir = offset > 0 ? 1 : -1;
      transform = isMobile
        ? `translateX(${dir * 220}px) translateZ(-80px) rotateY(${dir * -30}deg) scale(0.6)`
        : `translateX(${dir * 500}px) translateZ(-160px) rotateY(${dir * -45}deg) scale(0.65)`;
      zIndex = 1;
      opacity = 0;
      pointerEvents = 'none';
      filter = 'brightness(0.1) blur(4px)';
    }

    return {
      transform,
      zIndex,
      filter,
      opacity,
      pointerEvents,
    };
  };

  // Tự động cuộn dải thumbnail nội bộ (chỉ cuộn khi thực sự tràn và cố định trục dọc)
  useEffect(() => {
    if (thumbnailStripRef.current && displayMode === 'runway') {
      const container = thumbnailStripRef.current;
      // Chỉ kích hoạt cuộn khi dải thumbnail có thanh tràn ngang
      if (container.scrollWidth > container.clientWidth + 8) {
        const activeElement = container.children[active3DIndex] as HTMLElement;
        if (activeElement) {
          const targetScrollLeft =
            activeElement.offsetLeft - container.clientWidth / 2 + activeElement.clientWidth / 2;
          container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [active3DIndex, displayMode]);

  // Hỗ trợ phím mũi tên ← → trên máy tính
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Không can thiệp nếu người dùng đang nhập dữ liệu trong input, textarea hoặc contenteditable
      const activeEl = document.activeElement;
      const target = e.target as HTMLElement | null;
      const isInput =
        (target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)) ||
        (activeEl &&
          (activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'TEXTAREA' ||
            (activeEl as HTMLElement).isContentEditable));

      if (isInput) return;

      if (lightboxData !== null) return;
      if (displayMode !== 'runway') return;
      if (e.key === 'ArrowRight') handleNext3D();
      if (e.key === 'ArrowLeft') handlePrev3D();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayMode, filtered3DList.length, lightboxData, active3DIndex]);

  // Tự động xoay 3D Carousel nhẹ nhàng mỗi 3.8 giây (hình tự chạy để người xem nhận biết và vuốt ngang)
  useEffect(() => {
    if (displayMode !== 'runway' || !isPlaying) return;
    const timer = setInterval(() => {
      handleNext3D();
    }, 3800);
    return () => clearInterval(timer);
  }, [displayMode, isPlaying, filtered3DList.length]);

  // Mobile Touch Handlers với nhận diện cử chỉ nhạy bén & phân tách triệt để với cuộn dọc
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - endX;
    const diffY = touchStartYRef.current - endY;
    const duration = Date.now() - touchStartTimeRef.current;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    // Vuốt nhạy (ngưỡng 26px), ưu tiên trục ngang (> 1.25x trục dọc) và thời gian ngắn (< 750ms)
    // Nếu người dùng cuộn dọc (absY lớn), tuyệt đối không xoay carousel
    if (absX > 26 && absX > absY * 1.25 && duration < 750) {
      if (diffX > 0) {
        handleNext3D(); // Vuốt sang trái -> xem ảnh kế tiếp
      } else {
        handlePrev3D(); // Vuốt sang phải -> xem ảnh trước
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Real Projects list
  const filteredRealList = REAL_PROJECTS.filter((p) => {
    if (realFilter === 'all') return true;
    if (realFilter === 'living') return p.roomType === 'living';
    if (realFilter === 'bedroom') return p.roomType === 'bedroom' || p.roomType === 'wardrobe';
    if (realFilter === 'kitchen') return p.roomType === 'kitchen';
    if (realFilter === 'wall_workshop') return p.roomType === 'wall' || p.roomType === 'workshop';
    return true;
  });
  const displayedRealList = filteredRealList.slice(0, visibleRealCount);

  // Lightbox handlers
  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxData) {
      setLightboxData({
        ...lightboxData,
        index: (lightboxData.index + 1) % lightboxData.list.length,
      });
    }
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxData) {
      setLightboxData({
        ...lightboxData,
        index: (lightboxData.index - 1 + lightboxData.list.length) % lightboxData.list.length,
      });
    }
  };

  const currentProject = filtered3DList[active3DIndex] || filtered3DList[0];

  return (
    <>
      {/* ========================================================================= */}
      {/* PHẦN 1: BỘ SƯU TẬP 3D — 3D PERSPECTIVE CAROUSEL CHUYỂN ĐỘNG KIỂU LOWT     */}
      {/* ========================================================================= */}
      <section id="concept-3d" className="py-12 sm:py-20 bg-[#07080A] text-white border-b border-white/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 relative z-10">
          
          {/* HEADER ĐỒNG BỘ CÁC HẠNG MỤC — TIÊU ĐỀ LỚN & ĐIỀU KHIỂN CHẾ ĐỘ XEM */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 pb-6 border-b border-white/10 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00D0E8]" />
                <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] font-mono-num">
                  THIẾT KẾ PHỐI CẢNH 3D • ĐỘC BẢN KIẾN TRÚC
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-[1.2]">
                  BẢN VẼ 3D NỘI THẤT.
                </h2>
                <span className="text-xs sm:text-sm font-mono-num text-white/40">
                  ({active3DIndex + 1} / {filtered3DList.length})
                </span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Phối cảnh 3D trực quan, đo ni đóng giày từng công năng và chỉ định vật liệu thực tế có thể gia công xuất xưởng.
              </p>
            </div>

            {/* DUAL MODE SWITCHER */}
            <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
              <div className="p-0.5 rounded-full bg-white/5 border border-white/15 flex items-center">
                <button
                  onClick={() => setDisplayMode('runway')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    displayMode === 'runway'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  3D Carousel
                </button>
                <button
                  onClick={() => setDisplayMode('moodboard')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    displayMode === 'moodboard'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Lưới ({PROJECTS_3D.length})
                </button>
              </div>
            </div>
          </div>

          {/* FILTER PILLS THEO PHÒNG */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none whitespace-nowrap text-xs">
            <button
              onClick={() => setFilter3D('all')}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter3D === 'all'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              Tất cả ({PROJECTS_3D.length})
            </button>
            <button
              onClick={() => setFilter3D('bedroom')}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter3D === 'bedroom'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              Tủ Áo & Phòng Ngủ
            </button>
            <button
              onClick={() => setFilter3D('kitchen')}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter3D === 'kitchen'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              Tủ Bếp & Bàn Đảo
            </button>
            <button
              onClick={() => setFilter3D('living')}
              className={`px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filter3D === 'living'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              Kệ Tivi & Phòng Khách
            </button>
          </div>

          {/* ================================================================= */}
          {/* CHẾ ĐỘ 1: 3D PERSPECTIVE CAROUSEL THEO PHONG CÁCH LOWT            */}
          {/* ================================================================= */}
          {displayMode === 'runway' && (
            <div className="space-y-4">
              {/* KHUNG TRÌNH CHIẾU 3D HÌNH TRỤ XOAY TRÒN (LOWT 3D PERSPECTIVE) */}
              <div
                style={{ touchAction: 'pan-y' }}
                className="carousel-3d-container relative w-full h-[420px] sm:h-[480px] md:h-[540px] flex items-center justify-center overflow-hidden py-4 select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {/* 3D Track */}
                <div className="carousel-3d-track">
                  {filtered3DList.map((project, idx) => {
                    const offset = getCardOffset(idx);
                    const cardStyle = getCard3DStyle(offset);
                    const isActive = offset === 0;

                    return (
                      <div
                        key={project.id}
                        onClick={() => handleSelectCard(idx)}
                        style={cardStyle}
                        className={`carousel-3d-card group rounded-2xl overflow-hidden cursor-pointer ${
                          isActive
                            ? 'ring-1 ring-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
                            : 'shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
                        } w-[84vw] max-w-[340px] h-[250px] sm:w-[440px] sm:h-[310px] md:w-[560px] md:h-[380px] lg:w-[660px] lg:h-[430px] bg-[#0d0e12] border border-white/10`}
                      >
                        {/* Ảnh công trình */}
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Nút phóng to khi là thẻ active */}
                        {isActive && (
                          <div className="absolute top-3.5 right-3.5 bg-black/60 hover:bg-white hover:text-black text-white/90 backdrop-blur-md p-2 rounded-full border border-white/15 transition-all z-10 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        )}

                        {/* Gradient bóng đổ nhẹ phía dưới thẻ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                        {/* TIÊU ĐỀ TỐI GIẢN CHỈ HIỆN KHI LÀ THẺ CHÍNH (ACTIVE) */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transition-all duration-500 pointer-events-none ${
                            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                          }`}
                        >
                          <h3 className="font-heading text-sm sm:text-base md:text-lg font-medium text-white/95 tracking-wide line-clamp-1 drop-shadow-md">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DẢI THUMBNAIL PHÍA DƯỚI (CỐ ĐỊNH KÍCH THƯỚC TRIỆT ĐỂ, CHỐNG GIẬT MÀN HÌNH) */}
              <div
                ref={thumbnailStripRef}
                className="h-14 sm:h-16 flex items-center gap-2 overflow-x-auto scrollbar-none justify-start sm:justify-center px-1"
              >
                {filtered3DList.map((project, idx) => {
                  const isActive = idx === active3DIndex;
                  return (
                    <button
                      key={project.id}
                      onClick={() => handleSelectCard(idx)}
                      className={`w-16 sm:w-20 h-10 sm:h-12 flex-shrink-0 relative group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'ring-2 ring-[#00D0E8] scale-105 opacity-100 shadow-lg z-10'
                          : 'opacity-35 hover:opacity-85 border border-white/10 scale-100'
                      }`}
                      title={project.title}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover pointer-events-none"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CHẾ ĐỘ 2: MOODBOARD ARCHIVE (LƯỚI TẠP CHÍ THỜI TRANG 30 MẪU)    */}
          {/* ================================================================= */}
          {displayMode === 'moodboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between text-xs text-white/60 pb-2">
                <span className="font-mono-num">
                  Toàn bộ {filtered3DList.length} bản vẽ
                </span>
                <span className="text-[11px] text-white/40 font-mono-num">
                  * Chạm vào ảnh để phóng to
                </span>
              </div>

              {/* Lưới Moodboard: 2 cột trên Mobile, 3 cột trên Tablet, 4 cột trên Desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered3DList.map((project, idx) => (
                  <div
                    key={project.id}
                    onClick={() => setLightboxData({ list: filtered3DList, index: idx })}
                    className="group relative bg-[#131418] rounded-lg overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-md hover:shadow-2xl flex flex-col"
                  >
                    {/* Khung ảnh */}
                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/40">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-108 pointer-events-none"
                        loading="lazy"
                      />
                      
                      {/* Hangtag trên góc ảnh */}
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono-num font-bold text-white/80 border border-white/10">
                        #{String(idx + 1).padStart(2, '0')}
                      </div>

                      {/* Nút phóng to hover */}
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {/* Phần chữ mô tả dạng nhãn thời trang */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-[#121316]">
                      <div>
                        <span className="text-[9px] uppercase font-mono-num text-white/50 tracking-wider block mb-1">
                          {project.roomCategory}
                        </span>
                        <h4 className="font-heading text-xs sm:text-sm font-medium text-white line-clamp-2 leading-snug">
                          {project.title}
                        </h4>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-mono-num">
                        <span>{project.location}</span>
                        <span className="text-[#00D0E8] group-hover:underline flex items-center gap-0.5">
                          Xem chi tiết <ArrowUpRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHẦN 2: HÌNH ẢNH CÔNG TRÌNH THỰC TẾ (PHONG CÁCH TẠP CHÍ KIẾN TRÚC EDITORIAL)*/}
      {/* ========================================================================= */}
      <section id="projects" className="py-20 sm:py-28 bg-[#F4F3EF] border-b border-black/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          
          {/* Header Tạp Chí Kiến Trúc */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-black/10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00A8BC]" />
                <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#00A8BC] font-mono-num">
                  ARCHITECTURAL LOOKBOOK • HỒ SƠ THI CÔNG NGUYÊN BẢN
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#141414] leading-[1.2] uppercase">
                HÌNH ẢNH NỘI THẤT THỰC TẾ.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#55565B] max-w-md font-light leading-relaxed">
              100% hình ảnh thực tế thi công tại công trình được lưu giữ nguyên bản tỷ lệ chiều cao kịch trần (3:4), tôn vinh tay nghề thợ mộc và kỹ nghệ hoàn thiện của Phát Lộc.
            </p>
          </div>

          {/* Filter Bar Tạp Chí - Phân loại không gian tinh tế */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none whitespace-nowrap text-xs">
            <button
              onClick={() => { setRealFilter('all'); setVisibleRealCount(6); }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'all'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Tất cả công trình ({REAL_PROJECTS.length})
            </button>
            <button
              onClick={() => { setRealFilter('bedroom'); setVisibleRealCount(6); }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'bedroom'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Tủ Áo Cánh Kính & Phòng Ngủ
            </button>
            <button
              onClick={() => { setRealFilter('kitchen'); setVisibleRealCount(6); }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'kitchen'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Tủ Bếp & Đảo Bếp May Đo
            </button>
            <button
              onClick={() => { setRealFilter('living'); setVisibleRealCount(6); }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'living'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-sm'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Kệ Tivi & Tủ Rượu Sang Trọng
            </button>
            <button
              onClick={() => { setRealFilter('wall_workshop'); setVisibleRealCount(6); }}
              className={`px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                realFilter === 'wall_workshop'
                  ? 'bg-[#141414] border-[#141414] text-white shadow-xs'
                  : 'bg-white border-black/10 text-[#555] hover:border-black/30 hover:text-black'
              }`}
            >
              Vách Lam Gỗ & Nghệ Thuật Ốp
            </button>
          </div>

          {/* LƯỚI TẠP CHÍ KIẾN TRÚC EDITORIAL (2 CỘT DỌC TRÊN MOBILE, TỶ LỆ 3:4 CHUẨN MỰC) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
            {displayedRealList.map((project, idx) => (
              <RealProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpenLightbox={() => setLightboxData({ list: filteredRealList, index: idx })}
              />
            ))}
          </div>

          {/* NÚT XEM THÊM ẢNH THỰC TẾ */}
          {visibleRealCount < filteredRealList.length && (
            <div className="text-center pt-12 mt-4">
              <button
                onClick={() => setVisibleRealCount((prev) => prev + 6)}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#141414] hover:bg-[#00A8BC] text-white font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer rounded-full shadow-lg hover:shadow-cyan-500/20 active:scale-95"
              >
                <span>Mở thêm hồ sơ công trình (Còn {filteredRealList.length - visibleRealCount} ảnh)</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL (Xem ảnh phóng to độ phân giải cao - 100% Không crop)       */}
      {/* ========================================================================= */}
      {lightboxData !== null && (
        <div
          onClick={() => setLightboxData(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8 animate-in fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxData(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50 shadow-lg"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrevLightbox}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50 shadow-lg"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNextLightbox}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer z-50 shadow-lg"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Photo Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center"
          >
            <img
              src={lightboxData.list[lightboxData.index].image}
              alt={lightboxData.list[lightboxData.index].title}
              className="max-w-full max-h-[78vh] object-contain rounded-md shadow-2xl block"
            />
            <div className="mt-3.5 text-center text-white max-w-2xl px-2">
              <span className="text-[10px] uppercase font-mono-num bg-[#00D0E8] text-black font-bold px-2.5 py-0.5 rounded-full mr-2">
                {lightboxData.list[lightboxData.index].category === 'real' ? 'HÌNH ẢNH NỘI THẤT THỰC TẾ' : 'THIẾT KẾ NỘI THẤT 3D'}
              </span>
              <span className="font-heading text-sm sm:text-base font-bold">
                {lightboxData.list[lightboxData.index].title}
              </span>
              <span className="text-xs text-white/60 font-mono-num block mt-1">
                {lightboxData.list[lightboxData.index].location} • ({lightboxData.index + 1} / {lightboxData.list.length})
              </span>
              {lightboxData.list[lightboxData.index].spec && (
                <p className="text-[11px] text-white/70 font-light mt-1.5 italic">
                  {lightboxData.list[lightboxData.index].spec}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
