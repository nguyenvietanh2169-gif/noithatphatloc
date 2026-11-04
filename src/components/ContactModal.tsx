import React, { useState, useEffect } from 'react';
import { Phone, Send, X } from 'lucide-react';

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

  const isPhone = activeTab === 'phone';

  const contacts = [
    {
      id: 'loi',
      name: 'Mr. Lợi',
      phone: '0585 338 339',
      tel: 'tel:0585338339',
      zalo: 'https://zalo.me/0585338339',
    },
    {
      id: 'loc',
      name: 'Mr. Lộc',
      phone: '0836 084 719',
      tel: 'tel:0836084719',
      zalo: 'https://zalo.me/0836084719',
    },
    {
      id: 'huan',
      name: 'Mr. Huân',
      phone: '090 893 8297',
      tel: 'tel:0908938297',
      zalo: 'https://zalo.me/0908938297',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] bg-[#141416]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl text-white animate-in zoom-in-95 duration-150"
      >
        {/* Header tối giản - đồng bộ outline icon */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {isPhone ? (
              <Phone className="w-4 h-4 text-[#00D0E8] stroke-[2] fill-none" />
            ) : (
              <Send className="w-4 h-4 text-[#00D0E8] stroke-[2] fill-none" />
            )}
            <span className="font-heading text-sm font-semibold tracking-wide uppercase text-white">
              {isPhone ? 'Gọi Hotline' : 'Chat Zalo'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Danh sách 4 hotline dạng hàng bấm - đồng bộ nút icon tối giản như bên ngoài */}
        <div className="space-y-2">
          {contacts.map((c) => {
            const actionUrl = isPhone ? c.tel : c.zalo;

            return (
              <a
                key={c.id}
                href={actionUrl}
                target={isPhone ? undefined : '_blank'}
                rel={isPhone ? undefined : 'noreferrer'}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all duration-150 group cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center">
                  <span className="font-heading font-semibold text-sm text-white group-hover:text-[#00D0E8] transition-colors">
                    {c.phone} — {c.name}
                  </span>
                </div>

                <div
                  className="px-3 py-1.5 rounded-lg bg-[#00A8BC] group-hover:bg-[#00D0E8] text-white group-hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                  title={isPhone ? `Gọi ${c.name}: ${c.phone}` : `Chat Zalo với ${c.name}`}
                >
                  {isPhone ? (
                    <>
                      <Phone className="w-3.5 h-3.5 fill-none stroke-[2.2]" />
                      <span>Gọi ngay</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 fill-none stroke-[2.2]" />
                      <span>Nhắn Zalo</span>
                    </>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Switcher tinh tế ở đáy & Fanpage - đồng bộ outline icons */}
        <div className="pt-3 mt-3 border-t border-white/10 flex flex-col items-center gap-2 text-center">
          <button
            onClick={() => setActiveTab(isPhone ? 'zalo' : 'phone')}
            className="text-xs text-white/50 hover:text-[#00D0E8] transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
          >
            {isPhone ? (
              <>
                <Send className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" />
                <span>Hoặc nhắn tin qua Zalo</span>
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" />
                <span>Hoặc gọi hotline trực tiếp</span>
              </>
            )}
          </button>

          <a
            href="https://www.facebook.com/noithatphatloc1"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-white/50 hover:text-[#00D0E8] transition-colors inline-flex items-center gap-1.5 py-0.5 group"
          >
            <svg
              className="w-3.5 h-3.5 stroke-current fill-none stroke-[2] transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span>Fanpage Facebook: Nội Thất Phát Lộc</span>
          </a>
        </div>
      </div>
    </div>
  );
};
