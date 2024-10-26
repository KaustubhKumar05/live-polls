import React from "react";
import { Question } from "../../types";

export const Preview = ({
  questions = [],
  activeQuestion,
}: {
  questions: Question[];
  activeQuestion?: Question;
}) => (
  <section className="bg-red-400">
    <h2 className="text-white text-xl font-semibold">Preview</h2>
  </section>
);
