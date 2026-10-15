import React, { useState } from 'react';
import { User, Lock, Shield, Play, UserPlus, LogIn, Sparkles, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (username: string, role: 'member' | 'admin' | 'guest') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'login' | 'register' | 'admin'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'admin') {
      if (username === 'Poyraz' && password === 'Poyraz123') {
        onLogin('Poyraz (Admin)', 'admin');
      } else {
        setError('Hatalı Admin Kullanıcı Adı veya Şifre! (Admin: Poyraz / Şifre: Poyraz123)');
      }
    } else if (tab === 'login') {
      if (!username.trim()) {
        setError('Lütfen kullanıcı adı girin.');
        return;
      }
      const users = JSON.parse(localStorage.getItem('yp_registered_users') || '{}');
      if (users[username] && users[username] === password) {
        onLogin(username, 'member');
      } else {
        setError('Kayıt bulunamadı veya şifre yanlış. Lütfen kayıt olun.');
      }
    } else if (tab === 'register') {
      if (!username.trim() || !password.trim()) {
        setError('Kullanıcı adı ve şifre boş olamaz.');
        return;
      }
      const users = JSON.parse(localStorage.getItem('yp_registered_users') || '{}');
      if (users[username]) {
        setError('Bu kullanıcı adı zaten alınmış.');
        return;
      }
      users[username] = password;
      localStorage.setItem('yp_registered_users', JSON.stringify(users));
      onLogin(username, 'member');
    }
  };

  const handleGuest = () => {
    onLogin('Misafir Oyuncu', 'guest');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-slate-950 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 border border-amber-300/40">
            <span className="text-3xl font-black tracking-tighter text-white">Y.P</span>
          </div>
          <h1 className="text-2xl font-black text-amber-400">Y.P OYUN PORTALI</h1>
          <p className="text-xs text-slate-400">Giriş yapın veya misafir olarak hemen oynamaya başlayın.</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${tab === 'login' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Üye Girişi
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${tab === 'register' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Kayıt Ol
          </button>
          <button
            onClick={() => { setTab('admin'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${tab === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Admin Girişi
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {tab === 'admin' ? 'Admin Adı (Poyraz)' : 'Kullanıcı Adı'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder={tab === 'admin' ? 'Poyraz' : 'Kullanıcı adınızı girin...'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder={tab === 'admin' ? 'Admin şifresi (Poyraz123)' : 'Şifrenizi girin...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            {tab === 'admin' && (
              <p className="text-[11px] text-indigo-400 mt-1">İpucu: Kullanıcı: Poyraz | Şifre: Poyraz123</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-3 rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              tab === 'admin'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25'
            }`}
          >
            {tab === 'register' ? <UserPlus className="w-4 h-4" /> : tab === 'admin' ? <Shield className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {tab === 'register' ? 'Kayıt Ol ve Başla' : tab === 'admin' ? 'Admin Olarak Giriş Yap' : 'Giriş Yap'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-500">Veya</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Guest Button */}
        <button
          onClick={handleGuest}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-slate-700"
        >
          <Play className="w-4 h-4 text-amber-400" />
          Misafir Girişi (1 Dakika Deneme)
        </button>
      </div>
    </div>
  );
};
