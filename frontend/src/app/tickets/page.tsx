"use client";

import { ErrorNote, Loading, PageHeader } from "@/components/ui";
import { Pagination } from "@/features/tickets/Pagination";
import { TicketFilters } from "@/features/tickets/TicketFilters";
import { TicketTable } from "@/features/tickets/TicketTable";
import { useTicketList } from "@/features/tickets/useTicketList";

export default function TicketsPage() {
  const list = useTicketList();
  return (
    <div className="space-y-4">
      <PageHeader title="Ticket queue" audience="L1 agent">
        Pick a ticket and run the escalation check before sending it to engineering.
      </PageHeader>
      <TicketFilters filters={list.filters} update={list.update} total={list.total} />
      {list.tickets.isError && <ErrorNote error={list.tickets.error} />}
      {list.tickets.isPending && <Loading what="tickets" />}
      {list.tickets.data && <TicketTable tickets={list.tickets.data.items} />}
      <Pagination page={list.page} pages={list.pages} onChange={list.setPage} />
    </div>
  );
}
