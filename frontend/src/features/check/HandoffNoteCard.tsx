import { useRef, useState } from "react";
import { Button, Card } from "@/components/ui";
import { copyText } from "@/lib/clipboard";
import type { TicketCheckState } from "./useTicketCheck";

type Props = Pick<TicketCheckState, "note" | "makeNote">;

export function HandoffNoteCard({ note, makeNote }: Props) {
  const [copyLabel, setCopyLabel] = useState("Copy note");
  const noteBox = useRef<HTMLPreElement>(null);
  const label = makeNote.isPending ? "Writing…" : note ? "Regenerate note" : "Generate note";

  const copy = async () => {
    if (!note) return;
    if (await copyText(note.note)) {
      setCopyLabel("Copied");
    } else if (noteBox.current) {
      // The browser refused. Select the note so it can be copied by hand.
      window.getSelection()?.selectAllChildren(noteBox.current);
      setCopyLabel("Selected, press Ctrl+C");
    }
    setTimeout(() => setCopyLabel("Copy note"), 3000);
  };

  return (
    <Card
      step={4}
      title="Write the handoff note"
      hint="Built from your checklist answers. It states clearly what was not provided."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled={makeNote.isPending} onClick={() => makeNote.mutate()}>
          {label}
        </Button>
        {note && (
          <Button onClick={copy} aria-live="polite">
            {copyLabel}
          </Button>
        )}
      </div>
      {makeNote.isError && (
        <p className="mt-3 text-sm text-red-700">Could not generate the note. Try again.</p>
      )}
      {note && (
        <>
          <pre
            ref={noteBox}
            className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800"
          >
            {note.note}
          </pre>
          <p className="mt-2 text-[13px] text-slate-600">
            {note.source === "llm" ? "Written by AI from the template." : "Standard template."}{" "}
            Changing a checklist answer clears the note, so it never goes stale.
          </p>
        </>
      )}
    </Card>
  );
}
