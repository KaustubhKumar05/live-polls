export type QuestionType = "MCQ" | "SHORT_ANSWER";

export const QuestionTypes: Record<QuestionType, QuestionType> = {
  MCQ: "MCQ",
  SHORT_ANSWER: "SHORT_ANSWER",
};

export type Question = {
  id: string;
  questionType: QuestionType;
  title: string;
  options?: string[];
};

export type QuizStore = {
  id: string,
  setId: (value:string) => void,
  questions: Question[],
  setQuestions: (value: Question[]) => void,
}