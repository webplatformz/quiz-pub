export interface QuizSave {
  adminToken: string | undefined;
  id: string | undefined;
  name: string;
  rounds: Round[];
  date: number;
}

export interface Round {
  name: string;
  questions: string[];
}