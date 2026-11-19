import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui";

const DEMO_TICKET = "SUP-11438";
/** A ticket that engineering really did return as a duplicate of a known issue. */
const DUPLICATE_TICKET = "SUP-11386";

function To({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-blue-700 hover:underline">
      {children}
    </Link>
  );
}

export function DemoPath() {
  return (
    <Card title="Try it in two minutes" hint="A short path through the main features.">
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>
          Open ticket <To href={`/tickets/${DEMO_TICKET}`}>{DEMO_TICKET}</To>. Step 1 shows the
          history as context, and step 2 lists the known issues for this category.
        </li>
        <li>
          Fill in part of the checklist and generate the handoff note. The note lists what was not
          provided.
        </li>
        <li>
          Click <b>Escalate to engineering</b>. In Monitor mode it is allowed, and the gaps are
          logged.
        </li>
        <li>
          Switch <b>Check mode</b> to Enforce (bottom of the menu) and try again. Escalation is now
          blocked until the checklist is complete.
        </li>
        <li>
          Open <To href={`/tickets/${DUPLICATE_TICKET}`}>{DUPLICATE_TICKET}</To>, which engineering
          returned as a duplicate. The same problem is on the board in step 2, so{" "}
          <b>Link to known issue</b> is the right call here.
        </li>
        <li>
          Open the <To href="/log">decision log</To> to see all of it recorded, then the{" "}
          <To href="/dashboard">dashboard</To> for the measures a lead would track.
        </li>
      </ol>
    </Card>
  );
}
