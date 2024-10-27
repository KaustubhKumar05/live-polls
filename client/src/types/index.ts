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
};
