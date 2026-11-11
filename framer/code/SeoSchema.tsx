import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * vlori – strukturierte Daten (JSON-LD)
 * Unsichtbare Komponente: einmal auf die Startseite legen.
 * Liefert Organization, WebSite und FAQPage an Google & Co.
 * (FAQ-Rich-Results, Logo und Markenname im Suchergebnis).
 */

interface Faq {
    question: string
    answer: string
}

const DEFAULT_FAQ: Faq[] = [
    {
        question: "Was kostet vlori?",
        answer: "Alle Kernfunktionen – Profil, Projekte veröffentlichen, Match Score, Nachrichten, Community – sind kostenlos. Es gibt keine Vermittlungsprovision. Optionale Zusatzpakete folgen später; die kostenlose Nutzung bleibt uneingeschränkt.",
    },
    {
        question: "Gehört vlori zur SAP SE?",
        answer: "Nein. vlori ist eine unabhängige Plattform und wird nicht von der SAP SE betrieben, gesponsert oder offiziell unterstützt. SAP-Produktnamen dienen nur der Beschreibung fachlicher Spezialisierungen.",
    },
]

interface Props {
    siteUrl: string
    name: string
    description: string
    logo: string
    appUrl: string
    sameAs: string[]
    faq: Faq[]
}

export function buildSchema(p: Required<Omit<Props, never>>) {
    const site = p.siteUrl.replace(new RegExp("/$"), "")
    const graph: Record<string, unknown>[] = [
        {
            "@type": "Organization",
            "@id": site + "/#org",
            name: p.name,
            url: site + "/",
            ...(p.logo ? { logo: p.logo } : {}),
            ...(p.sameAs.length ? { sameAs: p.sameAs } : {}),
        },
        {
            "@type": "WebSite",
            "@id": site + "/#website",
            name: p.name,
            url: site + "/",
            description: p.description,
            inLanguage: "de-DE",
            publisher: { "@id": site + "/#org" },
            potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: p.appUrl.replace(new RegExp("/$"), "") + "/projekte?q={search_term_string}" },
                "query-input": "required name=search_term_string",
            },
        },
    ]
    const faq = p.faq.filter((f) => f && f.question && f.answer)
    if (faq.length)
        graph.push({
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
        })
    return { "@context": "https://schema.org", "@graph": graph }
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 */
export default function SeoSchema(props: Partial<Props>) {
    const {
        siteUrl = "https://green-suggestions-755845.framer.app",
        name = "vlori",
        description = "Der SAP-Marktplatz für Freelancer und Unternehmen – mit Match Score, ohne Provision.",
        logo = "",
        appUrl = "https://app.vlori.de",
        sameAs = [],
        faq = DEFAULT_FAQ,
    } = props
    // "<" escapen, damit Texte das Script-Tag nicht beenden können
    const json = JSON.stringify(buildSchema({ siteUrl, name, description, logo, appUrl, sameAs, faq })).replace(/</g, "\\u003c")
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

addPropertyControls(SeoSchema, {
    siteUrl: { type: ControlType.String, defaultValue: "https://green-suggestions-755845.framer.app", title: "Website-URL" },
    name: { type: ControlType.String, defaultValue: "vlori", title: "Name" },
    description: {
        type: ControlType.String,
        defaultValue: "Der SAP-Marktplatz für Freelancer und Unternehmen – mit Match Score, ohne Provision.",
        title: "Beschreibung",
        displayTextArea: true,
    },
    logo: { type: ControlType.String, defaultValue: "", title: "Logo-URL" },
    appUrl: { type: ControlType.String, defaultValue: "https://app.vlori.de", title: "App-URL" },
    sameAs: { type: ControlType.Array, title: "Profile (LinkedIn …)", control: { type: ControlType.String }, defaultValue: [] },
    faq: {
        type: ControlType.Array,
        title: "FAQ",
        defaultValue: DEFAULT_FAQ,
        control: {
            type: ControlType.Object,
            controls: {
                question: { type: ControlType.String, title: "Frage" },
                answer: { type: ControlType.String, title: "Antwort", displayTextArea: true },
            },
        },
    },
})
