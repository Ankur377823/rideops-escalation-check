import { ButtonLink, Icon } from "@/components/ui";

export function Hero() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
        RideOps Support case study
      </p>
      <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900">
        Stop escalations that engineering cannot act on
      </h1>
      <p className="mt-3 max-w-3xl text-base text-slate-600">
        Open tickets rose because 52% more tickets arrived and handling slowed under that load. The
        team cannot control volume this quarter. It can control the 68% of engineering trips that go
        to tickets engineering does not fix. Escalation Check is a short check an agent runs before
        escalating, so engineering gets what it needs the first time.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <ButtonLink href="/tickets" variant="primary">
          Open the ticket queue <Icon name="arrow" />
        </ButtonLink>
        <ButtonLink href="/evidence">See the evidence</ButtonLink>
      </div>
    </section>
  );
}
