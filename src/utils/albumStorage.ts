import { CustomerAlbum, AlbumPhoto, is3DAlbum } from '../types/album';
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
const DELETED_ALBUMS_KEY = 'phat_loc_deleted_album_ids';

export function getDeletedAlbumIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_ALBUMS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markAlbumAsDeleted(id: string): void {
  const deleted = getDeletedAlbumIds();
  deleted.add(id);
  try {
    localStorage.setItem(DELETED_ALBUMS_KEY, JSON.stringify(Array.from(deleted)));
  } catch {
    // Bỏ qua lỗi quota
  }
}

export function clearDeletedAlbumIds(): void {
  localStorage.removeItem(DELETED_ALBUMS_KEY);
}

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
  const deletedIds = getDeletedAlbumIds();

  // 1. Nếu có kết nối Cloud, thử tải từ Supabase trước
  if (isCloudEnabled()) {
    try {
      const cloudAlbums = await fetchAlbumsFromCloud();
      if (cloudAlbums && cloudAlbums.length > 0) {
        // Lọc bỏ triệt để các album mà admin đã bấm xóa
        const finalAlbums = cloudAlbums.filter((a) => !deletedIds.has(a.id));
        finalAlbums.sort((a, b) => b.createdAt - a.createdAt);
        // Cache lại vào IndexedDB để chạy siêu tốc
        saveLocalAlbums(finalAlbums).catch(() => {});
        return finalAlbums;
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
        let albums = request.result as CustomerAlbum[];
        if (!albums || albums.length === 0) {
          const initial = INITIAL_CUSTOMER_ALBUMS.filter((a) => !deletedIds.has(a.id));
          await saveLocalAlbums(initial);
          resolve(initial);
        } else {
          const filtered = albums.filter((a) => !deletedIds.has(a.id));
          filtered.sort((a, b) => b.createdAt - a.createdAt);
          resolve(filtered);
        }
      };

      request.onerror = () => {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        const list: CustomerAlbum[] = cached ? JSON.parse(cached) : INITIAL_CUSTOMER_ALBUMS;
        resolve(list.filter((a) => !deletedIds.has(a.id)));
      };
    });
  } catch {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: CustomerAlbum[] = cached ? JSON.parse(cached) : INITIAL_CUSTOMER_ALBUMS;
    return list.filter((a) => !deletedIds.has(a.id));
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

  // Nếu album này từng bị đánh dấu xóa trước đó, gỡ bỏ khỏi danh sách đã xóa
  const deleted = getDeletedAlbumIds();
  if (deleted.has(preparedAlbum.id)) {
    deleted.delete(preparedAlbum.id);
    try {
      localStorage.setItem(DELETED_ALBUMS_KEY, JSON.stringify(Array.from(deleted)));
    } catch {
      // Bỏ qua lỗi
    }
  }

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
  // 1. Đánh dấu đã xóa vĩnh viễn
  markAlbumAsDeleted(albumId);

  // 2. Gửi lệnh xóa trực tiếp lên Cloud Supabase
  if (isCloudEnabled()) {
    try {
      await deleteAlbumFromCloud(albumId);
    } catch (err) {
      console.warn('Lỗi khi xóa trên cloud:', err);
    }
  }

  // 3. Xóa trong IndexedDB local
  const currentAlbums = await getAlbums();
  const updated = currentAlbums.filter((a) => a.id !== albumId);
  await saveLocalAlbums(updated);

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
  clearDeletedAlbumIds();
  await saveLocalAlbums(INITIAL_CUSTOMER_ALBUMS);
  if (isCloudEnabled()) {
    try {
      await syncAllAlbumsToCloud(INITIAL_CUSTOMER_ALBUMS);
    } catch (err) {
      console.warn('Lỗi sync default to cloud:', err);
    }
  }
  return INITIAL_CUSTOMER_ALBUMS;
}
