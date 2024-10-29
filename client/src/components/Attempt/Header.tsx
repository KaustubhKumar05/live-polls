import { Copy, Loader, StopCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import useQuizStore from "../../store";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";

export const Header = ({ id }) => {
  const { authoredQuizzes, ended, currentRoomID, setEnded } = useQuizStore(
    (store) => store
  );
  const isAuthor = authoredQuizzes.has(id);
  const [copiedLink, setCopiedLink] = useState(false);
  const broadcast = useBroadcastEvent();
  const [endClicked, setEndClicked] = useState(false);

  useEventListener(({ event, user, connectionId }) => {
    // @ts-ignore
    if (event?.type === "STATUS" && event?.ended) {
      setEnded(true);
    }
  });

  return (
    <div className="bg-slate-700 w-full flex items-center justify-center sticky top-0 py-2">
      <div className="flex w-full max-w-7xl justify-between items-center px-4">
        <p className="text-white font-bold text-2xl">Live polls</p>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 400);
            }}
            className="flex items-center gap-1 text-white font-semibold p-2 rounded-md bg-slate-800 text-sm"
          >
            <Copy size={20} /> {copiedLink ? "Copied" : "Copy link"}
          </button>
          {ended ? (
            <p className="text-red-600 font-semibold">Ended</p>
          ) : (
            <button
              disabled={endClicked}
              onClick={async () => {
                setEndClicked(true);
                const resp = await fetch(
                  import.meta.env.VITE_SERVER_ENDPOINT + "/api/stop-quiz",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomID: currentRoomID, quizID: id }),
                  }
                );
                const data = await resp.json();
                if (data.ok) {
                  broadcast({ type: "STATUS", ended: true });
                }
                setEnded(!!data.ok);
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
          )}
        </div>
      </div>
    </div>
  );
};
