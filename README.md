# Stasi-Zentrale: 1989 und heute

Gemeinsame Weiterentwicklung mit Naina und externen Mitwirkenden.

## Aktueller Stand

`index.tsx` (vorgesehener Zielpfad im vollständigen Projekt: `src/routes/index.tsx`) ist die unveränderte, bereitgestellte Originaldatei. Sie enthält die Startseite mit Buchbezug, Medienabschnitt und Damals-Heute-Vergleichen.

**Dies ist noch keine eigenständig lauffähige Anwendung.** Die einzelne TSX-Datei ist kein vollständiger Lovable-Export. Build und Tests sind deshalb derzeit nicht möglich.

## Fehlende Bestandteile

- `src/components/ui/button.tsx`
- `src/components/comparison/ComparisonCard.tsx`
- `src/components/sections/BookSection.tsx`
- `src/components/sections/MediaSection.tsx`
- `src/lib/comparison-store.ts`
- Router-Einrichtung, App-Einstieg, CSS/Theme und Bilddateien
- `package.json`, Lockfile, TypeScript- und Build-Konfiguration

Verwendete Bibliotheken: React, TypeScript, TanStack React Router, lucide-react und sonner. Die Klassen setzen außerdem passende Utility-CSS- und Theme-Konfiguration voraus.

## Mitmachen

Dieses öffentliche Repository kann von Naina und anderen geforkt werden. Änderungen auf einem eigenen Branch vornehmen und anschließend einen Pull Request an dieses Repository öffnen. Dafür ist keine Einladung notwendig.

Für direkte Änderungen im gemeinsamen Repository lädt Patrick die gewünschten GitHub-Accounts unter **Settings → Collaborators → Add people** ein. Einladungen müssen angenommen werden. Der Name „Naina“ allein identifiziert keinen GitHub-Account.

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für den Ablauf.

## Nächster Schritt

Den vollständigen Quellcode aus dem ursprünglichen Lovable-Projekt exportieren und die fehlenden Dateien ergänzen. Dabei die vorhandene Startseite mit dem Export abgleichen. Erst danach die im vollständigen Projekt definierten Installations-, Build- und Testbefehle ausführen.

Ursprüngliches Lovable-Projekt: https://lovable.dev/projects/ddffdfb8-2842-58f2-bd72-39af9c168784

Dieses neue Repository ist unabhängig vom ursprünglichen Repository und besitzt keine automatische Lovable-Synchronisierung.

## Speicherung

Die Startseite sieht lokale Speicherung im Browser vor. Ein GitHub-Repository synchronisiert keine von Besuchern im Browser hochgeladenen Bilder, Videos oder Texte.
