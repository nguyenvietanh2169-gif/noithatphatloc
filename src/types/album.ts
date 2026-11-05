export interface AlbumPhoto {
  id: string;
  url: string; // URL ảnh hoặc video (DataURL hoặc đường dẫn tĩnh)
  type?: 'image' | 'video'; // Phân biệt ảnh hay video
  thumbnail?: string; // Ảnh bìa trích xuất tự động nếu là video
  caption?: string;
  originalSize?: number;
  compressedSize?: number;
  reductionPercentage?: number;
}

export interface CustomerAlbum {
  id: string;
  customerName: string; // Ví dụ: "Gia đình Anh Minh" hoặc "Chị Mai - Penthouse"
  projectTitle: string; // Ví dụ: "Hoàn thiện trọn gói Nhà phố Biên Hòa" hoặc "Bản vẽ 3D Căn hộ Swanbay"
  location: string; // "Bình Chánh, TP.HCM" hoặc "Biên Hòa, Đồng Nai"
  completedDate: string; // "Tháng 10/2024"
  coverImage: string; // Ảnh đại diện album
  categories: string[]; // ["Phòng Khách", "Phòng Bếp", "Tủ Quần Áo"]
  photos: AlbumPhoto[];
  albumType?: 'real' | '3d'; // 'real' = Công trình thực tế, '3d' = Bản vẽ / Phối cảnh 3D
  videoUrl?: string; // Link video nếu có
  testimonial?: string; // Cảm nhận của khách hàng
  materialNotes?: string; // Quy cách vật liệu / ghi chú thiết kế
  createdAt: number;
}

/**
 * Kiểm tra xem một album là Album 3D hay Album Thực Tế
 */
export function is3DAlbum(album: CustomerAlbum): boolean {
  if (album.albumType === '3d') return true;
  if (album.albumType === 'real') return false;
  return (
    album.categories.some((c) => c.toLowerCase().includes('3d') || c.toLowerCase().includes('phối cảnh')) ||
    album.projectTitle.toLowerCase().includes('3d') ||
    album.projectTitle.toLowerCase().includes('phối cảnh') ||
    album.id.startsWith('album-3d-')
  );
}
