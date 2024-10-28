import { QuizResponse, QuestionTypes } from "./types";

export const getVotesForOptions = (
  responses: QuizResponse[] = [],
  question_id,
  question_type,
  options
): [string[] | number[], number] => {
  if (question_type === QuestionTypes.MCQ) {
    const optionCounts = Array.from({ length: options?.length }, () => 0);
    let submissions = 0;
    responses?.forEach((resp) => {
      if (question_id === resp.question_id) {
        submissions++;
        optionCounts[resp.response]++;
      }
    });
    return [optionCounts, submissions];
  }
  const responseWords: string[] = [];
  responses?.forEach((resp) => {
    if (resp.question_id === question_id) {
      responseWords.push(resp.response);
    }
  });
  return [responseWords, responseWords.length];
};
