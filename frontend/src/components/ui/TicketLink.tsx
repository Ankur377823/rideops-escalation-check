import Link from "next/link";

export function TicketLink({ id, bold }: { id: string; bold?: boolean }) {
  return (
    <Link
      href={`/tickets/${id}`}
      className={`text-blue-700 hover:underline ${bold ? "font-medium" : ""}`}
    >
      {id}
    </Link>
  );
}
