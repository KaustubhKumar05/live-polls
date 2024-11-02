import React from "react";
import useQuizStore from "../../store";
import { QuestionCard } from "./QuestionCard";
import { Header } from "./Header";

export const View = ({ id }: { id: string }) => {
  const { liveQuestions, ended } = useQuizStore((store) => store);

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden bg-black flex flex-col items-center">
      <Header id={id} />
      <div
        className="p-4 w-full flex flex-col items-center"
        style={{ height: "calc(100vh - 61px)" }}
      >
        <div className="w-full flex justify-between p-4 items-center bg-slate-800 mb-4 rounded-md z-10 max-w-md">
          <p className="text-white font-semibold">Poll Code: {id}</p>
          <p
            className={`${
              ended ? "bg-red-500" : "bg-blue-500"
            } font-semibold uppercase text-white py-1 rounded px-2`}
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
