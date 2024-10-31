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
import { useQuizManager } from "../../hooks/useQuizManager";

export const Attempt = () => {
  let { id } = useParams();

  const { currentRoomID, liveQuestions } = useQuizStore((state) => state);
  const { getQuiz } = useQuizManager();

  useEffect(() => {
    getQuiz(id);
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
