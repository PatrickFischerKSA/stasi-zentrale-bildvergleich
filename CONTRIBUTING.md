# Gemeinsam weiterentwickeln

1. Repository forken oder nach angenommener Einladung klonen.
2. Mit Node.js 22.12+ (empfohlen 24) `npm ci` ausführen.
3. Branch anlegen: `git switch -c feature/meine-aenderung`.
4. Mit `npm run dev` entwickeln; auch schmale Fenster prüfen.
5. `npm test` und `npm run build` ausführen. Upload und Speicherung bei Änderungen auch nach einem Neuladen und in einer zweiten Ansicht prüfen. Testdaten anschließend wieder entfernen. Änderungen am Backend zusätzlich mit `npx wrangler deploy` veröffentlichen; GitHub Pages aktualisiert nur das Frontend.
6. Committen, Branch pushen und Pull Request gegen `main` öffnen. Verhalten und Prüfergebnisse beschreiben.

Keine Zugangsdaten oder privaten Medien einchecken. Quellen und Nutzungsrechte dokumentieren. GitHub Actions prüft Build und Speichertests automatisch.

Für direkte Mitarbeit lädt Patrick bekannte GitHub-Accounts unter Settings → Collaborators → Add people ein. Einladungen müssen angenommen werden. Ohne Einladung sind Forks und Pull Requests möglich.
