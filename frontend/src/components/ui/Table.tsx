import type { ReactNode } from "react";

export type Column = string | { label: string; right?: boolean };

type TableProps = { columns: Column[]; minWidth?: number; children: ReactNode };

export function Table({ columns, minWidth = 640, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth }}>
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columns.map((column) => {
              const { label, right } =
                typeof column === "string" ? { label: column, right: false } : column;
              return (
                <th
                  key={label}
                  scope="col"
                  className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 ${right ? "text-right" : "text-left"}`}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

type CellProps = { children: ReactNode; right?: boolean; className?: string };

export function Cell({ children, right, className = "" }: CellProps) {
  const align = right ? "text-right tabular-nums" : "";
  return <td className={`px-3 py-2.5 text-sm text-slate-800 ${align} ${className}`}>{children}</td>;
}
