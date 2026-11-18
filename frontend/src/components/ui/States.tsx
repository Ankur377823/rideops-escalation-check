import Link from "next/link";
import { ApiError } from "@/lib/api";

/** Grey placeholder blocks shown while data loads. */
export function Loading({ what = "data" }: { what?: string }) {
  return (
    <div role="status" className="space-y-3 py-1">
      <span className="sr-only">Loading {what}…</span>
      <div className="h-20 animate-pulse rounded-xl bg-slate-200/70" />
      <div className="h-40 animate-pulse rounded-xl bg-slate-200/70" />
      <div className="h-28 animate-pulse rounded-xl bg-slate-200/70" />
    </div>
  );
}

const BOX = "rounded-xl border p-5 text-sm";

export function ErrorNote({ error }: { error: unknown }) {
  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className={`${BOX} border-slate-200 bg-white text-slate-700`}>
        <p className="text-base font-semibold text-slate-900">Not found</p>
        <p className="mt-1">This ticket or page does not exist. Check the ID and try again.</p>
        <Link href="/tickets" className="mt-3 inline-block font-medium text-blue-700 underline">
          Back to ticket queue
        </Link>
      </div>
    );
  }
  return (
    <div className={`${BOX} border-red-200 bg-red-50 text-red-800`}>
      <p className="text-base font-semibold">Could not reach the API</p>
      <p className="mt-1">
        {error instanceof Error ? error.message : "Unknown error"}. If the backend is on a free host
        it may be waking up. Wait a minute and reload.
      </p>
    </div>
  );
}
