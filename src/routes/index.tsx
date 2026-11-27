import { useState } from "react";
import { toast } from "sonner";
import { KaelterStory } from "@/components/kaelter-story";
import { SiteManager } from "@/components/site-manager";
import { Button } from "@/components/ui/button";
import { normalizeState } from "@/lib/comparison-store";
import { api, editToken } from "@/lib/online";
import { useSharedProject } from "@/lib/use-shared-project";

export default function Index() {
  const { state, setState, loaded, canEdit, status, error, conflict, resolve, sync } = useSharedProject();
  const [history, setHistory] = useState<{ revision: number; updated_at: string }[]>([]);

  const copyLink = async (edit = false) => {
    const url = new URL(location.href);
    url.search = "";
    url.hash = edit ? `edit=${editToken()}` : "";
    try {
      await navigator.clipboard.writeText(url.href);
      toast(edit ? "Bearbeitungslink kopiert" : "Ansichtslink kopiert");
    } catch {
      window.prompt("Link kopieren:", url.href);
    }
  };

  const versions = async () => {
    try {
      const versions = (await (await api("/api/history")).json()).versions;
      setHistory(versions);
      if (!versions.length) toast("Noch keine früheren Versionen vorhanden.");
    } catch (caught) {
      toast.error((caught as Error).message);
    }
  };

  const restore = async (revision: number) => {
    if (!window.confirm("Diese ältere Version für alle wiederherstellen?")) return;
    try {
      const data = await (await api(`/api/history/${revision}`)).json();
      setState(normalizeState(data.state));
      setHistory([]);
    } catch (caught) {
      toast.error((caught as Error).message);
    }
  };

  if (!loaded) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p role="status">{error || "Gemeinsame Vorlage wird geladen …"}</p>
        <Button onClick={() => void sync()}>Erneut versuchen</Button>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {canEdit&&<aside className="edit-access-bar print:hidden" aria-label="Projektzugang">
        <span>{canEdit ? "Template bearbeiten · automatisch online gespeichert" : "Kälter-Template · Leseansicht"}</span>
        <div className="edit-access-actions">
          <button type="button" onClick={() => void copyLink()}>Ansichtslink kopieren</button>
          {canEdit && <button type="button" onClick={() => void copyLink(true)}>Bearbeitungslink kopieren</button>}
          {canEdit && <button type="button" onClick={() => void versions()}>Versionsverlauf</button>}
        </div>
      </aside>}

      {(canEdit||error||conflict)&&<div className="mx-auto max-w-5xl px-5 py-3 print:hidden">
        <p role="status" className="text-sm">{status}</p>
        {error && <p role="alert" className="mt-2 text-accent">{error} <Button onClick={() => void sync()}>Erneut versuchen</Button></p>}
        {conflict && (
          <div role="alert" className="template-notice">
            <p>Jemand hat gleichzeitig dieselben Felder geändert. Wähle, welche Fassung übernommen wird.</p>
            <div className="edit-access-actions">
              <Button onClick={() => resolve("remote")}>Gemeinsame Version laden</Button>
              <Button onClick={() => resolve("local")}>Meine Änderungen übernehmen</Button>
            </div>
          </div>
        )}
        {history.length > 0 && (
          <div className="template-notice">
            <p>Frühere Version wiederherstellen</p>
            <div className="edit-access-actions">
              {history.map((version) => <Button key={version.revision} onClick={() => void restore(version.revision)}>Version {version.revision} · {new Date(version.updated_at).toLocaleString("de-CH")}</Button>)}
              <Button onClick={() => setHistory([])}>Schliessen</Button>
            </div>
          </div>
        )}
      </div>}

      <SiteManager
        renderHome={(page,onEdit)=><KaelterStory page={page} onEdit={onEdit} layouts={state.site.sections}/>}
        value={state.site}
        onChange={(change) => setState((current) => ({ ...current, site: change(current.site) }))}
        canEdit={canEdit}
        blocked={!!conflict}
        status={status}
      >
        {null}
      </SiteManager>
    </div>
  );
}
