import React, { useCallback, useEffect, useState } from "react";
import { Question, QuestionType, QuestionTypes } from "../../types";
import { Preview } from "./Preview";
import { Config } from "./Config";
import useQuizStore from "../../store";
import { Delete, Rocket } from "lucide-react";

export const Create = () => {
  const { questions, setQuestions } = useQuizStore((store) => store);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>(
    questions?.[activeQuestionIndex]
  );

  const decrementActiveQuestionIndex = useCallback(
    () => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1)),
    [activeQuestionIndex]
  );

  useEffect(() => {
    setActiveQuestion({
      ...questions[activeQuestionIndex],
      options: questions[activeQuestionIndex]?.options
        ? [...questions[activeQuestionIndex].options]
        : undefined,
    });
  }, [questions, activeQuestionIndex]);

  // On launch, show responses and hide the config sidebar. Questions will no longer be editable
  const [launched, setLaunched] = useState(false);
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
  return (
    <main className="w-full max-h-screen h-screen bg-gray-900 gap-4 p-4">
      <div className="bg-slate-100 rounded-md h-16 mb-4 px-3 flex w-full items-center justify-end">
        <button className="bg-orange-400 text-white font-semibold flex items-center gap-2 rounded-md justify-center p-2 px-2">
          Launch <Rocket />
        </button>
      </div>
      {/* Subtract header, gaps */}
      <div
        className="grid grid-cols-6 gap-4"
        style={{ height: "calc(100vh - 64px - 3*16px)" }}
      >
        <Preview
          activeQuestion={activeQuestion}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
        {/* Main 4 cols */}
        <main className="col-span-4 bg-slate-100 px-8 py-4 rounded-md">
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
            className="text-2xl w-full p-2 outline-none border-b-2 border-purple-500 focus:border-dotted bg-transparent"
          />

          {activeQuestion?.questionType === QuestionTypes.MCQ && (
            <ul className="list-inside mt-5">
              {activeQuestion.options?.map((option, index) => (
                <div className="flex w-full items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <input
                    className="my-2 w-full text-lg outline-none focus:border-b border-purple-500 bg-transparent"
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

                  <Delete
                    className="cursor-pointer hover:text-orange-400"
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
              ))}
              <button
                className="p-2 bg-orange-400 rounded-md mt-4 text-white font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
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
                Add option
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
