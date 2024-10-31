import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { LivePollsTitle } from "./LivePollsTitle";
import { CirclePlus, Pencil } from "lucide-react";

export const Home = () => {
  const [id, setId] = useState("");
  const history = useHistory();

  return (
    <main className="w-full h-screen bg-gray-800 flex flex-col justify-center items-center gap-4 p-4 md:p-8">
      <div className="bg-slate-700 w-full flex items-center justify-center py-3 fixed top-0 left-0">
        <div className="max-w-[1440px] w-full px-2">
          <LivePollsTitle />
        </div>
      </div>
      <Link to="/create">
        <button className="bg-orange-500 text-white font-semibold px-3 py-2 rounded-md w-full md:w-60 hidden md:flex gap-2 items-center justify-center">
          <CirclePlus size={20} /> Create a poll
        </button>
      </Link>
      <div className="w-full md:w-96 h-0.5 bg-yellow-300 hidden md:block" />

      <input
        type="text"
        placeholder="Enter code for a live poll"
        value={id}
        onChange={(e) => setId(e.target.value.trim())}
        className="w-full md:w-60 px-3 py-2 text-center bg-transparent border-purple-400 border-b-2 outline-none text-white focus:border-dotted"
      />

      <button
        onClick={() => history.push(`/quiz/${id}`)}
        // Sticking with a 6 digit num code for now
        disabled={id.length !== 6}
        className="bg-purple-600 text-white font-semibold px-3 py-2 rounded-md w-full md:w-60 disabled:opacity-80 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
      >
        <Pencil size={20} /> Attempt
      </button>
    </main>
  );
};
