import React from 'react';
import { Trophy, Zap, Gift, Star, ExternalLink } from 'lucide-react';
import { UserStats } from '../types';

interface RightSidebarProps {
  stats: UserStats;
  onClaimDailyBonus: () => void;
  claimedBonus: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  stats,
  onClaimDailyBonus,
  claimedBonus,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
      {/* Reklam Alanı (Wireframe sidebar reklam) */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 text-center relative overflow-hidden group">
        <div className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
          Sponsor Reklam
        </div>
        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
          <Zap className="w-6 h-6" />
        </div>
        <h4 className="text-white font-bold text-sm mb-1">Y.P Pro Üyelik</h4>
        <p className="text-xs text-slate-300 mb-3">Tüm reklamsız özel oyun modları ve sınırsız altın avantajı!</p>
        <button 
          onClick={() => alert('Y.P Pro üyelik yakında aktifleşecektir!')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
        >
          <span>Hemen Keşfet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Günlük Bonus */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
          <Gift className="w-5 h-5 text-amber-400" />
          Günlük Giriş Bonusu
        </div>
        <p className="text-xs text-slate-300 mb-3">Her gün giriş yaparak 100 Altın kazan!</p>
        <button
          onClick={onClaimDailyBonus}
          disabled={claimedBonus}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
            claimedBonus
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20'
          }`}
        >
          {claimedBonus ? 'Bonus Alındı ✓' : '100 Altını Topla!'}
        </button>
      </div>

      {/* Skorlarım */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          En İyi Skorlarım
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-300 font-medium">Block Blast</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{stats.blockBlastHighScore} Puan</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-300 font-medium">Kafa Topu 2</span>
            <span className="text-xs font-bold text-green-400 font-mono">{stats.headSoccerWins} Galibiyet</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <span className="text-xs text-slate-300 font-medium">Araba Yarışı</span>
            <span className="text-xs font-bold text-blue-400 font-mono">{stats.carRacingHighScore} Metre</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
