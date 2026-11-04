import React, { useState } from 'react';
import { X, Check, Send, ShieldCheck, ClipboardList } from 'lucide-react';

interface PriceEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EstimateItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  defaultQty: number;
  material: string;
}

const ESTIMATE_ITEMS: EstimateItem[] = [
  // Phòng khách
  { id: 'pk1', category: 'Phòng khách', name: 'Kệ Tivi treo tường MDF chống ẩm', unit: 'md', defaultQty: 2.2, material: 'MDF lõi xanh chống ẩm phủ Melamine cao cấp' },
  { id: 'pk2', category: 'Phòng khách', name: 'Vách ốp than tre nano kết hợp lam sóng', unit: 'm²', defaultQty: 8, material: 'Tấm than tre vân đá / kim loại chống trầy' },
  { id: 'pk3', category: 'Phòng khách', name: 'Tủ giày kịch trần kết hợp ghế ngồi', unit: 'm²', defaultQty: 2.5, material: 'Cánh CNC soi tay nắm âm, đợt để giày thông minh' },
  { id: 'pk4', category: 'Phòng khách', name: 'Tủ rượu cánh kính đèn LED âm tủ', unit: 'm²', defaultQty: 3, material: 'Khung nhôm Slim, kính cường lực xám khói sang trọng' },

  // Phòng bếp
  { id: 'pb1', category: 'Phòng bếp', name: 'Tủ bếp trên thùng MDF cánh Acrylic bóng gương', unit: 'md', defaultQty: 3, material: 'Chống ẩm mốc, công nghệ dán nẹp không đường line' },
  { id: 'pb2', category: 'Phòng bếp', name: 'Tủ bếp dưới thùng Picomat kháng nước 100%', unit: 'md', defaultQty: 3, material: 'Nhựa Picomat siêu chịu nước, chống ẩm mốc kháng nước tuyệt đối' },
  { id: 'pb3', category: 'Phòng bếp', name: 'Mặt đá bếp đá nung kết / Vicostone', unit: 'md', defaultQty: 3, material: 'Chống trầy, chống ố nhiệt và chống thấm nước' },
  { id: 'pb4', category: 'Phòng bếp', name: 'Bàn đảo bếp rời tích hợp lưu trữ', unit: 'md', defaultQty: 1.6, material: 'Mặt đá đồng bộ, kết hợp ngăn kéo đa năng' },

  // Phòng ngủ Master
  { id: 'pn1', category: 'Phòng ngủ', name: 'Giường ngủ thông minh có ngăn kéo để đồ', unit: 'bộ', defaultQty: 1, material: 'Gỗ MDF phủ Melamine, khung thang dát hộp kẽm kiên cố' },
  { id: 'pn2', category: 'Phòng ngủ', name: 'Tủ quần áo kịch trần cánh kính Slim / mở', unit: 'm²', defaultQty: 5.5, material: 'Cánh kính khung nhôm xám khói, ray giảm chấn Hafele' },
  { id: 'pn3', category: 'Phòng ngủ', name: 'Bàn trang điểm gương LED cảm ứng', unit: 'bộ', defaultQty: 1, material: 'Gỗ MDF chống ẩm, gương viền LED đổi màu cảm biến' },
  { id: 'pn4', category: 'Phòng ngủ', name: 'Vách ốp đầu giường nẹp nhôm mạ PVD', unit: 'm²', defaultQty: 6, material: 'Ốp đệm da / nẹp chỉ kim loại tạo điểm nhấn sang trọng' },
];

export const PriceEstimatorModal: React.FC<PriceEstimatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(['pk1', 'pk2', 'pb1', 'pb2', 'pn1', 'pn2']);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    pk1: 2.2,
    pk2: 8,
    pk3: 2.5,
    pk4: 3,
    pb1: 3,
    pb2: 3,
    pb3: 3,
    pb4: 1.6,
    pn1: 1,
    pn2: 5.5,
    pn3: 1,
    pn4: 6,
  });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleQtyChange = (id: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0.1, val),
    }));
  };

  const selectPreset = (type: 'canho' | 'nhapho' | 'full') => {
    if (type === 'canho') {
      setSelectedItems(['pk1', 'pk2', 'pb1', 'pb2', 'pb3', 'pn1', 'pn2']);
    } else if (type === 'nhapho') {
      setSelectedItems(['pk1', 'pk2', 'pk3', 'pk4', 'pb1', 'pb2', 'pb3', 'pb4', 'pn1', 'pn2', 'pn4']);
    } else {
      setSelectedItems(ESTIMATE_ITEMS.map((i) => i.id));
    }
  };

  // Tạo nội dung gửi qua Zalo
  const handleSendZalo = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItemNames = ESTIMATE_ITEMS
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => `${item.name} (${quantities[item.id] || item.defaultQty} ${item.unit})`)
      .join(', ');

    const nameText = customerName.trim() ? `Tên: ${customerName.trim()}` : '';
    const phoneText = customerPhone.trim() ? `SĐT/Zalo: ${customerPhone.trim()}` : '';
    const addrText = customerAddress.trim() ? `Khu vực: ${customerAddress.trim()}` : '';
    const infoText = [nameText, phoneText, addrText].filter(Boolean).join(' - ');

    const message = `Chào Nội Thất Phát Lộc, tôi muốn nhận báo giá xưởng cho ${selectedItems.length} hạng mục: ${selectedItemNames}.${infoText ? ` Thông tin của tôi: ${infoText}.` : ''} Nhờ xưởng tư vấn báo giá chi tiết giúp tôi.`;

    const zaloUrl = `https://zalo.me/0585338339?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] sm:h-auto sm:max-h-[90vh] bg-[#F8F7F4] text-[#141414] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-none border border-black/20 shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3.5 sm:p-5 bg-white border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00D0E8]/15 flex items-center justify-center text-[#00A8BC] shrink-0">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-lg font-bold tracking-tight text-[#141414] uppercase leading-tight">
                YÊU CẦU DỰ TOÁN BÁO GIÁ XƯỞNG
              </h3>
              <span className="text-[10px] sm:text-[11px] text-[#71706A] font-mono-num block">
                NỘI THẤT PHÁT LỘC • BÁO GIÁ TRỰC TIẾP TẠI XƯỞNG KHÔNG QUA TRUNG GIAN
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Preset Packages */}
        <div className="px-3 py-2 sm:px-6 sm:py-2.5 bg-[#EFECE6] border-b border-black/8 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs">
          <span className="font-semibold text-[#505156] text-[10px] sm:text-xs shrink-0">Chọn nhanh mô hình:</span>
          <button
            onClick={() => selectPreset('canho')}
            className="px-2.5 py-1 bg-white hover:bg-black hover:text-white border border-black/15 text-[11px] sm:text-xs shrink-0 transition-colors cursor-pointer rounded-xs"
          >
            Căn Hộ Chung Cư (2PN)
          </button>
          <button
            onClick={() => selectPreset('nhapho')}
            className="px-2.5 py-1 bg-white hover:bg-black hover:text-white border border-black/15 text-[11px] sm:text-xs shrink-0 transition-colors cursor-pointer rounded-xs"
          >
            Nhà Phố Liền Kề
          </button>
          <button
            onClick={() => selectPreset('full')}
            className="px-2.5 py-1 bg-white hover:bg-black hover:text-white border border-black/15 text-[11px] sm:text-xs shrink-0 transition-colors cursor-pointer rounded-xs"
          >
            Trọn Gói Biệt Thự
          </button>
        </div>

        {/* Body Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2 sm:space-y-2.5">
          {ESTIMATE_ITEMS.map((item) => {
            const isChecked = selectedItems.includes(item.id);
            const qty = quantities[item.id] || item.defaultQty;

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 sm:p-4 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-xs ${
                  isChecked
                    ? 'bg-white border-[#00A8BC] shadow-xs'
                    : 'bg-white/50 border-black/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 flex-1">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded-xs border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? 'bg-[#00D0E8] border-[#00D0E8] text-white' : 'border-black/30'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-mono-num uppercase tracking-wider text-[#00A8BC] font-semibold block">
                      {item.category}
                    </span>
                    <h4 className="font-medium text-xs sm:text-sm text-[#141414] leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#7A7973] font-light mt-0.5">
                      {item.material}
                    </p>
                  </div>
                </div>

                {/* Ước tính số lượng & Nhãn báo giá xưởng */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#8A8982]">SL dự kiến:</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={qty}
                      onChange={(e) => handleQtyChange(item.id, parseFloat(e.target.value) || 1)}
                      className="w-14 sm:w-16 px-1.5 py-0.5 sm:py-1 bg-[#F8F7F4] border border-black/20 text-xs font-mono-num text-center focus:outline-hidden focus:border-[#00D0E8]"
                    />
                    <span className="text-[11px] text-[#8A8982] font-mono-num">{item.unit}</span>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-[#00D0E8]/15 text-[#008A9B] text-[10px] sm:text-[11px] font-semibold uppercase font-mono-num rounded-xs">
                      Báo giá gốc xưởng
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Gated Lead Form */}
        <div className="p-3 sm:p-5 bg-white border-t border-black/10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.06)]">
          <form onSubmit={handleSendZalo} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#00A8BC] block font-mono-num font-bold">
                  ĐÃ CHỌN {selectedItems.length} HẠNG MỤC THI CÔNG
                </span>
                <span className="text-xs text-[#525357] block mt-0.5">
                  Nhập số điện thoại / Zalo để nhận file báo giá bóc tách chi tiết:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Nhập SĐT / Zalo của bạn *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-3 py-2 bg-[#F8F7F4] border border-black/20 text-xs text-[#141414] focus:outline-hidden focus:border-[#00D0E8] w-full sm:w-56 rounded-xs font-mono-num"
                />
                <button
                  type="submit"
                  className="px-4 py-2 sm:py-2.5 bg-[#00D0E8] hover:bg-[#141414] hover:text-white text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 rounded-xs cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Nhận Báo Giá Zalo</span>
                </button>
              </div>
            </div>

            {/* Thông tin hỗ trợ & bảo mật */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-black/6 text-[10.5px] text-[#717277]">
              <div className="flex items-center gap-1.5 text-[#00A8BC] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cam kết bảo mật thông tin khách hàng</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#8C8A84]">Hotline tư vấn nhanh:</span>
                <a href="tel:0585338339" className="font-bold text-[#141414] hover:text-[#00A8BC] transition-colors">
                  Mr. Lợi: 0585 338 339
                </a>
                <span>•</span>
                <a href="tel:0836084719" className="font-bold text-[#141414] hover:text-[#00A8BC] transition-colors">
                  Mr. Lộc: 0836 084 719
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
