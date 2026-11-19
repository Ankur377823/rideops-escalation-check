import { FIELD, Icon } from "@/components/ui";
import type { ChecklistItem } from "@/lib/types/check";

type Props = {
  item: ChecklistItem;
  value: string | boolean | undefined;
  done: boolean;
  onChange: (value: string | boolean) => void;
};

/** One checklist row: a tick box or a text box, with the reason it exists. */
export function ChecklistField({ item, value, done, onChange }: Props) {
  return (
    <li
      className={`rounded-lg border px-3 py-2.5 ${
        done ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200"
      }`}
    >
      {item.kind === "confirm" ? (
        <label className="flex items-start gap-3 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            className="mt-0.5 size-4"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{item.label}</span>
        </label>
      ) : (
        <label className="block text-sm font-medium text-slate-800">
          <span>{item.label}</span>
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type here"
            className={`${FIELD} mt-1.5 w-full font-normal`}
          />
        </label>
      )}
      <div className="mt-1.5 flex items-center justify-between gap-2 text-[13px] text-slate-600">
        <span>Prevents: {item.prevents}</span>
        {done && (
          <span className="flex items-center gap-1 font-medium text-emerald-700">
            <Icon name="check" size={14} /> Done
          </span>
        )}
      </div>
    </li>
  );
}
