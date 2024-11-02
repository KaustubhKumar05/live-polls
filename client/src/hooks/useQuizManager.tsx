import { toast } from "react-toastify";
import useQuizStore from "../store";
import { useHistory } from "react-router-dom";
import { QuestionTypes } from "../types";

export const useQuizManager = () => {
  const {
    currentRoomID,
    setCurrentRoomID,
    setLiveQuestions,
    setQuestions,
    setEnded,
    questions,
    updateAuthoredQuizzes,
    setId,
  } = useQuizStore((store) => store);

  const history = useHistory();

  const reset = () => {
    setLiveQuestions([]);
    setCurrentRoomID("");
    setQuestions([
      {
        id: crypto.randomUUID(),
        title: "Question goes here",
        questionType: QuestionTypes.MCQ,
        options: ["Option 1", "Option 2"],
      },
    ]);
    setEnded(false);
    setId("");
  };

  const launchQuiz = async () => {
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/api/create-room`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions }),
        }
      );
      const data = await resp.json();
      setLiveQuestions(data.questions);
      const quizID = data.quizID;
      setCurrentRoomID(data.id);
      updateAuthoredQuizzes(quizID);
      history.replace(`/quiz/${quizID}`);
    } catch (err) {
      console.error("Error launching quiz:", err);
      toast.error("Could not launch quiz", { theme: "dark" });
    }
  };

  const getQuiz = async (id: string) => {
    if (!currentRoomID) {
      const resp = await fetch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/api/get-room/${id}`
      );
      const data = await resp.json();
      setCurrentRoomID(data.id);
      setLiveQuestions(JSON.parse(data.questions || "[]"));
      setEnded(data.active === "false");
      if (data.error) {
        toast.error(data.error, { theme: "dark" });
        console.error(data.error);
      }
    }
  };

  const endQuiz = async (id: string) => {
    try {
      const resp = await fetch(
        import.meta.env.VITE_SERVER_ENDPOINT + "/api/stop-quiz",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomID: currentRoomID, quizID: id }),
        }
      );
      const data = await resp.json();
      return data.ok;
    } catch (err) {
      console.error("Error ending quiz:", err);
      return false;
    }
  };

  return { launchQuiz, getQuiz, endQuiz, reset };
};
