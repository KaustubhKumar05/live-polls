import React, { useState } from "react";
import { Question, QuestionTypes, QuizResponse } from "../../types";
import { useMutation, useStorage } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

const getVotesForOptions = (responses, question_id, question_type, options) => {
  // string[] for short_answer
  // number[] for mcq
  if (question_type === QuestionTypes.MCQ) {
    const optionCounts = Array.from({ length: options?.length }, () => 0);
    responses.forEach((resp) => {
      if (question_id === resp.question_id) optionCounts[resp.response]++;
    });
    return optionCounts;
  }
  const responseWords: string[] = [];
  responses.forEach((resp) => {
    if (resp.question_id === question_id) {
      responseWords.push(resp.response);
    }
  });
  return responseWords;
};

export const QuestionCard = ({
  question,
  quiz_id,
}: {
  question: Question;
  quiz_id: string;
}) => {
  const responses = useStorage((root) => root.responses);
  const [draftResponse, setDraftResponse] = useState<string>("");
  const [localResponse, setLocalResponse] = useState<string>("");
  const [allResponses, setAllResponses] = useState<string[] | number[]>([]);

  console.log({ allResponses });

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
      <h2 className="text-white text-2xl font-bold">{question.title}</h2>
      <div className="my-4">
        {question.options?.map((option, index) => (
          <div className="flex items-center gap-2" key={option + index}>
            <input
              type="radio"
              value={option}
              checked={draftResponse === index.toString()}
              onChange={() => setDraftResponse(index.toString())}
            />
            <p className="text-white">{option}</p>
          </div>
        ))}
      </div>
      {question.questionType === QuestionTypes.SHORT_ANSWER &&
      !localResponse ? (
        <input
          onChange={(e) => setDraftResponse(e.target.value)}
          className="my-2 w-full text-lg text-white px-4 py-[5px] rounded-md outline-none border-2 focus:border-purple-600 border-slate-700 bg-slate-800"
        />
      ) : (
        ""
      )}
      {!localResponse ? (
        <button
          disabled={!draftResponse}
          className="bg-slate-900 text-orange-400 w-full p-2 font-semibold cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
          onClick={() => {
            setLocalResponse(draftResponse);
            addResponse();
            setTimeout(
              () =>
                setAllResponses(
                  getVotesForOptions(
                    responses,
                    question.id,
                    question.questionType,
                    question.options
                  )
                ),
              100
            );
          }}
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
