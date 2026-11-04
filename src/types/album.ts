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
  customerName: string; // Ví dụ: "Gia đình Anh Minh"
  projectTitle: string; // Ví dụ: "Hoàn thiện trọn gói Nhà phố Biên Hòa"
  location: string; // "Bình Chánh, TP.HCM"
  completedDate: string; // "Tháng 10/2024"
  coverImage: string; // Ảnh đại diện album
  categories: string[]; // ["Phòng Khách", "Phòng Bếp", "Tủ Quần Áo"]
  photos: AlbumPhoto[];
  videoUrl?: string; // Link video nếu có
  testimonial?: string; // Cảm nhận của khách hàng
  materialNotes?: string; // Quy cách vật liệu
  createdAt: number;
}
