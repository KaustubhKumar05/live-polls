import React from "react";
import useQuizStore from "../../store";
import { StopCircle } from "lucide-react";
import { QuestionCard } from "./QuestionCard";

export const View = ({ id }: { id: string }) => {
  const { liveQuestions, authoredQuizzes } = useQuizStore((store) => store);
  const isAuthor = authoredQuizzes.has(id);

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col items-center">
      {isAuthor ? (
        <div className="bg-slate-700 w-full flex items-center justify-center sticky top-0 py-2">
          <div className="flex w-full max-w-7xl justify-end">
            <button className="flex items-center gap-1 bg-red-500 text-white font-semibold p-2 rounded-md">
              <StopCircle size={20} />
              Stop quiz
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="overflow-y-auto w-full max-w-md bg-slate-800 min-h-0 px-4 flex-1">
        {liveQuestions.map((liveQuestion) => (
          <QuestionCard
            key={liveQuestion.id}
            question={liveQuestion}
            quiz_id={id}
          />
        ))}
      </div>
    </div>
  );
};
