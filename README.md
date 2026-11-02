# vlori – Homepage (Framer)

Marketing-Startseite für **vlori**, das deutschsprachige Netzwerk für SAP-Projekte und SAP-Expertinnen & Experten.

- **Live-Seite:** https://green-suggestions-755845.framer.app (Berater/innen) · https://green-suggestions-755845.framer.app/unternehmen (Unternehmen)
- **Live-Projekt in Framer:** https://framer.com/projects/NhgOpMCKuQm252avuOjd
- **Funktionen:** aus dem Floot-Export `pages/_index.tsx` übernommen (siehe [`docs/funktionen.md`](docs/funktionen.md))
- **Design:** neu, angelehnt an die Designsprache von sap.com – Navy-Hero mit animiertem Verlauf, SAP-Blau `#0070F2`, Utility-Leiste, Kachel-Raster, viel Weißraum

## Aufbau

| Pfad | Inhalt |
|------|--------|
| `framer/code/HeroSearch.tsx` | Code-Komponente: Suche mit Umschalter Projekte/Berater, Modul-Auswahl, „Gefragt“-Chips → leitet in die App weiter |
| `framer/code/CountUp.tsx` | Code-Komponente: animierte Kennzahlen, optional live aus der App (`Live-URL` + `JSON-Pfad`) |
| `framer/code/MatchRing.tsx` | Code-Komponente: Match-Score-Ring, zeichnet sich beim Scrollen |
| `framer/code/LiveMatch.tsx` | **v2** Hero: ein Satz rein → erkannte Kriterien als Chips → Top-3 mit Score und Gründen (Sicht Berater/in oder Unternehmen) |
| `framer/code/MatchPlayground.tsx` | **v2** Matching-Spielwiese: Module, Tagessatz, Remote, Branche, Verfügbarkeit → Ranking sortiert sich live um |
| `framer/code/ScrollBloom.tsx` | **v2** Die vlori-Blüte öffnet sich beim Scrollen, vier Etappen werden nacheinander aktiv |
| `framer/code/RateRadar.tsx` | **v2** Tagessatz-Radar: Median, Spanne, Remote-Quote, Nachfrage je SAP-Modul (Beispieldaten, optional Live-Endpunkt) |
| `framer/code/LiveFeed.tsx` | **v2** Rotierender Aktivitäts-Feed im Hero |
| `design/tokens.json` | Farben, Typografie, Abstände, Radien, Animationen |
| `docs/funktionen.md` | Mapping Original-Funktion → Framer-Umsetzung |

## Framer-Struktur

- **Layout-Template „Main Layout“**: Utility-Leiste, Sticky-Navigation, Footer (Desktop / Tablet / Phone)
- **Komponenten**: `Logo` (hell/dunkel), `Button` (Primary, Outline, White, Ghost Dark – jeweils mit Hover), `Navigation` (Desktop, Phone, Phone Open), `Footer`, `Match Preview` (Sicht Beraterin / Sicht Unternehmen), `FAQ Item` (Open / Closed)
- **CMS**: Collection „Projekte“ speist die Projektbörse (Titel, Unternehmen, Module, Ort, Remote, Tagessatz, Start, Badge, Link)
- **Seiten (v2)**: `/` für Berater/innen, `/unternehmen` für Unternehmen – Umschalter oben im Hero. `/archiv-v1` (Entwurf, nicht veröffentlicht) enthält die erste Version.
- **Sektionen `/`**: Hero mit Live-Match + Live-Feed → Modul-Ticker → Matching-Spielwiese → Scroll-Blüte → Tagessatz-Radar → Projektbörse → Community & Events → Vertrauen & FAQ → Pakete → CTA
- **Sektionen `/unternehmen`**: wie oben, aber Sicht Unternehmen und Expertennetzwerk statt Projektbörse

## App-Anbindung

Alle Links und die Suche zeigen auf `https://app.vlori.de` (die Floot-App). Bei anderer Domain:

1. In Framer `Strg/Cmd + F` → `app.vlori.de` ersetzen
2. In der Hero-Suche das Property **App-URL** anpassen
3. Für Live-Zahlen bei den vier Kennzahlen die **Live-URL** des `home`-Endpunkts eintragen
4. Live-Match und Tagessatz-Radar haben ein Property **Live-Daten**: dort einen JSON-Endpunkt eintragen (gleiches Format wie die Beispieldaten im Code), dann ersetzen echte Daten die Beispieldaten

## Rechtlicher Hinweis

vlori ist eine unabhängige Plattform und wird nicht von der SAP SE betrieben, gesponsert oder offiziell unterstützt. SAP-Produktnamen dienen nur der Beschreibung fachlicher Spezialisierungen. Es wurden keine SAP-Logos oder -Grafiken verwendet.
