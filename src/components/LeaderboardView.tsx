import React from 'react';
import { Trophy, ArrowLeft, Medal, Award, Crown } from 'lucide-react';
import { UserStats, GameId } from '../types';

interface LeaderboardViewProps {
  stats: UserStats;
  onBack: () => void;
  onNavigate: (tab: GameId) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ stats, onBack, onNavigate }) => {
  const topPlayers = [
    { rank: 1, name: 'Burak Y.P (Sen)', score: stats.blockBlastHighScore + stats.carRacingHighScore + stats.headSoccerWins * 100, badge: '👑 Lider' },
    { rank: 2, name: 'ProGamer_34', score: 14250, badge: '🥈 2. Sıra' },
    { rank: 3, name: 'SpeedKing', score: 12800, badge: '🥉 3. Sıra' },
    { rank: 4, name: 'BlockMaster', score: 9500, badge: 'Oyuncu' },
    { rank: 5, name: 'GoalHunter', score: 8200, badge: 'Oyuncu' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-2xl mx-auto text-white space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </button>
        <div className="flex items-center gap-2 text-amber-400 font-black text-lg">
          <Trophy className="w-6 h-6 text-amber-400" />
          Y.P Liderlik Tablosu
        </div>
        <div />
      </div>

      <div className="space-y-3">
        {topPlayers.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              player.rank === 1
                ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/60 border-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                player.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md' :
                player.rank === 2 ? 'bg-slate-300 text-slate-950' :
                player.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                #{player.rank}
              </div>
              <div>
                <div className="font-bold text-white text-sm md:text-base flex items-center gap-2">
                  {player.name}
                </div>
                <div className="text-xs text-slate-400">{player.badge}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm md:text-lg font-black text-amber-400 font-mono">{player.score} Puan</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
