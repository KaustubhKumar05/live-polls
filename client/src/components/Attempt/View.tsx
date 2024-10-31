import React from "react";
import useQuizStore from "../../store";
import { QuestionCard } from "./QuestionCard";
import { Header } from "./Header";

export const View = ({ id }: { id: string }) => {
  const { liveQuestions, ended } = useQuizStore((store) => store);

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col items-center">
      <Header id={id} />
      <div className="overflow-y-auto w-full max-w-md bg-slate-800 min-h-0 px-4 flex-1">
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
  );
};
