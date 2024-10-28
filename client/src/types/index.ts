export type QuestionType = "Multiple Choice" | "Short Answer";

export const QuestionTypes: Record<string, QuestionType> = {
  MCQ: "Multiple Choice",
  SHORT_ANSWER: "Short Answer",
};

export type Question = {
  id: string;
  questionType: QuestionType;
  title: string;
  options?: string[];
};

export type QuizStore = {
  id: string;
  setId: (value: string) => void;
  questions: Question[];
  setQuestions: (value: Question[]) => void;
  authoredQuizzes: Set<string>;
  updateAuthoredQuizzes: (quizID: string) => void;
  liveQuestions: Question[];
  setLiveQuestions: (value: Question[]) => void;
  currentRoomID: string;
  setCurrentRoomID: (value: string) => void;
  ended: boolean;
  setEnded: (value: boolean) => void;
};

export type QuizResponse = {
  id: string;
  quiz_id: string;
  question_id: string;
  // Can be a word or an option
  response: string;
};
