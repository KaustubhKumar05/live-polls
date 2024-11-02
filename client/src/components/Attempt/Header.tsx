import { Copy, Loader, StopCircle } from "lucide-react";
import React, { useState } from "react";
import useQuizStore from "../../store";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";
import { useQuizManager } from "../../hooks/useQuizManager";
import { LivePollsTitle } from "../LivePollsTitle";
import { toast } from "react-toastify";

export const Header = ({ id }) => {
  const { authoredQuizzes, ended, setEnded } = useQuizStore((store) => store);
  const { endQuiz } = useQuizManager();
  const isAuthor = authoredQuizzes.has(id);
  const [copiedLink, setCopiedLink] = useState(false);
  const broadcast = useBroadcastEvent();
  const [endClicked, setEndClicked] = useState(false);

  useEventListener(({ event }) => {
    if (event?.["type"] === "STATUS" && event?.["ended"]) {
      setEnded(true);
      toast.info("Poll has ended", { theme: "dark" });
    }
  });

  return (
    <div className=" bg-slate-800 border-b border-gray-700 w-full flex items-center sticky top-0 z-20 justify-center py-3">
      <div className="flex w-full max-w-7xl justify-between items-center px-4">
        <LivePollsTitle />
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 400);
            }}
            className="flex items-center gap-1 text-white font-semibold p-2 rounded-md bg-blue-500 text-sm"
          >
            <Copy size={20} /> {copiedLink ? "Copied" : "Copy link"}
          </button>
          {!ended && isAuthor ? (
            <button
              disabled={endClicked}
              onClick={async () => {
                setEndClicked(true);
                const ok = await endQuiz(id);
                if (ok) {
                  broadcast({ type: "STATUS", ended: true });
                }
                setEnded(!!ok);
                setEndClicked(false);
              }}
              className={`flex items-center gap-1 bg-red-500 text-white font-semibold p-2 rounded-md text-sm disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer`}
            >
              {endClicked ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <StopCircle size={20} />
              )}
              Stop quiz
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
