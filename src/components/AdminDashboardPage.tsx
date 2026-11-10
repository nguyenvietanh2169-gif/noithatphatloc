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
  ArrowRight,
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
  Eye,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Monitor,
  BarChart3,
  Globe,
  Save,
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
import {
  getAnalyticsData,
  AnalyticsData,
} from '../utils/analyticsTracker';
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

  // Analytics State (Đo lường lượt xem tự động)
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => getAnalyticsData());

  const handleRefreshAnalytics = () => {
    setAnalytics(getAnalyticsData());
  };

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
  // VIEW 1: AUTHENTICATION (CHUẨN NHƯ APP - RỘNG RÃI & SANG TRỌNG)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between p-4 sm:p-6">
        <header className="flex justify-between items-center max-w-md w-full mx-auto">
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
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
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
            className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-white/5 active:scale-95"
          >
            ← Về website
          </button>
        </header>

        <div className="w-full max-w-xs sm:max-w-sm mx-auto my-auto py-8 px-4">
          <div className="flex flex-col items-center mb-6">
            <Lock className="w-8 h-8 text-white stroke-[1.5] mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-white mb-1.5 tracking-tight">
              Mã PIN Quản Trị
            </h2>
            <p className="text-xs text-neutral-400 text-center">
              Nhập mã bảo mật để truy cập bảng điều khiển
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                className="w-full h-14 bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-none transition-colors"
              />
            </div>

            {pinError && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2.5 px-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Mã PIN không chính xác, vui lòng thử lại</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-white hover:bg-neutral-200 text-black font-medium text-sm rounded-xl transition-colors cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Mở khóa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <footer className="text-center text-[11px] text-neutral-500 py-2">
          Hệ thống quản lý nội thất Phát Lộc
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ADMIN DASHBOARD (TỐI GIẢN - BỚT CHỮ)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E4E6EA] flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0E0F14]/95 backdrop-blur-md border-b border-white/[0.07] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onExitAdmin();
          }}
          className="flex items-center gap-2 group cursor-pointer shrink-0"
        >
          <img
            src="/assets/logo/logo-turquoise-clean.png"
            alt="Nội Thất Phát Lộc"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
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

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => handleOpenCreateForm('3d')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Đăng album</span>
            <span className="sm:hidden">Đăng</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white text-xs font-medium rounded-xl border border-white/[0.08] transition-all cursor-pointer active:scale-95"
            title="Xem website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xem web</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer active:scale-95"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR (DESKTOP) */}
        <aside className="hidden md:flex md:flex-col md:w-56 bg-[#0C0D11] border-r border-white/[0.06] p-4 shrink-0 justify-between gap-4">
          <nav className="flex flex-col gap-1.5 w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'overview'
                  ? 'bg-white/[0.1] text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutGrid className="w-4 h-4 opacity-70" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('manage_3d')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'manage_3d'
                  ? 'bg-white/[0.1] text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-[#00D0E8]" />
                <span>Bản vẽ 3D</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/[0.06] text-neutral-300">
                {design3DAlbums.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('manage_real')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'manage_real'
                  ? 'bg-white/[0.1] text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Thực tế</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/[0.06] text-neutral-300">
                {realAlbums.length}
              </span>
            </button>

            <button
              onClick={() => handleOpenCreateForm('3d')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'editor'
                  ? 'bg-white/[0.1] text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Plus className="w-4 h-4 text-neutral-300" />
              <span>{editingAlbumId ? 'Sửa album' : 'Đăng album'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-white/[0.1] text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Cloud className="w-4 h-4 opacity-70" />
              <span>Đồng bộ</span>
            </button>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full pb-28 md:pb-8">
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
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight">Tổng Quan Website</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Theo dõi lượt truy cập thực tế và dự án của xưởng Phát Lộc
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefreshAnalytics}
                    className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs font-mono rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
                    title="Làm mới số liệu"
                  >
                    Làm mới
                  </button>
                  <a
                    href="https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fnoithatphatloc.com%2F&metrics=CLICKS%2CIMPRESSIONS%2CCTR%2CPOSITION"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white text-xs font-mono rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
                    title="Mở Google Search Console chính thức"
                  >
                    Google Search Console ↗
                  </a>
                  {design3DAlbums.length === 0 && (
                    <button
                      onClick={handleSeedDefault3D}
                      className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 text-xs rounded-lg border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      Nạp 5 album 3D mẫu
                    </button>
                  )}
                </div>
              </div>

              {/* KHỐI 1: LƯỢT TRUY CẬP WEBSITE THỰC TẾ (PAGEVIEWS & TRAFFIC) */}
              <div className="bg-[#101115] border border-white/[0.06] p-5 sm:p-6 rounded-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-400 block">
                      Hệ Thống Đo Lường Tự Động
                    </span>
                    <h3 className="text-sm font-medium text-white tracking-wide mt-0.5">
                      Lượt Xem Website Thực Tế
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-2 py-0.5 rounded border border-white/10 bg-white/[0.02]">
                    Tự động 24/7
                  </span>
                </div>

                {/* 4 Stats Live Traffic */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block mb-1">
                      Tổng lượt xem
                    </span>
                    <div className="text-2xl sm:text-3xl font-light text-white font-mono">
                      {analytics.totalViews.toLocaleString('vi-VN')}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block">Tích lũy thực tế</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block mb-1">
                      Hôm nay
                    </span>
                    <div className="text-2xl sm:text-3xl font-light text-white font-mono">
                      {analytics.todayViews.toLocaleString('vi-VN')}
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block font-mono">{analytics.todayDate}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block mb-1">
                      Thiết bị di động
                    </span>
                    <div className="text-2xl sm:text-3xl font-light text-white font-mono">
                      {Math.round(
                        (analytics.mobileCount / (analytics.mobileCount + analytics.desktopCount || 1)) * 100
                      )}%
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block font-mono">
                      {analytics.mobileCount} lượt
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400 block mb-1">
                      Máy tính
                    </span>
                    <div className="text-2xl sm:text-3xl font-light text-white font-mono">
                      {Math.round(
                        (analytics.desktopCount / (analytics.mobileCount + analytics.desktopCount || 1)) * 100
                      )}%
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1 block font-mono">
                      {analytics.desktopCount} lượt
                    </span>
                  </div>
                </div>

                {/* Biểu đồ tối giản */}
                {analytics.history && analytics.history.length > 0 && (
                  <div className="bg-white/[0.015] border border-white/[0.04] p-4 rounded-xl">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                      <span className="text-[10px] uppercase tracking-wider font-mono">Lịch sử truy cập</span>
                      <span className="font-mono text-[10px] text-neutral-400">Theo ngày</span>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-24 pt-4 px-2">
                      {analytics.history.map((day, idx) => {
                        const maxVal = Math.max(...analytics.history.map((h) => h.views), 20);
                        const heightPct = Math.max(14, Math.round((day.views / maxVal) * 100));
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                            <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors">
                              {day.views}
                            </span>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full max-w-[24px] rounded-t-sm bg-white/20 group-hover:bg-white/60 transition-colors"
                            />
                            <span className="text-[10px] font-mono text-neutral-400 mt-1">{day.date}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* KHỐI 3: QUẢN LÝ ALBUM & DỰ ÁN */}
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-base font-bold text-white tracking-tight">Nội dung Album & Dự án</h3>
                <span className="text-xs text-neutral-400 font-mono">{albums.length} album</span>
              </div>

              {/* 4 Stats Album */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-[#121319] border border-white/[0.08] p-4 sm:p-5 rounded-2xl shadow-sm">
                  <span className="text-xs text-neutral-400 block mb-1">Tổng album</span>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{albums.length}</div>
                </div>

                <div
                  onClick={() => setActiveTab('manage_3d')}
                  className="bg-[#121319] border border-white/[0.08] hover:border-[#00D0E8]/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-sm"
                >
                  <span className="text-xs text-neutral-400 block mb-1">Bản vẽ 3D</span>
                  <div className="text-2xl sm:text-3xl font-bold text-[#00D0E8] font-mono">
                    {design3DAlbums.length}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('manage_real')}
                  className="bg-[#121319] border border-white/[0.08] hover:border-amber-400/40 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all active:scale-98 shadow-sm"
                >
                  <span className="text-xs text-neutral-400 block mb-1">Thực tế</span>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                    {realAlbums.length}
                  </div>
                </div>

                <div className="bg-[#121319] border border-white/[0.08] p-4 sm:p-5 rounded-2xl shadow-sm">
                  <span className="text-xs text-neutral-400 block mb-1">Hình ảnh</span>
                  <div className="text-2xl sm:text-3xl font-bold text-neutral-200 font-mono">
                    {totalPhotosCount}
                  </div>
                </div>
              </div>

              {/* Recent Albums List */}
              <div className="bg-[#121319] border border-white/[0.08] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 sm:px-5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-200">Album gần đây</span>
                  <span className="text-xs text-neutral-400 font-mono">{albums.length}</span>
                </div>

                <div className="divide-y divide-white/[0.04]">
                  {albums.map((album) => {
                    const is3d = is3DAlbum(album);
                    return (
                      <div
                        key={album.id}
                        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                          <img
                            src={album.coverImage || album.photos[0]?.url}
                            alt=""
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-black/40 shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[170px] sm:max-w-md">
                              {album.projectTitle}
                            </h4>
                            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2">
                              <span className={is3d ? 'text-[#00D0E8] font-medium' : 'text-amber-400 font-medium'}>
                                {is3d ? '3D' : 'Thực tế'}
                              </span>
                              <span>•</span>
                              <span className="truncate">{album.customerName || album.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <span className="hidden sm:inline text-xs text-neutral-400 font-mono mr-1">
                            {album.photos.length} ảnh
                          </span>
                          <button
                            onClick={() => handleStartEdit(album)}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-[#00D0E8] transition-all cursor-pointer active:scale-95"
                            title="Sửa album"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album)}
                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer active:scale-95"
                            title="Xóa album"
                          >
                            <Trash2 className="w-4 h-4" />
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
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {activeTab === 'manage_3d' ? 'Album Bản Vẽ 3D' : 'Album Thực Tế'}
                </h2>

                <button
                  onClick={() => handleOpenCreateForm(activeTab === 'manage_3d' ? '3d' : 'real')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Thêm album</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên khách, dự án, địa điểm..."
                  className="w-full bg-[#121319] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                      className="bg-[#121319] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                      <div className="relative aspect-[16/10] bg-black/40">
                        <img
                          src={album.coverImage || album.photos[0]?.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-full text-[11px] font-medium text-white border border-white/10">
                          {album.photos.length} ảnh
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-xs text-[#00D0E8] font-mono mb-1 font-semibold uppercase tracking-wide">
                            {album.customerName || 'Khách hàng'}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                            {album.projectTitle}
                          </h3>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            {album.location}
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="text-[11px] text-neutral-400 font-mono">{album.completedDate || '2025'}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEdit(album)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg transition-colors active:scale-95 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAlbum(album)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors active:scale-95 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa</span>
                            </button>
                          </div>
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
                <div className="p-1.5 bg-[#121319] border border-white/[0.08] rounded-2xl flex gap-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setAlbumType('3d');
                      if (!selectedCategories.includes('Bản Vẽ 3D')) {
                        setSelectedCategories(['Bản Vẽ 3D', ...selectedCategories]);
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-98 ${
                      albumType === '3d' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
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
                    className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-98 ${
                      albumType === 'real' ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Công trình thực tế
                  </button>
                </div>

                {/* Fields */}
                <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Chủ công trình *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ví dụ: Gia đình Chú Hùng, Biệt Thự Aqua City..."
                        className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Tiêu đề album *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Ví dụ: Phối Cảnh 3D Biệt Thự Waterfront"
                        className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Địa điểm
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Biên Hòa, Đồng Nai"
                        className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Thời gian
                      </label>
                      <input
                        type="text"
                        value={completedDate}
                        onChange={(e) => setCompletedDate(e.target.value)}
                        placeholder="2025"
                        className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      Hạng mục
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(albumType === '3d' ? PRESET_CATEGORIES_3D : PRESET_CATEGORIES_REAL).map(
                        (cat) => {
                          const isSelected = selectedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                                isSelected
                                  ? 'bg-[#00D0E8] text-black font-semibold shadow-sm'
                                  : 'bg-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.1] border border-white/5'
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
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Quy cách vật liệu (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={materialNotes}
                      onChange={(e) => setMaterialNotes(e.target.value)}
                      placeholder="MDF lõi xanh An Cường, cánh kính khung nhôm..."
                      className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-white">
                      Hình ảnh ({uploadedPhotos.length})
                    </label>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] text-white rounded-xl text-xs font-medium transition-colors active:scale-95 cursor-pointer"
                    >
                      Chọn tệp
                    </button>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-[#00D0E8]/40 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-white/[0.01]"
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
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab(albumType === '3d' ? 'manage_3d' : 'manage_real')}
                    className="px-4 py-2.5 text-xs sm:text-sm text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-white text-black font-bold text-xs sm:text-sm rounded-xl hover:bg-neutral-200 transition-all cursor-pointer active:scale-95 shadow-md flex items-center gap-2"
                  >
                    <span>{isProcessing ? 'Đang lưu...' : 'Lưu album'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: CLOUD */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Đồng bộ Cloud</h2>

              <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Supabase URL
                  </label>
                  <input
                    type="text"
                    value={cloudUrl}
                    onChange={(e) => setCloudUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    API Key (Anon Key)
                  </label>
                  <input
                    type="password"
                    value={cloudKey}
                    onChange={(e) => setCloudKey(e.target.value)}
                    placeholder="sb_publishable_..."
                    className="w-full bg-[#161722] border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#00D0E8]/50 transition-colors"
                  />
                </div>

                <button
                  onClick={handleSaveCloudSettings}
                  className="px-5 py-2.5 bg-white text-black font-bold text-xs sm:text-sm rounded-xl hover:bg-neutral-200 transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  Lưu cấu hình
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer active:scale-95"
                >
                  Khôi phục album mẫu ban đầu
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (CHUẨN NHƯ APP) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E0F14]/98 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'overview' ? 'text-[#00D0E8]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab('manage_3d')}
          className={`relative flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'manage_3d' ? 'text-[#00D0E8]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Bản vẽ 3D</span>
          {design3DAlbums.length > 0 && (
            <span className="absolute -top-0.5 right-[20%] px-1.5 py-0.2 bg-[#00D0E8] text-black text-[9px] font-bold rounded-full">
              {design3DAlbums.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('manage_real')}
          className={`relative flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'manage_real' ? 'text-[#00D0E8]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Thực tế</span>
          {realAlbums.length > 0 && (
            <span className="absolute -top-0.5 right-[20%] px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-bold rounded-full">
              {realAlbums.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleOpenCreateForm('3d')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'editor' ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'
          }`}
        >
          <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center mb-0.5 shadow-sm">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight">Đăng</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'settings' ? 'text-[#00D0E8]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Cloud className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Đồng bộ</span>
        </button>
      </nav>
    </div>
  );
};
