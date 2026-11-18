export type Ticket = {
  ticket_id: string;
  created_at: string;
  channel: string;
  client_name: string;
  client_tier: string;
  category: string;
  priority: string;
  description: string;
  assigned_agent: string;
  escalated_to_eng: string;
  eng_handoffs: number;
  eng_outcome: string;
  status: string;
  reopen_count: number;
  age_hours: number;
};

export type TicketList = { total: number; items: Ticket[] };

export type FilterOptions = Record<
  "category" | "priority" | "assigned_agent" | "status" | "client_tier",
  string[]
>;
