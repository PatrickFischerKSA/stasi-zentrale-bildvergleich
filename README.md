# Stasi-Zentrale: 1989 und heute

Lauffähige React-/TypeScript-Anwendung für Bildvergleiche, Buchbezug und einen Medienabschnitt mit einem Video und zwei Bildern. Fehlende Komponenten wurden für dieses eigenständige Projekt neu implementiert.

## Im Browser ausprobieren

https://patrickfischerksa.github.io/stasi-zentrale-bildvergleich/

GitHub Pages veröffentlicht nach erfolgreichen Tests und Build jede Änderung auf `main` automatisch. Alle sehen dieselbe online gespeicherte Version. Ein separater Bearbeitungslink erlaubt gemeinsame Änderungen.

## Lokal starten

Voraussetzung: Node.js 22.12+ (empfohlen 24) und npm.

```sh
git clone https://github.com/PatrickFischerKSA/stasi-zentrale-bildvergleich.git
cd stasi-zentrale-bildvergleich
npm ci
npm run dev
```

Die von Vite angezeigte Adresse öffnen. Zum lokalen Start sind keine Schlüssel nötig; die öffentliche gemeinsame Version ist lesbar. Ein gültiger Bearbeitungslink schaltet Online-Änderungen frei.

```sh
npm test        # Datenmigration und IndexedDB-Speicherung prüfen
npm run build   # TypeScript prüfen und Produktionsbuild erstellen
npm run preview # fertigen Build lokal öffnen
```

`dist/` enthält die statisch hostbare Anwendung. Relative Asset-Pfade erlauben Hosting in Unterverzeichnissen. GitHub Actions prüft Pull Requests und Änderungen auf `main`. Alternativ mit **Code → Codespaces** öffnen, `npm ci` und `npm run dev -- --host 0.0.0.0` ausführen und Port 5173 öffnen.

## Funktionen

- Überschrift, Einleitung, Buchdaten, Quellen und Anmerkungen bearbeiten
- Bilder und Video per Dateiauswahl oder Drag-and-drop einfügen
- Bildvergleich mit Regler oder nebeneinander
- Vergleiche hinzufügen und nach Bestätigung löschen
- Gemeinsame Online-Speicherung in Cloudflare D1 und R2
- Drucken/PDF und Zurücksetzen mit Bestätigung

Keine historischen Fotos mitgeliefert. Eigene Bilder mit Quellen und Nutzungsrechten ergänzen. Bilder bis 15 MB, Video bis 60 MB; Speicherplatz und Videoformate hängen vom Browser ab.

## Gemeinsam entwickeln

Naina und andere können dieses öffentliche Repository forken und Pull Requests stellen. Direkten Schreibzugriff kann der Eigentümer unter **Settings → Collaborators → Add people** für bekannte GitHub-Accounts einrichten. Siehe [CONTRIBUTING.md](CONTRIBUTING.md).

## Projektstruktur

- `src/routes/index.tsx`: Startseite und Aktionen
- `src/components/comparison/ComparisonCard.tsx`: Vergleich und Metadaten
- `src/components/sections/`: Buchbezug und Medien
- `src/components/MediaUpload.tsx`: Dateiprüfung und Vorschau
- `src/lib/comparison-store.ts`: Datenmodell, Normalisierung und IndexedDB
- `src/styles.css`: Tailwind-Theme und Druckansicht
- `reference/index.original.tsx`: unveränderte ursprünglich gelieferte Datei

Die Startseite wird direkt eingebunden und benötigt keinen Router. Die Routenmetadaten wurden in `index.html` überführt.

## Gemeinsamer Online-Speicher

Die öffentliche Website zeigt dieselbe gemeinsame Version für alle. Ein separater Bearbeitungslink schaltet das Speichern frei. Dieser Link enthält einen zufälligen Schlüssel im URL-Fragment, gehört nicht ins Repository und sollte nur an Mitwirkende weitergegeben werden. Bilder, Videos und Texte der gemeinsamen Version sind öffentlich sichtbar.

- Automatisches Speichern und Abgleichen etwa alle zwei Sekunden
- Unterschiedliche Felder werden zusammengeführt; Änderungen desselben Feldes erzeugen einen sichtbaren Konflikt mit Auswahlmöglichkeit
- Versionsverlauf mit Wiederherstellung der letzten 50 gespeicherten Stände
- Cloudflare D1 speichert Texte und Dokumentversionen, R2 die Medien
- Ohne Bearbeitungsschlüssel verweigert die API Schreibzugriffe
- Offline-Fehler erscheinen sichtbar; ungespeicherte Eingaben bleiben im offenen Tab. Vor Schließen wird bei ausstehenden Änderungen gewarnt.
- Frühere Browserdaten lassen sich im Bearbeitungsmodus mit **Bisherige lokale Vorlage übernehmen** ausdrücklich in die gemeinsame Version hochladen. Andere Geräte und die ursprüngliche Lovable-Domain haben eigene lokale Speicher.

### Backend entwickeln und veröffentlichen

Die Client-API-Adresse steht in `src/lib/online.ts`, der Server in `worker/index.mjs`. Das Frontend bleibt auf GitHub Pages. Datenbank und R2-Bucket werden über `wrangler.jsonc` angebunden.

```sh
npx wrangler@4 login
npx wrangler@4 d1 migrations apply stasi-zentrale-gemeinsam --remote
npx wrangler@4 deploy
```

Backend-Deployments erfolgen bewusst über einen autorisierten Cloudflare-Account; der GitHub-Pages-Workflow veröffentlicht nur das Frontend. `EDIT_TOKEN_HASH` ist als Worker-Secret hinterlegt und enthält ausschließlich den SHA-256-Hash des Bearbeitungsschlüssels. Vor absichtlicher Schlüsselrotation einen neuen zufälligen Schlüssel erzeugen und dessen Hash mit `wrangler secret put EDIT_TOKEN_HASH` setzen; danach den neuen Bearbeitungslink verteilen. Niemals den Schlüssel in GitHub-Quellcode oder Workflowdateien eintragen. 

Entfernte Medien werden aus der Ansicht entfernt; gespeicherte Medien bleiben für frühere Versionen im Bucket verfügbar. Unterstützte Dateien: JPG, PNG, WebP, GIF, AVIF sowie MP4, WebM, MOV und OGG. Bilder maximal 15 MB, Videos maximal 60 MB.

Dieses Repository ist unabhängig vom ursprünglichen Lovable-Projekt und hat keine automatische Lovable-Synchronisierung.
