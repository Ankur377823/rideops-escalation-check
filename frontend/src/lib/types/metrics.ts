import type { Ticket } from "./ticket";

export type Week = {
  week_end: string;
  created: number;
  closed: number;
  open_at_end: number;
  open_over_48h: number;
  bounce_rate: number | null;
};

export type AgentRow = {
  assigned_agent: string;
  tickets: number;
  escalation_rate: number | null;
  bounce_rate: number | null;
  median_hours: number | null;
  reopen_rate: number | null;
  csat: number | null;
  open: number;
};

export type HandoffRow = { eng_handoffs: number; tickets: number; median_hours: number | null };

export type Headline = {
  tickets: number;
  open_now: number;
  open_over_48h_now: number;
  escalated: number;
  bounced: number;
  bounce_rate: number;
  multi_handoff: number;
  reopen_rate: number;
};

export type Summary = { summary: Headline; by_handoffs: HandoffRow[] };

export type AttentionTicket = Pick<
  Ticket,
  | "ticket_id"
  | "client_name"
  | "category"
  | "priority"
  | "assigned_agent"
  | "status"
  | "eng_handoffs"
  | "age_hours"
>;
