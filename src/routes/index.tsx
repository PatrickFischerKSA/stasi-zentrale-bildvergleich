import type { ReactNode } from "react";

const LOVABLE_EDIT_URL =
  "https://lovable.dev/projects/7023de20-609e-4a6e-a4b5-cacfa6d7576d";

function PH({ kind, children, tall }: { kind: string; children: ReactNode; tall?: boolean }) {
  return (
    <figure className={`placeholder-box my-8 flex flex-col justify-center rounded-sm px-5 py-6 ${tall ? "min-h-[55vh]" : "min-h-40"}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Platzhalter · {kind}</span>
      <figcaption className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</figcaption>
    </figure>
  );
}

function TextPH({ children }: { children: ReactNode }) {
  return <span className="rounded-sm bg-accent/10 px-1 text-accent">[Platzhalter: {children}]</span>;
}

function Station({
  kicker,
  title,
  children,
  dark,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`${dark ? "bg-primary text-primary-foreground" : ""} flex min-h-[90vh] flex-col justify-center px-6 py-20`}>
      <div className="reveal mx-auto w-full max-w-md">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{kicker}</p>
        <h2 className="text-balance text-4xl font-semibold leading-[1.05]">{title}</h2>
        <div className={`mt-6 space-y-4 text-[1.05rem] leading-relaxed ${dark ? "text-primary-foreground/85" : "text-foreground/85"}`}>
          {children}
        </div>
      </div>
    </section>
  );
}

function Chapter({ n, title }: { n: string; title: string }) {
  return (
    <div className="border-y border-border px-6 py-10">
      <div className="mx-auto flex max-w-md items-baseline gap-4">
        <span className="font-serif text-6xl text-accent">{n}</span>
        <span className="font-serif text-2xl italic">{title}</span>
      </div>
    </div>
  );
}

export default function Index() {
  const isEditLink = typeof window !== "undefined" && window.location.hash.startsWith("#edit=");

  return (
    <main className="bg-background text-foreground">
      {isEditLink && (
        <aside className="edit-access-bar" aria-label="Bearbeitungszugang">
          <span>Bearbeitungsmodus · aktueller Lovable-Stand</span>
          <a href={LOVABLE_EDIT_URL} target="_blank" rel="noreferrer">In Lovable bearbeiten</a>
        </aside>
      )}

      <div className="bg-accent px-4 py-2 text-center text-xs font-medium text-accent-foreground">
        Entwurf · Alle orange gestrichelten Felder und [Platzhalter] sind noch zu ersetzen und zu belegen.
      </div>

      <header className="flex min-h-screen flex-col justify-end px-6 pb-16 pt-24">
        <div className="mx-auto w-full max-w-md">
          <PH kind="Eigenes Foto oder Kurzvideo (Hochformat)" tall>
            Ein Gegenwartsmoment, z. B. eine aktuelle Nachricht, ein Ort in Berlin heute, ein Smartphone mit Push-Meldung. Bildnachweis:{" "}
            <TextPH>eigene Aufnahme, Datum, Ort</TextPH>
            <span className="mt-3 block rounded-sm bg-accent/10 p-3 font-mono text-xs leading-relaxed text-foreground/80">
              {'<video src="/gegenwart.mp4" controls playsInline className="my-8 aspect-[9/16] w-full rounded-sm object-cover" />'}
              <br />
              <span className="text-muted-foreground">→ Fertiges Template steht direkt über diesem Platzhalter im Code: Marker entfernen, Datei in „public“ legen, fertig.</span>
            </span>
          </PH>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Eine Scrollstory zu Andreas Pflüger</p>
          <h1 className="mt-3 text-7xl font-semibold leading-none">Kälter</h1>
          <p className="mt-6 font-serif text-xl italic leading-snug">
            <TextPH>Ein Satz, der den Gegenwartsmoment benennt und zur Frage des Romans überleitet</TextPH>
          </p>
          <p className="mt-10 text-sm text-muted-foreground">Scrollen ↓</p>
        </div>
      </header>

      <PH kind="Atmo-Ton">
        <span className="block">Audio-Datei, ca. 20–40 Sek., z. B. Straßengeräusch, Funkrauschen. Quelle: <TextPH>eigene Aufnahme / Archiv mit Lizenz</TextPH></span>
      </PH>

      <Chapter n="1" title="Der Fall" />
      <Station kicker="Ausgangslage" title="Mauerfall 9.11.1989">
        <p>Die Pressekonferenz wird im Buch erwähnt nachdem Luzy von einem Kurztrip im Süden Frankreichs zurückkommt. Schabowskis genaue Worte werden zitiert: „Das tritt nach meiner Kenntnis – ist das sofort – unverzüglich.“ Luzy erkennt die Tragweite dieser Worte sofort und macht sich auf den Weg zum Grenzübergang, nach Ostberlin, zur Stasizentrale.</p>
      </Station>
      <Station kicker="Figur" title="Luzy Morgenrot">
        <p><TextPH>Hauptfigur(en) und Motiv, nur nach eigener Lektüre beschreiben</TextPH></p>
        <PH kind="Eigenes Foto">Symbolbild zur Figur. Bildnachweis: <TextPH>Urheber:in</TextPH></PH>
      </Station>
      <Station kicker="Zitat" title="Ein Satz, der hängen bleibt.">
        <blockquote className="border-l-2 border-accent pl-4 font-serif text-2xl italic"><TextPH>wörtliches Zitat aus dem Roman</TextPH></blockquote>
        <p className="text-sm text-muted-foreground">Pflüger, Kälter, S. <TextPH>Seite</TextPH></p>
      </Station>

      <Chapter n="2" title="Der historische Kontext" />
      <Station kicker="Mauerfall" title="Am 9. November 1989 öffnet sich die Grenze.">
        <p>Mit der Öffnung der Berliner Mauer beginnt das Ende der DDR. Für die Geheimdienste in Ost und West bedeutet das: Akten, Netzwerke und Geheimnisse geraten in Bewegung.</p>
        <PH kind="Historische Quelle">Foto oder Dokument zum 9. November 1989. Beschriftung: <TextPH>Titel, Urheber, Datum, Archiv, Signatur, Lizenz</TextPH></PH>
      </Station>
      <Station dark kicker="RAF in der DDR" title="Untergetaucht im anderen Deutschland.">
        <p>Mehrere ehemalige Mitglieder der RAF lebten in den 1980er Jahren mit neuen Identitäten in der DDR – unterstützt von der Staatssicherheit. Nach dem Mauerfall wurden sie 1990 enttarnt und festgenommen.</p>
        <p className="text-sm opacity-70">Details (Namen, Zahl, Daten) vor Veröffentlichung mit Quellen belegen, z. B. Stasi-Unterlagen-Archiv, bpb.</p>
      </Station>
      <Station kicker="Karte" title="Ein geteiltes Land, ein Netz aus Orten.">
        <PH kind="Karte" tall>Karte mit den Schauplätzen des Romans und historischen Orten. Kartengrundlage: <TextPH>z. B. OpenStreetMap, © OpenStreetMap-Mitwirkende, ODbL</TextPH></PH>
      </Station>
      <Station kicker="Geheimdienste" title="Wer weiß was – und wer verrät wen?">
        <p><TextPH>Rolle von MfS (Stasi) und westlichen Diensten im Roman, belegt</TextPH></p>
        <PH kind="Historische Quelle">Aktenauszug. Beschriftung: <TextPH>Dokumenttitel, Datum, Archiv, Signatur</TextPH></PH>
      </Station>

      <Chapter n="3" title="Das zentrale Thema" />
      <Station kicker="These" title="[Platzhalter: Thema in einem Wort]">
        <p><TextPH>Eine These: Was der Roman über dieses Thema sagt</TextPH></p>
      </Station>
      <Station kicker="Beleg" title="Wo der Text es zeigt.">
        <p><TextPH>Szene aus dem Roman, mit Seitenangabe</TextPH></p>
        <PH kind="Kurzvideo">10–20 Sek. eigene Aufnahme zur Stimmung. Nachweis: <TextPH>eigene Aufnahme</TextPH></PH>
      </Station>

      <Chapter n="4" title="Mein Aspekt" />
      <Station kicker="Selbst gewählt" title="[Platzhalter: eigener Aspekt]">
        <p><TextPH>Warum dieser Aspekt? Eine Beobachtung, ein Gedanke</TextPH></p>
      </Station>

      <Chapter n="5" title="Und heute?" />
      <Station dark kicker="Gegenwart" title="Was bleibt kalt?">
        <p><TextPH>Rückbezug auf den Gegenwartsmoment vom Anfang – ein klarer Schlussgedanke</TextPH></p>
        <PH kind="Eigenes Foto">Derselbe Ort / dasselbe Motiv wie am Anfang. Bildnachweis: <TextPH>eigene Aufnahme</TextPH></PH>
      </Station>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-md">
          <h2 className="text-4xl font-semibold">Quellen</h2>
          <h3 className="mt-8 text-xl">Primärliteratur</h3>
          <ul className="mt-2 space-y-2 text-sm"><li>Pflüger, Andreas: Kälter. <TextPH>Verlag, Ort, Jahr, Auflage</TextPH></li></ul>
          <h3 className="mt-8 text-xl">Sekundärliteratur &amp; Rezensionen</h3>
          <ul className="mt-2 space-y-2 text-sm"><li><TextPH>Autor:in, Titel, Medium, Datum, URL, abgerufen am</TextPH></li></ul>
          <h3 className="mt-8 text-xl">Historische Quellen</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li><TextPH>Dokument, Datum, Archiv, Signatur</TextPH></li>
            <li><TextPH>Darstellung zu RAF in der DDR, z. B. Stasi-Unterlagen-Archiv / bpb, URL</TextPH></li>
          </ul>
          <h3 className="mt-8 text-xl">Bild-, Video- und Tonnachweise</h3>
          <ul className="mt-2 space-y-2 text-sm"><li><TextPH>je Medium: Titel, Urheber:in, Lizenz, Quelle</TextPH></li></ul>
          <h3 className="mt-8 text-xl">Karte</h3>
          <ul className="mt-2 space-y-2 text-sm"><li><TextPH>Kartengrundlage und Lizenz</TextPH></li></ul>
          <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">Erstellt von <TextPH>Name, Klasse, Datum</TextPH></p>
        </div>
      </section>
    </main>
  );
}
