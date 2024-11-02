import React, { useEffect, useState } from "react";
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
import { useHistory } from "react-router-dom";

export const Attempt = () => {
  let { id } = useParams();

  const { currentRoomID, liveQuestions } = useQuizStore((state) => state);
  const { getQuiz } = useQuizManager();
  const [fetching, setFetching] = useState<boolean | undefined>(undefined);
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      setFetching(true);
      await getQuiz(id);
      setFetching(false);
    };
    init();
  }, [id]);

  useEffect(() => {
    if (fetching === false && liveQuestions.length === 0) {
      history.push("/");
    }
  }, [fetching, liveQuestions]);

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
