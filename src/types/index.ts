export interface User {
  firstName: string;
  lastName: string;
  company: 'C2S' | 'JCC';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  user: User;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
}

export interface TrainingSection {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}