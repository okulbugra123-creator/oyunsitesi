import React from 'react';
import { Play, Star, Trophy, Users, Sparkles, Flame, Zap, Grid, Car } from 'lucide-react';
import { GameId } from '../types';

interface GameHubProps {
  onSelectGame: (gameId: GameId) => void;
  searchQuery: string;
}

export const GameHub: React.FC<GameHubProps> = ({ onSelectGame, searchQuery }) => {
  const games = [
    {
      id: 'block-blast' as GameId,
      title: 'Block Blast',
      category: 'Bulmaca & Strateji',
      description: 'Renkli blokları ızgaraya yerleştir, satırları ve sütunları patlatarak en yüksek skora ulaş!',
      image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      plays: '124.5K',
      badge: 'Trend #1',
      color: 'from-purple-600 to-indigo-600',
      icon: Grid,
    },
    {
      id: 'head-soccer' as GameId,
      title: 'Kafa Topu 2',
      category: 'Spor & Arcade',
      description: 'Dev kafa karakterinle sahaya çık, şut çek, özel güçleri kullan ve rakibine golü at!',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      plays: '98.2K',
      badge: 'Çok Popüler',
      color: 'from-green-600 to-emerald-600',
      icon: Zap,
    },
    {
      id: 'car-racing' as GameId,
      title: 'Araba Yarışı',
      category: 'Yarış & Hız',
      description: 'Yoğun trafikte makas at, nitrosunu ateşle ve en uzun mesafeyi kaza yapmadan git!',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      plays: '150.1K',
      badge: 'Hızlı & Öfkeli',
      color: 'from-amber-600 to-red-600',
      icon: Car,
    },
  ];

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 p-6 md:p-10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden md:block opacity-20">
          <div className="text-9xl font-black text-amber-400">Y.P</div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Y.P Oyun Portalı 2026 Sezonu
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            En Eğlenceli <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">Arcade Oyunları</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
            Blok patlatma heyecanı, kafa topu şutları ve nitro dolu araba yarışı tek tıkla seni bekliyor. Hemen oyna, skorunu kaydet ve liderlik tablosunda yerini al!
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onSelectGame('block-blast')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              Hemen Oyna: Block Blast
            </button>
          </div>
        </div>
      </div>

      {/* Oyun Listesi Başlığı */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Öne Çıkan Oyunlar</h2>
            <p className="text-xs text-slate-400">Y.P özel menüleri ve akıcı oyun modları</p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
          3 Harika Oyun
        </span>
      </div>

      {/* Oyun Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const IconComponent = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
            >
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {game.badge}
                </div>

                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {game.rating}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                    {game.category}
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-amber-500" />
                    {game.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    {game.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {game.plays} oynanma
                  </span>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    Oyuna Başla
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
