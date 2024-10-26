import React, { act, useCallback, useEffect, useState } from "react";
import { Question, QuestionTypes } from "../../types";
import { Preview } from "./Preview";
import { Config } from "./Config";
import useQuizStore from "../../store";

export const Create = () => {
  const { questions, setQuestions } = useQuizStore((store) => store);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | undefined>(
    questions?.[activeQuestionIndex]
  );

  useEffect(
    () => setActiveQuestion(questions[activeQuestionIndex]),
    [questions, activeQuestionIndex]
  );

  // On launch, show responses and hide the config sidebar. Questions will no longer be editable
  const [launched, setLaunched] = useState(false);
  const updateActiveQuestion = useCallback(
    (title, options, type) => {
      if (activeQuestion) {
        setQuestions(
          questions.map((question) =>
            question.id === activeQuestion.id
              ? {
                  ...question,
                  title,
                  type,
                  options:
                    type === QuestionTypes.SHORT_ANSWER ? undefined : options,
                }
              : question
          )
        );
      }
    },
    [activeQuestion, questions]
  );
  return (
    <main className="w-full h-screen bg-gray-900 grid grid-cols-6 gap-4 p-4 md:p-8">
      {/* Preview 1 col */}
      <Preview questions={questions} activeQuestion={activeQuestion} />
      {/* Main 4 cols */}
      <main className="col-span-4 bg-red-400 p-8">
        <input
          type="text"
          value={activeQuestion?.title}
          onChange={(e) =>
            updateActiveQuestion(
              e.target.value,
              activeQuestion?.options,
              activeQuestion?.questionType
            )
          }
          className="text-2xl w-full p-2 outline-none border-b-2 border-purple-500 focus:border-dotted bg-transparent"
        />

        {activeQuestion?.questionType === QuestionTypes.MCQ && (
          <ul className="list-inside list-disc mt-5">
            {activeQuestion.options?.map((option, index) => (
              <li
                className=""
                contentEditable
                onChange={(e) => {
                  updateActiveQuestion(
                    activeQuestion.title,
                    activeQuestion.options?.map((opt, ind) =>
                      index === ind ? e : opt
                    ),
                    activeQuestion.questionType
                  );
                }}
                key={option}
              >
                {option}
              </li>
            ))}
            <button
              onClick={() =>
                updateActiveQuestion(
                  activeQuestion.title,
                  activeQuestion.options
                    ? [...activeQuestion.options, ""]
                    : [""],
                  activeQuestion.questionType
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
      {/* Sidebar 1 col */}
      <Config question={activeQuestion} />
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
