# vlori – Homepage (Framer)

Marketing-Startseite für **vlori**, das deutschsprachige Netzwerk für SAP-Projekte und SAP-Expertinnen & Experten.

- **Live-Projekt in Framer:** https://framer.com/projects/NhgOpMCKuQm252avuOjd
- **Funktionen:** aus dem Floot-Export `pages/_index.tsx` übernommen (siehe [`docs/funktionen.md`](docs/funktionen.md))
- **Design:** neu, angelehnt an die Designsprache von sap.com – Navy-Hero mit animiertem Verlauf, SAP-Blau `#0070F2`, Utility-Leiste, Kachel-Raster, viel Weißraum

## Aufbau

| Pfad | Inhalt |
|------|--------|
| `framer/code/HeroSearch.tsx` | Code-Komponente: Suche mit Umschalter Projekte/Berater, Modul-Auswahl, „Gefragt“-Chips → leitet in die App weiter |
| `framer/code/CountUp.tsx` | Code-Komponente: animierte Kennzahlen, optional live aus der App (`Live-URL` + `JSON-Pfad`) |
| `framer/code/MatchRing.tsx` | Code-Komponente: Match-Score-Ring, zeichnet sich beim Scrollen |
| `design/tokens.json` | Farben, Typografie, Abstände, Radien, Animationen |
| `docs/funktionen.md` | Mapping Original-Funktion → Framer-Umsetzung |

## Framer-Struktur

- **Layout-Template „Main Layout“**: Utility-Leiste, Sticky-Navigation, Footer (Desktop / Tablet / Phone)
- **Komponenten**: `Logo` (hell/dunkel), `Button` (Primary, Outline, White, Ghost Dark – jeweils mit Hover), `Navigation` (Desktop, Phone, Phone Open), `Footer`, `Match Preview` (Sicht Beraterin / Sicht Unternehmen), `FAQ Item` (Open / Closed)
- **CMS**: Collection „Projekte“ speist die Projektbörse (Titel, Unternehmen, Module, Ort, Remote, Tagessatz, Start, Badge, Link)
- **Sektionen**: Hero → Modul-Ticker → Projektbörse → Erklärbares Matching → Karriere-Etappen → Fachgebiete → Zielgruppen → Expertennetzwerk → Community & Events → Vertrauen & FAQ → Pakete → CTA

## App-Anbindung

Alle Links und die Suche zeigen auf `https://app.vlori.de` (die Floot-App). Bei anderer Domain:

1. In Framer `Strg/Cmd + F` → `app.vlori.de` ersetzen
2. In der Hero-Suche das Property **App-URL** anpassen
3. Für Live-Zahlen bei den vier Kennzahlen die **Live-URL** des `home`-Endpunkts eintragen

## Rechtlicher Hinweis

vlori ist eine unabhängige Plattform und wird nicht von der SAP SE betrieben, gesponsert oder offiziell unterstützt. SAP-Produktnamen dienen nur der Beschreibung fachlicher Spezialisierungen. Es wurden keine SAP-Logos oder -Grafiken verwendet.
