export enum ScenarioDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXTREME = 'Extreme'
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: ScenarioDifficulty;
  aiRole: string;
  userRole: string;
  initialMessage: string;
  goal: string;
  turnLimit: number;
  baseScore: number; // Starting persuasion score (0-100)
  winningScore: number;
  themeColor: string;
  iconName: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  mood?: string; // For AI only (e.g., "angry", "impressed", "neutral")
  scoreDelta?: number; // How much this message changed the score
}

export interface TurnResult {
  text: string;
  scoreDelta: number;
  aiMood: string;
  isGameOver: boolean;
  isWin: boolean;
  feedback?: string; // Short feedback on why the score changed
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}
