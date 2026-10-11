type SummaryItem = {
  type: "new" | "review";
  todayMastered: boolean;
};

type SummarySession = {
  items: SummaryItem[];
  startedAt: string | null;
  completed: boolean;
};

export function getSessionSummary(session: SummarySession) {
  const newItems = session.items.filter((item) => item.type === "new");
  const reviewItems = session.items.filter((item) => item.type === "review");
  const mastered = session.items.filter((item) => item.todayMastered).length;
  return {
    total: session.items.length,
    mastered,
    remaining: session.items.length - mastered,
    newTotal: newItems.length,
    newMastered: newItems.filter((item) => item.todayMastered).length,
    reviewTotal: reviewItems.length,
    reviewMastered: reviewItems.filter((item) => item.todayMastered).length,
    status: session.completed
      ? ("completed" as const)
      : session.startedAt || mastered > 0
        ? ("in_progress" as const)
        : ("not_started" as const),
  };
}
