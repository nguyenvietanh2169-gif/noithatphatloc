import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Image as ImageIcon,
  Plus,
  Upload,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Search,
  ExternalLink,
  Lock,
  LogOut,
  RefreshCw,
  FolderArchive,
  Compass,
  Star,
  HardDrive,
  Cloud,
  X,
  LayoutGrid,
} from 'lucide-react';
import { CustomerAlbum, AlbumPhoto, is3DAlbum } from '../types/album';
import { compressImage, extractVideoThumbnail } from '../utils/imageCompressor';
import { saveAlbum, deleteAlbum, resetToDefaultAlbums } from '../utils/albumStorage';
import {
  isCloudEnabled,
  getCloudConfig,
  saveCloudConfig,
  fetchAlbumsFromCloud,
  syncAllAlbumsToCloud,
} from '../utils/cloudSync';
import { INITIAL_CUSTOMER_ALBUMS } from '../data/defaultAlbums';

interface AdminDashboardPageProps {
  albums: CustomerAlbum[];
  onAlbumsUpdated: (albums: CustomerAlbum[]) => void;
  onExitAdmin: () => void;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const PRESET_CATEGORIES_3D = [
  'Bản Vẽ 3D',
  'Căn Hộ',
  'Biệt Thự',
  'Nhà Phố',
  'Phòng Khách',
  'Phòng Bếp',
  'Tủ Áo Cánh Kính',
  'Phòng Ngủ',
  'Tủ Rượu',
  'Vách Tivi',
];

const PRESET_CATEGORIES_REAL = [
  'Tủ Bếp',
  'Phòng Khách',
  'Tủ Áo',
  'Tủ Bếp Đảo',
  'Tủ Rượu',
  'Phòng Ngủ',
  'Vách Tivi',
  'Bàn Làm Việc',
  'Căn Hộ',
  'Nhà Phố',
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  albums,
  onAlbumsUpdated,
  onExitAdmin,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('phat_loc_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab: 'overview' | 'manage_3d' | 'manage_real' | 'editor' | 'settings'
  const [activeTab, setActiveTab] = useState<
    'overview' | 'manage_3d' | 'manage_real' | 'editor' | 'settings'
  >('overview');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumType, setAlbumType] = useState<'3d' | 'real'>('3d');
  const [customerName, setCustomerName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [location, setLocation] = useState('Biên Hòa, Đồng Nai');
  const [completedDate, setCompletedDate] = useState('2025');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Bản Vẽ 3D', 'Phòng Khách']);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [materialNotes, setMaterialNotes] = useState('');
  const [testimonial, setTestimonial] = useState('');

  // Media
  const [uploadedPhotos, setUploadedPhotos] = useState<AlbumPhoto[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number>(0);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloud Config State
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudKey, setCloudKey] = useState('');

  useEffect(() => {
    const config = getCloudConfig();
    if (config) {
      setCloudUrl(config.url);
      setCloudKey(config.anonKey);
    }
  }, []);

  const design3DAlbums = albums.filter((a) => is3DAlbum(a));
  const realAlbums = albums.filter((a) => !is3DAlbum(a));
  const totalPhotosCount = albums.reduce((acc, a) => acc + (a.photos?.length || 0), 0);

  // Reset form
  const handleOpenCreateForm = (type: '3d' | 'real' = '3d') => {
    setEditingAlbumId(null);
    setAlbumType(type);
    setCustomerName('');
    setProjectTitle('');
    setLocation('Biên Hòa, Đồng Nai');
    setCompletedDate(type === '3d' ? '2025' : 'Tháng 02/2025');
    setSelectedCategories(type === '3d' ? ['Bản Vẽ 3D', 'Phòng Khách'] : ['Tủ Bếp', 'Phòng Khách']);
    setCustomCategoryInput('');
    setMaterialNotes('');
    setTestimonial('');
    setUploadedPhotos([]);
    setCoverPhotoIndex(0);
    setActiveTab('editor');
    setStatusMessage(null);
  };

  // Start Edit
  const handleStartEdit = (album: CustomerAlbum) => {
    const is3d = is3DAlbum(album);
    setEditingAlbumId(album.id);
    setAlbumType(is3d ? '3d' : 'real');
    setCustomerName(album.customerName || '');
    setProjectTitle(album.projectTitle || '');
    setLocation(album.location || 'Biên Hòa, Đồng Nai');
    setCompletedDate(album.completedDate || '');
    setSelectedCategories(album.categories || []);
    setMaterialNotes(album.materialNotes || '');
    setTestimonial(album.testimonial || '');
    setUploadedPhotos(album.photos || []);

    const coverIdx = (album.photos || []).findIndex(
      (p) => p.url === album.coverImage || (p.thumbnail && p.thumbnail === album.coverImage)
    );
    setCoverPhotoIndex(coverIdx >= 0 ? coverIdx : 0);

    setActiveTab('editor');
    setStatusMessage(null);
  };

  // Toggle category
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (trimmed && !selectedCategories.includes(trimmed)) {
      setSelectedCategories((prev) => [...prev, trimmed]);
      setCustomCategoryInput('');
    }
  };

  // PIN Login
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '123456') {
      setIsAuthenticated(true);
      sessionStorage.setItem('phat_loc_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('phat_loc_admin_auth');
    setPinInput('');
  };

  // Upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setStatusMessage('Đang tải ảnh...');
    setStatusType('info');

    const newItems: AlbumPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        if (file.type.startsWith('video/')) {
          const [thumbnail, videoUrl] = await Promise.all([
            extractVideoThumbnail(file).catch(() => ''),
            readFileAsDataURL(file),
          ]);
          newItems.push({
            id: 'video-' + Date.now() + '-' + i,
            url: videoUrl,
            type: 'video',
            thumbnail: thumbnail || undefined,
            caption: '',
            originalSize: file.size,
            compressedSize: file.size,
          });
        } else {
          const result = await compressImage(file, 1920, 1920, 0.82);
          newItems.push({
            id: 'photo-' + Date.now() + '-' + i,
            url: result.dataUrl,
            type: 'image',
            caption: '',
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            reductionPercentage: result.reductionPercentage,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    setUploadedPhotos((prev) => [...prev, ...newItems]);
    setIsProcessing(false);
    setStatusMessage(`Đã thêm ${newItems.length} ảnh`);
    setStatusType('success');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    if (coverPhotoIndex >= index && coverPhotoIndex > 0) {
      setCoverPhotoIndex(coverPhotoIndex - 1);
    }
  };

  // Save
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !projectTitle.trim()) {
      alert('Vui lòng nhập tên chủ công trình và tiêu đề album!');
      return;
    }

    if (uploadedPhotos.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ảnh!');
      return;
    }

    const categories = [...selectedCategories];
    if (albumType === '3d' && !categories.some((c) => c.toLowerCase().includes('3d'))) {
      categories.unshift('Bản Vẽ 3D');
    }

    const coverItem = uploadedPhotos[coverPhotoIndex] || uploadedPhotos[0];
    const coverUrl =
      coverItem.type === 'video' && coverItem.thumbnail ? coverItem.thumbnail : coverItem.url;

    const existingAlbum = editingAlbumId ? albums.find((a) => a.id === editingAlbumId) : null;

    const albumToSave: CustomerAlbum = {
      id: editingAlbumId || (albumType === '3d' ? 'album-3d-' : 'album-') + Date.now(),
      customerName: customerName.trim(),
      projectTitle: projectTitle.trim(),
      location: location.trim() || 'Biên Hòa, Đồng Nai',
      completedDate: completedDate.trim() || '2025',
      coverImage: coverUrl,
      categories: categories.length > 0 ? categories : [albumType === '3d' ? 'Bản Vẽ 3D' : 'Nội Thất May Đo'],
      photos: uploadedPhotos,
      albumType: albumType,
      testimonial: testimonial.trim() || undefined,
      materialNotes: materialNotes.trim() || undefined,
      createdAt: existingAlbum ? existingAlbum.createdAt : Date.now(),
    };

    setIsProcessing(true);
    setStatusMessage('Đang lưu...');
    setStatusType('info');

    try {
      const updated = await saveAlbum(albumToSave, (msg) => setStatusMessage(msg));
      onAlbumsUpdated(updated);
      setIsProcessing(false);
      setStatusMessage('Đã lưu thành công');
      setStatusType('success');

      setTimeout(() => {
        setActiveTab(albumType === '3d' ? 'manage_3d' : 'manage_real');
      }, 400);
    } catch (err: any) {
      setIsProcessing(false);
      setStatusMessage('Lỗi: ' + (err.message || 'Không thể lưu'));
      setStatusType('error');
    }
  };

  // Delete
  const handleDeleteAlbum = async (album: CustomerAlbum) => {
    if (confirm(`Xóa album "${album.projectTitle}"?`)) {
      setIsProcessing(true);
      try {
        const updated = await deleteAlbum(album.id);
        onAlbumsUpdated(updated);
        setStatusMessage('Đã xóa');
        setStatusType('success');
      } catch (err: any) {
        setStatusMessage('Lỗi: ' + err.message);
        setStatusType('error');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Nạp album mẫu
  const handleSeedDefault3D = async () => {
    const default3D = INITIAL_CUSTOMER_ALBUMS.filter((a) => is3DAlbum(a));
    const merged = [...albums.filter((a) => !is3DAlbum(a)), ...default3D];
    setIsProcessing(true);
    try {
      for (const alb of default3D) {
        await saveAlbum(alb);
      }
      onAlbumsUpdated(merged);
      setStatusMessage('Đã nạp 5 album mẫu');
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage('Lỗi: ' + err.message);
      setStatusType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save Cloud
  const handleSaveCloudSettings = () => {
    if (!cloudUrl.trim() || !cloudKey.trim()) {
      saveCloudConfig(null);
      alert('Đã xóa cấu hình');
      return;
    }
    saveCloudConfig({ url: cloudUrl.trim(), anonKey: cloudKey.trim() });
    alert('Đã lưu cấu hình');
  };

  const handleResetDefaults = async () => {
    if (confirm('Khôi phục toàn bộ album mẫu ban đầu?')) {
      setIsProcessing(true);
      const res = await resetToDefaultAlbums();
      onAlbumsUpdated(res);
      setIsProcessing(false);
      alert('Đã khôi phục dữ liệu mẫu');
    }
  };

  // =========================================================================
  // VIEW 1: AUTHENTICATION (CỰC KỲ TỐI GIẢN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col justify-between p-6">
        <header className="flex justify-between items-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onExitAdmin();
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <img
              src="/assets/logo/logo-turquoise-clean.png"
              alt="Nội Thất Phát Lộc"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="font-heading text-sm sm:text-base font-black tracking-tight text-white leading-none">
                PHÁT LỘC
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.18em] text-[#00D0E8] font-bold mt-0.5 whitespace-nowrap">
                ADMIN PANEL
              </span>
            </div>
          </a>
          <button
            onClick={onExitAdmin}
            className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Về website
          </button>
        </header>

        <div className="flex justify-center">
          <div className="w-full max-w-xs bg-[#121318] border border-white/[0.08] rounded-xl p-6 shadow-xl">
            <h2 className="text-base font-semibold text-center mb-4">Mã PIN</h2>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                maxLength={10}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                className="w-full bg-[#1A1C24] border border-white/[0.1] rounded-lg px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-white/30"
              />
              {pinError && (
                <p className="text-[11px] text-rose-400 text-center">Sai mã PIN</p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Mở khóa
              </button>
            </form>
          </div>
        </div>

        <div />
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ADMIN DASHBOARD (TỐI GIẢN - BỚT CHỮ)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E4E6EA] flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0E0F14]/95 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onExitAdmin();
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <img
            src="/assets/logo/logo-turquoise-clean.png"
            alt="Nội Thất Phát Lộc"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <span className="font-heading text-xs sm:text-sm font-black tracking-tight text-white leading-none">
              PHÁT LỘC
            </span>
            <span className="text-[7.5px] sm:text-[8px] uppercase tracking-[0.18em] text-[#00D0E8] font-bold mt-0.5 whitespace-nowrap">
              ADMIN PANEL
            </span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCreateForm('3d')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Đăng album</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs rounded-lg border border-white/[0.08] transition-all cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Xem web</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full md:w-52 bg-[#0C0D11] border-r border-white/[0.06] p-3 shrink-0 flex md:flex-col justify-between gap-3 overflow-x-auto">
          <nav className="flex md:flex-col gap-1 w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 opacity-70" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('manage_3d')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'manage_3d'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-3.5 h-3.5 text-[#00D0E8]" />
                <span>Bản vẽ 3D</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white/[0.06] text-neutral-400">
                {design3DAlbums.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('manage_real')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'manage_real'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Thực tế</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-white/[0.06] text-neutral-400">
                {realAlbums.length}
              </span>
            </button>

            <button
              onClick={() => handleOpenCreateForm('3d')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'editor'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-neutral-300" />
              <span>{editingAlbumId ? 'Sửa album' : 'Đăng album'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 opacity-70" />
              <span>Đồng bộ</span>
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
          {/* Status Banner */}
          {statusMessage && (
            <div className="mb-4 p-3 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-between text-xs">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage(null)}>
                <X className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Tổng quan</h2>
                {design3DAlbums.length === 0 && (
                  <button
                    onClick={handleSeedDefault3D}
                    className="px-3 py-1 bg-[#00D0E8] text-black text-xs font-semibold rounded-lg hover:bg-white transition-all cursor-pointer"
                  >
                    Nạp 5 album 3D mẫu
                  </button>
                )}
              </div>

              {/* 4 Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#101116] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Tổng album</span>
                  <div className="text-xl font-semibold text-white font-mono">{albums.length}</div>
                </div>

                <div
                  onClick={() => setActiveTab('manage_3d')}
                  className="bg-[#101116] border border-white/[0.06] hover:border-[#00D0E8]/40 p-3.5 rounded-lg cursor-pointer transition-all"
                >
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Bản vẽ 3D</span>
                  <div className="text-xl font-semibold text-[#00D0E8] font-mono">
                    {design3DAlbums.length}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('manage_real')}
                  className="bg-[#101116] border border-white/[0.06] hover:border-amber-400/40 p-3.5 rounded-lg cursor-pointer transition-all"
                >
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Thực tế</span>
                  <div className="text-xl font-semibold text-amber-300 font-mono">
                    {realAlbums.length}
                  </div>
                </div>

                <div className="bg-[#101116] border border-white/[0.06] p-3.5 rounded-lg">
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Hình ảnh</span>
                  <div className="text-xl font-semibold text-neutral-200 font-mono">
                    {totalPhotosCount}
                  </div>
                </div>
              </div>

              {/* Recent Albums List */}
              <div className="bg-[#101116] border border-white/[0.06] rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">Album gần đây</span>
                  <span className="text-[11px] text-neutral-500 font-mono">{albums.length}</span>
                </div>

                <div className="divide-y divide-white/[0.04]">
                  {albums.map((album) => {
                    const is3d = is3DAlbum(album);
                    return (
                      <div
                        key={album.id}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={album.coverImage || album.photos[0]?.url}
                            alt=""
                            className="w-10 h-10 rounded object-cover bg-black/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-medium text-white truncate max-w-sm sm:max-w-md">
                              {album.projectTitle}
                            </h4>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {is3d ? '3D' : 'Thực tế'} • {album.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] text-neutral-500 font-mono mr-2">
                            {album.photos.length} ảnh
                          </span>
                          <button
                            onClick={() => handleStartEdit(album)}
                            className="p-1 text-neutral-400 hover:text-white rounded"
                            title="Sửa"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album)}
                            className="p-1 text-neutral-400 hover:text-rose-400 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: MANAGE 3D / REAL */}
          {(activeTab === 'manage_3d' || activeTab === 'manage_real') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-white">
                  {activeTab === 'manage_3d' ? 'Album Bản Vẽ 3D' : 'Album Thực Tế'}
                </h2>

                <button
                  onClick={() => handleOpenCreateForm(activeTab === 'manage_3d' ? '3d' : 'real')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm album</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full bg-[#101116] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeTab === 'manage_3d' ? design3DAlbums : realAlbums)
                  .filter((a) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      a.projectTitle.toLowerCase().includes(q) ||
                      a.customerName.toLowerCase().includes(q) ||
                      a.location.toLowerCase().includes(q)
                    );
                  })
                  .map((album) => (
                    <div
                      key={album.id}
                      className="bg-[#101116] border border-white/[0.06] rounded-lg overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] bg-black/40">
                        <img
                          src={album.coverImage || album.photos[0]?.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-white">
                          {album.photos.length} ảnh
                        </div>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="text-xs font-semibold text-white line-clamp-1">
                            {album.projectTitle}
                          </h3>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            {album.location}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/[0.05] flex justify-end gap-1">
                          <button
                            onClick={() => handleStartEdit(album)}
                            className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white rounded"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album)}
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-rose-400 rounded"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDITOR (TỐI GIẢN - ÍT CHỮ) */}
          {activeTab === 'editor' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h2 className="text-base font-bold text-white">
                  {editingAlbumId ? 'Sửa album' : 'Đăng album'}
                </h2>
                <button
                  onClick={() => setActiveTab(albumType === '3d' ? 'manage_3d' : 'manage_real')}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Hủy
                </button>
              </div>

              <form onSubmit={handleSaveAlbum} className="space-y-4">
                {/* Segmented Type Switcher */}
                <div className="p-1 bg-[#121319] border border-white/[0.08] rounded-lg flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAlbumType('3d');
                      if (!selectedCategories.includes('Bản Vẽ 3D')) {
                        setSelectedCategories(['Bản Vẽ 3D', ...selectedCategories]);
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      albumType === '3d' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Bản vẽ 3D
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAlbumType('real');
                      setSelectedCategories(selectedCategories.filter((c) => c !== 'Bản Vẽ 3D'));
                    }}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      albumType === 'real' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Công trình thực tế
                  </button>
                </div>

                {/* Fields */}
                <div className="bg-[#101116] border border-white/[0.06] rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Chủ công trình *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ví dụ: Gia đình Chú Hùng, Biệt Thự Aqua City..."
                        className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Tiêu đề album *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Ví dụ: Phối Cảnh 3D Biệt Thự Waterfront"
                        className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Địa điểm
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Biên Hòa, Đồng Nai"
                        className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Thời gian
                      </label>
                      <input
                        type="text"
                        value={completedDate}
                        onChange={(e) => setCompletedDate(e.target.value)}
                        placeholder="2025"
                        className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Hạng mục
                    </label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(albumType === '3d' ? PRESET_CATEGORIES_3D : PRESET_CATEGORIES_REAL).map(
                        (cat) => {
                          const isSelected = selectedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-black font-medium'
                                  : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Material notes */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Quy cách (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={materialNotes}
                      onChange={(e) => setMaterialNotes(e.target.value)}
                      placeholder="MDF lõi xanh An Cường, cánh kính khung nhôm..."
                      className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="bg-[#101116] border border-white/[0.06] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-white">
                      Hình ảnh ({uploadedPhotos.length})
                    </label>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-white/[0.08] hover:bg-white/[0.15] text-white rounded text-xs transition-colors"
                    >
                      Chọn tệp
                    </button>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-white/[0.15] hover:border-white/[0.3] rounded-lg p-5 text-center cursor-pointer transition-colors bg-white/[0.01]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-xs text-neutral-300">Kéo thả hoặc chọn ảnh</p>
                  </div>

                  {/* Photos Grid */}
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {uploadedPhotos.map((item, idx) => {
                        const isCover = coverPhotoIndex === idx;
                        return (
                          <div
                            key={item.id}
                            className={`group relative aspect-square rounded overflow-hidden bg-black/40 border ${
                              isCover ? 'border-[#00D0E8] ring-1 ring-[#00D0E8]' : 'border-white/[0.08]'
                            }`}
                          >
                            <img
                              src={item.thumbnail || item.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {isCover && (
                              <div className="absolute top-1 left-1 px-1 rounded bg-[#00D0E8] text-black text-[8px] font-bold">
                                Bìa
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCoverPhotoIndex(idx);
                                }}
                                className={`p-1 rounded ${
                                  isCover ? 'bg-[#00D0E8] text-black' : 'bg-white/20 text-white'
                                }`}
                                title="Ảnh bìa"
                              >
                                <Star className="w-3 h-3 fill-current" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePhoto(idx);
                                }}
                                className="p-1 rounded bg-rose-500/80 text-white"
                                title="Xóa"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab(albumType === '3d' ? 'manage_3d' : 'manage_real')}
                    className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-1.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    {isProcessing ? 'Đang lưu...' : 'Lưu album'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: CLOUD */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-base font-bold text-white">Đồng bộ Cloud</h2>

              <div className="bg-[#101116] border border-white/[0.06] rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Supabase URL
                  </label>
                  <input
                    type="text"
                    value={cloudUrl}
                    onChange={(e) => setCloudUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={cloudKey}
                    onChange={(e) => setCloudKey(e.target.value)}
                    placeholder="sb_publishable_..."
                    className="w-full bg-[#16171E] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <button
                  onClick={handleSaveCloudSettings}
                  className="px-3.5 py-1.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200"
                >
                  Lưu
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetDefaults}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Khôi phục album mẫu ban đầu
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
