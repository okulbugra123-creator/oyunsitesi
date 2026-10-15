import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationMenu } from './components/NavigationMenu';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Footer } from './components/Footer';
import { GameHub } from './components/GameHub';
import { BlockBlastGame } from './games/BlockBlastGame';
import { HeadSoccerGame } from './games/HeadSoccerGame';
import { CarRacingGame } from './games/CarRacingGame';
import { LeaderboardView } from './components/LeaderboardView';
import { AuthScreen } from './components/AuthScreen';
import { AdminPanel } from './components/AdminPanel';
import { GameId, UserStats } from './types';
import { Heart, UserCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'member' | 'admin' | 'guest' } | null>(() => {
    const saved = localStorage.getItem('yp_current_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentTab, setCurrentTab] = useState<GameId | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedBonus, setClaimedBonus] = useState(false);

  // Stats persistence logic: Members/Admins save to localStorage, Guests use session memory (reset on logout/close)
  const [stats, setStats] = useState<UserStats>(() => {
    const session = localStorage.getItem('yp_current_session');
    if (session) {
      try {
        const sessObj = JSON.parse(session);
        if (sessObj.role === 'guest') {
          return { blockBlastHighScore: 0, headSoccerWins: 0, carRacingHighScore: 0, coins: 100, soundEnabled: true, musicEnabled: true };
        }
      } catch (e) { /* ignore */ }
    }
    const saved = localStorage.getItem('yp_game_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      blockBlastHighScore: 1250,
      headSoccerWins: 7,
      carRacingHighScore: 3420,
      coins: 500,
      soundEnabled: true,
      musicEnabled: true,
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('yp_current_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('yp_current_session');
    }
  }, [currentUser]);

  useEffect(() => {
    // Only save stats to localStorage if user is NOT a guest
    if (currentUser && currentUser.role !== 'guest') {
      localStorage.setItem('yp_game_stats', JSON.stringify(stats));
    }
  }, [stats, currentUser]);

  const handleLogin = (name: string, role: 'member' | 'admin' | 'guest') => {
    setCurrentUser({ name, role });
    if (role === 'guest') {
      setStats({ blockBlastHighScore: 0, headSoccerWins: 0, carRacingHighScore: 0, coins: 100, soundEnabled: true, musicEnabled: true });
    } else {
      const saved = localStorage.getItem('yp_game_stats');
      if (saved) {
        try { setStats(JSON.parse(saved)); } catch (e) { /* ignore */ }
      }
    }
    setCurrentTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const updateStats = (updater: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...updater }));
  };

  const handleClaimDailyBonus = () => {
    if (claimedBonus) return;
    setStats(prev => ({ ...prev, coins: prev.coins + 100 }));
    setClaimedBonus(true);
    alert('Tebrikler! 100 Günlük Altın Bonusu hesabınıza eklendi!');
  };

  const handleNavigate = (tab: GameId | 'admin') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative">
      <Header
        stats={stats}
        onUpdateStats={updateStats}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAdmin={() => handleNavigate('admin')}
      />

      {/* Guest Mode Notice */}
      {currentUser.role === 'guest' && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Misafir Modu: Kazandığınız altın ve skorlar oyundan çıkınca sıfırlanacaktır. Sınırsız kayıt için üye olun!</span>
          <button
            onClick={() => setCurrentUser(null)}
            className="underline ml-3 hover:text-white"
          >
            Üye Ol
          </button>
        </div>
      )}

      <NavigationMenu currentTab={currentTab === 'admin' ? 'home' : currentTab} onNavigate={handleNavigate} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          <div className="w-full lg:w-64 shrink-0 order-2 lg:order-1">
            <LeftSidebar onNavigate={handleNavigate} />
          </div>

          <main className="flex-1 w-full order-1 lg:order-2">
            {currentTab === 'admin' && currentUser.role === 'admin' ? (
              <AdminPanel stats={stats} onBack={() => handleNavigate('home')} onLogout={handleLogout} />
            ) : currentTab === 'home' ? (
              <GameHub onSelectGame={handleNavigate} searchQuery={searchQuery} />
            ) : currentTab === 'block-blast' ? (
              <BlockBlastGame stats={stats} onUpdateStats={updateStats} onBack={() => handleNavigate('home')} />
            ) : currentTab === 'head-soccer' ? (
              <HeadSoccerGame stats={stats} onUpdateStats={updateStats} onBack={() => handleNavigate('home')} />
            ) : currentTab === 'car-racing' ? (
              <CarRacingGame stats={stats} onUpdateStats={updateStats} onBack={() => handleNavigate('home')} />
            ) : currentTab === 'leaderboard' ? (
              <LeaderboardView stats={stats} onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
            ) : currentTab === 'favorites' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl mx-auto flex items-center justify-center">
                  <Heart className="w-8 h-8 fill-red-400" />
                </div>
                <h3 className="text-2xl font-bold">Favori Oyunların</h3>
                <p className="text-slate-400 text-sm">Block Blast, Kafa Topu 2 ve Araba Yarışı her zaman hızlı erişim için ana sayfada seni bekliyor.</p>
                <button
                  onClick={() => handleNavigate('home')}
                  className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  Ana Sayfaya Dön
                </button>
              </div>
            ) : null}
          </main>

          <div className="w-full lg:w-72 shrink-0 order-3">
            <RightSidebar
              stats={stats}
              onClaimDailyBonus={handleClaimDailyBonus}
              claimedBonus={claimedBonus}
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
