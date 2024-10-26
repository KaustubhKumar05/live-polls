import React from "react";
import { Question } from "../../types";

export const Config = ({ question }: { question?: Question }) => {
  return (
    <section className="col-span-1 bg-red-300">
      <h2 className="text-white text-xl font-semibold">Modify question</h2>
    </section>
  );
};
