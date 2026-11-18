export type RuleScore = {
  rule: string;
  flagged: number;
  precision: number | null;
  recall: number | null;
};

export type Predictors = {
  train_escalations: number;
  test_escalations: number;
  base_bounce_rate: number;
  threshold: number;
  rules: RuleScore[];
  known_issue_rule: RuleScore & { base_rate: number };
};

export type ReasonRow = { reason: string; tickets: number; becomes: string; hours_saved: number };

export type ScenarioWeek = {
  week_end: string;
  open_over_48h_actual: number;
  open_over_48h_scenario: number;
};

export type Scenario = {
  hours_saved: number;
  share_of_all_ticket_hours: number;
  eng_handoffs_avoided: number;
  open_now_actual: number;
  open_now_scenario: number;
  open_over_48h_now_actual: number;
  open_over_48h_now_scenario: number;
  by_reason: ReasonRow[];
  weeks: ScenarioWeek[];
  assumptions: string[];
};
