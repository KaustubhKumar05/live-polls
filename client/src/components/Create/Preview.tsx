import React from "react";
import { Question, QuestionTypes } from "../../types";
import { CircleDot, Type } from "lucide-react";
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
      options: [`Option ${activeQuestion?.options?.length || 0 + 1}`],
    };
    setQuestions([...questions, newQuestion]);
    // To prevent a race condition and fix the exec order
    setTimeout(() => setActiveQuestionIndex(questions.length), 100);
  };
  return (
    <section className="bg-red-100 p-2 min-h-0 flex-1 overflow-y-auto rounded-md">
      <h2 className="text-2xl font-semibold text-center">Preview</h2>
      <div className="px-2 py-2 my-2 sticky top-0 bg-white/75 rounded-md">
        <button
          onClick={addQuestion}
          className="p-2 text-white font-semibold w-full text-center bg-orange-400 rounded-md"
        >
          Add question
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-2 min-h-0 flex-1 overflow-y-auto">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`bg-white text-black h-32 w-full flex flex-col items-center border-2 gap-2 justify-center rounded-md ${
              question.id === activeQuestion?.id
                ? "border-orange-400"
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
