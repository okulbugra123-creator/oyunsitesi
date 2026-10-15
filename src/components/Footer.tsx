import React from 'react';
import { Gamepad2, Heart, Shield, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
            Y.P
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wide">Y.P OYUN PORTALI</div>
            <p className="text-xs text-slate-500">© 2026 Tüm Hakları Saklıdır.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
          <a href="#gizlilik" onClick={(e) => { e.preventDefault(); alert('Gizlilik Politikası: Verileriniz tarayıcınızda güvenle saklanır.'); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Gizlilik Politikası
          </a>
          <a href="#kullanim" onClick={(e) => { e.preventDefault(); alert('Kullanım Şartları: Eğlence amaçlı ücretsiz oyun portalıdır.'); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Kullanım Şartları
          </a>
          <a href="#iletisim" onClick={(e) => { e.preventDefault(); alert('İletişim: destek@ypoyun.com'); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500" /> İletişim
          </a>
        </div>
      </div>
    </footer>
  );
};
