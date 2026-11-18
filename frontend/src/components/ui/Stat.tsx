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
};

export function Stat({ label, value, sub, role, icon }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
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

export function StatRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
