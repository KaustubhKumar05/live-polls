import React from "react";
import useQuizStore from "../../store";
import { QuestionCard } from "./QuestionCard";
import { Header } from "./Header";

export const View = ({ id }: { id: string }) => {
  const { liveQuestions, ended } = useQuizStore((store) => store);

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col items-center">
      <Header id={id} />
      <div className="p-4 w-full h-screen flex flex-col items-center">
        <div className="w-full flex justify-between p-4 bg-slate-800 mb-4 sticky top-0 rounded-md z-10 max-w-md">
          <p className="text-white font-semibold">Poll Code: {id}</p>
          <p
            className={`${
              ended ? "text-red-500" : "text-green-500"
            } font-semibold uppercase`}
          >
            {ended ? "Ended" : "Live"}
          </p>
        </div>
        <div className="overflow-y-auto w-full max-w-md bg-slate-800 min-h-0 px-4 flex-1 rounded-md">
          {liveQuestions.map((liveQuestion) => (
            <QuestionCard
              key={liveQuestion.id}
              question={liveQuestion}
              quiz_id={id}
              ended={ended}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
