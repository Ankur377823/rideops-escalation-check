import { Button } from "@/components/ui";

type Props = { page: number; pages: number; onChange: (page: number) => void };

export function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-3 text-sm text-slate-600">
      <Button small disabled={page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span>
        Page {page + 1} of {pages}
      </span>
      <Button small disabled={page + 1 >= pages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
