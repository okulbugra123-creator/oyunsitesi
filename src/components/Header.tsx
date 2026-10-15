import React from 'react';
import { Volume2, VolumeX, Coins, Trophy, Search, Gamepad2, Shield, LogOut } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onUpdateStats: (updater: Partial<UserStats>) => void;
  onNavigate: (tab: any) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: { name: string; role: 'member' | 'admin' | 'guest' };
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onUpdateStats,
  onNavigate,
  searchQuery,
  setSearchQuery,
  currentUser,
  onLogout,
  onOpenAdmin,
}) => {
  return (
    <header className="bg-slate-900 border-b border-amber-500/30 text-white sticky top-0 z-50 shadow-xl shadow-amber-500/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo Y.P */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform border border-amber-300/40">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent drop-shadow">
              Y.P
            </span>
          </div>
          <div>
            <div className="text-lg font-black tracking-wider flex items-center gap-1.5 text-amber-400">
              <Gamepad2 className="w-5 h-5 text-amber-500 animate-pulse" />
              Y.P OYUN PORTALI
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Hoş geldin, <strong className="text-white">{currentUser.name}</strong></p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Oyun ara (Block Blast, Kafa Topu 2, Araba Yarışı)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-amber-500/30 px-3 py-1.5 rounded-full shadow-inner">
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-sm font-bold text-amber-300">{stats.coins}</span>
          </div>

          <button
            onClick={() => onUpdateStats({ soundEnabled: !stats.soundEnabled })}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors hidden sm:block"
            title={stats.soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
          >
            {stats.soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 text-xs transition-all"
            >
              <Shield className="w-4 h-4" />
              Admin Paneli
            </button>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 px-3 py-2 rounded-xl border border-slate-700 transition-colors text-xs font-bold"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  );
};
