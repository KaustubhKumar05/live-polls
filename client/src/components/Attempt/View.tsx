import React from "react";
import useQuizStore from "../../store";
import { StopCircle } from "lucide-react";
import { QuestionCard } from "./QuestionCard";

export const View = ({ id }: { id: string }) => {
  const { liveQuestions, authoredQuizzes } = useQuizStore((store) => store);
  const isAuthor = authoredQuizzes.has(id);
  return (
    <div className="w-full h-screen bg-slate-900 flex justify-center items-center">
      {isAuthor ? (
        <div className="bg-slate-700 w-full flex items-center justify-end sticky top-2">
          <button className="flex items-center gap-2 bg-red-500 text-white font-bold p-2">
            <StopCircle size={20} />
            Stop quiz
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="overflow-y-auto w-full max-w-md">
        {liveQuestions.map((liveQuestion) => (
          <QuestionCard key={liveQuestion.id} question={liveQuestion} />
        ))}
      </div>
    </div>
  );
};
