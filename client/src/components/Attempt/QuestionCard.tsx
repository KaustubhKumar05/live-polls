import React, { useState } from "react";
import { Question, QuestionTypes } from "../../types";
import { useMutation } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

export const QuestionCard = ({ question }: { question: Question }) => {
  const [localResponse, setLocalResponse] = useState("");
  const [draftResponse, setDraftResponse] = useState("");

  const addResponse = useMutation(
    ({ storage }) => {
      const responses =
        storage.get("responses") || ([] as unknown as LiveList<Question>);
      // @ts-ignore
      responses.push(localResponse);
    },
    [localResponse]
  );

  return (
    <div className="w-full bg-slate-700 max-w-md p-4 rounded-md my-4">
      <h2 className="text-white text-2xl font-bold">{question.title}</h2>
      <div className="my-4">
        {question.options?.map((option, index) => (
          <div className="flex items-center gap-2" key={option + index}>
            <input
              type="radio"
              value={option}
              checked={draftResponse === option}
              onChange={(e) => setDraftResponse(e.target.value)}
            />
            <p className="text-white">{option}</p>
          </div>
        ))}
      </div>
      {question.questionType === QuestionTypes.SHORT_ANSWER &&
      !localResponse ? (
        <input className="my-2 w-full text-lg text-white px-4 py-[5px] rounded-md outline-none border-2 focus:border-purple-600 border-slate-700 bg-slate-800" />
      ) : (
        ""
      )}
      {!localResponse ? (
        <button
          className="bg-slate-900 text-orange-400 w-full p-2 font-semibold"
          onClick={() => setLocalResponse(draftResponse)}
        >
          Submit
        </button>
      ) : (
        <div className="bg-slate-800 p-2 w-full rounded-md cursor-not-allowed text-center text-purple-500 font-semibold">
          Voted
        </div>
      )}
    </div>
  );
};
