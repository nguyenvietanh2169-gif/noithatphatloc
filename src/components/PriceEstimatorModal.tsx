import React, { useState } from 'react';
import { X, Calculator, Check, ArrowRight, Phone, MessageSquare } from 'lucide-react';

interface PriceEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriceItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  defaultQty: number;
  unitPrice: number; // in VNĐ
  desc: string;
}

const PRICING_DATA: PriceItem[] = [
  // Phòng khách
  { id: 'pk1', category: 'Phòng khách', name: 'Kệ Tivi treo tường MDF chống ẩm', unit: 'md', defaultQty: 2.2, unitPrice: 2200000, desc: 'MDF lõi xanh chống ẩm phủ Melamine' },
  { id: 'pk2', category: 'Phòng khách', name: 'Vách ốp than tre nano kết hợp lam sóng', unit: 'm²', defaultQty: 8, unitPrice: 1250000, desc: 'Tấm than tre vân đá chống trầy' },
  { id: 'pk3', category: 'Phòng khách', name: 'Tủ giày kết hợp ghế ngồi thông minh', unit: 'm²', defaultQty: 2.5, unitPrice: 2400000, desc: 'Cánh CNC soi tay nắm âm' },
  { id: 'pk4', category: 'Phòng khách', name: 'Tủ rượu cánh kính đèn LED âm tủ', unit: 'm²', defaultQty: 3, unitPrice: 3800000, desc: 'Khung nhôm Slim, kính xám khói cường lực' },

  // Phòng bếp
  { id: 'pb1', category: 'Phòng bếp', name: 'Tủ bếp trên thùng MDF cánh Acrylic bóng gương', unit: 'md', defaultQty: 3, unitPrice: 3200000, desc: 'Chống ẩm mốc, dễ vệ sinh dầu mỡ' },
  { id: 'pb2', category: 'Phòng bếp', name: 'Tủ bếp dưới thùng Picomat kháng nước 100%', unit: 'md', defaultQty: 3, unitPrice: 3600000, desc: 'Bảo hành không cong vênh mối mọt' },
  { id: 'pb3', category: 'Phòng bếp', name: 'Mặt đá bếp Vicostone / Đá nung kết cao cấp', unit: 'md', defaultQty: 3, unitPrice: 1800000, desc: 'Chống ố, chống xước công nghệ nano' },
  { id: 'pb4', category: 'Phòng bếp', name: 'Bàn đảo bếp rời đa năng', unit: 'md', defaultQty: 1.6, unitPrice: 3500000, desc: 'Kết hợp ngăn chứa đồ khô' },

  // Phòng ngủ Master
  { id: 'pn1', category: 'Phòng ngủ', name: 'Giường ngủ thông minh 1m8 x 2m có ngăn kéo', unit: 'bộ', defaultQty: 1, unitPrice: 7500000, desc: 'Gỗ MDF phủ melamine, thang dát hộp kẽm' },
  { id: 'pn2', category: 'Phòng ngủ', name: 'Tủ quần áo kịch trần cánh lùa / mở', unit: 'm²', defaultQty: 5.5, unitPrice: 2600000, desc: 'Phụ kiện Ivan / Hafele giảm chấn' },
  { id: 'pn3', category: 'Phòng ngủ', name: 'Bàn trang điểm gương LED cảm ứng', unit: 'bộ', defaultQty: 1, unitPrice: 3200000, desc: 'Gương viền LED 3 chế độ ánh sáng' },
  { id: 'pn4', category: 'Phòng ngủ', name: 'Vách ốp đầu giường nẹp nhôm mạ PVD', unit: 'm²', defaultQty: 6, unitPrice: 1100000, desc: 'Tạo điểm nhấn sang trọng' },
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

  const totalPrice = selectedItems.reduce((sum, id) => {
    const item = PRICING_DATA.find((i) => i.id === id);
    if (!item) return sum;
    const qty = quantities[id] || item.defaultQty;
    return sum + item.unitPrice * qty;
  }, 0);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const selectPreset = (type: 'canho' | 'nhapho' | 'full') => {
    if (type === 'canho') {
      setSelectedItems(['pk1', 'pk2', 'pb1', 'pb2', 'pb3', 'pn1', 'pn2']);
    } else if (type === 'nhapho') {
      setSelectedItems(['pk1', 'pk2', 'pk3', 'pk4', 'pb1', 'pb2', 'pb3', 'pb4', 'pn1', 'pn2', 'pn4']);
    } else {
      setSelectedItems(PRICING_DATA.map((i) => i.id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] sm:h-auto sm:max-h-[90vh] bg-[#F8F7F4] text-[#141414] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-none border border-black/20 shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 sm:p-5 bg-white border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00D0E8]/15 flex items-center justify-center text-[#00A8BC] shrink-0">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-heading text-sm sm:text-lg font-bold tracking-tight text-[#141414] uppercase leading-tight">
                BẢNG DỰ TOÁN THI CÔNG NỘI THẤT
              </h3>
              <span className="text-[10px] sm:text-[11px] text-[#71706A] font-mono-num block">
                NỘI THẤT PHÁT LỘC • ĐƠN GIÁ XƯỞNG 2026
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

        {/* Preset Packages (Cuộn ngang 1 dòng gọn gàng trên mobile, không bị vỡ 3-4 dòng) */}
        <div className="px-3 py-2 sm:px-6 sm:py-2.5 bg-[#EFECE6] border-b border-black/8 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap text-xs">
          <span className="font-semibold text-[#505156] text-[10px] sm:text-xs shrink-0">Gợi ý nhanh:</span>
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

        {/* Body Items List (Không gian cuộn rộng rãi, thoáng mắt) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2 sm:space-y-3">
          {PRICING_DATA.map((item) => {
            const isChecked = selectedItems.includes(item.id);
            const qty = quantities[item.id] || item.defaultQty;
            const subtotal = item.unitPrice * qty;

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
                    <p className="text-[11px] sm:text-xs text-[#7A7973] font-light mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] sm:text-xs text-[#8A8982]">SL ({item.unit}):</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={qty}
                      onChange={(e) => handleQtyChange(item.id, parseFloat(e.target.value) || 1)}
                      className="w-14 sm:w-16 px-1.5 py-0.5 sm:py-1 bg-[#F8F7F4] border border-black/20 text-xs font-mono-num text-center focus:outline-hidden focus:border-[#00D0E8]"
                    />
                  </div>

                  <div className="text-right min-w-[110px] sm:min-w-[130px]">
                    <span className="text-[10px] sm:text-xs text-[#8A8982] block">
                      {formatVND(item.unitPrice)} / {item.unit}
                    </span>
                    <span className="font-mono-num font-bold text-xs sm:text-sm text-[#141414]">
                      {formatVND(subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary & Contact Action (Gọn gàng tối đa trên mobile, không chiếm diện tích) */}
        <div className="p-3 sm:p-5 bg-white border-t border-black/10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.06)]">
          {/* Top row: Total Price & Zalo Button */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#8A8982] block font-mono-num">
                TỔNG DỰ TOÁN ({selectedItems.length} HẠNG MỤC)
              </span>
              <div className="font-mono-num text-lg sm:text-2xl font-bold text-[#00A8BC] leading-none mt-1">
                {formatVND(totalPrice)}
              </div>
            </div>

            <a
              href={`https://zalo.me/0585338339?text=Xin%20chao%20Noi%20That%20Phat%20Loc,%20toi%20muon%20tu%20van%20du%20toan%20uoc%20tinh%20${totalPrice}%20VND`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 sm:px-5 sm:py-3 bg-[#00D0E8] hover:bg-[#141414] hover:text-white text-black font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 rounded-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Gửi Zalo</span>
            </a>
          </div>

          {/* Bottom row: Quick Call Lợi & Lộc side-by-side */}
          <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-black/6">
            <a
              href="tel:0585338339"
              className="py-1.5 px-2 bg-[#141414] hover:bg-[#00A8BC] text-white font-medium text-[10px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 rounded-xs"
            >
              <Phone className="w-3 h-3 text-[#00D0E8]" />
              <span className="truncate">Gọi Anh Lợi</span>
            </a>
            <a
              href="tel:08360847193"
              className="py-1.5 px-2 bg-[#141414] hover:bg-[#00A8BC] text-white font-medium text-[10px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1 rounded-xs"
            >
              <Phone className="w-3 h-3 text-[#00D0E8]" />
              <span className="truncate">Gọi Anh Lộc</span>
            </a>
          </div>

          <div className="mt-2 pt-1.5 text-center text-[10px] text-[#717277] font-mono-num flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
            <span className="font-semibold text-[#141414]">CÔNG TY TNHH NỘI THẤT PHÁT LỘC</span>
            <span>•</span>
            <span>MST: 3604065485</span>
            <span>•</span>
            <a href="mailto:noithatphatloc2025@gmail.com" className="text-[#00A8BC] hover:underline">
              noithatphatloc2025@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
