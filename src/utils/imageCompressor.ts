/**
 * Bộ công cụ nén ảnh tự động 100% trên trình duyệt bằng Canvas & WebP
 * Giảm dung lượng từ 5-15MB xuống còn ~100-250KB mà vẫn giữ độ nét cao.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Tính toán tỷ lệ co giãn để giữ nguyên tỷ lệ khung hình
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Không thể khởi tạo Canvas 2D'));
          return;
        }

        // Tăng độ mượt khi resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất ra định dạng WebP (chuẩn nhẹ nhất cho web hiện nay)
        // Nếu trình duyệt cũ không hỗ trợ webp sẽ fallback sang jpeg
        let format = 'image/webp';
        let dataUrl = canvas.toDataURL(format, quality);

        if (!dataUrl.startsWith('data:image/webp')) {
          format = 'image/jpeg';
          dataUrl = canvas.toDataURL(format, quality);
        }

        // Tính dung lượng ước lượng sau khi nén (từ chuỗi Base64)
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const compressedSize = Math.round((base64Length * 3) / 4);
        const reductionPercentage = Math.max(
          0,
          Math.round(((originalSize - compressedSize) / originalSize) * 100)
        );

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          reductionPercentage,
          width,
          height,
        });
      };

      img.onerror = () => reject(new Error('Không thể đọc file ảnh'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Trích xuất ảnh bìa (thumbnail) từ video tải lên
 */
export async function extractVideoThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(videoFile);
    video.src = url;

    video.onloadeddata = () => {
      // Nhảy tới giây thứ 1 để lấy khung hình đẹp
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(video.videoWidth || 1280, 1280);
      canvas.height = Math.round(
        (canvas.width * (video.videoHeight || 720)) / (video.videoWidth || 1280)
      );

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumb = canvas.toDataURL('image/webp', 0.8);
        URL.revokeObjectURL(url);
        resolve(thumb);
      } else {
        URL.revokeObjectURL(url);
        reject(new Error('Không thể tạo thumbnail từ video'));
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Lỗi tải video'));
    };
  });
}

/**
 * Định dạng dung lượng sang KB hoặc MB dễ đọc
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
