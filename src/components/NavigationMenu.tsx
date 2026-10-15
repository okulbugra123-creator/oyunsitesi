import React from 'react';
import { Home, Grid, Zap, Car, Trophy, Heart } from 'lucide-react';
import { GameId } from '../types';

interface NavigationMenuProps {
  currentTab: GameId;
  onNavigate: (tab: GameId) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ currentTab, onNavigate }) => {
  const menuItems = [
    { id: 'home' as GameId, label: 'Ana Sayfa', icon: Home },
    { id: 'block-blast' as GameId, label: 'Block Blast', icon: Grid },
    { id: 'head-soccer' as GameId, label: 'Kafa Topu 2', icon: Zap },
    { id: 'car-racing' as GameId, label: 'Araba Yarışı', icon: Car },
    { id: 'leaderboard' as GameId, label: 'Skor Tablosu', icon: Trophy },
    { id: 'favorites' as GameId, label: 'Favorilerim', icon: Heart },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar py-2 gap-1 sm:gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
