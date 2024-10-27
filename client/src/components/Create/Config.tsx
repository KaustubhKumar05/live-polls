import React from "react";
import { Question, QuestionType, QuestionTypes } from "../../types";
import { Trash } from "lucide-react";
import useQuizStore from "../../store";

const description = {
  [QuestionTypes.MCQ]: "Users can vote for one of multiple options provided",
  [QuestionTypes.SHORT_ANSWER]:
    "Users can type a short answer which will be collectively displayed",
};

export const Config = ({
  activeQuestion,
  updateActiveQuestion,
  decrementActiveQuestionIndex,
}: {
  activeQuestion?: Question;
  updateActiveQuestion: (
    title: string,
    questionType: QuestionType,
    options?: string[]
  ) => void;
  decrementActiveQuestionIndex: () => void;
}) => {
  const { questions, setQuestions } = useQuizStore((store) => store);
  return (
    <section className="col-span-1 bg-red-300 p-2 rounded-md">
      <h2 className="text-white text-2xl font-semibold text-center">
        Modify question
      </h2>
      <div className="flex flex-col m-2 mt-6 border border-gray-500 rounded-md overflow-hidden">
        {Object.keys(QuestionTypes).map((questionType) => (
          <button
            onClick={() =>
              updateActiveQuestion(
                activeQuestion!.title,
                QuestionTypes[questionType],
                activeQuestion?.options
              )
            }
            className={`p-2 text-white font-semibold w-full ${
              activeQuestion?.questionType === QuestionTypes[questionType]
                ? "bg-gray-800"
                : "bg-gray-500 opacity-50"
            }`}
            key={questionType}
          >
            {QuestionTypes[questionType]}
          </button>
        ))}
      </div>
      <p className="text-white text-center">
        {description[activeQuestion!.questionType]}
      </p>
      <div className="m-2">
        <button
          disabled={questions.length === 1}
          onClick={() => {
            decrementActiveQuestionIndex();
            setQuestions(
              questions.filter((question) => question.id !== activeQuestion!.id)
            );
          }}
          className="mt-8 bg-red-400 text-white font-semibold flex items-center gap-2 rounded-md w-full justify-center p-2 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          Delete question <Trash />
        </button>
      </div>
    </section>
  );
};
