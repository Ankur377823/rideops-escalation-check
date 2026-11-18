import type { ReactNode } from "react";

type Props = {
  title?: string;
  hint?: string;
  /** Shows a numbered circle, for screens that are a sequence of steps. */
  step?: number;
  /** Shown at the right of the title, for example a result badge. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, hint, step, action, children, className = "" }: Props) {
  return (
    <section
      id={step ? `step-${step}` : undefined}
      className={`scroll-mt-36 rounded-xl border border-slate-200 bg-white p-5 shadow-xs ${className}`}
    >
      {title && (
        <div className="flex items-start gap-3">
          {step && (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {step}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {hint && <p className="mt-0.5 text-sm text-slate-600">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
