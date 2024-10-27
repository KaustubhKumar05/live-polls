import { create } from "zustand";
import { Question, QuestionTypes, QuizStore } from "../types";

const useQuizStore = create<QuizStore>((set) => ({
  id: "",
  setId: (value: string) => set({ id: value }),
  questions: [
    {
      id: crypto.randomUUID(),
      title: "Question goes here",
      questionType: QuestionTypes.MCQ,
      // At least one option needed for mcqs
      options: ["Option 1"],
    },
  ],
  setQuestions: (values: Question[]) => set({ questions: values }),
}));

export default useQuizStore;
