export function ScenarioNotes({ assumptions }: { assumptions: string[] }) {
  return (
    <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
      <details>
        <summary className="cursor-pointer font-semibold">
          Assumptions behind these numbers ({assumptions.length})
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </details>
      <p className="mt-2">
        <span className="font-semibold">What it does not fix:</span> even at 100%, open tickets do
        not return to July levels. Ticket volume grew 52% from July to September and properly fixed
        escalations still take about 65 hours. Those need separate work.
      </p>
    </div>
  );
}
