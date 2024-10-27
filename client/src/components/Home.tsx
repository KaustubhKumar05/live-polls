import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export const Home = () => {
  const [id, setId] = useState("");
  const history = useHistory();

  return (
    <main className="w-full h-screen bg-gray-800 flex flex-col justify-center items-center gap-4 p-4 md:p-8">
      <Link to="/create">
        <button className="bg-orange-500 text-white font-semibold px-3 py-2 rounded-md w-full md:w-60 hidden md:block">
          Create
        </button>
      </Link>
      <div className="w-full md:w-72 h-0.5 bg-yellow-300 hidden md:block" />

      <input
        type="text"
        placeholder="Enter code"
        value={id}
        onChange={(e) => setId(e.target.value.trim())}
        className="w-full md:w-60 px-3 py-2 text-center capitalize bg-transparent border-purple-400 border-b-2 outline-none text-white focus:border-dotted"
      />

      <button
        onClick={() => history.push(`/quiz/${id}`)}
        // Sticking with a 6 digit alphanum code for now
        disabled={id.length !== 6}
        className="bg-purple-600 text-white font-semibold px-3 py-2 rounded-md w-full md:w-60 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        Attempt
      </button>
    </main>
  );
};
