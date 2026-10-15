export type GameId = 'home' | 'block-blast' | 'head-soccer' | 'car-racing' | 'leaderboard' | 'favorites';

export interface GameInfo {
  id: GameId;
  title: string;
  category: string;
  description: string;
  image: string;
  plays: number;
  rating: number;
  tags: string[];
}

export interface UserStats {
  blockBlastHighScore: number;
  headSoccerWins: number;
  carRacingHighScore: number;
  coins: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
}
