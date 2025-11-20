
export enum ScenarioDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXTREME = 'Extreme'
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  style: string; // Hint for AI behavior (e.g. "Aggressive", "Logical", "Emotional")
  initialMessage: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: ScenarioDifficulty;
  personas: Persona[]; // List of available opponents
  userRole: string;
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
  PERSONA_SELECT = 'PERSONA_SELECT',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}
