import type { Ticket } from "./ticket";

export type Mode = "monitor" | "enforce";
export type Action = "escalated" | "resolved_at_l1" | "linked_known_issue";
export type Answers = Record<string, string | boolean>;

export type ChecklistItem = {
  id: string;
  prevents: string;
  kind: "text" | "confirm";
  label: string;
};

export type KnownIssue = {
  id: number;
  title: string;
  category: string;
  issue_type: string | null;
  status: string;
  workaround: string | null;
  source: string | null;
};

export type History = {
  issue_type: string;
  total: number;
  enough_history: boolean;
  resolved_at_l1: number;
  escalated: number;
  fixed_by_eng: number;
  bounced: number;
  return_reasons: { reason: string; count: number }[];
};

export type Advice = { level: "warn" | "info"; text: string };

export type AgentContext = { agent: string; bounce_rate: number | null; team_bounce_rate: number };

export type L1Example = { ticket_id: string; agent: string; client: string; hours: number };

export type Check = {
  ticket: Ticket;
  mode: Mode;
  history: History;
  advice: Advice[];
  agent: AgentContext;
  checklist: ChecklistItem[];
  known_issues: KnownIssue[];
  l1_examples: L1Example[];
};

export type HandoffNote = { note: string; source: string };
export type DecisionResult = { action: Action; missing_items: string[] };
