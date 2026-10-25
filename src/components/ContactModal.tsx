import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'phone' | 'zalo';
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'phone',
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'zalo'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contacts = [
    {
      id: 'loi',
      name: 'mr LỢI',
      role: 'Trưởng phòng Thiết kế & Bản vẽ',
      phone: '0585 338 339',
      displayPhone: '0585.338.339',
      zaloUrl: 'https://zalo.me/0585338339',
      telUrl: 'tel:0585338339',
      avatarColor: 'bg-[#00D0E8] text-black',
      tag: 'Tư vấn phương án 3D',
    },
    {
      id: 'loc',
      name: 'mr LỘC',
      role: 'Phụ trách Xưởng sản xuất & Thi công',
      phone: '0836 084 7193',
      displayPhone: '0836.084.7193',
      zaloUrl: 'https://zalo.me/08360847193',
      telUrl: 'tel:08360847193',
      avatarColor: 'bg-white text-black',
      tag: 'Khảo sát & Báo giá xưởng',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#16171B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200"
      >
        {/* Header Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00D0E8] via-[#0068FF] to-[#00D0E8]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Đóng hộp thoại"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00D0E8] animate-pulse" />
            <span className="text-[10.5px] font-mono-num font-semibold uppercase tracking-[0.2em] text-[#00D0E8]">
              TRỰC TUYẾN 24/7 — NỘI THẤT PHÁT LỘC
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-tight">
            Chọn Chuyên Viên Liên Hệ
          </h3>
          <p className="text-xs text-white/60 font-light mt-1">
            Phát Lộc luôn có 2 hotline song song. Nếu số này bận, quý khách vui lòng liên hệ số còn lại.
          </p>

          {/* Toggle Tab (Gọi Điện / Zalo) */}
          <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-black/40 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'phone'
                  ? 'bg-[#141414] text-white shadow-md border border-white/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#00D0E8]" />
              <span>Gọi Điện Thoại</span>
            </button>

            <button
              onClick={() => setActiveTab('zalo')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'zalo'
                  ? 'bg-[#0068FF] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Nhắn Tin Zalo</span>
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="p-6 pt-2 space-y-3">
          {contacts.map((c) => {
            const isPhone = activeTab === 'phone';
            const actionUrl = isPhone ? c.telUrl : c.zaloUrl;

            return (
              <a
                key={c.id}
                href={actionUrl}
                target={isPhone ? undefined : '_blank'}
                rel={isPhone ? undefined : 'noreferrer'}
                onClick={onClose}
                className="group block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00D0E8]/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_20px_rgba(0,208,232,0.12)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar Badge */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${c.avatarColor}`}>
                      {c.name.replace('mr ', '')}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-base text-white tracking-wide">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono-num px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                          {c.tag}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/50 truncate font-light mt-0.5">
                        {c.role}
                      </div>
                      <div className="text-sm font-mono-num font-bold text-[#00D0E8] mt-1 tracking-wider">
                        {c.displayPhone}
                      </div>
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="shrink-0 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-transform group-hover:scale-105 ${
                        isPhone
                          ? 'bg-[#00D0E8] text-black group-hover:bg-white'
                          : 'bg-[#0068FF] text-white group-hover:bg-[#0055d4]'
                      }`}
                    >
                      {isPhone ? (
                        <>
                          <Phone className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">Gọi ngay</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">Chat Zalo</span>
                        </>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer Notes */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00D0E8]" />
            <span>Xưởng sản xuất trực tiếp — Không qua trung gian</span>
          </div>
          <div className="flex items-center gap-1 font-mono-num text-[10px] text-[#00D0E8]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sẵn sàng hỗ trợ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
