import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ComparisonCard } from "@/components/comparison/ComparisonCard";
import { BookSection } from "@/components/sections/BookSection";
import { MediaSection } from "@/components/sections/MediaSection";
import {
  clearState,
  createDefaultState,
  createPair,
  loadState,
  normalizeState,
  saveState,
  type TemplateState,
} from "@/lib/comparison-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stasi-Zentrale 1989 und heute – Bildvergleich" },
      {
        name: "description",
        content:
          "Vergleichsvorlage für die ehemalige Stasi-Zentrale in Berlin-Lichtenberg: eigene Bilder von 1989 und heute einfügen und mit dem Regler vergleichen.",
      },
      { property: "og:title", content: "Stasi-Zentrale 1989 und heute – Bildvergleich" },
      {
        property: "og:description",
        content: "Eigene Damals-Heute-Bilder der Stasi-Zentrale einfügen und vergleichen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [state, setState] = useState<TemplateState>(createDefaultState);
  const loaded = useRef(false);

  useEffect(() => {
    loadState().then((stored) => {
      if (stored) setState(stored);
      loaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => saveState(state), 400);
    return () => clearTimeout(t);
  }, [state]);

  // Guards against state that lacks newer sections (e.g. kept in memory from an older version).
  const sections = useMemo(() => normalizeState(state), [state]);

  const update = (patch: Partial<TemplateState>) => setState((s) => ({ ...s, ...patch }));

  const reset = async () => {
    if (!window.confirm("Alle eigenen Bilder und Texte entfernen und die Vorlage zurücksetzen?")) return;
    await clearState();
    setState(createDefaultState());
    toast("Vorlage zurückgesetzt");
  };

  return (
    <div className="min-h-screen">
      <div className="bg-ink text-ink-foreground print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5 md:px-8">
          <p className="file-label opacity-80">Vorlage · Bilder werden nur in diesem Browser gespeichert</p>
          <div className="flex gap-2">
            <Button variant="ink" size="sm" onClick={() => window.print()} className="border border-ink-foreground/30">
              <Printer /> Drucken / PDF
            </Button>
            <Button variant="ink" size="sm" onClick={reset} className="border border-ink-foreground/30">
              <RotateCcw /> Zurücksetzen
            </Button>
          </div>
        </div>
      </div>

      <header className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:px-8 md:pt-20">
        <div className="flex flex-wrap items-center gap-3">
          <span className="stamp text-primary">MfS · Berlin-Lichtenberg</span>
          <span className="file-label text-muted-foreground">Normannenstraße 22 / Ruschestraße 103</span>
        </div>
        <textarea
          className="field mt-6 resize-none overflow-hidden font-display text-5xl leading-[0.95] tracking-tight md:text-7xl"
          rows={1}
          value={state.heading}
          onChange={(e) => update({ heading: e.target.value })}
          aria-label="Überschrift"
        />
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <textarea
            className="field max-w-2xl resize-none text-lg leading-relaxed text-muted-foreground"
            rows={2}
            value={state.intro}
            onChange={(e) => update({ intro: e.target.value })}
            aria-label="Einleitung"
          />
          <div className="flex items-end gap-6 font-display leading-none">
            <div>
              <p className="file-label mb-1 text-muted-foreground">Damals</p>
              <p className="text-6xl text-era-past">1989</p>
            </div>
            <span className="pb-2 text-3xl text-muted-foreground">↔</span>
            <div>
              <p className="file-label mb-1 text-muted-foreground">Heute</p>
              <p className="text-6xl text-era-now">{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-16 md:px-8">
        <BookSection book={sections.book} onChange={(book) => update({ book })} />
        <MediaSection media={sections.media} onChange={(media) => update({ media })} />

        <div className="flex items-center gap-4 pt-4">
          <span className="stamp text-primary">Damals · Heute</span>
          <span className="h-px flex-1 border-t border-dashed border-input" />
        </div>

        {state.pairs.map((pair, i) => (
          <ComparisonCard
            key={pair.id}
            pair={pair}
            index={i}
            onChange={(next) =>
              setState((s) => ({ ...s, pairs: s.pairs.map((p) => (p.id === next.id ? next : p)) }))
            }
            onRemove={() => {
              if (!window.confirm(`„${pair.title}“ löschen?`)) return;
              setState((s) => ({ ...s, pairs: s.pairs.filter((p) => p.id !== pair.id) }));
            }}
          />
        ))}

        <button
          type="button"
          onClick={() => setState((s) => ({ ...s, pairs: [...s.pairs, createPair()] }))}
          className="empty-slot group flex items-center justify-center gap-3 border border-dashed border-input py-10 text-muted-foreground transition-colors hover:text-primary print:hidden"
        >
          <Plus className="size-5 transition-transform group-hover:rotate-90" />
          <span className="file-label">Weiteren Vergleich hinzufügen</span>
        </button>
      </main>

      <footer className="border-t border-dashed">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 md:px-8">
          <p className="file-label text-muted-foreground">Bildvergleich · Stasi-Zentrale</p>
          <p className="file-label text-muted-foreground">Platzhalterbilder sind KI-generiert</p>
        </div>
      </footer>
    </div>
  );
}
