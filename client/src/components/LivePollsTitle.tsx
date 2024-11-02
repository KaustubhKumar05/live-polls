import { LoaderPinwheel } from "lucide-react";
import React from "react";
import { useHistory } from "react-router-dom";
import { useQuizManager } from "../hooks/useQuizManager";

export const LivePollsTitle = () => {
  const { reset } = useQuizManager();
  const history = useHistory();
  return (
    <button
      className=""
      onClick={() => {
        reset();
        history.push("/");
      }}
    >
      <h1 className="text-white flex gap-2 font-bold text-3xl items-center cursor-pointer">
        <LoaderPinwheel size={32} /> Live Polls
      </h1>
    </button>
  );
};
