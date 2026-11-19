import { Icon } from "@/components/ui";

export type Step = { label: string; done: boolean };

/** Bar at the top of the check screen: the five steps and which are done.
 *  Each step links to its card further down the page. */
export function StepTracker({ steps }: { steps: Step[] }) {
  return (
    <div className="bg-slate-50 lg:sticky lg:top-14 lg:z-10 lg:-mt-2 lg:pt-2 lg:pb-1">
      <nav
        aria-label="Check steps"
        className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
      >
        <ol className="flex gap-1 overflow-x-auto">
          {steps.map((step, index) => (
            <li key={step.label} className="flex-1">
              <a
                href={`#step-${index + 1}`}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    step.done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {step.done ? <Icon name="check" size={14} /> : index + 1}
                </span>
                {step.label}
                {step.done && <span className="sr-only">(done)</span>}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
