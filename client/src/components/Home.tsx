import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { LivePollsTitle } from "./LivePollsTitle";
import { CirclePlus, Pencil } from "lucide-react";
import useQuizStore from "../store";
import { useQuizManager } from "../hooks/useQuizManager";

export const Home = () => {
  const [quizID, setQuizID] = useState("");
  const history = useHistory();

  const { setId } = useQuizStore();
  const { reset } = useQuizManager();

  useEffect(() => reset(), []);

  return (
    <main className="w-full h-screen bg-black flex flex-col justify-center items-center gap-4 p-4 md:p-8">
      <div className="mb-10 flex flex-col gap-4 items-center">
        <LivePollsTitle />
        <p className="text-gray-400 text-md hidden md:block">
          Start a live poll or attempt an existing one
        </p>
      </div>
      <Link to="/create">
        <button className="bg-blue-500 text-white font-semibold px-3 py-2 rounded-md w-full md:w-60 hidden md:flex gap-2 items-center justify-center">
          <CirclePlus size={20} /> Create
        </button>
      </Link>
      <p className="hidden md:block text-gray-400 text-sm my-4">OR</p>

      <input
        type="text"
        placeholder="Enter a poll code"
        value={quizID}
        onChange={(e) => setQuizID(e.target.value.trim())}
        className="w-full md:w-60 px-3 py-2 text-center bg-transparent border-gray-600 border-2 rounded-md outline-none text-white focus:border-dotted"
      />

      <button
        onClick={() => {
          setId(quizID);
          history.push(`/quiz/${quizID}`);
        }}
        // Sticking with a 6 digit num code for now
        disabled={quizID.length !== 6}
        className="bg-gray-600 text-white font-semibold px-3 py-2 rounded-md w-full md:w-60 disabled:opacity-80 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
      >
        <Pencil size={20} /> Attempt
      </button>
    </main>
  );
};
