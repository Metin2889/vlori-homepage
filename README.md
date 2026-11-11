# vlori – Homepage (Framer + Next.js/Vercel)

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
| `framer/code/EarningsCalculator.tsx` | **neu** Provisions-Rechner: Tagessatz, Projekttage, Vermittler-Marge → Mehrverdienst (Berater/in) bzw. Ersparnis (Unternehmen) mit 0 % Provision |
| `framer/code/JobAlert.tsx` | **neu** Projekt-Alarm: Module wählen, E-Mail + Einwilligung → POST an `POST-Endpunkt` oder Weiterleitung in die Registrierung (`suchauftrag=1&module=…`) |
| `framer/code/SeoSchema.tsx` | **neu** Unsichtbar: JSON-LD (Organization, WebSite mit Suchfeld, FAQPage) für Rich Results bei Google |
| `preview/`, `tests/` | Lokale Vorschau (Vite, Framer-Shim) und Tests (Vitest) |
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

## Neue Komponenten in Framer einbauen

1. **Provisions-Rechner** – als eigene Sektion nach dem Tagessatz-Radar, auf `/unternehmen` Property **Sicht** = Unternehmen.
2. **Projekt-Alarm** – vor dem CTA bzw. neben der Projektbörse. Ohne **POST-Endpunkt** wird in die Registrierung weitergeleitet; mit Endpunkt kommt `{ email, modules, remote, consent, source }` als JSON (Double-Opt-in muss der Endpunkt übernehmen).
3. **SEO-Schema** – einmal irgendwo auf `/` ablegen (1 × 1 px). **Website-URL** auf die finale Domain setzen und die FAQ-Antworten im Property **FAQ** ergänzen (vorbelegt sind nur die Antworten, die auf der Seite bereits stehen).

## Website auf Vercel (Next.js)

Neben den Framer-Komponenten enthält das Repo eine eigenständige Next.js-Website (`app/`, `components/`, `lib/`), die dieselben Komponenten aus `framer/code` verwendet und auf Vercel läuft:

| Route | Inhalt |
|---|---|
| `/` | Startseite für SAP-Berater/innen |
| `/unternehmen` | Startseite für Unternehmen |
| `/api/projekt-alarm` | `POST` – speichert einen Projekt-Alarm (Double-Opt-in) |
| `/api/projekt-alarm/bestaetigen`, `/abmelden` | Bestätigungs- und Abmeldelink aus der E-Mail |
| `/api/live-match?typ=projekte\|berater` | Live-Daten für den Live-Match |
| `/api/raten` | Tagessatz-Statistiken für den Tagessatz-Radar |
| `/api/kennzahlen` | Zähler für die Kennzahlen im Hero |
| `/sitemap.xml`, `/robots.txt` | SEO |

Ohne Datenbank zeigt die Seite Beispieldaten, und der Projekt-Alarm leitet zur Registrierung in der App weiter.

### Einrichtung (einmalig)

1. **Vercel:** https://vercel.com/new → GitHub-Repo `vlori-homepage` importieren. Framework „Next.js“ wird automatisch erkannt.
2. **Umgebungsvariablen** in Vercel → Settings → Environment Variables (siehe `.env.example`):
   - `NEXT_PUBLIC_APP_URL` – Adresse der Floot-App (solange `app.vlori.de` nicht existiert: die `*.floot.app`-Adresse)
   - `NEXT_PUBLIC_SITE_URL` – endgültige Adresse der Website, z. B. `https://vlori.de`
3. **Optional, Supabase** (Projekt-Alarm & Live-Daten): kostenloses Projekt in Region *Frankfurt (eu-central-1)* anlegen, `supabase/schema.sql` im SQL Editor ausführen, dann `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` (Settings → API) in Vercel eintragen.
4. **Optional, Bestätigungs-E-Mails:** bei Resend eine Domain verifizieren, dann `RESEND_API_KEY` und `ALERT_FROM_EMAIL` setzen. Ohne Resend wird der Alarm unbestätigt gespeichert.
5. **Domain:** Vercel → Settings → Domains → `vlori.de` und `www.vlori.de` hinzufügen und die angezeigten DNS-Einträge beim Domain-Anbieter setzen.

Hinweis: Der kostenlose Vercel-Hobby-Plan ist laut Vercel nur für nicht-kommerzielle Nutzung gedacht; für den Livebetrieb ist Vercel Pro vorgesehen.

## Entwicklung

```bash
npm install
npm run dev        # Next.js-Website: http://localhost:3000 (/unternehmen)
npm run preview    # Vorschau aller Framer-Komponenten: http://localhost:5173 (?sicht=unternehmen)
npm run typecheck
npm test
npm run build
```

Website, Vorschau und Tests ersetzen das Paket `framer` durch `preview/framer-shim.ts`; in Framer selbst werden die Dateien unverändert als Code-Komponenten eingefügt. Schriften (Inter, Geist Mono) werden selbst gehostet, es gibt keine Anfragen an Google Fonts.

## Rechtlicher Hinweis

vlori ist eine unabhängige Plattform und wird nicht von der SAP SE betrieben, gesponsert oder offiziell unterstützt. SAP-Produktnamen dienen nur der Beschreibung fachlicher Spezialisierungen. Es wurden keine SAP-Logos oder -Grafiken verwendet.
