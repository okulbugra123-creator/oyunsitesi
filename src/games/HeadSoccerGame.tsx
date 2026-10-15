import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, ArrowLeft, Play, Zap, Users, User, Flame, Snowflake, Maximize, Minimize } from 'lucide-react';
import { UserStats } from '../types';

interface HeadSoccerGameProps {
  stats: UserStats;
  onUpdateStats: (updater: Partial<UserStats>) => void;
  onBack: () => void;
}

export const HeadSoccerGame: React.FC<HeadSoccerGameProps> = ({
  stats,
  onUpdateStats,
  onBack,
}) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameMode, setGameMode] = useState<'2player' | 'ai'>('2player');
  const [difficulty, setDifficulty] = useState<'kolay' | 'orta' | 'zor'>('orta');

  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [winnerMessage, setWinnerMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [goalBanner, setGoalBanner] = useState<string | null>(null);

  const [p1FireUsed, setP1FireUsed] = useState(false);
  const [p1BigUsed, setP1BigUsed] = useState(false);
  const [p1FreezeUsed, setP1FreezeUsed] = useState(false);

  const [p2FireUsed, setP2FireUsed] = useState(false);
  const [p2BigUsed, setP2BigUsed] = useState(false);
  const [p2FreezeUsed, setP2FreezeUsed] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const p1PowersRef = useRef({ fire: false, big: false, freeze: false, bigTimer: 0, freezeTimer: 0 });
  const p2PowersRef = useRef({ fire: false, big: false, freeze: false, bigTimer: 0, freezeTimer: 0 });
  const ballFireRef = useRef(false);
  const isGoalCelebratingRef = useRef(false);

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

  const startMatch = () => {
    setP1Score(0);
    setP2Score(0);
    setTimeLeft(60);
    setP1FireUsed(false);
    setP1BigUsed(false);
    setP1FreezeUsed(false);
    setP2FireUsed(false);
    setP2BigUsed(false);
    setP2FreezeUsed(false);
    p1PowersRef.current = { fire: false, big: false, freeze: false, bigTimer: 0, freezeTimer: 0 };
    p2PowersRef.current = { fire: false, big: false, freeze: false, bigTimer: 0, freezeTimer: 0 };
    ballFireRef.current = false;
    isGoalCelebratingRef.current = false;
    setGoalBanner(null);
    setGameState('playing');
  };

  const triggerPower = (player: 1 | 2, power: 'fire' | 'big' | 'freeze') => {
    if (player === 1) {
      if (power === 'fire' && !p1FireUsed) {
        setP1FireUsed(true);
        ballFireRef.current = true;
      }
      if (power === 'big' && !p1BigUsed) {
        setP1BigUsed(true);
        p1PowersRef.current.big = true;
        p1PowersRef.current.bigTimer = 300;
      }
      if (power === 'freeze' && !p1FreezeUsed) {
        setP1FreezeUsed(true);
        p2PowersRef.current.freeze = true;
        p2PowersRef.current.freezeTimer = 200;
      }
    } else {
      if (power === 'fire' && !p2FireUsed) {
        setP2FireUsed(true);
        ballFireRef.current = true;
      }
      if (power === 'big' && !p2BigUsed) {
        setP2BigUsed(true);
        p2PowersRef.current.big = true;
        p2PowersRef.current.bigTimer = 300;
      }
      if (power === 'freeze' && !p2FreezeUsed) {
        setP2FreezeUsed(true);
        p1PowersRef.current.freeze = true;
        p1PowersRef.current.freezeTimer = 200;
      }
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let p1X = 150;
    let p1Y = 270;
    let p1VY = 0;
    let p1Grounded = true;

    let p2X = 650;
    let p2Y = 270;
    let p2VY = 0;
    let p2Grounded = true;

    let bX = 400;
    let bY = 180;
    let bVX = 0;
    let bVY = 0;
    const bRadius = 18;
    const floorY = 340;

    let currentP1Score = 0;
    let currentP2Score = 0;
    let secondsLeft = 60;

    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const timerInterval = setInterval(() => {
      if (!isGoalCelebratingRef.current) {
        secondsLeft -= 1;
        setTimeLeft(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(timerInterval);
          cancelAnimationFrame(gameLoopRef.current!);
          if (currentP1Score > currentP2Score) {
            setWinnerMessage('1. Oyuncu (WASD) Kazandı! 🏆');
            onUpdateStats({ 
              headSoccerWins: stats.headSoccerWins + 1,
              coins: stats.coins + 150
            });
          } else if (currentP1Score < currentP2Score) {
            setWinnerMessage(gameMode === '2player' ? '2. Oyuncu (Yön Tuşları) Kazandı! 🏆' : 'Yapay Zeka Kazandı!');
          } else {
            setWinnerMessage('Maç Berabere Bitti!');
          }
          setGameState('gameover');
        }
      }
    }, 1000);

    const update = () => {
      if (!isGoalCelebratingRef.current) {
        if (p1PowersRef.current.bigTimer > 0) {
          p1PowersRef.current.bigTimer--;
          if (p1PowersRef.current.bigTimer === 0) p1PowersRef.current.big = false;
        }
        if (p1PowersRef.current.freezeTimer > 0) {
          p1PowersRef.current.freezeTimer--;
          if (p1PowersRef.current.freezeTimer === 0) p1PowersRef.current.freeze = false;
        }

        if (p2PowersRef.current.bigTimer > 0) {
          p2PowersRef.current.bigTimer--;
          if (p2PowersRef.current.bigTimer === 0) p2PowersRef.current.big = false;
        }
        if (p2PowersRef.current.freezeTimer > 0) {
          p2PowersRef.current.freezeTimer--;
          if (p2PowersRef.current.freezeTimer === 0) p2PowersRef.current.freeze = false;
        }

        let p1Moving = false;
        if (!p1PowersRef.current.freeze) {
          if (gameMode === '2player') {
            if (keys['KeyA'] && p1X > 45) { p1X -= 6; p1Moving = true; }
            if (keys['KeyD'] && p1X < 360) { p1X += 6; p1Moving = true; }
            if ((keys['KeyW'] || keys['Space']) && p1Grounded) {
              p1VY = -13;
              p1Grounded = false;
            }
          } else {
            if (keys['ArrowLeft'] && p1X > 45) { p1X -= 6; p1Moving = true; }
            if (keys['ArrowRight'] && p1X < 360) { p1X += 6; p1Moving = true; }
            if ((keys['ArrowUp'] || keys['Space']) && p1Grounded) {
              p1VY = -13;
              p1Grounded = false;
            }
          }
        }

        p1VY += 0.7;
        p1Y += p1VY;
        if (p1Y >= 270) {
          p1Y = 270;
          p1VY = 0;
          p1Grounded = true;
        }

        if (!p2PowersRef.current.freeze) {
          if (gameMode === '2player') {
            if (keys['ArrowLeft'] && p2X > 440) p2X -= 6;
            if (keys['ArrowRight'] && p2X < 755) p2X += 6;
            if (keys['ArrowUp'] && p2Grounded) {
              p2VY = -13;
              p2Grounded = false;
            }
          } else {
            const aiSpeed = difficulty === 'kolay' ? 3 : difficulty === 'orta' ? 4.5 : 6;
            if (bX > p2X + 15) p2X += aiSpeed;
            if (bX < p2X - 15) p2X -= aiSpeed;
            if (p2X < 440) p2X = 440;
            if (p2X > 755) p2X = 755;

            if (Math.random() < 0.03 && p2Grounded && bY < 260) {
              p2VY = -13;
              p2Grounded = false;
            }
          }
        }

        p2VY += 0.7;
        p2Y += p2VY;
        if (p2Y >= 270) {
          p2Y = 270;
          p2VY = 0;
          p2Grounded = true;
        }

        // Slightly slower ball physics for better control
        bVY += 0.45;
        bX += bVX;
        bY += bVY;

        const maxBallY = floorY - bRadius;
        if (bY >= maxBallY) {
          bY = maxBallY;
          bVY = -Math.abs(bVY) * 0.65;
          bVX *= 0.97;
          if (Math.abs(bVY) < 1.2) bVY = 0;
        }

        if (bX <= 30 + bRadius) {
          bX = 30 + bRadius;
          bVX = -bVX * 0.75;
        }
        if (bX >= 770 - bRadius) {
          bX = 770 - bRadius;
          bVX = -bVX * 0.75;
        }

        if (bY <= bRadius + 40) {
          bY = bRadius + 40;
          bVY = -bVY * 0.75;
        }

        // Goal Check with Goal Animation Trigger
        const triggerGoal = (scorer: '1' | '2') => {
          isGoalCelebratingRef.current = true;
          setGoalBanner(scorer === '1' ? 'GOL! 1. OYUNCU ⚽' : 'GOL! 2. OYUNCU / AI ⚽');
          
          setTimeout(() => {
            isGoalCelebratingRef.current = false;
            setGoalBanner(null);
            bX = 400; bY = 150; bVX = 0; bVY = -3;
          }, 1500);
        };

        if (bX <= 55 && bY >= 210 && !isGoalCelebratingRef.current) {
          currentP2Score += 1;
          setP2Score(currentP2Score);
          ballFireRef.current = false;
          triggerGoal('2');
        }
        if (bX >= 745 && bY >= 210 && !isGoalCelebratingRef.current) {
          currentP1Score += 1;
          setP1Score(currentP1Score);
          ballFireRef.current = false;
          triggerGoal('1');
        }

        const handlePlayerBallCollision = (pX: number, pY: number, isP1: boolean) => {
          const headRadius = p1PowersRef.current.big && isP1 || p2PowersRef.current.big && !isP1 ? 42 : 26;
          const headDist = Math.hypot(pX - bX, pY - bY);
          const headColDist = headRadius + bRadius;

          if (headDist < headColDist) {
            const angle = Math.atan2(bY - pY, bX - pX);
            bX = pX + Math.cos(angle) * headColDist;
            bY = pY + Math.sin(angle) * headColDist;
            const hitSpeed = ballFireRef.current ? 15 : 9.5;
            bVX = Math.cos(angle) * hitSpeed + (isP1 && p1Moving ? 3.5 : 0.8);
            bVY = Math.sin(angle) * hitSpeed - 2.5;
            if (ballFireRef.current) ballFireRef.current = false;
          }

          const bodyLeft = pX - 22;
          const bodyRight = pX + 22;
          const bodyTop = pY;
          const bodyBottom = floorY;

          if (bX + bRadius > bodyLeft && bX - bRadius < bodyRight && bY + bRadius > bodyTop && bY - bRadius < bodyBottom) {
            if (bX < pX) {
              bX = bodyLeft - bRadius;
              bVX = -Math.abs(bVX) - 3;
            } else {
              bX = bodyRight + bRadius;
              bVX = Math.abs(bVX) + 3;
            }
            bVY = -7;
          }
        };

        handlePlayerBallCollision(p1X, p1Y, true);
        handlePlayerBallCollision(p2X, p2Y, false);

        if (Math.abs(bVX) < 0.4 && Math.abs(bVY) < 0.4 && bY >= maxBallY - 2) {
          bVX = (Math.random() - 0.5) * 5;
          bVY = -6;
        }
      }

      // Render
      ctx.clearRect(0, 0, 800, 400);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 800, 400);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, floorY, 800, 60);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(400, floorY);
      ctx.lineTo(400, 100);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(10, 210, 15, 130);
      ctx.fillRect(10, 210, 45, 12);

      ctx.fillRect(775, 210, 15, 130);
      ctx.fillRect(745, 210, 45, 12);

      const drawCharacter = (x: number, y: number, color: string, isP1: boolean) => {
        const isBig = isP1 ? p1PowersRef.current.big : p2PowersRef.current.big;
        const isFrozen = isP1 ? p1PowersRef.current.freeze : p2PowersRef.current.freeze;
        const headR = isBig ? 42 : 26;

        ctx.fillStyle = isFrozen ? '#38bdf8' : color;
        ctx.fillRect(x - 16, y + 10, 32, 60);

        ctx.beginPath();
        ctx.arc(x, y, headR, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = isFrozen ? '#bae6fd' : '#ffffff';
        ctx.stroke();

        if (isFrozen) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.beginPath();
          ctx.arc(x, y, headR + 8, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      drawCharacter(p1X, p1Y, '#f59e0b', true);
      drawCharacter(p2X, p2Y, '#3b82f6', false);

      ctx.fillStyle = ballFireRef.current ? '#ef4444' : '#ffffff';
      ctx.beginPath();
      ctx.arc(bX, bY, bRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ballFireRef.current ? '#b91c1c' : '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (ballFireRef.current) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(bX + (Math.random() * 8 - 4), bY + (Math.random() * 8 - 4), 10, 0, Math.PI * 2);
        ctx.fill();
      }

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(gameLoopRef.current!);
      clearInterval(timerInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, gameMode, difficulty]);

  return (
    <div ref={containerRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-4xl mx-auto text-white">
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
          <h2 className="text-xl font-black text-amber-400">Y.P Kafa Topu 2</h2>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Galibiyet</div>
          <div className="text-lg font-black text-emerald-400 font-mono">{stats.headSoccerWins}</div>
        </div>
      </div>

      {/* MENU STATE */}
      {gameState === 'menu' && (
        <div className="py-8 space-y-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-green-500/30">
            <Zap className="w-10 h-10 text-white animate-bounce" />
          </div>
          <div>
            <h3 className="text-3xl font-black mb-2">Kafa Topu 2 & Özel Güçler</h3>
            <p className="text-slate-400 text-sm">Alevli Şut, Adam Büyüme ve Buz Kaplama süper güçleriyle maça damganı vur!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setGameMode('2player')}
              className={`p-4 rounded-2xl border font-bold text-sm flex flex-col items-center gap-2 transition-all ${
                gameMode === '2player' ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-lg' : 'border-slate-800 bg-slate-800/60 text-slate-400'
              }`}
            >
              <Users className="w-6 h-6" />
              2 Kişilik (Aynı Cihaz)
            </button>
            <button
              onClick={() => setGameMode('ai')}
              className={`p-4 rounded-2xl border font-bold text-sm flex flex-col items-center gap-2 transition-all ${
                gameMode === 'ai' ? 'border-green-500 bg-green-500/10 text-green-400 shadow-lg' : 'border-slate-800 bg-slate-800/60 text-slate-400'
              }`}
            >
              <User className="w-6 h-6" />
              Yapay Zekaya Karşı
            </button>
          </div>

          {gameMode === 'ai' && (
            <div className="space-y-3 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zorluk</label>
              <div className="grid grid-cols-3 gap-3">
                {['kolay', 'orta', 'zor'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d as any)}
                    className={`p-3 rounded-xl border font-bold text-sm capitalize transition-all ${
                      difficulty === d ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-800 bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startMatch}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-green-500/25 flex items-center justify-center gap-3 text-base transform hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            Maçı Başlat
          </button>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 px-6 py-3 rounded-2xl border border-slate-800 font-mono text-lg">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">1. OYUNCU (WASD)</span>
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-xl text-xl font-black">{p1Score}</span>
            </div>
            <div className="text-red-400 font-black text-xl animate-pulse">
              {timeLeft}s
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-xl text-xl font-black">{p2Score}</span>
              <span className="text-blue-400 font-bold">{gameMode === '2player' ? '2. OYUNCU (YÖN)' : 'YAPAY ZEKA'}</span>
            </div>
          </div>

          {/* Super Powers Bar */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between px-2">
              <span className="text-amber-400 font-bold">P1 Güçler:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerPower(1, 'fire')}
                  disabled={p1FireUsed}
                  className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 ${p1FireUsed ? 'bg-slate-800 text-slate-500' : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'}`}
                >
                  <Flame className="w-3.5 h-3.5" /> Alev
                </button>
                <button
                  onClick={() => triggerPower(1, 'big')}
                  disabled={p1BigUsed}
                  className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 ${p1BigUsed ? 'bg-slate-800 text-slate-500' : 'bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30'}`}
                >
                  <Zap className="w-3.5 h-3.5" /> Büyü
                </button>
                <button
                  onClick={() => triggerPower(1, 'freeze')}
                  disabled={p1FreezeUsed}
                  className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 ${p1FreezeUsed ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30'}`}
                >
                  <Snowflake className="w-3.5 h-3.5" /> Buz
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <span className="text-blue-400 font-bold">P2 Güçler:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerPower(2, 'fire')}
                  disabled={p2FireUsed}
                  className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 ${p2FireUsed ? 'bg-slate-800 text-slate-500' : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'}`}
                >
                  <Flame className="w-3.5 h-3.5" /> Alev
                </button>
                <button
                  onClick={() => triggerPower(2, 'big')}
                  disabled={p2BigUsed}
                  className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 ${p2BigUsed ? 'bg-slate-800 text-slate-500' : 'bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30'}`}
                >
                  <Zap className="w-3.5 h-3.5" /> Büyü
                </button>
                <button
                  onClick={() => triggerPower(2, 'freeze')}
                  disabled={p2FreezeUsed}
                  className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 ${p2FreezeUsed ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30'}`}
                >
                  <Snowflake className="w-3.5 h-3.5" /> Buz
                </button>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-auto bg-slate-950 block"
            />
            {goalBanner && (
              <div className="absolute inset-0 bg-amber-500/30 backdrop-blur-sm flex items-center justify-center animate-bounce">
                <div className="bg-slate-950 border-4 border-amber-400 text-amber-300 text-3xl md:text-5xl font-black px-8 py-4 rounded-3xl shadow-2xl tracking-wider">
                  {goalBanner}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-2">
            <span>P1: <strong className="text-slate-200">A / D</strong> & <strong className="text-slate-200">W</strong></span>
            <span>P2: <strong className="text-slate-200">Sol / Sağ Tuş</strong> & <strong className="text-slate-200">Yukarı</strong></span>
          </div>
        </div>
      )}

      {/* GAME OVER STATE */}
      {gameState === 'gameover' && (
        <div className="text-center py-12 space-y-6">
          <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-3xl font-black mb-1 text-white">{winnerMessage}</h3>
            <p className="text-slate-400 text-sm">Skor: {p1Score} - {p2Score}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startMatch}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Rövanş Maçı
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold text-sm"
            >
              Menüye Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
