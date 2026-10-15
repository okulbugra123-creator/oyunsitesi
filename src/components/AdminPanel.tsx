import React, { useState } from 'react';
import { Shield, Users, Database, Plus, Trash2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { UserStats } from '../types';

interface AdminPanelProps {
  stats: UserStats;
  onBack: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ stats, onBack, onLogout }) => {
  const [gamesList, setGamesList] = useState([
    { id: '1', title: 'Block Blast', category: 'Bulmaca', status: 'Aktif' },
    { id: '2', title: 'Kafa Topu 2', category: 'Spor / Arcade', status: 'Aktif' },
    { id: '3', title: 'Araba Yarışı', category: 'Yarış', status: 'Aktif' },
  ]);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameCat, setNewGameCat] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameTitle.trim()) return;
    const newItem = {
      id: Math.random().toString(),
      title: newGameTitle,
      category: newGameCat || 'Genel',
      status: 'Aktif'
    };
    setGamesList([...gamesList, newItem]);
    setNewGameTitle('');
    setNewGameCat('');
    setSuccessMsg('Yeni oyun başarıyla siteye eklendi!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteGame = (id: string) => {
    if (confirm('Bu oyunu siteden silmek istediğinize emin misiniz?')) {
      setGamesList(gamesList.filter(g => g.id !== id));
      setSuccessMsg('Oyun sistemden silindi.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl max-w-3xl mx-auto text-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Siteye Dön
        </button>
        <div className="flex items-center gap-2 text-indigo-400 font-black text-lg">
          <Shield className="w-6 h-6 text-indigo-400" />
          Y.P Admin Paneli (Hoş geldin, Poyraz)
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
        >
          Çıkış Yap
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admin Privilege Notice */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3">
        <Database className="w-8 h-8 text-indigo-400 shrink-0" />
        <div className="text-xs text-slate-300">
          <strong className="text-white block">Admin Yetkisi Aktif (Poyraz)</strong>
          Yalnızca Admin dışarıdan siteye yeni oyun ekleyebilir veya mevcut içerikleri silebilir.
        </div>
      </div>

      {/* Add Game Form */}
      <form onSubmit={handleAddGame} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Yeni Oyun Ekle
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Oyun Adı..."
            value={newGameTitle}
            onChange={(e) => setNewGameTitle(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Kategori (Örn: Arcade)"
            value={newGameCat}
            onChange={(e) => setNewGameCat(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/30"
        >
          Oyunu Yayınla
        </button>
      </form>

      {/* Games Management List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Mevcut Oyun Yönetimi</h4>
        <div className="space-y-2">
          {gamesList.map((game) => (
            <div key={game.id} className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <div>
                <div className="font-bold text-white text-sm">{game.title}</div>
                <div className="text-xs text-slate-400">{game.category} • <span className="text-emerald-400">{game.status}</span></div>
              </div>
              <button
                onClick={() => handleDeleteGame(game.id)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-xl transition-colors"
                title="Oyunu Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
