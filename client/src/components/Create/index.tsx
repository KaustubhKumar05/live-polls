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

  if (loading) return <FullPageLoader />;

  return (
    <main className="w-full max-h-screen h-screen bg-gray-900 max-w mx-auto gap-4">
      <div className="bg-slate-800 rounded-md h-16 mb-4 px-4 flex w-full mx-auto items-center justify-center">
        <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center">
          <LivePollsTitle />
          <button
            onClick={async () => {
              setLoading(true);
              await launchQuiz();
              setLoading(false);
            }}
            className="bg-purple-500 text-white font-semibold flex items-center gap-2 rounded-md justify-center p-2 px-3"
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
            className="text-2xl text-white w-full p-2 outline-none border-b-2 border-purple-500 focus:border-dotted bg-transparent"
          />

          {activeQuestion?.questionType === QuestionTypes.MCQ && (
            <ul className="list-inside mt-5">
              {activeQuestion.options?.map((option, index) => (
                <div className="flex w-full items-center gap-4" key={index}>
                  <input
                    className="my-2 w-full text-lg text-white px-4 py-[5px] rounded-md outline-none border-2 focus:border-purple-600 border-slate-700 bg-slate-700"
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
                  <div className="p-2 bg-slate-700 rounded-md">
                    <Trash2
                      className="cursor-pointer hover:text-red-400 text-white"
                      onClick={() =>
                        updateActiveQuestion(
                          activeQuestion.title,
                          activeQuestion.questionType,
                          activeQuestion.options?.filter(
                            (_, ind) => index !== ind
                          )
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                className="p-2 px-3 bg-slate-700 rounded-md mt-4 text-orange-400 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 flex items-center gap-2 justify-center"
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

/*
 *
Tab for question types > show a short description

Launch
Preview           Main          Sidebar

New CTA                         Launch CTA
previews        Draft UI        Question config: type + desc
 * 
 */
