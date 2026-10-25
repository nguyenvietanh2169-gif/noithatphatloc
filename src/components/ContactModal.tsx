import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';

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
      name: 'mr Lợi',
      phone: '0585 338 339',
      tel: 'tel:0585338339',
      zalo: 'https://zalo.me/0585338339',
    },
    {
      id: 'loc',
      name: 'mr Lộc',
      phone: '0836 084 7193',
      tel: 'tel:08360847193',
      zalo: 'https://zalo.me/08360847193',
    },
    {
      id: 'huan',
      name: 'mr Huân',
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
        className="w-full max-w-[320px] bg-[#141416]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl text-white animate-in zoom-in-95 duration-150"
      >
        {/* Header tối giản */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {isPhone ? (
              <Phone className="w-4 h-4 text-[#00D0E8]" />
            ) : (
              <MessageCircle className="w-4 h-4 text-[#0068FF] fill-current" />
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

        {/* Danh sách 2 hotline dạng hàng bấm tinh gọn */}
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
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/20 transition-all duration-150 group cursor-pointer active:scale-[0.98]"
              >
                <div className="flex flex-col">
                  <span className="font-heading font-medium text-sm text-white group-hover:text-[#00D0E8] transition-colors">
                    {c.name}
                  </span>
                  <span className="font-mono-num text-xs text-white/60 tracking-wider mt-0.5">
                    {c.phone}
                  </span>
                </div>

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isPhone
                      ? 'bg-[#00D0E8] text-black shadow-xs'
                      : 'bg-[#0068FF] text-white shadow-xs'
                  }`}
                >
                  {isPhone ? (
                    <Phone className="w-4 h-4 fill-current" />
                  ) : (
                    <MessageCircle className="w-4 h-4 fill-current" />
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Switcher tinh tế ở đáy */}
        <div className="pt-3 mt-3 border-t border-white/10 text-center">
          <button
            onClick={() => setActiveTab(isPhone ? 'zalo' : 'phone')}
            className="text-xs text-white/50 hover:text-[#00D0E8] transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
          >
            {isPhone ? (
              <>
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hoặc nhắn tin qua Zalo</span>
              </>
            ) : (
              <>
                <Phone className="w-3.5 h-3.5" />
                <span>Hoặc gọi hotline trực tiếp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
