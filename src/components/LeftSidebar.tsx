import React from 'react';
import { Flame, Star, Sparkles, Award, ShieldCheck, Zap } from 'lucide-react';
import { GameId } from '../types';

interface LeftSidebarProps {
  onNavigate: (tab: GameId) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onNavigate }) => {
  return (
    <aside className="w-full lg:w-64 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
      {/* Kategoriler */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Oyun Kategorileri
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => onNavigate('block-blast')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors group"
          >
            <span className="flex items-center gap-2">🧩 Bulmaca & Zeka</span>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Yeni</span>
          </button>
          <button
            onClick={() => onNavigate('head-soccer')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors group"
          >
            <span className="flex items-center gap-2">⚽ Spor & Arcade</span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Popüler</span>
          </button>
          <button
            onClick={() => onNavigate('car-racing')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-colors group"
          >
            <span className="flex items-center gap-2">🏎️ Yarış & Hız</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Hot</span>
          </button>
        </div>
      </div>

      {/* Günün Turnuvası */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
          <Award className="w-5 h-5 text-amber-400" />
          Y.P Haftalık Turnuva
        </div>
        <p className="text-xs text-slate-300 mb-3">En yüksek skoru yap, 1000 Altın ödülü kap!</p>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl">
          <span>Kalan Süre:</span>
          <span className="text-amber-400 font-mono">02:14:50</span>
        </div>
      </div>

      {/* Site Güvencesi */}
      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-slate-200 block">%100 Güvenli & Hızlı</strong>
          Reklamsız ve akıcı HTML5 oyun deneyimi.
        </div>
      </div>
    </aside>
  );
};
