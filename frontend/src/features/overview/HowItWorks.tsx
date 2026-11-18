import { Card } from "@/components/ui";

const STEPS = [
  {
    title: "Review the history",
    text: "See what happened to past tickets of the same type, and why engineering sent them back.",
  },
  {
    title: "Check known issues",
    text: "If engineering already knows the problem, link the ticket instead of escalating again.",
  },
  {
    title: "Complete the checklist",
    text: "Each item targets one reason engineering gives for returning a ticket.",
  },
  {
    title: "Write the handoff note",
    text: "One click builds a note that states what was and was not provided.",
  },
  {
    title: "Decide and log",
    text: "Escalate, keep at L1, or link to a known issue. Every decision is recorded.",
  },
];

export function HowItWorks() {
  return (
    <Card
      title="How the check works"
      hint="Five steps on one screen, before a ticket is escalated."
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <div className="mt-2 text-sm font-semibold text-slate-900">{step.title}</div>
            <p className="mt-1 text-sm text-slate-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
