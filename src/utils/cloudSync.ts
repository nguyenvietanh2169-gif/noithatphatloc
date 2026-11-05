import { CustomerAlbum, AlbumPhoto } from '../types/album';

export interface CloudConfig {
  url: string;
  anonKey: string;
}

const CLOUD_CONFIG_KEY = 'phat_loc_cloud_config';
const DEFAULT_SUPABASE_URL = 'https://vjxiyfqvuvgfuawfbjiv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_2hIR0pFadBa_Em-GHa5O4w_g0QSOIqo';

/**
 * Lấy cấu hình Supabase (từ biến môi trường hoặc cấu hình đã lưu)
 */
export function getCloudConfig(): CloudConfig | null {
  const metaEnv = (import.meta as any).env;
  const envUrl = metaEnv?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = metaEnv?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl.trim().replace(/\/$/, ''), anonKey: envKey.trim() };
  }

  const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim().replace(/\/$/, ''),
          anonKey: parsed.anonKey.trim(),
        };
      }
    } catch {
      // Bỏ qua lỗi
    }
  }

  return null;
}

/**
 * Lưu cấu hình Supabase vào trình duyệt
 */
export function saveCloudConfig(config: CloudConfig | null) {
  if (!config) {
    localStorage.removeItem(CLOUD_CONFIG_KEY);
  } else {
    localStorage.setItem(
      CLOUD_CONFIG_KEY,
      JSON.stringify({
        url: config.url.trim().replace(/\/$/, ''),
        anonKey: config.anonKey.trim(),
      })
    );
  }
}

/**
 * Kiểm tra xem chế độ Cloud có đang bật không
 */
export function isCloudEnabled(): boolean {
  return getCloudConfig() !== null;
}

/**
 * Chuyển đổi dataURL (Base64) sang Blob để upload
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/webp';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Tải 1 file (Blob hoặc DataURL) lên Supabase Storage bucket 'albums'
 */
export async function uploadToSupabaseStorage(
  fileOrDataUrl: Blob | string,
  fileName: string,
  contentType = 'image/webp'
): Promise<string> {
  const config = getCloudConfig();
  if (!config) {
    throw new Error('Chưa cấu hình Supabase');
  }

  let blob: Blob;
  if (typeof fileOrDataUrl === 'string') {
    if (fileOrDataUrl.startsWith('data:')) {
      blob = dataUrlToBlob(fileOrDataUrl);
      contentType = blob.type || contentType;
    } else {
      return fileOrDataUrl; // Đã là URL online
    }
  } else {
    blob = fileOrDataUrl;
  }

  // Đặt tên file ngẫu nhiên tránh trùng lặp
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${Date.now()}_${cleanName}`;

  const uploadEndpoint = `${config.url}/storage/v1/object/albums/${path}`;

  const res = await fetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': contentType,
    },
    body: blob,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Lỗi upload storage:', errorText);
    throw new Error('Không thể tải file lên Storage. Hãy đảm bảo bucket "albums" đã được tạo ở chế độ Public!');
  }

  // Trả về link CDN public trực tiếp
  return `${config.url}/storage/v1/object/public/albums/${path}`;
}

/**
 * Lấy toàn bộ danh sách Album từ Supabase Database
 */
export async function fetchAlbumsFromCloud(): Promise<CustomerAlbum[]> {
  const config = getCloudConfig();
  if (!config) return [];

  const res = await fetch(
    `${config.url}/rest/v1/customer_albums?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    }
  );

  if (!res.ok) {
    console.error('Lỗi đọc database:', await res.text());
    return [];
  }

  const rows = await res.json();
  // Map từ bảng database sang CustomerAlbum
  return rows.map((r: any) => {
    const is3D =
      r.album_type === '3d' ||
      r.albumType === '3d' ||
      (Array.isArray(r.categories) &&
        r.categories.some(
          (c: string) =>
            typeof c === 'string' &&
            (c.toLowerCase().includes('3d') || c.toLowerCase().includes('phối cảnh'))
        )) ||
      (r.project_title &&
        (r.project_title.toLowerCase().includes('3d') ||
          r.project_title.toLowerCase().includes('phối cảnh'))) ||
      (r.id && typeof r.id === 'string' && r.id.startsWith('album-3d-'));

    return {
      id: r.id,
      customerName: r.customer_name || r.customerName,
      projectTitle: r.project_title || r.projectTitle,
      location: r.location,
      completedDate: r.completed_date || r.completedDate,
      coverImage: r.cover_image || r.coverImage,
      categories: r.categories || [],
      photos: r.photos || [],
      albumType: (is3D ? '3d' : 'real') as 'real' | '3d',
      testimonial: r.testimonial,
      materialNotes: r.material_notes || r.materialNotes,
      videoUrl: r.video_url || r.videoUrl,
      createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    };
  });
}

/**
 * Lưu hoặc cập nhật 1 album lên Supabase Database
 */
export async function saveAlbumToCloud(album: CustomerAlbum): Promise<void> {
  const config = getCloudConfig();
  if (!config) throw new Error('Chưa cấu hình Supabase');

  const categories = [...(album.categories || [])];
  if (album.albumType === '3d' && !categories.some((c) => c.toLowerCase().includes('3d'))) {
    categories.unshift('Bản Vẽ 3D');
  }

  const row = {
    id: album.id,
    customer_name: album.customerName,
    project_title: album.projectTitle,
    location: album.location,
    completed_date: album.completedDate,
    cover_image: album.coverImage,
    categories,
    photos: album.photos,
    testimonial: album.testimonial,
    material_notes: album.materialNotes,
    video_url: album.videoUrl,
    created_at: new Date(album.createdAt || Date.now()).toISOString(),
  };

  const res = await fetch(`${config.url}/rest/v1/customer_albums`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Lỗi lưu database:', errorText);
    throw new Error('Lỗi lưu dữ liệu lên Supabase Database: ' + errorText);
  }
}

/**
 * Xóa 1 album trên Supabase Database
 */
export async function deleteAlbumFromCloud(albumId: string): Promise<void> {
  const config = getCloudConfig();
  if (!config) return;

  const res = await fetch(
    `${config.url}/rest/v1/customer_albums?id=eq.${albumId}`,
    {
      method: 'DELETE',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    }
  );

  if (!res.ok) {
    console.error('Lỗi xóa album:', await res.text());
  }
}

/**
 * Đồng bộ toàn bộ danh sách Album lên Supabase Cloud:
 * 1. Xóa các album trên Cloud không còn trong danh sách local
 * 2. Lưu/Cập nhật các album hiện tại lên Cloud
 */
export async function syncAllAlbumsToCloud(
  albums: CustomerAlbum[],
  onProgress?: (msg: string) => void
): Promise<void> {
  const config = getCloudConfig();
  if (!config) throw new Error('Chưa cấu hình Supabase');

  onProgress?.('Đang kết nối Supabase Cloud...');

  // 1. Lấy danh sách ID trên Cloud
  const cloudAlbums = await fetchAlbumsFromCloud();
  const currentCloudIds = new Set(cloudAlbums.map((a) => a.id));
  const activeIds = new Set(albums.map((a) => a.id));

  // 2. Xóa các album trên Cloud mà ở giao diện quản trị đã bị xoá
  const toDelete = Array.from(currentCloudIds).filter((id) => !activeIds.has(id));
  if (toDelete.length > 0) {
    onProgress?.(`Đang gỡ ${toDelete.length} album đã xóa trên Cloud...`);
    for (const id of toDelete) {
      await deleteAlbumFromCloud(id);
    }
  }

  // 3. Đẩy/Cập nhật từng album lên Cloud
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    onProgress?.(`Đang lưu album (${i + 1}/${albums.length}): ${album.customerName}...`);
    await saveAlbumToCloud(album);
  }

  onProgress?.('Đã đồng bộ thành công lên Cloud!');
}

/**
 * Kiểm tra kết nối thử tới Supabase
 */
export async function testCloudConnection(config: CloudConfig): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `${config.url.trim().replace(/\/$/, '')}/rest/v1/customer_albums?limit=1`,
      {
        headers: {
          apikey: config.anonKey.trim(),
          Authorization: `Bearer ${config.anonKey.trim()}`,
        },
      }
    );

    if (res.ok) {
      return { success: true, message: 'Kết nối thành công!' };
    } else {
      const err = await res.text();
      return {
        success: false,
        message: 'Không thể kết nối (mã lỗi ' + res.status + '): ' + err,
      };
    }
  } catch (err: any) {
    return { success: false, message: 'Lỗi kết nối URL: ' + (err.message || 'Kiểm tra lại URL') };
  }
}
