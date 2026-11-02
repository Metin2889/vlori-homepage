# Funktionen der Homepage

Quelle: `vlori-projekt/pages/_index.tsx` (Floot-Export vom 18.10.2026). Übernommen wurden die **Funktionen**, nicht das Design. Das neue Design orientiert sich an der Designsprache von sap.com (dunkles Navy-Hero mit Verlauf, SAP-Blau `#0070F2`, Utility-Leiste, Kachel-Raster, viel Weißraum) und ist in Framer gebaut.

| # | Sektion | Funktion im Original | Umsetzung in Framer |
|---|---------|----------------------|---------------------|
| 0 | Utility-Leiste + Navigation | Hauptnavigation (Projektsuche, Beratersuche, Community, Netzwerk, Wissen & Events), Anmelden, Registrieren, mobiles Menü | Layout-Template „Main Layout“ mit Utility-Leiste (SAP-Stil), Sticky-Navigation als Komponente mit Varianten *Desktop / Phone / Phone Open* (Drawer) |
| 1 | Hero | Live-Zahl offener Projekte, H1, Lead, Suchkarte mit Umschalter Projekte/Berater, Freitext, Modul-Auswahl, „Gefragt“-Chips, CTA-Links | Code-Komponente `HeroSearch.tsx` (gleiche Logik, leitet auf `{App-URL}/projekte?q=…&module=…` bzw. `/berater` weiter). Hintergrund: animierter Shader in SAP-Blau, Blüten-Logo mit Loop-Animation, schwebende Match-Karten |
| 2 | Kennzahlen | CountUp-Animation für offene Projekte, Berater, Unternehmen, Module | Code-Komponente `CountUp.tsx`, optional live aus der App (`Live-URL` + `JSON-Pfad`, z. B. `stats.openProjects`) |
| 3 | Modul-Ticker | – (neu) | Endlos-Ticker mit allen 23 SAP-Modulen aus `sapCatalog.tsx` |
| 4 | Projektbörse | Neueste 4 Projekte (`projects/search_POST`, Sortierung Relevanz) | CMS-Collection „Projekte“ + Collection List; Karten verlinken in die App |
| 5 | Erklärbares Matching | 3 Schritte + Vorschau mit Tabs „Sicht Beraterin / Sicht Unternehmen“, Kriterienliste, Projektwahrscheinlichkeit, Kandidaten-Ranking | Komponente „Match Preview“ mit zwei Varianten (Tab-Wechsel per Klick), `MatchRing.tsx` animiert den Score |
| 6 | Karriere-Etappen | Saat → Wachstum → Knospe → Blüte mit BloomFlower in 4 Öffnungsgraden | 4 Etappen-Kacheln mit SVG-Blüten (aus `BloomFlower.tsx` berechnet), gestaffelte Einblendung |
| 7 | Fachgebiete | Module nach Gruppen (Plattform, Finanzen, Logistik, HR, Cloud, Technologie, Analytics), Link auf gefilterte Projektsuche, Projektanzahl | Gruppen-Kacheln, jedes Modul verlinkt auf `/projekte?module=CODE` |
| 8 | Zielgruppen | Vorteile für Berater/innen und Unternehmen + CTAs | Zwei Karten (hell / Navy) |
| 9 | Expertennetzwerk | Top-Expert/innen (`home_GET.experts`) | Experten-Karten mit Verifiziert-Abzeichen, Bewertung, Modulen |
| 10 | Community & Events | Neueste Beiträge + kommende Webinare/Stammtische | Zwei Listen mit Hover-Zuständen |
| 11 | Vertrauen & FAQ | 4 Vertrauenspunkte + Accordion mit 5 Fragen | Trust-Kacheln + FAQ-Komponente (Offen/Geschlossen) |
| 12 | Pakete | Seite `preise.tsx`: Basis 0 €, Premium-Profil, Recruiting | Kompakte Paket-Sektion auf der Startseite |
| 13 | Abschluss-CTA | Registrieren als Berater/in oder Unternehmen | Navy-Band mit großer Blüte |
| 14 | Footer | Plattform / Community / Rechtliches + Hinweis „nicht von der SAP SE betrieben“ | Footer-Komponente (Desktop/Phone) |

## Was bewusst in der App bleibt

Login, Registrierung, Dashboard, Match-Center, Nachrichten und alle Datenbank-Endpunkte laufen weiter in der Floot-App. Die Framer-Seite ist die Marketing-Startseite und verlinkt dorthin. Die App-Adresse ist überall als `https://app.vlori.de` hinterlegt – bei abweichender Domain einmal in Framer per Suchen & Ersetzen ändern (und im Property „App-URL“ der Hero-Suche).

## Animationen

- Hero: Text-Effekt (Wort für Wort mit Blur), Shader-Hintergrund, rotierende Blüte (Loop), schwebende Karten (Loop, versetzt)
- Sektionen: Appear-on-scroll (Fade + 24 px nach oben, gestaffelt)
- Karten und Buttons: Hover (Anheben, Schatten/Farbe), Tap (leichtes Eindrücken)
- Zahlen und Match-Ring: zählen bzw. zeichnen sich beim Hineinscrollen
- Modul-Ticker: Endlosband, verlangsamt bei Hover
- FAQ und Mobile-Menü: federnde Höhenanimation
