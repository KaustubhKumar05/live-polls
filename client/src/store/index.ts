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
  liveQuestions: [],
  currentRoomID: "",
  setCurrentRoomID: (value: string) => set({ currentRoomID: value }),
  setLiveQuestions: (values: Question[]) => set({ liveQuestions: values }),
  authoredQuizzes: new Set(),
  updateAuthoredQuizzes: (quizID: string) =>
    set((state) => ({
      authoredQuizzes: new Set(state.authoredQuizzes).add(quizID),
    })),
}));

export default useQuizStore;
