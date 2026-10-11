import assert from "node:assert/strict";
import { getLearningOutcome, type LearningState } from "../src/lib/learning-state";

const historicalReviewState: LearningState = {
  wordId: "review-word",
  status: "unknown",
  inReviewPool: true,
  todayMastered: false,
  dailyConsecutiveKnowCount: 0,
  firstLearningCompleted: true,
  updatedAt: "2026-10-08T00:00:00.000Z",
};

const firstKnow = getLearningOutcome({
  itemType: "review",
  status: "know",
  previousState: historicalReviewState,
  dailyConsecutiveKnowCount: 0,
  wasUnknownToday: false,
});

assert.equal(firstKnow.todayMastered, true);
assert.equal(firstKnow.dailyConsecutiveKnowCount, 0);
assert.equal(firstKnow.wasUnknownToday, false);
assert.equal([firstKnow].filter((item) => item.todayMastered).length, 1);

const firstUnknown = getLearningOutcome({
  itemType: "review",
  status: "unknown",
  previousState: historicalReviewState,
  dailyConsecutiveKnowCount: 0,
  wasUnknownToday: false,
});

const reinforcementResults = [1, 2, 3].reduce<
  ReturnType<typeof getLearningOutcome>[]
>((results) => {
  const previous = results.at(-1) ?? firstUnknown;
  return [
    ...results,
    getLearningOutcome({
      itemType: "review",
      status: "know",
      previousState: historicalReviewState,
      dailyConsecutiveKnowCount: previous.dailyConsecutiveKnowCount,
      wasUnknownToday: previous.wasUnknownToday,
    }),
  ];
}, []);

assert.deepEqual(
  reinforcementResults.map((result) => ({
    count: result.dailyConsecutiveKnowCount,
    mastered: result.todayMastered,
  })),
  [
    { count: 1, mastered: false },
    { count: 2, mastered: false },
    { count: 3, mastered: true },
  ],
);

console.log("review first know: 1 / 1 mastered");
console.log("review unknown -> know x3: false, false, true");
