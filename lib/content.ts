export type Mode = "berater" | "unternehmen"

export const MODULES: [string, string][] = [
    ["S/4HANA", "S/4HANA Transformation"],
    ["FI", "Finanzwesen"],
    ["CO", "Controlling"],
    ["MM", "Materialwirtschaft"],
    ["SD", "Vertrieb"],
    ["PP", "Produktionsplanung"],
    ["EWM", "Extended Warehouse Mgmt."],
    ["WM", "Lagerverwaltung"],
    ["QM", "Qualitätsmanagement"],
    ["PM", "Instandhaltung"],
    ["PS", "Projektsystem"],
    ["TM", "Transportmanagement"],
    ["HCM", "Personalwirtschaft"],
    ["SuccessFactors", "HR Cloud"],
    ["Ariba", "Einkauf"],
    ["BTP", "Business Technology Platform"],
    ["Fiori", "UI5"],
    ["ABAP", "Entwicklung"],
    ["Basis", "Betrieb"],
    ["Security", "GRC"],
    ["BW", "BW/4HANA"],
    ["SAC", "Analytics Cloud"],
    ["Integration", "Integration Suite / CPI"],
]

export const HERO = {
    berater: {
        badge: "128 offene SAP-Projekte · ohne Provision",
        title: ["Ein Satz.", "Passende SAP-Projekte."],
        lead: "Beschreiben Sie sich wie einem Kollegen – vlori erkennt Module, Erfahrung, Tagessatz und Remote-Wunsch und zeigt sofort, welche Projekte passen und warum. Ohne Provision.",
        topMatch: { title: "Senior SAP FI/CO, S/4HANA Brownfield", meta: "Mannheim · 70 % remote", score: 96 },
    },
    unternehmen: {
        badge: "1.240 verifizierte SAP-Expert/innen · 0 % Aufschlag",
        title: ["Ein Satz.", "Die richtige SAP-Expertin."],
        lead: "Beschreiben Sie Ihr Projekt wie im Kickoff – vlori erkennt Module, Budget und Remote-Anteil und zeigt verifizierte Expert/innen mit nachvollziehbarem Match Score. Ohne Vermittler-Aufschlag.",
        topMatch: { title: "Katrin M., S/4HANA Finance-Architektin", meta: "14 Jahre · 60 % remote", score: 94 },
    },
} as const

export const PLAYGROUND = {
    berater: "Drehen Sie an den Reglern. Das Ranking erklärt sich selbst.",
    unternehmen: "Drehen Sie an den Reglern. Ihr Kandidaten-Ranking folgt.",
}

export const RADAR = {
    berater: "Median-Tagessätze, Spannen, Remote-Quote und Nachfrage je Modul – damit Sie wissen, wo Sie stehen, bevor Sie verhandeln.",
    unternehmen: "Median-Tagessätze, Spannen und Remote-Quote je Modul – damit Ihr Budget zum Markt passt, bevor Sie ausschreiben.",
}

export const CALC = {
    berater: {
        kicker: "Provisions-Rechner",
        title: "Was Ihnen ohne Vermittler bleibt.",
        lead: "Vermittler behalten oft 15 – 30 % Ihres Tagessatzes. Rechnen Sie nach, was das im Jahr ausmacht.",
    },
    unternehmen: {
        kicker: "Kosten-Rechner",
        title: "Was Sie ohne Aufschlag sparen.",
        lead: "Personaldienstleister schlagen häufig 15 – 30 % auf den Tagessatz auf. So viel bleibt bei Ihnen, wenn Sie direkt beauftragen.",
    },
}

export const PROJECTS = [
    { tags: "FI · CO · S/4HANA", badge: "Neu", title: "S/4HANA Brownfield Conversion – Finance Lead", org: "Chemie & Pharma, Konzern", city: "Mannheim", remote: "70 % remote", rate: "1.150 €/Tag", start: "ab 01.12.2026", module: "S/4HANA" },
    { tags: "EWM · MM · TM", badge: "Gefragt", title: "SAP EWM Consultant für Lagerneubau", org: "Logistikdienstleister", city: "Hamburg", remote: "50 % remote", rate: "1.050 €/Tag", start: "ab 15.01.2027", module: "EWM" },
    { tags: "ABAP · BTP · Fiori", badge: "Remote", title: "ABAP Cloud / RAP Entwickler:in", org: "Beratungshaus", city: "Remote (DACH)", remote: "100 % remote", rate: "950 €/Tag", start: "sofort", module: "ABAP" },
    { tags: "SuccessFactors · HCM", badge: "Neu", title: "SuccessFactors Employee Central Rollout", org: "Maschinenbau, Mittelstand", city: "Stuttgart", remote: "60 % remote", rate: "1.000 €/Tag", start: "ab 01.02.2027", module: "SuccessFactors" },
]

export const EXPERTS = [
    { initials: "LW", rating: "4,9", name: "Lena W.", role: "SAP FI/CO Senior", tags: "FI · CO · S/4HANA", meta: "12 Jahre Erfahrung · Köln" },
    { initials: "TH", rating: "5,0", name: "Tobias H.", role: "S/4HANA Finance Architekt", tags: "FI · S/4HANA · BTP", meta: "15 Jahre Erfahrung · München" },
    { initials: "AK", rating: "4,8", name: "Aylin K.", role: "SAP EWM Lead Consultant", tags: "EWM · MM · TM", meta: "10 Jahre Erfahrung · Hamburg" },
    { initials: "JR", rating: "4,9", name: "Jonas R.", role: "ABAP Cloud Entwickler", tags: "ABAP · BTP · Fiori", meta: "8 Jahre Erfahrung · Remote" },
]

export const POSTS = [
    { kind: "Frage · S/4HANA", title: "Brownfield vs. Selective Data Transition – eure Erfahrungen bei Finance?", meta: "Lena W., vor 2 Std. · ★ 24" },
    { kind: "Erfahrungsbericht · EWM", title: "Embedded EWM im Lagerneubau: Was wir beim Go-Live gelernt haben", meta: "Aylin K., gestern · ★ 41" },
    { kind: "Tipp · ABAP", title: "RAP & ABAP Cloud: Clean-Core-Checkliste für Erweiterungen", meta: "Jonas R., vor 3 Tagen · ★ 57" },
]

export const EVENTS = [
    { day: "12", month: "Nov", title: "Webinar: S/4HANA Public Cloud – Fit-to-Standard in der Praxis", meta: "Webinar · online" },
    { day: "19", month: "Nov", title: "SAP-Logistik-Stammtisch Köln", meta: "Stammtisch · Köln" },
    { day: "03", month: "Dez", title: "BTP Integration Suite: Migration von PI/PO", meta: "Webinar · online" },
]

export const TRUST = [
    { title: "Verifizierte Profile", text: "Identität und Zertifikate werden geprüft und sichtbar gekennzeichnet." },
    { title: "Geprüfte Unternehmen", text: "Unternehmensverifizierung über Handelsregisterdaten." },
    { title: "DSGVO-orientiert", text: "Datensparsamkeit, Hosting-Konzept in der EU und klare Einwilligungen." },
    { title: "Klare Regeln", text: "Community-Regeln, Meldefunktion und Moderation gegen Spam." },
]

export const FAQ = [
    {
        question: "Was kostet vlori?",
        answer: "Alle Kernfunktionen – Profil, Projekte veröffentlichen, Match Score, Nachrichten, Community – sind kostenlos. Es gibt keine Vermittlungsprovision. Optionale Zusatzpakete folgen später; die kostenlose Nutzung bleibt uneingeschränkt.",
    },
    {
        question: "Wie wird der Match Score berechnet?",
        answer: "Der Score setzt sich aus fünf Kriterien zusammen: SAP-Module (45 %), Tagessatz (20 %), Remote-Anteil (15 %), Branche (10 %) und Verfügbarkeit (10 %). Zu jedem Treffer sehen Sie, welche Kriterien passen und wo es Abweichungen gibt.",
    },
    {
        question: "Für wen ist vlori gedacht?",
        answer: "Für freiberufliche SAP-Beraterinnen, -Berater und -Entwickler im DACH-Raum sowie für Unternehmen und Beratungshäuser, die SAP-Projekte direkt und ohne Vermittler-Aufschlag besetzen möchten.",
    },
    {
        question: "Wie werden Profile und Unternehmen verifiziert?",
        answer: "Bei Expertinnen und Experten werden Identität und Zertifikate geprüft und im Profil gekennzeichnet. Unternehmen werden anhand von Handelsregisterdaten verifiziert.",
    },
    {
        question: "Gehört vlori zur SAP SE?",
        answer: "Nein. vlori ist eine unabhängige Plattform und wird nicht von der SAP SE betrieben, gesponsert oder offiziell unterstützt. SAP-Produktnamen dienen nur der Beschreibung fachlicher Spezialisierungen.",
    },
]

export const PACKAGES = [
    {
        name: "Basis",
        badge: "Aktiv",
        price: "0 €",
        note: "dauerhaft kostenlos",
        items: ["Expertenprofil oder Unternehmensprofil", "Unbegrenzt Projekte veröffentlichen", "SAP Match Score & Match-Analyse", "Interessenbekundungen & Nachrichten", "Suchaufträge, Merkliste, Netzwerk", "Community, Fachgruppen, Events"],
        cta: "Kostenlos registrieren",
        href: "/registrieren",
        featured: true,
    },
    {
        name: "Premium-Profil",
        badge: "Bald verfügbar",
        price: "Demnächst",
        note: "für Beraterinnen & Berater",
        items: ["Hervorgehobene Platzierung im Talentpool", "Profilaufrufe & Suchstatistiken", "Verifizierungs-Expressprüfung", "Erweiterte Lebenslauf-Exporte"],
        cta: "Interesse melden",
        href: "/info/kontakt",
        featured: false,
    },
    {
        name: "Recruiting",
        badge: "Bald verfügbar",
        price: "Demnächst",
        note: "für Unternehmen & Personalberatungen",
        items: ["Hervorgehobene Top-Projekte", "Talentpool-Export & Teamzugänge", "Automatische Kandidatenansprache", "Unternehmensseite mit Employer Branding"],
        cta: "Interesse melden",
        href: "/info/kontakt",
        featured: false,
    },
]

export const NAV: [string, string][] = [
    ["Projektsuche", "/projekte"],
    ["Beratersuche", "/berater"],
    ["Community", "/community"],
    ["Netzwerk", "/netzwerk"],
    ["Wissen & Events", "/wissen"],
    ["Pakete", "/preise"],
]

export const FOOTER: [string, [string, string][]][] = [
    ["Plattform", [["Projektsuche", "/projekte"], ["Beratersuche", "/berater"], ["Projekt veröffentlichen", "/projekte/neu"], ["Pakete & Premium", "/preise"]]],
    ["Community", [["Beiträge & Fragen", "/community"], ["Expertennetzwerk", "/netzwerk"], ["Wissen, News & Events", "/wissen"], ["Community-Regeln", "/info/regeln"]]],
    ["Rechtliches", [["Impressum", "/info/impressum"], ["Datenschutz", "/info/datenschutz"], ["AGB", "/info/agb"], ["Kontakt", "/info/kontakt"]]],
]
