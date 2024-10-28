import { create } from "zustand";
import { QuestionTypes, QuizStore } from "../types";

const useQuizStore = create<QuizStore>((set) => ({
  id: "",
  ended: false,
  setEnded: (ended) => set({ ended }),
  setId: (id) => set({ id }),
  questions: [
    {
      id: crypto.randomUUID(),
      title: "Question goes here",
      questionType: QuestionTypes.MCQ,
      // At least one option needed for mcqs
      options: ["Option 1"],
    },
  ],
  setQuestions: (questions) => set({ questions }),
  liveQuestions: [],
  currentRoomID: "",
  setCurrentRoomID: (currentRoomID) => set({ currentRoomID }),
  setLiveQuestions: (liveQuestions) => set({ liveQuestions }),
  authoredQuizzes: new Set(),
  updateAuthoredQuizzes: (quizID: string) =>
    set((state) => ({
      authoredQuizzes: new Set(state.authoredQuizzes).add(quizID),
    })),
}));

export default useQuizStore;
