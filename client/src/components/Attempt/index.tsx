import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";
import useQuizStore from "../../store";
import { Question } from "../../types";
import { View } from "./View";
import { FullPageLoader } from "../FullPageLoader";

export const Attempt = () => {
  let { id } = useParams();

  const {
    currentRoomID,
    setCurrentRoomID,
    setLiveQuestions,
    liveQuestions,
    setEnded,
  } = useQuizStore((state) => state);

  useEffect(() => {
    const init = async () => {
      if (!currentRoomID) {
        const resp = await fetch(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/api/get-room/${id}`
        );
        const data = await resp.json();
        setCurrentRoomID(data.id);
        setLiveQuestions(JSON.parse(data.questions));
        setEnded(data.active === "false");
      }
    };
    init();
  }, [id]);

  return liveQuestions && liveQuestions.length > 0 ? (
    <LiveblocksProvider publicApiKey={import.meta.env.VITE_LB_PUBLIC_KEY}>
      <RoomProvider
        id={currentRoomID}
        initialStorage={{ responses: new LiveList<Question>([]) }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <View id={id} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  ) : (
    <FullPageLoader />
  );
};

/**
 * Show timer in the navbar, stop button for author
 * Submit for MCQ and text based, show everyone's responses after submission
 */
