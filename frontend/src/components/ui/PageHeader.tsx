import type { ReactNode } from "react";

type Props = {
  title: string;
  /** Who the screen is for, shown as a small label above the title. */
  audience?: string;
  children: ReactNode;
};

export function PageHeader({ title, audience, children }: Props) {
  return (
    <header>
      {audience && (
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{audience}</p>
      )}
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-slate-600">{children}</p>
    </header>
  );
}
