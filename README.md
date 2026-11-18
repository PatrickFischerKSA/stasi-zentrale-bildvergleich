# Stasi-Zentrale: 1989 und heute

Lauffähige React-/TypeScript-Anwendung für Bildvergleiche, Buchbezug und einen Medienabschnitt mit einem Video und zwei Bildern. Fehlende Komponenten wurden für dieses eigenständige Projekt neu implementiert.

## Im Browser ausprobieren

https://patrickfischerksa.github.io/stasi-zentrale-bildvergleich/

GitHub Pages veröffentlicht nach erfolgreichen Tests und Build jede Änderung auf `main` automatisch. Eingaben und Medien bleiben im Browser der jeweiligen Person.

## Lokal starten

Voraussetzung: Node.js 22.12+ (empfohlen 24) und npm.

```sh
git clone https://github.com/PatrickFischerKSA/stasi-zentrale-bildvergleich.git
cd stasi-zentrale-bildvergleich
npm ci
npm run dev
```

Die von Vite angezeigte Adresse öffnen. Keine API-Schlüssel, Konten oder Datenbankserver nötig.

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
- Automatische lokale Speicherung in IndexedDB, auch für Medien
- Drucken/PDF und Zurücksetzen mit Bestätigung

Keine historischen Fotos mitgeliefert. Eigene Bilder mit Quellen und Nutzungsrechten ergänzen. Bilder bis 15 MB, Video bis 100 MB; Speicherplatz und Videoformate hängen vom Browser ab.

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

## Speicherung

Texte und Medien bleiben in diesem Browser auf diesem Gerät. Löschen von Browserdaten entfernt sie. GitHub versioniert den Code, nicht die Eingaben der Besucher. Gemeinsame Inhaltsbearbeitung und geräteübergreifende Synchronisierung benötigen ein Backend und sind nicht enthalten. Inhalte der ursprünglichen Lovable-Domain werden nicht automatisch übernommen.

Dieses Repository ist unabhängig vom [ursprünglichen Lovable-Projekt](https://lovable.dev/projects/ddffdfb8-2842-58f2-bd72-39af9c168784) und hat keine automatische Lovable-Synchronisierung.
