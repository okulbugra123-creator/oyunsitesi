import React, { useState, useRef } from 'react';
import { Trophy, RotateCcw, ArrowLeft, Play, Sparkles, Maximize, Minimize } from 'lucide-react';
import { UserStats } from '../types';

interface BlockBlastGameProps {
  stats: UserStats;
  onUpdateStats: (updater: Partial<UserStats>) => void;
  onBack: () => void;
}

type GridCell = string | null;

interface Piece {
  id: number;
  shape: number[][];
  color: string;
}

const COLORS = [
  'bg-gradient-to-br from-pink-500 to-rose-600 shadow-md shadow-pink-500/25 border-pink-400',
  'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/25 border-purple-400',
  'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/25 border-cyan-300',
  'bg-gradient-to-br from-amber-400 to-orange-600 shadow-md shadow-amber-500/25 border-amber-300',
  'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md shadow-emerald-500/25 border-emerald-300',
];

const SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 0], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
];

export const BlockBlastGame: React.FC<BlockBlastGameProps> = ({
  stats,
  onUpdateStats,
  onBack,
}) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [grid, setGrid] = useState<GridCell[][]>(
    Array(6).fill(null).map(() => Array(6).fill(null))
  );
  const [score, setScore] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const generateRandomPieces = () => {
    const newPieces: Piece[] = [];
    for (let i = 0; i < 3; i++) {
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      newPieces.push({ id: Math.random(), shape: randomShape, color: randomColor });
    }
    return newPieces;
  };

  const startGame = () => {
    setGrid(Array(6).fill(null).map(() => Array(6).fill(null)));
    setScore(0);
    setPieces(generateRandomPieces());
    setSelectedPieceIndex(null);
    setGameState('playing');
  };

  const canPlacePiece = (piece: Piece, startRow: number, startCol: number, currentGrid: GridCell[][]) => {
    const shape = piece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const targetR = startRow + r;
          const targetCol = startCol + c;
          if (targetR < 0 || targetR >= 6 || targetCol < 0 || targetCol >= 6) return false;
          if (currentGrid[targetR][targetCol] !== null) return false;
        }
      }
    }
    return true;
  };

  const checkGameOver = (currentPieces: Piece[], currentGrid: GridCell[][]) => {
    if (currentPieces.length === 0) return false;
    for (const piece of currentPieces) {
      let possible = false;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if (canPlacePiece(piece, r, c, currentGrid)) {
            possible = true;
            break;
          }
        }
        if (possible) break;
      }
      if (possible) return false;
    }
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (selectedPieceIndex === null) return;
    const piece = pieces[selectedPieceIndex];
    if (!piece) return;

    if (canPlacePiece(piece, row, col, grid)) {
      const newGrid = grid.map(r => [...r]);
      const shape = piece.shape;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] === 1) {
            newGrid[row + r][col + c] = piece.color;
          }
        }
      }

      let pointsEarned = shape.flat().filter(v => v === 1).length * 15;

      const rowsToClear: number[] = [];
      const colsToClear: number[] = [];

      for (let r = 0; r < 6; r++) {
        if (newGrid[r].every(cell => cell !== null)) rowsToClear.push(r);
      }
      for (let c = 0; c < 6; c++) {
        if (newGrid.every(row => row[c] !== null)) colsToClear.push(c);
      }

      rowsToClear.forEach(r => {
        for (let c = 0; c < 6; c++) newGrid[r][c] = null;
        pointsEarned += 100;
      });

      colsToClear.forEach(c => {
        for (let r = 0; r < 6; r++) newGrid[r][c] = null;
        pointsEarned += 100;
      });

      const newScore = score + pointsEarned;
      setScore(newScore);

      if (newScore > stats.blockBlastHighScore) {
        onUpdateStats({ 
          blockBlastHighScore: newScore,
          coins: stats.coins + Math.floor(pointsEarned / 20)
        });
      }

      const remainingPieces = pieces.filter((_, idx) => idx !== selectedPieceIndex);
      setSelectedPieceIndex(null);
      setHoveredCell(null);

      if (remainingPieces.length === 0) {
        const nextPieces = generateRandomPieces();
        if (checkGameOver(nextPieces, newGrid)) {
          setGrid(newGrid);
          setPieces([]);
          setGameState('gameover');
        } else {
          setGrid(newGrid);
          setPieces(nextPieces);
        }
      } else {
        if (checkGameOver(remainingPieces, newGrid)) {
          setGrid(newGrid);
          setPieces(remainingPieces);
          setGameState('gameover');
        } else {
          setGrid(newGrid);
          setPieces(remainingPieces);
        }
      }
    }
  };

  return (
    <div ref={containerRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
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

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-xs text-slate-400">Skor</div>
            <div className="text-lg font-black text-amber-400 font-mono">{score}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">En Yüksek</div>
            <div className="text-lg font-black text-emerald-400 font-mono">{stats.blockBlastHighScore}</div>
          </div>
        </div>
      </div>

      {/* MENU STATE */}
      {gameState === 'menu' && (
        <div className="text-center py-10 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-purple-500/30 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-2 text-white">Y.P Block Blast (6x6)</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Kutucuk sayısı optimize edilmiş hızlı 6x6 bulmaca deneyimi!
            </p>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center gap-3 mx-auto text-base transform hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            Oyunu Başlat
          </button>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="text-center text-xs text-slate-400">
            {selectedPieceIndex !== null ? (
              <span className="text-amber-400 font-bold animate-pulse text-xs">Seçili bloğu yerleştirmek için ızgaraya tıklayın!</span>
            ) : (
              <span>Aşağıdaki bloklardan birini seçin:</span>
            )}
          </div>

          {/* 6x6 Grid */}
          <div className="bg-slate-950 p-3 rounded-2xl border-2 border-slate-800 max-w-[320px] mx-auto aspect-square grid grid-cols-6 gap-2 shadow-inner">
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isHovered = hoveredCell && selectedPieceIndex !== null && (() => {
                  const p = pieces[selectedPieceIndex];
                  if (!p) return false;
                  const shape = p.shape;
                  const rOffset = rIdx - hoveredCell.r;
                  const cOffset = cIdx - hoveredCell.c;
                  return (
                    rOffset >= 0 && rOffset < shape.length &&
                    cOffset >= 0 && cOffset < shape[0].length &&
                    shape[rOffset][cOffset] === 1
                  );
                })();

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`rounded-xl cursor-pointer transition-all duration-150 border flex items-center justify-center ${
                      cell ? `${cell} scale-95` :
                      isHovered ? 'bg-amber-500/30 border-amber-400/60 scale-105' :
                      'bg-slate-900/90 border-slate-800/80 hover:bg-slate-800'
                    }`}
                  />
                );
              })
            )}
          </div>

          {/* Piece Inventory */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 max-w-[320px] mx-auto">
            {pieces.map((piece, idx) => {
              const isSelected = selectedPieceIndex === idx;
              return (
                <div
                  key={piece.id}
                  onClick={() => setSelectedPieceIndex(idx)}
                  className={`p-2.5 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/20'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="inline-grid gap-1">
                    {piece.shape.map((row, r) => (
                      <div key={r} className="flex gap-1">
                        {row.map((val, c) => (
                          <div
                            key={c}
                            className={`w-4 h-4 rounded-sm ${val === 1 ? piece.color : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME OVER STATE */}
      {gameState === 'gameover' && (
        <div className="text-center py-10 space-y-6">
          <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-red-500/20">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black mb-1 text-white">Hamle Kalmadı!</h2>
            <p className="text-slate-400 text-sm">Harika bir performans sergiledin.</p>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 max-w-xs mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Skor:</span>
              <span className="font-bold text-amber-400 font-mono">{score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">En Yüksek:</span>
              <span className="font-bold text-emerald-400 font-mono">{stats.blockBlastHighScore}</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Oyna
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
