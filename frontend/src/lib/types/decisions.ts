export type Decision = {
  id: number;
  ticket_id: string;
  agent: string | null;
  mode: string;
  action: string;
  missing_items: string[];
  created_at: string;
};

export type DecisionSummary = {
  checks: number;
  escalated: number;
  escalated_with_gaps: number;
  kept_at_l1: number;
  linked_known_issue: number;
};

export type DecisionLog = { items: Decision[]; summary: DecisionSummary };
