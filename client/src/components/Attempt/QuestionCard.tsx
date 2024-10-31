import React, { useMemo, useState } from "react";
import { Question, QuestionTypes, QuizResponse } from "../../types";
import { useMutation, useStorage } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";
import { getVotesForOptions } from "../../utils";

export const QuestionCard = ({
  question,
  quiz_id,
  ended,
}: {
  question: Question;
  quiz_id: string;
  ended: boolean;
}) => {
  const allResponses = (useStorage((root) => root.responses) ||
    []) as QuizResponse[];
  const [draftResponse, setDraftResponse] = useState<string>("");
  const [localResponse, setLocalResponse] = useState<string>("");
  const [submittedResponses, submissionCount] =
    getVotesForOptions(
      allResponses,
      question.id,
      question.questionType,
      question.options
    ) || Array.from({ length: question.options?.length || 1 }, () => 0);

  // To highlight local response in short answer type
  const firstMatchIndex = useMemo(
    () =>
      question.questionType === QuestionTypes.SHORT_ANSWER &&
      submittedResponses.findIndex((word) => word === localResponse),
    [submittedResponses, localResponse]
  );

  const addResponse = useMutation(
    ({ storage }) => {
      const responses =
        storage.get("responses") || ([] as unknown as LiveList<QuizResponse>);
      // @ts-ignore
      responses.push({
        response: draftResponse,
        id: crypto.randomUUID(),
        quiz_id,
        question_id: question.id,
      });
    },
    [draftResponse, quiz_id]
  );

  return (
    <div className="w-full bg-slate-700 max-w-md p-4 rounded-md my-4">
      <h2 className="text-white text-xl font-semibold">{question.title}</h2>
      <div className="my-4">
        {question.questionType === QuestionTypes.MCQ &&
          question.options?.map((option, index) => (
            <div key={option + index}>
              <div className="flex items-center gap-2 my-2 relative">
                <input
                  type="radio"
                  value={option}
                  className={`${
                    localResponse || ended ? "pointer-events-none" : ""
                  } p-1 invert`}
                  checked={draftResponse === index.toString()}
                  onChange={() => setDraftResponse(index.toString())}
                />
                <div className="flex w-full items-center justify-between">
                  <p className="text-white">{option}</p>
                  {(localResponse || ended) && (
                    <div className="text-white text-sm font-semibold">
                      {submittedResponses?.[index]} vote
                      {(parseInt(submittedResponses?.[index].toString()) ||
                        0) !== 1
                        ? "s"
                        : ""}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`w-full h-2 bg-slate-900 rounded mb-3 overflow-hidden ${
                  localResponse || ended ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="h-2 bg-orange-400"
                  style={{
                    width: `${
                      (((submittedResponses?.[index] as number) || 0) /
                        (submissionCount || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      {question.questionType === QuestionTypes.SHORT_ANSWER &&
        !localResponse &&
        !ended && (
          <input
            onChange={(e) => setDraftResponse(e.target.value)}
            className="my-2 w-full text-lg text-white px-4 py-[5px] rounded-md outline-none border-2 focus:border-purple-600 border-slate-700 bg-slate-800"
          />
        )}

      {question.questionType === QuestionTypes.SHORT_ANSWER &&
        (localResponse || ended) && (
          <div className="flex w-full gap-2 my-2 flex-wrap">
            {submittedResponses.map((word, index) => (
              <div
                className={`font-bold ${
                  word === localResponse && index === firstMatchIndex
                    ? "text-orange-400"
                    : "text-white"
                }`}
                key={`${word}-${index}`}
              >
                "{word}"
              </div>
            ))}
          </div>
        )}
      {!localResponse && !ended ? (
        <button
          disabled={!draftResponse}
          className="bg-slate-900 text-orange-400 w-full p-2 font-semibold cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
          onClick={() => {
            setLocalResponse(draftResponse);
            addResponse();
          }}
        >
          Submit
        </button>
      ) : (
        <div className="bg-slate-800 p-2 w-full rounded-md cursor-not-allowed text-center text-purple-500 font-semibold">
          Submitted
        </div>
      )}
    </div>
  );
};
