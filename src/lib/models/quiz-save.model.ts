export interface QuizSave {
  id: string;
  name: string;
  rounds: Round[];
  created_at: number;
}

export interface Round {
  name: string;
  questions: string[];
}