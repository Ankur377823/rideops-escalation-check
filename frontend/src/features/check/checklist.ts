import type { Answers, ChecklistItem } from "@/lib/types/check";

/** Text items need non-blank text; confirm items need a ticked box. */
export function isAnswered(item: ChecklistItem, answers: Answers) {
  const value = answers[item.id];
  return item.kind === "text" ? typeof value === "string" && value.trim() !== "" : value === true;
}

export const missingItems = (checklist: ChecklistItem[], answers: Answers) =>
  checklist.filter((item) => !isAnswered(item, answers));
