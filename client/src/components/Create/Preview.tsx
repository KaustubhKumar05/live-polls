import React from "react";
import { Question, QuestionTypes } from "../../types";
import { CircleDot, SquarePlus, Type } from "lucide-react";
import useQuizStore from "../../store";

export const Preview = ({
  activeQuestion,
  setActiveQuestionIndex,
}: {
  activeQuestion?: Question;
  setActiveQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { questions, setQuestions } = useQuizStore((state) => state);
  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      title: "Question goes here",
      questionType: QuestionTypes.MCQ,
      options: ["Option 1", "Option 2"],
    };
    const newIndex = questions.length
    setQuestions([...questions, newQuestion]);
    // To prevent a race condition and fix the exec order
    setTimeout(() => setActiveQuestionIndex(newIndex), 100);
  };
  return (
    <section className="bg-slate-800 px-4 py-6 min-h-0 flex-1 overflow-y-auto rounded-md col-span-2">
      <h2 className="text-2xl font-semibold text-center text-white">Preview</h2>
      <div className="py-2 my-2 rounded-md">
        <button
          onClick={addQuestion}
          className="p-2 px-3 text-white font-semibold w-full hover:opacity-90 text-center bg-gray-600 rounded-md flex items-center gap-2 justify-center"
        >
          <SquarePlus size={20} /> Add question
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-2 min-h-0 flex-1 overflow-y-auto">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`bg-white text-black h-32 w-full flex flex-col items-center border-4 gap-2 justify-center rounded-md ${
              question.id === activeQuestion?.id
                ? "border-blue-500"
                : "border-white"
            }`}
            onClick={() => setActiveQuestionIndex(index)}
          >
            {question.questionType === QuestionTypes.MCQ ? (
              <CircleDot />
            ) : (
              <Type />
            )}
            {question.title.slice(0, 20)}
          </div>
        ))}
      </div>
    </section>
  );
};
