export interface QuizSave {
  name: string;
  rounds: Round[];
  date: number;
}

export interface Round {
  name: string;
  questions: string[];
}