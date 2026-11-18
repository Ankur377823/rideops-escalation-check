import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { TicketCheck } from "@/features/check/TicketCheck";

export default function TicketCheckPage() {
  return (
    <Suspense fallback={<Loading what="check" />}>
      <TicketCheck />
    </Suspense>
  );
}
