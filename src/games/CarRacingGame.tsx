import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, ArrowLeft, Play, Car, Coins, Lock, Check, Maximize, Minimize } from 'lucide-react';
import { UserStats } from '../types';

interface CarRacingGameProps {
  stats: UserStats;
  onUpdateStats: (updater: Partial<UserStats>) => void;
  onBack: () => void;
}

interface CarModel {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  price: number;
  speedBonus: number;
}

const CAR_MODELS: CarModel[] = [
  { id: 'red', name: 'Klasik Kırmızı', color: '#ef4444', accentColor: '#991b1b', price: 0, speedBonus: 0 },
  { id: 'blue', name: 'Spor Mavi', color: '#3b82f6', accentColor: '#1e40af', price: 100, speedBonus: 1 },
  { id: 'amber', name: 'Turbo Altın', color: '#f59e0b', accentColor: '#b45309', price: 300, speedBonus: 2 },
  { id: 'purple', name: 'Y.P Süper GT', color: '#8b5cf6', accentColor: '#5b21b6', price: 500, speedBonus: 3 },
];

export const CarRacingGame: React.FC<CarRacingGameProps> = ({
  stats,
  onUpdateStats,
  onBack,
}) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [unlockedCars, setUnlockedCars] = useState<string[]>(() => {
    const saved = localStorage.getItem('yp_unlocked_cars');
    return saved ? JSON.parse(saved) : ['red'];
  });
  const [selectedCarId, setSelectedCarId] = useState<string>('red');
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const unlockCar = (car: CarModel) => {
    if (stats.coins >= car.price && !unlockedCars.includes(car.id)) {
      const newUnlocked = [...unlockedCars, car.id];
      setUnlockedCars(newUnlocked);
      localStorage.setItem('yp_unlocked_cars', JSON.stringify(newUnlocked));
      onUpdateStats({ coins: stats.coins - car.price });
      setSelectedCarId(car.id);
      alert(`Tebrikler! ${car.name} garaja eklendi!`);
    } else if (stats.coins < car.price) {
      alert(`Yeterli altının yok! ${car.price - stats.coins} altına daha ihtiyacın var.`);
    }
  };

  const startRace = () => {
    setDistance(0);
    setCoinsCollected(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const selectedCar = CAR_MODELS.find(c => c.id === selectedCarId) || CAR_MODELS[0];

    let carX = 200;
    let currentLane = 1;
    const lanes = [95, 200, 305];

    let obstacles: { x: number; y: number; color: string }[] = [];
    let coins: { x: number; y: number }[] = [];
    let roadOffset = 0;
    let dist = 0;
    let speed = 5 + selectedCar.speedBonus;
    let localCoins = 0;

    let canSwitch = true;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && currentLane > 0 && canSwitch) {
        currentLane -= 1;
        canSwitch = false;
      }
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && currentLane < 2 && canSwitch) {
        currentLane += 1;
        canSwitch = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      canSwitch = true;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const spawner = () => {
      if (gameState !== 'playing') return;

      const laneIdx = Math.floor(Math.random() * 3);
      obstacles.push({
        x: lanes[laneIdx],
        y: -120,
        color: ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
      });

      if (Math.random() < 0.75) {
        const coinLane = (laneIdx + 1) % 3;
        coins.push({
          x: lanes[coinLane],
          y: -80,
        });
      }

      const nextSpawnTime = Math.max(450, 1300 - speed * 70);
      setTimeout(spawner, nextSpawnTime);
    };

    const timer = setTimeout(spawner, 1000);

    const update = () => {
      const targetX = lanes[currentLane];
      carX += (targetX - carX) * 0.25;

      speed = (5 + selectedCar.speedBonus) + Math.floor(dist / 250) * 0.7;
      roadOffset = (roadOffset + speed) % 50;
      dist += 1;
      setDistance(dist);

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += speed;

        const carY = 440;
        if (
          Math.abs(obstacles[i].x - carX) < 30 &&
          Math.abs(obstacles[i].y - carY) < 65
        ) {
          clearTimeout(timer);
          cancelAnimationFrame(gameLoopRef.current!);
          
          const finalCoins = stats.coins + localCoins;
          const finalHighScore = Math.max(dist, stats.carRacingHighScore);

          onUpdateStats({ 
            carRacingHighScore: finalHighScore,
            coins: finalCoins
          });
          setGameState('gameover');
          return;
        }

        if (obstacles[i].y > 600) {
          obstacles.splice(i, 1);
        }
      }

      for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].y += speed;

        const carY = 440;
        if (
          Math.abs(coins[i].x - carX) < 35 &&
          Math.abs(coins[i].y - carY) < 60
        ) {
          localCoins += 10;
          setCoinsCollected(localCoins);
          coins.splice(i, 1);
        } else if (coins[i].y > 600) {
          coins.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, 400, 600);

      // Realistic background night/sunset highway vibe
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 400, 600);

      // Asphalt Road
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(50, 0, 300, 600);

      // Road Glow Borders
      ctx.fillStyle = speed > 12 ? '#ef4444' : '#f59e0b';
      ctx.fillRect(46, 0, 6, 600);
      ctx.fillRect(348, 0, 6, 600);

      // Lane Dashes
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.setLineDash([30, 30]);
      ctx.lineDashOffset = -roadOffset;
      ctx.beginPath();
      ctx.moveTo(150, 0);
      ctx.lineTo(150, 600);
      ctx.moveTo(250, 0);
      ctx.lineTo(250, 600);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Coins
      coins.forEach(coin => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('¢', coin.x - 4, coin.y + 4);
      });

      // Draw Obstacle Cars (Realistic with headlights)
      obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.beginPath();
        ctx.roundRect(obs.x - 20, obs.y, 40, 70, 8);
        ctx.fill();

        // Windshield
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(obs.x - 15, obs.y + 12, 30, 20);

        // Brake lights
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.x - 18, obs.y + 64, 8, 4);
        ctx.fillRect(obs.x + 10, obs.y + 64, 8, 4);
      });

      // Draw Realistic Player Car
      ctx.fillStyle = selectedCar.color;
      ctx.beginPath();
      ctx.roundRect(carX - 20, 440, 40, 70, 8);
      ctx.fill();

      // Accent spoiler / stripes
      ctx.fillStyle = selectedCar.accentColor;
      ctx.fillRect(carX - 18, 445, 36, 6);

      // Windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(carX - 15, 460, 30, 20);

      // Headlights glow
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(carX - 18, 438, 8, 4);
      ctx.fillRect(carX + 10, 438, 8, 4);

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(gameLoopRef.current!);
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, selectedCarId]);

  return (
    <div ref={containerRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-xl mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Menü
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
            title="Tam Ekran Yap / Küçült"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Küçült' : 'Tam Ekran'}</span>
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black text-amber-400">Y.P Hız Garajı</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 font-bold text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          {stats.coins}
        </div>
      </div>

      {/* MENU STATE */}
      {gameState === 'menu' && (
        <div className="py-6 space-y-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Car className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-1">Gelişmiş Garaj & Araba Seçimi</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Yarışlardan kazandığın altınlarla yeni süper spor arabaların kilidini aç!
            </p>
          </div>

          {/* Garage Car Selection */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {CAR_MODELS.map(car => {
              const isUnlocked = unlockedCars.includes(car.id);
              const isSelected = selectedCarId === car.id;

              return (
                <div
                  key={car.id}
                  onClick={() => {
                    if (isUnlocked) setSelectedCarId(car.id);
                    else unlockCar(car);
                  }}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/20'
                      : isUnlocked
                      ? 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
                      : 'border-slate-800/80 bg-slate-950/60 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: car.color }} />
                      {car.name}
                    </span>
                    {isUnlocked ? (
                      isSelected ? (
                        <span className="text-xs bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">Seçili</span>
                      ) : (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )
                    ) : (
                      <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {car.price} ¢
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Hız Bonusu: <strong className="text-amber-400">+{car.speedBonus}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={startRace}
            className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 text-base transform hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            Seçilen Araba ile Yarışa Başla
          </button>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-800 font-mono text-sm">
            <div>
              <span className="text-slate-400 mr-2">Mesafe:</span>
              <span className="text-amber-400 font-black text-lg">{distance}m</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-xl text-amber-300 font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              +{coinsCollected} Altın
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex justify-center bg-slate-950">
            <canvas
              ref={canvasRef}
              width={400}
              height={600}
              className="bg-slate-950 block"
            />
          </div>
          <p className="text-center text-xs text-slate-400">
            Şerit Değiştir: <strong className="text-slate-200">Sol / Sağ Ok Tuşları</strong> veya <strong className="text-slate-200">A / D</strong>
          </p>
        </div>
      )}

      {/* GAME OVER STATE */}
      {gameState === 'gameover' && (
        <div className="text-center py-12 space-y-6">
          <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-3xl font-black mb-1 text-white">Kaza Yaptın!</h3>
            <p className="text-slate-400 text-sm">Toplanan Altın: <strong className="text-amber-400">+{coinsCollected}</strong></p>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 max-w-xs mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gidilen Mesafe:</span>
              <span className="font-bold text-amber-400 font-mono">{distance}m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">En İyi Rekor:</span>
              <span className="font-bold text-emerald-400 font-mono">{stats.carRacingHighScore}m</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startRace}
              className="bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Yarış
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold text-sm"
            >
              Garaja Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
