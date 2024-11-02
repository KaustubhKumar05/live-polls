import { create } from "zustand";
import { QuizStore } from "../types";

const useQuizStore = create<QuizStore>((set) => ({
  id: "",
  ended: false,
  setEnded: (ended) => set({ ended }),
  setId: (id) => set({ id }),
  questions: [],
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
