import { LiveList } from "@liveblocks/client";
import { QuizResponse } from "./src/types";

declare global {
  interface Liveblocks {
    Storage: {
      responses: LiveList<QuizResponse>;
    };
  }
}
