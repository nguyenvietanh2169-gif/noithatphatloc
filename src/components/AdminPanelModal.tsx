import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Trash2,
  Lock,
  Plus,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Star,
  Play,
} from 'lucide-react';
import { CustomerAlbum, AlbumPhoto } from '../types/album';
import { compressImage, extractVideoThumbnail, formatFileSize } from '../utils/imageCompressor';
import { saveAlbum, deleteAlbum } from '../utils/albumStorage';
import { isCloudEnabled, fetchAlbumsFromCloud, syncAllAlbumsToCloud } from '../utils/cloudSync';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  albums: CustomerAlbum[];
  onAlbumsUpdated: (albums: CustomerAlbum[]) => void;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  albums,
  onAlbumsUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('phat_loc_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab: 'create' | 'manage'
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [location, setLocation] = useState('Biên Hòa, Đồng Nai');
  const [completedDate, setCompletedDate] = useState('Tháng 11/2024');
  const [categoriesInput, setCategoriesInput] = useState('Tủ Bếp, Phòng Khách, Tủ Áo');
  const [materialNotes, setMaterialNotes] = useState(
    'MDF Lõi Xanh An Cường • Cánh Kính Slim Khung Nhôm Anode'
  );
  const [testimonial, setTestimonial] = useState('');

  // Danh sách ảnh & video trong album hiện tại
  const [uploadedPhotos, setUploadedPhotos] = useState<AlbumPhoto[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number>(0);

  // Tiến trình xử lý
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState<{
    current: number;
    total: number;
  }>({ current: 0, total: 0 });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tự động kiểm tra và đồng bộ danh sách hiện tại lên Cloud nếu Cloud đang trống
  useEffect(() => {
    if (isOpen && isAuthenticated && isCloudEnabled() && albums.length > 0) {
      fetchAlbumsFromCloud().then((cloudList) => {
        if (!cloudList || cloudList.length === 0) {
          syncAllAlbumsToCloud(albums).catch((err) =>
            console.warn('Auto sync cloud error:', err)
          );
        }
      });
    }
  }, [isOpen, isAuthenticated, albums]);

  if (!isOpen) return null;

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

  // Xử lý upload cả Ảnh & Video
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setStatusMessage('Đang xử lý media...');

    const newItems: AlbumPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProcessProgress({ current: i + 1, total: files.length });

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
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            originalSize: file.size,
            compressedSize: file.size,
          });
        } else {
          const result = await compressImage(file, 1920, 1920, 0.82);
          newItems.push({
            id: 'photo-' + Date.now() + '-' + i,
            url: result.dataUrl,
            type: 'image',
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            reductionPercentage: result.reductionPercentage,
          });
        }
      } catch (err) {
        console.error('Lỗi khi xử lý file:', err);
      }
    }

    setUploadedPhotos((prev) => [...prev, ...newItems]);
    setIsProcessing(false);
    setStatusMessage(`Đã thêm ${newItems.length} tệp`);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    if (coverPhotoIndex >= index && coverPhotoIndex > 0) {
      setCoverPhotoIndex(coverPhotoIndex - 1);
    }
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !projectTitle.trim()) {
      alert('Vui lòng nhập tên khách hàng và tiêu đề!');
      return;
    }

    if (uploadedPhotos.length === 0) {
      alert('Vui lòng tải lên ít nhất 1 ảnh hoặc video!');
      return;
    }

    const categories = categoriesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const coverItem = uploadedPhotos[coverPhotoIndex] || uploadedPhotos[0];
    const coverUrl =
      coverItem.type === 'video' && coverItem.thumbnail
        ? coverItem.thumbnail
        : coverItem.url;

    const newAlbum: CustomerAlbum = {
      id: 'album-' + Date.now(),
      customerName: customerName.trim(),
      projectTitle: projectTitle.trim(),
      location: location.trim(),
      completedDate: completedDate.trim(),
      coverImage: coverUrl,
      categories: categories.length > 0 ? categories : ['Nội Thất May Đo'],
      photos: uploadedPhotos,
      testimonial: testimonial.trim() || undefined,
      materialNotes: materialNotes.trim() || undefined,
      createdAt: Date.now(),
    };

    setIsProcessing(true);
    setStatusMessage('Đang lưu album...');

    try {
      const updated = await saveAlbum(newAlbum, (msg) => setStatusMessage(msg));
      onAlbumsUpdated(updated);

      setCustomerName('');
      setProjectTitle('');
      setUploadedPhotos([]);
      setTestimonial('');
      setStatusMessage('Đã đăng album thành công');
      setActiveTab('manage');
    } catch (err: any) {
      console.error(err);
      alert('Lỗi khi lưu album: ' + (err.message || 'Thử lại'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa album này khỏi trang web?')) {
      setIsProcessing(true);
      setStatusMessage('Đang xóa album và tự động đồng bộ...');
      try {
        const updated = await deleteAlbum(id);
        onAlbumsUpdated(updated);
        setStatusMessage('Đã xóa album thành công');
      } catch (err: any) {
        console.error(err);
        alert('Lỗi khi xóa album: ' + (err.message || 'Thử lại'));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl h-full sm:h-[88vh] bg-[#141519] text-[#E4E5E8] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Tối Giản */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#18191E] shrink-0">
          <h2 className="text-base font-bold text-white tracking-wide">
            Quản Trị Album
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Màn hình nhập PIN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form
              onSubmit={handleVerifyPin}
              className="max-w-xs w-full space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D0E8] mx-auto">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-sm font-semibold text-white tracking-wide">
                Nhập mã PIN
              </h3>

              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full text-center text-lg tracking-widest px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#00D0E8]"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Mã PIN không đúng
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00D0E8] hover:bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Xác nhận
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Bar Tối Giản */}
            <div className="px-6 border-b border-white/10 bg-[#16171B] flex items-center gap-6 shrink-0">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'border-[#00D0E8] text-[#00D0E8]'
                    : 'border-transparent text-[#8E9096] hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Album</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'manage'
                    ? 'border-[#00D0E8] text-[#00D0E8]'
                    : 'border-transparent text-[#8E9096] hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Danh Sách ({albums.length})</span>
              </button>
            </div>

            {/* Thông báo trạng thái */}
            {statusMessage && (
              <div className="px-6 py-2 bg-[#00D0E8]/10 text-[#00D0E8] text-xs flex items-center justify-between">
                <span>{statusMessage}</span>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Nội dung form */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'create' ? (
                <form onSubmit={handleSaveAlbum} className="space-y-5 max-w-2xl mx-auto">
                  {/* Thông tin cơ bản */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Khách hàng *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Anh Tuấn"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Địa điểm *
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Biên Hòa, Đồng Nai"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Tiêu đề *
                      </label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Thi công trọn gói Nhà phố Biên Hòa"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Thời gian
                      </label>
                      <input
                        type="text"
                        value={completedDate}
                        onChange={(e) => setCompletedDate(e.target.value)}
                        placeholder="Tháng 11/2024"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Hạng mục
                      </label>
                      <input
                        type="text"
                        value={categoriesInput}
                        onChange={(e) => setCategoriesInput(e.target.value)}
                        placeholder="Tủ Bếp, Phòng Khách, Tủ Áo"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Vật liệu
                      </label>
                      <input
                        type="text"
                        value={materialNotes}
                        onChange={(e) => setMaterialNotes(e.target.value)}
                        placeholder="MDF Lõi Xanh An Cường • Cánh Kính Slim"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#8E9096] mb-1 font-medium">
                        Cảm nhận của khách
                      </label>
                      <textarea
                        rows={2}
                        value={testimonial}
                        onChange={(e) => setTestimonial(e.target.value)}
                        placeholder="Nhận xét sau khi bàn giao..."
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:border-[#00D0E8] focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Phần Tải Cả Ảnh & Video */}
                  <div className="pt-2 space-y-3">
                    <label className="block text-xs text-[#8E9096] font-medium">
                      Ảnh & Video ({uploadedPhotos.length})
                    </label>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-white/15 hover:border-[#00D0E8] rounded-xl p-5 text-center cursor-pointer transition-all bg-black/20 hover:bg-[#00D0E8]/5 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 mx-auto text-white/50 group-hover:text-[#00D0E8] transition-colors" />
                      <p className="mt-2 text-xs font-medium text-white/90">
                        Chọn ảnh hoặc video từ thiết bị
                      </p>
                    </div>

                    {/* Tiến trình xử lý */}
                    {isProcessing && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-1.5 text-xs text-[#00D0E8]">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Đang xử lý {processProgress.current} /{' '}
                            {processProgress.total}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00D0E8] transition-all"
                            style={{
                              width: `${(processProgress.current / processProgress.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Danh sách ảnh & video đã chọn */}
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                        {uploadedPhotos.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className={`relative aspect-[4/3] rounded-lg overflow-hidden border transition-all ${
                              coverPhotoIndex === idx
                                ? 'border-[#00D0E8]'
                                : 'border-white/10'
                            }`}
                          >
                            {item.type === 'video' ? (
                              item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <img
                                src={item.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}

                            {item.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white">
                                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                                </div>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => setCoverPhotoIndex(idx)}
                              className={`absolute top-1 left-1 p-1 rounded text-xs transition-all ${
                                coverPhotoIndex === idx
                                  ? 'bg-[#00D0E8] text-black'
                                  : 'bg-black/60 text-white hover:bg-black'
                              }`}
                              title="Đặt làm bìa"
                            >
                              <Star className={`w-3 h-3 ${coverPhotoIndex === idx ? 'fill-black' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-red-500 text-white transition-all"
                              title="Xóa"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            {item.compressedSize && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1.5 py-0.5 text-[9px] text-white/70 flex justify-between font-mono">
                                <span>{item.type === 'video' ? 'Video' : formatFileSize(item.compressedSize)}</span>
                                {item.reductionPercentage ? (
                                  <span className="text-green-400">-{item.reductionPercentage}%</span>
                                ) : null}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nút Submit */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-[#00D0E8] hover:bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      <span>Đăng Album</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Tab Danh sách Album */
                <div className="space-y-2.5 max-w-2xl mx-auto">
                  {albums.length === 0 ? (
                    <div className="py-12 text-center text-[#8E9096] text-xs">
                      Chưa có album nào. Hãy chuyển sang tab "Thêm Album" để tạo mới!
                    </div>
                  ) : (
                    albums.map((album) => (
                      <div
                        key={album.id}
                        className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={album.coverImage || album.photos[0]?.thumbnail || album.photos[0]?.url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">
                              {album.customerName} — {album.projectTitle}
                            </h4>
                            <p className="text-[11px] text-[#8E9096] mt-0.5">
                              {album.location} • {album.photos.length} tệp
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteAlbum(album.id)}
                          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                          title="Xóa album này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
