import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";

type Props = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** Small label above the number, for example "Headline" or "Guardrail". */
  role?: string;
  icon?: IconName;
  /** Takes two columns in a StatRow of five, so no slot is left empty. */
  wide?: boolean;
};

export function Stat({ label, value, sub, role, icon, wide }: Props) {
  const span = wide ? "sm:col-span-2 2xl:col-span-1" : "";
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-xs ${span}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          {role && (
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {role}
            </div>
          )}
          <div className="text-sm font-medium text-slate-600">{label}</div>
        </div>
        {icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
        {value}
      </div>
      {sub && <div className="mt-1 text-sm text-slate-600">{sub}</div>}
    </div>
  );
}

export function StatRow({ children, five }: { children: ReactNode; five?: boolean }) {
  const wide = five ? "lg:grid-cols-3 2xl:grid-cols-5" : "xl:grid-cols-4";
  return <div className={`grid gap-3 sm:grid-cols-2 ${wide}`}>{children}</div>;
}
