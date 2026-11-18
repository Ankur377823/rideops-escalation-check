import { ButtonLink, Icon } from "@/components/ui";

export function Hero() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
        RideOps Support case study
      </p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900">
        Stop escalations that engineering cannot act on
      </h1>
      <p className="mt-3 max-w-3xl text-base text-slate-600">
        More than half of the tickets that L1 support sends to engineering come back without a fix.
        Escalation Check is a short check an agent runs before escalating, so engineering gets what
        it needs the first time.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <ButtonLink href="/tickets" variant="primary">
          Open the ticket queue <Icon name="arrow" />
        </ButtonLink>
        <ButtonLink href="/evidence">See the evidence</ButtonLink>
      </div>
    </section>
  );
}
