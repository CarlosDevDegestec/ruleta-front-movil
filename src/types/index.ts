export interface Prize {
  id: number;
  name: string;
  rarity: string;
  weight: number;
  color: string;
}

export interface Question {
  id: number;
  question: string;
  type: 'rating' | 'text';
}

export interface ClaimBody {
  prize_id: number;
  name: string;
  phone: string;
  email: string;
  notifications: boolean;
}

export interface RouletteData {
  winner_index: number;
  prizes: Prize[];
}
