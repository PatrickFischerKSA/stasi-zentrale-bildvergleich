import { useMemo, useState } from "react";
import { Plus, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useSharedProject } from '@/lib/use-shared-project';
import { EditingContext } from '@/lib/editing';
import { api,editToken,importLocalMedia } from '@/lib/online';
import { Button } from "@/components/ui/button";
import { ComparisonCard } from "@/components/comparison/ComparisonCard";
import { BookSection } from "@/components/sections/BookSection";
import { MediaSection } from "@/components/sections/MediaSection";
import {
  createDefaultState,
  createPair,
  normalizeState,
  loadState,
  type TemplateState,
} from "@/lib/comparison-store";

export default function Index() {
  const {state,setState,loaded,canEdit,status,error,conflict,resolve,sync} = useSharedProject();
  const [importBusy,setImportBusy]=useState(false);
  const [history,setHistory] = useState<{revision:number;updated_at:string}[]>([]);
  const copyLink = async (edit=false) => {
    const url=new URL(location.href); url.hash=edit?'edit='+editToken():'';
    try { await navigator.clipboard.writeText(url.href); toast(edit?'Bearbeitungslink kopiert':'Ansichtslink kopiert'); } catch { window.prompt('Link kopieren:',url.href); }
  };
  const importLocal = async () => {
    if(!window.confirm('Die bisherige lokale Vorlage mit ihren Bildern und Texten in das gemeinsame Projekt übernehmen? Diese Inhalte werden für alle sichtbar.'))return;
    setImportBusy(true);
    try {const stored=await loadState();if(!stored){toast('Keine bisherige lokale Vorlage in diesem Browser vorhanden.');return;}setState(await importLocalMedia(stored));toast('Lokale Inhalte übernommen. Sie werden online gespeichert.');}catch(e){toast.error((e as Error).message);}finally{setImportBusy(false);}
  };
  const versions = async () => { try {const versions=(await (await api('/api/history')).json()).versions;setHistory(versions);if(!versions.length)toast("Noch keine früheren Versionen vorhanden.");}catch(e){toast.error((e as Error).message);} };
  const restore = async (revision:number) => {
    if(!window.confirm('Diese ältere Version für alle wiederherstellen?'))return;
    try {const data=await (await api('/api/history/'+revision)).json();setState(normalizeState(data.state));setHistory([]);}catch(e){toast.error((e as Error).message);}
  };
  // Guards against state that lacks newer sections (e.g. kept in memory from an older version).
  const sections = useMemo(() => normalizeState(state), [state]);

  const update = (patch: Partial<TemplateState>) => setState((s) => ({ ...s, ...patch }));

  const reset = async () => {
    if (!window.confirm("Die gemeinsame Vorlage für ALLE zurücksetzen? Frühere Versionen bleiben im Verlauf erhalten.")) return;
    setState(createDefaultState());
    toast("Gemeinsame Vorlage wird zurückgesetzt");
  };

  if (!loaded) return <main className="mx-auto max-w-6xl p-8"><p role="status">{error || "Gemeinsame Version wird geladen …"}</p><Button onClick={()=>void sync()}>Erneut versuchen</Button></main>;

  return (
    <div className="min-h-screen">
      <div className="bg-ink text-ink-foreground print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-2.5 md:px-8">
          <p className="file-label opacity-80">{canEdit ? "Gemeinsam bearbeiten · Änderungen werden online gespeichert" : "Gemeinsame Online-Version · Leseansicht"}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="ink" size="sm" onClick={()=>void copyLink()}>Ansichtslink kopieren</Button>
            {canEdit && <><Button variant="ink" size="sm" onClick={()=>void copyLink(true)}>Bearbeitungslink kopieren</Button><Button variant="ink" size="sm" onClick={()=>void versions()}>Versionsverlauf</Button><Button variant="ink" size="sm" disabled={importBusy || !!conflict} onClick={()=>void importLocal()}>{importBusy?"Medien werden übertragen …":"Bisherige lokale Vorlage übernehmen"}</Button></>}
            <Button variant="ink" size="sm" onClick={() => window.print()} className="border border-ink-foreground/30">
              <Printer /> Drucken / PDF
            </Button>
            <Button disabled={!canEdit || !!conflict || importBusy} variant="ink" size="sm" onClick={reset} className="border border-ink-foreground/30">
              <RotateCcw /> Zurücksetzen
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-4 print:hidden"><p role="status" className="text-sm">{status}</p>{error && <p role="alert" className="mt-2 text-primary">{error} <Button onClick={()=>void sync()}>Erneut versuchen</Button></p>}
        {conflict && <div role="alert" className="panel my-3"><p>Jemand hat dieselben Felder geändert. Deine Eingaben bleiben erhalten. Wähle die gemeinsame Version oder übernimm deine betroffenen Felder.</p><p className="my-2 text-sm">{conflict.paths.length} Konflikt(e): {conflict.paths.map(p=>p.split('/').pop()).join(', ')}</p><div className="flex flex-wrap gap-3"><Button onClick={()=>resolve('remote')}>Gemeinsame Version laden</Button><Button onClick={()=>resolve('local')}>Meine betroffenen Felder übernehmen</Button></div></div>}
        {history.length>0 && <div className="panel my-3"><p className="mb-3">Frühere Versionen wiederherstellen</p>{history.map(v=><Button key={v.revision} className="m-1" onClick={()=>void restore(v.revision)}>Version {v.revision} · {new Date(v.updated_at).toLocaleString('de-CH')}</Button>)}<Button onClick={()=>setHistory([])}>Schliessen</Button></div>}
      </div>
      <EditingContext.Provider value={canEdit && !conflict && !importBusy}><div>
      <header className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:px-8 md:pt-20">
        <div className="flex flex-wrap items-center gap-3">
          <span className="stamp text-primary">MfS · Berlin-Lichtenberg</span>
          <span className="file-label text-muted-foreground">Normannenstraße 22 / Ruschestraße 103</span>
        </div>
        <textarea readOnly={!canEdit || !!conflict || importBusy}
          className="field mt-6 resize-none overflow-hidden font-display text-5xl leading-[0.95] tracking-tight md:text-7xl"
          rows={2}
          value={state.heading}
          onChange={(e) => update({ heading: e.target.value })}
          aria-label="Überschrift"
        />
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <textarea readOnly={!canEdit || !!conflict || importBusy}
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
          disabled={!canEdit || !!conflict || importBusy}
          hidden={!canEdit}
          onClick={() => setState((s) => ({ ...s, pairs: [...s.pairs, createPair()] }))}
          className="empty-slot group flex items-center justify-center gap-3 border border-dashed border-input py-10 text-muted-foreground transition-colors hover:text-primary print:hidden"
        >
          <Plus className="size-5 transition-transform group-hover:rotate-90" />
          <span className="file-label">Weiteren Vergleich hinzufügen</span>
        </button>
      </main>

      </div></EditingContext.Provider>
      <footer className="border-t border-dashed">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 md:px-8">
          <p className="file-label text-muted-foreground">Bildvergleich · Stasi-Zentrale</p>
          <p className="file-label text-muted-foreground">Eigene Bilder einsetzen · Quellen angeben</p>
        </div>
      </footer>
    </div>
  );
}
