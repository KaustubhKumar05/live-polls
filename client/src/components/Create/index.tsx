import React, { useCallback, useState } from "react";
import { QuestionType, QuestionTypes } from "../../types";
import { Preview } from "./Preview";
import { Config } from "./Config";
import useQuizStore from "../../store";
import { CirclePlus, Rocket, Trash2 } from "lucide-react";
import { FullPageLoader } from "../FullPageLoader";
import { useQuizManager } from "../../hooks/useQuizManager";
import { LivePollsTitle } from "../LivePollsTitle";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const { questions, setQuestions } = useQuizStore((store) => store);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const activeQuestion = questions[activeQuestionIndex];

  const decrementActiveQuestionIndex = useCallback(
    () => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1)),
    [activeQuestionIndex]
  );

  const updateActiveQuestion = useCallback(
    (title: string, questionType: QuestionType, options?: string[]) => {
      if (activeQuestion) {
        setQuestions(
          questions.map((question) =>
            question.id === activeQuestion.id
              ? {
                  ...question,
                  title,
                  questionType,
                  // Reverting and choosing to preserve options in case user randomly toggles types
                  options,
                }
              : question
          )
        );
      }
    },
    [activeQuestion, questions]
  );

  const { launchQuiz } = useQuizManager();
  const disableOptionDeletion = !!(
    activeQuestion.options?.length && activeQuestion.options.length === 2
  );

  if (loading) return <FullPageLoader />;

  return (
    <main className="w-full max-h-screen h-screen bg-black max-w mx-auto gap-4">
      <div className="bg-slate-800 rounded-md h-16 mb-4 px-4 flex w-full mx-auto items-center justify-center">
        <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center">
          <LivePollsTitle />
          <button
            onClick={async () => {
              setLoading(true);
              await launchQuiz();
              setLoading(false);
            }}
            className="bg-blue-500 text-white font-semibold flex items-center gap-2 hover:opacity-90 rounded-md justify-center p-2 px-3"
          >
            <Rocket size={20} /> Launch
          </button>
        </div>
      </div>
      {/* Subtract header, gaps */}
      <div
        className="grid grid-cols-8 gap-4 max-w-[1440px] mx-auto"
        style={{ height: "calc(100vh - 64px - 2*16px)" }}
      >
        <Preview
          activeQuestion={activeQuestion}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        <main className="col-span-4 bg-slate-800 p-4 px-6 rounded-md">
          <input
            type="text"
            value={activeQuestion?.title}
            onChange={(e) =>
              updateActiveQuestion(
                e.target.value,
                activeQuestion!.questionType,
                activeQuestion!.options
              )
            }
            className="text-2xl text-white w-full p-2 outline-none border-b-2 border-blue-500 focus:border-dotted bg-transparent"
          />

          {activeQuestion?.questionType === QuestionTypes.MCQ && (
            <ul className="list-inside mt-5">
              {activeQuestion.options?.map((option, index) => (
                <div className="flex w-full items-center gap-4" key={index}>
                  <input
                    className="my-2 w-full text-lg text-white px-4 py-[5px] rounded-md outline-none border-2 focus:border-blue-500 border-slate-700 bg-slate-700"
                    onChange={(e) => {
                      updateActiveQuestion(
                        activeQuestion.title,
                        activeQuestion.questionType,
                        activeQuestion.options?.map((opt, ind) =>
                          index === ind ? e.target.value : opt
                        )
                      );
                    }}
                    key={`option-${index}`}
                    value={option}
                  />
                  <button
                    disabled={disableOptionDeletion}
                    title={
                      disableOptionDeletion
                        ? "At least two options are required"
                        : ""
                    }
                    onClick={() =>
                      updateActiveQuestion(
                        activeQuestion.title,
                        activeQuestion.questionType,
                        activeQuestion.options?.filter(
                          (_, ind) => index !== ind
                        )
                      )
                    }
                    className="p-2 bg-gray-600 cursor-pointer rounded-md text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
              <button
                className="p-2 px-3 bg-gray-600 hover:opacity-90 rounded-md mt-4 text-white font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 flex items-center gap-2 justify-center"
                disabled={
                  activeQuestion.options && activeQuestion.options.length > 5
                }
                onClick={() =>
                  updateActiveQuestion(
                    activeQuestion.title,
                    activeQuestion.questionType,
                    activeQuestion.options
                      ? [
                          ...activeQuestion.options,
                          "Option " + (activeQuestion.options.length + 1),
                        ]
                      : ["Option 1"]
                  )
                }
              >
                <CirclePlus size={20} /> Add option
              </button>
            </ul>
          )}
          {activeQuestion?.questionType === QuestionTypes.SHORT_ANSWER && (
            <ul className="list-inside list-disc"></ul>
          )}
        </main>
        <Config
          activeQuestion={activeQuestion}
          updateActiveQuestion={updateActiveQuestion}
          decrementActiveQuestionIndex={decrementActiveQuestionIndex}
        />
      </div>
    </main>
  );
};
