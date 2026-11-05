import { CustomerAlbum, AlbumPhoto } from '../types/album';
import { INITIAL_CUSTOMER_ALBUMS } from '../data/defaultAlbums';
import {
  isCloudEnabled,
  fetchAlbumsFromCloud,
  saveAlbumToCloud,
  deleteAlbumFromCloud,
  uploadToSupabaseStorage,
  syncAllAlbumsToCloud,
} from './cloudSync';

const DB_NAME = 'PhatLocInteriorDB';
const DB_VERSION = 1;
const STORE_NAME = 'customer_albums';
const LOCAL_STORAGE_KEY = 'phat_loc_albums_backup';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB không được hỗ trợ trên trình duyệt này'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Lấy toàn bộ album (Ưu tiên đọc từ Cloud nếu đã kết nối, fallback IndexedDB)
 */
export async function getAlbums(): Promise<CustomerAlbum[]> {
  // 1. Nếu có kết nối Cloud, thử tải từ Supabase trước
  if (isCloudEnabled()) {
    try {
      const cloudAlbums = await fetchAlbumsFromCloud();
      if (cloudAlbums && cloudAlbums.length > 0) {
        // Cache lại vào IndexedDB để chạy siêu tốc
        saveLocalAlbums(cloudAlbums).catch(() => {});
        return cloudAlbums;
      }
    } catch (err) {
      console.warn('Lỗi đọc Cloud, fallback về offline cache:', err);
    }
  }

  // 2. Fallback đọc IndexedDB offline
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = async () => {
        const albums = request.result as CustomerAlbum[];
        if (!albums || albums.length === 0) {
          await saveLocalAlbums(INITIAL_CUSTOMER_ALBUMS);
          resolve(INITIAL_CUSTOMER_ALBUMS);
        } else {
          albums.sort((a, b) => b.createdAt - a.createdAt);
          resolve(albums);
        }
      };

      request.onerror = () => {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        resolve(cached ? JSON.parse(cached) : INITIAL_CUSTOMER_ALBUMS);
      };
    });
  } catch {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : INITIAL_CUSTOMER_ALBUMS;
  }
}

/**
 * Lưu danh sách album vào IndexedDB
 */
async function saveLocalAlbums(albums: CustomerAlbum[]): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.clear();
    for (const album of albums) {
      store.put(album);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        try {
          const minimalAlbums = albums.map((a) => ({
            ...a,
            photos: a.photos.slice(0, 3).map((p) => ({
              ...p,
              url: p.url.startsWith('data:') ? p.url.substring(0, 100) + '...' : p.url,
            })),
          }));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(minimalAlbums));
        } catch {
          // Bỏ qua lỗi quota của localStorage
        }
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Lỗi khi lưu local albums:', err);
  }
}

/**
 * Thêm hoặc cập nhật 1 album (Nếu có Cloud, tải ảnh/video lên Storage và lưu Database)
 */
export async function saveAlbum(
  album: CustomerAlbum,
  onProgress?: (msg: string) => void
): Promise<CustomerAlbum[]> {
  const preparedAlbum: CustomerAlbum = { ...album };

  // 1. Nếu có Cloud, upload các file ảnh/video còn là dataURL lên Supabase Storage
  if (isCloudEnabled()) {
    onProgress?.('Đang tải file lên Cloud Storage...');
    const uploadedPhotos: AlbumPhoto[] = [];

    for (let i = 0; i < preparedAlbum.photos.length; i++) {
      const p = { ...preparedAlbum.photos[i] };
      onProgress?.(`Đang tải tệp ${i + 1}/${preparedAlbum.photos.length} lên Cloud...`);

      // Upload ảnh/video chính
      if (p.url.startsWith('data:')) {
        const isVideo = p.type === 'video';
        const ext = isVideo ? 'mp4' : 'webp';
        const mime = isVideo ? 'video/mp4' : 'image/webp';
        p.url = await uploadToSupabaseStorage(p.url, `${p.id}.${ext}`, mime);
      }

      // Upload thumbnail nếu là video
      if (p.thumbnail && p.thumbnail.startsWith('data:')) {
        p.thumbnail = await uploadToSupabaseStorage(
          p.thumbnail,
          `${p.id}_thumb.webp`,
          'image/webp'
        );
      }

      uploadedPhotos.push(p);
    }

    preparedAlbum.photos = uploadedPhotos;

    // Cập nhật lại ảnh bìa nếu là dataURL
    if (preparedAlbum.coverImage.startsWith('data:')) {
      const coverIdx = album.photos.findIndex(
        (p) => p.url === album.coverImage || (p.thumbnail && p.thumbnail === album.coverImage)
      );
      if (coverIdx >= 0 && preparedAlbum.photos[coverIdx]) {
        const coverItem = preparedAlbum.photos[coverIdx];
        preparedAlbum.coverImage = coverItem.thumbnail || coverItem.url;
      } else {
        const coverItem = preparedAlbum.photos[0];
        preparedAlbum.coverImage = coverItem?.thumbnail || coverItem?.url || '';
      }
    }

    // Lưu vào Supabase Database
    onProgress?.('Đang lưu thông tin vào Cloud Database...');
    await saveAlbumToCloud(preparedAlbum);
  }

  // 2. Lưu vào local IndexedDB
  const currentAlbums = await getAlbums();
  const index = currentAlbums.findIndex((a) => a.id === preparedAlbum.id);

  let updated: CustomerAlbum[];
  if (index >= 0) {
    updated = [...currentAlbums];
    updated[index] = preparedAlbum;
  } else {
    updated = [preparedAlbum, ...currentAlbums];
  }

  await saveLocalAlbums(updated);
  return updated;
}

/**
 * Xóa 1 album và đồng bộ tức thì lên Cloud
 */
export async function deleteAlbum(albumId: string): Promise<CustomerAlbum[]> {
  if (isCloudEnabled()) {
    try {
      await deleteAlbumFromCloud(albumId);
    } catch (err) {
      console.warn('Lỗi khi xóa trên cloud:', err);
    }
  }

  const currentAlbums = await getAlbums();
  const updated = currentAlbums.filter((a) => a.id !== albumId);
  await saveLocalAlbums(updated);

  // Đồng bộ lại Cloud để đảm bảo Cloud không giữ album cũ và luôn đồng nhất với Local
  if (isCloudEnabled()) {
    try {
      await syncAllAlbumsToCloud(updated);
    } catch (err) {
      console.warn('Lỗi đồng bộ Cloud sau khi xóa:', err);
    }
  }

  return updated;
}

/**
 * Đồng bộ toàn bộ danh sách Album lên Supabase Cloud và lưu cache Local
 */
export async function syncAlbums(
  albums: CustomerAlbum[],
  onProgress?: (msg: string) => void
): Promise<CustomerAlbum[]> {
  if (isCloudEnabled()) {
    await syncAllAlbumsToCloud(albums, onProgress);
  }
  await saveLocalAlbums(albums);
  return albums;
}

/**
 * Reset về dữ liệu mẫu ban đầu
 */
export async function resetToDefaultAlbums(): Promise<CustomerAlbum[]> {
  await saveLocalAlbums(INITIAL_CUSTOMER_ALBUMS);
  return INITIAL_CUSTOMER_ALBUMS;
}
