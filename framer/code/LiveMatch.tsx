import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

/**
 * vlori – Live-Match
 * Ein Satz rein, Matches raus: Der Text wird im Browser zerlegt
 * (Module, Erfahrung, Tagessatz, Remote, Ort, Branche, Seniorität, Start),
 * gegen Beispieldaten bewertet und als erklärbares Ranking angezeigt.
 * Optional liefert "endpoint" echte Daten (gleiches Format wie ITEMS).
 */

type Mode = "berater" | "unternehmen"

interface Item {
    title: string
    sub: string
    modules: string[]
    rate: number
    remote: number
    city: string
    industry: string
    years: number
    lead?: boolean
}

interface Parsed {
    modules: string[]
    years?: number
    rate?: number
    remote?: number
    city?: string
    industry?: string
    level?: string
    start?: string
}

const MODS: [string, string[]][] = [
    ["S/4HANA", ["s/4hana", "s4hana", "s/4", "s4", "s4/hana", "s/4 hana", "conversion", "brownfield", "greenfield"]],
    ["FI", ["fi", "fico", "fi/co", "finanzwesen", "finance", "buchhaltung", "rechnungswesen"]],
    ["CO", ["co", "fico", "fi/co", "controlling"]],
    ["MM", ["mm", "mm/sd", "einkauf", "materialwirtschaft", "beschaffung"]],
    ["SD", ["sd", "mm/sd", "vertrieb", "order to cash", "o2c"]],
    ["PP", ["pp", "pp/qm", "produktionsplanung", "fertigung"]],
    ["EWM", ["ewm", "warehouse", "lagerverwaltung", "lager"]],
    ["TM", ["tm", "transportmanagement"]],
    ["QM", ["qm", "pp/qm", "qualitätsmanagement"]],
    ["PM", ["instandhaltung", "eam"]],
    ["HCM", ["hcm", "hr", "payroll", "personalwirtschaft"]],
    ["SuccessFactors", ["successfactors", "sf", "employee central"]],
    ["Ariba", ["ariba"]],
    ["BTP", ["btp", "cap", "business technology platform", "cloud foundry"]],
    ["Fiori", ["fiori", "ui5", "sapui5"]],
    ["ABAP", ["abap", "rap", "abap cloud"]],
    ["Basis", ["basis", "hana db"]],
    ["Security", ["security", "grc", "berechtigungen"]],
    ["BW", ["bw", "bw/4", "bw4hana", "bw/4hana", "datasphere"]],
    ["SAC", ["sac", "analytics cloud"]],
    ["Integration", ["cpi", "integration suite", "pi/po"]],
]

const NOT_MODULES = ["co-lead", "co-founder", "co-pilot", "co-working", "co-worker"]

const CITIES = [
    "münchen", "berlin", "hamburg", "frankfurt", "stuttgart", "köln", "düsseldorf", "wien", "zürich",
    "leipzig", "hannover", "nürnberg", "walldorf", "mannheim", "dresden", "basel", "bremen", "essen",
]

const INDUSTRIES: [string, string[]][] = [
    ["Automotive", ["automotive", "automobil", "autozulieferer", "zulieferer", "oem"]],
    ["Handel", ["handel", "retail", "e-commerce"]],
    ["Pharma", ["pharma", "life science", "life sciences"]],
    ["Chemie", ["chemie", "chemical"]],
    ["Banken", ["bank", "banken", "finanzdienstleister"]],
    ["Versicherung", ["versicherung", "versicherer", "insurance"]],
    ["Maschinenbau", ["maschinenbau", "industrie", "manufacturing"]],
    ["Energie", ["energie", "energieversorger", "utilities", "stadtwerke"]],
    ["Logistik", ["logistik", "logistics"]],
    ["Öffentlicher Sektor", ["öffentlich", "öffentlicher", "behörde", "verwaltung", "public"]],
    ["Medizintechnik", ["medizintechnik", "medtech"]],
]

const MONTHS = [
    "januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember",
]

const PROJECTS: Item[] = [
    { title: "S/4HANA Conversion – Finance Stream", sub: "Automobilzulieferer", modules: ["S/4HANA", "FI", "CO"], rate: 1150, remote: 60, city: "Stuttgart", industry: "Automotive", years: 8 },
    { title: "EWM-Rollout an 3 Standorten", sub: "Handelskonzern", modules: ["EWM", "MM", "SD"], rate: 1050, remote: 40, city: "Hamburg", industry: "Handel", years: 6 },
    { title: "BTP Side-by-Side Extensions (CAP)", sub: "Energieversorger", modules: ["BTP", "ABAP", "Fiori"], rate: 1000, remote: 100, city: "Köln", industry: "Energie", years: 5 },
    { title: "SuccessFactors Employee Central", sub: "Versicherung", modules: ["SuccessFactors", "HCM"], rate: 980, remote: 80, city: "München", industry: "Versicherung", years: 5 },
    { title: "FI/CO Group Reporting", sub: "Pharmaunternehmen", modules: ["FI", "CO", "SAC"], rate: 1200, remote: 50, city: "Basel", industry: "Pharma", years: 10 },
    { title: "ABAP Cloud & RAP Entwicklung", sub: "Maschinenbauer", modules: ["ABAP", "Fiori", "S/4HANA"], rate: 950, remote: 100, city: "Nürnberg", industry: "Maschinenbau", years: 4 },
    { title: "MM/SD Template-Rollout DACH", sub: "Chemiekonzern", modules: ["MM", "SD", "S/4HANA"], rate: 1080, remote: 50, city: "Frankfurt", industry: "Chemie", years: 8 },
    { title: "BW/4HANA nach Datasphere", sub: "Privatbank", modules: ["BW", "SAC"], rate: 1100, remote: 70, city: "Frankfurt", industry: "Banken", years: 7 },
    { title: "PI/PO nach Integration Suite", sub: "Logistikdienstleister", modules: ["Integration", "BTP"], rate: 1050, remote: 90, city: "Düsseldorf", industry: "Logistik", years: 6 },
    { title: "Security & GRC Rollenkonzept", sub: "Bundesbehörde", modules: ["Security", "Basis"], rate: 900, remote: 60, city: "Berlin", industry: "Öffentlicher Sektor", years: 6 },
    { title: "PP/QM Prozessberatung", sub: "Medizintechnik", modules: ["PP", "QM", "S/4HANA"], rate: 1000, remote: 30, city: "Nürnberg", industry: "Medizintechnik", years: 7 },
    { title: "S/4HANA Finance-Architektur", sub: "Industriekonzern", modules: ["S/4HANA", "FI", "CO", "BTP"], rate: 1350, remote: 40, city: "München", industry: "Maschinenbau", years: 12, lead: true },
]

const EXPERTS: Item[] = [
    { title: "Katrin M. – S/4HANA Finance-Architektin", sub: "14 Jahre · verifiziert", modules: ["S/4HANA", "FI", "CO"], rate: 1250, remote: 60, city: "München", industry: "Automotive", years: 14, lead: true },
    { title: "Deniz A. – EWM Lead", sub: "11 Jahre · verifiziert", modules: ["EWM", "MM"], rate: 1100, remote: 50, city: "Hamburg", industry: "Handel", years: 11, lead: true },
    { title: "Jonas W. – ABAP Cloud & RAP", sub: "8 Jahre · verifiziert", modules: ["ABAP", "BTP", "Fiori"], rate: 950, remote: 100, city: "Leipzig", industry: "Maschinenbau", years: 8 },
    { title: "Svenja K. – SuccessFactors EC", sub: "9 Jahre · verifiziert", modules: ["SuccessFactors", "HCM"], rate: 1000, remote: 80, city: "Köln", industry: "Versicherung", years: 9 },
    { title: "Marco R. – FI/CO Group Reporting", sub: "16 Jahre · verifiziert", modules: ["FI", "CO", "SAC"], rate: 1150, remote: 40, city: "Zürich", industry: "Pharma", years: 16, lead: true },
    { title: "Aylin T. – BTP Integration Suite", sub: "10 Jahre · verifiziert", modules: ["Integration", "BTP"], rate: 1050, remote: 100, city: "Berlin", industry: "Logistik", years: 10 },
    { title: "Thomas B. – MM/SD Rollouts", sub: "18 Jahre · verifiziert", modules: ["MM", "SD", "S/4HANA"], rate: 1080, remote: 50, city: "Frankfurt", industry: "Chemie", years: 18, lead: true },
    { title: "Lea S. – BW/4HANA & Datasphere", sub: "7 Jahre · verifiziert", modules: ["BW", "SAC"], rate: 1000, remote: 70, city: "Stuttgart", industry: "Banken", years: 7 },
    { title: "Paul H. – Security & GRC", sub: "12 Jahre · verifiziert", modules: ["Security", "Basis"], rate: 980, remote: 60, city: "Wien", industry: "Öffentlicher Sektor", years: 12 },
    { title: "Mira F. – PP/QM Prozesse", sub: "9 Jahre · verifiziert", modules: ["PP", "QM", "S/4HANA"], rate: 920, remote: 30, city: "Nürnberg", industry: "Medizintechnik", years: 9 },
    { title: "Felix D. – S/4HANA EWM & TM", sub: "13 Jahre · verifiziert", modules: ["EWM", "TM", "S/4HANA"], rate: 1180, remote: 40, city: "Bremen", industry: "Logistik", years: 13, lead: true },
]

const EXAMPLES: Record<Mode, string[]> = {
    berater: [
        "Senior FI/CO-Beraterin, 12 Jahre S/4HANA, 1.100 €, 80 % remote, München, ab März",
        "ABAP Cloud & BTP Entwickler, 6 Jahre, 950 €, 100 % remote, Maschinenbau",
        "EWM-Berater, 9 Jahre, Hamburg, hybrid, 1.050 €, ab sofort",
    ],
    unternehmen: [
        "Wir suchen eine EWM-Expertin für den Rollout in Hamburg, Budget 1.150 €, 50 % remote, ab sofort",
        "S/4HANA Finance-Architekt, mind. 10 Jahre, München, Automotive, Budget 1.300 €",
        "SuccessFactors EC Beraterin, 80 % remote, Versicherung, ab April",
    ],
}

function isW(ch: string | undefined) {
    if (!ch) return false
    const c = ch.charCodeAt(0)
    return (c >= 48 && c <= 57) || (c >= 97 && c <= 122) || "äöüß".indexOf(ch) >= 0
}

function has(t: string, w: string) {
    let i = t.indexOf(w)
    while (i >= 0) {
        if (!isW(t[i - 1]) && !isW(t[i + w.length])) return true
        i = t.indexOf(w, i + 1)
    }
    return false
}

function isDigit(ch: string | undefined) {
    if (!ch) return false
    const c = ch.charCodeAt(0)
    return c >= 48 && c <= 57
}

function numbers(t: string) {
    const out: { n: number; before: string; after: string }[] = []
    let i = 0
    while (i < t.length) {
        if (isDigit(t[i]) && t[i - 1] !== "/") {
            let j = i
            let s = ""
            while (j < t.length && (isDigit(t[j]) || (t[j] === "." && isDigit(t[j + 1])))) {
                if (t[j] !== ".") s += t[j]
                j++
            }
            if (t[j] === "," && isDigit(t[j + 1])) {
                j++
                while (j < t.length && isDigit(t[j])) j++
            }
            out.push({ n: parseInt(s, 10), before: t.slice(Math.max(0, i - 16), i), after: t.slice(j, j + 16).trim() })
            i = j
        } else i++
    }
    return out
}

export function parse(text: string): Parsed {
    let t = " " + text.toLowerCase() + " "
    for (const w of NOT_MODULES) t = t.split(w).join(" " + w.slice(3))
    const p: Parsed = { modules: [] }
    for (const [code, aliases] of MODS) {
        if (aliases.some((a) => has(t, a))) p.modules.push(code)
    }
    for (const n of numbers(t)) {
        const a = n.after.replace("+", "").trim()
        if (a.indexOf("jahr") === 0 || a.indexOf("j.") === 0 || a.indexOf("yrs") === 0) {
            if (n.n > 0 && n.n < 45) p.years = n.n
        } else if (a.indexOf("%") === 0 || a.indexOf("prozent") === 0) {
            const rest = a.replace("%", "").replace("prozent", "").trim()
            const onsite = rest.indexOf("vor ort") === 0 || rest.indexOf("onsite") === 0 || rest.indexOf("präsenz") === 0
            if (n.n <= 100) p.remote = onsite ? 100 - n.n : n.n
        } else if (
            n.n >= 300 &&
            n.n <= 3000 &&
            (a.indexOf("€") === 0 || a.indexOf("eur") === 0 || n.before.indexOf("satz") >= 0 || n.before.indexOf("budget") >= 0 || n.before.indexOf("€") >= 0)
        ) {
            p.rate = n.n
        }
    }
    if (p.remote === undefined) {
        if (has(t, "full remote") || has(t, "voll remote") || has(t, "nur remote")) p.remote = 100
        else if (has(t, "remote")) p.remote = 80
        else if (has(t, "hybrid")) p.remote = 50
        else if (has(t, "vor ort") || has(t, "onsite")) p.remote = 0
    }
    for (const c of CITIES) {
        if (has(t, c)) {
            p.city = c.charAt(0).toUpperCase() + c.slice(1)
            break
        }
    }
    for (const [name, aliases] of INDUSTRIES) {
        if (aliases.some((a) => has(t, a))) {
            p.industry = name
            break
        }
    }
    if (has(t, "lead") || has(t, "architekt") || has(t, "architektin") || has(t, "principal")) p.level = "Lead / Architektur"
    else if (has(t, "senior")) p.level = "Senior"
    else if (has(t, "junior")) p.level = "Junior"
    if (has(t, "sofort") || has(t, "asap")) p.start = "ab sofort"
    else {
        for (let i = 0; i < MONTHS.length; i++) {
            if (has(t, MONTHS[i])) {
                p.start = "ab " + MONTHS[i].charAt(0).toUpperCase() + MONTHS[i].slice(1)
                break
            }
        }
        for (let q = 1; q <= 4; q++) if (has(t, "q" + q)) p.start = "ab Q" + q
    }
    return p
}

function isItem(x: any): x is Item {
    return (
        !!x &&
        typeof x.title === "string" &&
        Array.isArray(x.modules) &&
        x.modules.length > 0 &&
        typeof x.rate === "number" &&
        typeof x.remote === "number" &&
        typeof x.years === "number"
    )
}

function fmt(n: number) {
    return n.toLocaleString("de-DE")
}

interface Scored {
    item: Item
    score: number
    good: string[]
    bad: string[]
}

export function score(p: Parsed, item: Item, mode: Mode): Scored {
    const good: string[] = []
    const bad: string[] = []
    let total = 0
    let weight = 0
    const add = (w: number, v: number) => {
        total += w * Math.max(0, Math.min(1, v))
        weight += w
    }

    if (p.modules.length) {
        const hit = item.modules.filter((m) => p.modules.indexOf(m) >= 0)
        const miss = item.modules.filter((m) => p.modules.indexOf(m) < 0)
        add(50, (hit.length / item.modules.length) * 0.65 + (hit.length / p.modules.length) * 0.35)
        if (hit.length) good.push(hit.join(", "))
        if (miss.length) bad.push(miss.join(", ") + (mode === "berater" ? " gefragt" : " zusätzlich"))
    } else add(50, 0.45)

    if (p.rate) {
        const diff = mode === "berater" ? item.rate - p.rate : p.rate - item.rate
        add(15, diff >= 0 ? 1 : 1 + diff / 350)
        if (diff >= 0) good.push(fmt(item.rate) + " €/Tag" + (mode === "berater" ? " geboten" : " im Budget"))
        else bad.push(fmt(Math.abs(diff)) + " € " + (mode === "berater" ? "unter Wunsch" : "über Budget"))
    } else add(15, 0.7)

    if (p.remote !== undefined) {
        const diff = mode === "berater" ? item.remote - p.remote : p.remote - item.remote
        add(15, diff >= 0 ? 1 : 1 + diff / 80)
        if (diff >= 0) good.push(item.remote + " % remote")
        else bad.push("nur " + item.remote + " % remote")
    } else add(15, 0.7)

    if (p.city) {
        const same = (item.city || "").toLowerCase() === p.city.toLowerCase()
        add(8, same ? 1 : item.remote >= 80 ? 0.85 : 0.35)
        if (same) good.push(item.city)
        else if (item.remote < 80 && item.city) bad.push(item.city + " statt " + p.city)
    } else add(8, 0.7)

    if (p.industry) {
        const same = item.industry === p.industry
        add(7, same ? 1 : 0.45)
        if (same) good.push("Branche " + item.industry)
    } else add(7, 0.65)

    if (p.years || p.level) {
        let v = 0.7
        if (mode === "berater") {
            const yrs = p.years || (p.level === "Senior" ? 8 : p.level === "Junior" ? 2 : 12)
            v = yrs >= item.years ? 1 : 1 - (item.years - yrs) / 10
            if (yrs >= item.years) good.push("Erfahrung passt")
            else bad.push("ab " + item.years + " Jahren gesucht")
            if (item.lead && p.level === "Lead / Architektur") v = 1
        } else {
            const need = p.years || (p.level === "Lead / Architektur" ? 12 : p.level === "Senior" ? 8 : 3)
            v = item.years >= need ? 1 : 1 - (need - item.years) / 10
            if (item.years >= need) good.push(item.years + " Jahre Erfahrung")
            else bad.push("erst " + item.years + " Jahre")
        }
        add(5, v)
    } else add(5, 0.7)

    const s = weight ? total / weight : 0
    return { item, score: Math.round(38 + 61 * s), good, bad }
}

function Ring({ value, size = 46, color, track, text }: { value: number; size?: number; color: string; track: string; text: string }) {
    const r = (size - 6) / 2
    const c = 2 * Math.PI * r
    return (
        <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={5} />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: c * (1 - value / 100) }}
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "600 14px/1 'Inter Display', 'Inter', system-ui, sans-serif",
                    color: text,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {value}
            </div>
        </div>
    )
}

interface Props {
    mode: Mode
    appUrl: string
    endpoint: string
    accent: string
    autoType: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 600
 */
export default function LiveMatch(props: Partial<Props>) {
    const {
        mode = "berater",
        appUrl = "https://app.vlori.de",
        endpoint = "",
        accent = "#0070F2",
        autoType = true,
        style,
    } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [text, setText] = React.useState(isCanvas ? EXAMPLES[mode][0] : "")
    const [touched, setTouched] = React.useState(false)
    const [remote, setRemote] = React.useState<Item[] | null>(null)
    const [focus, setFocus] = React.useState(false)
    const typing = React.useRef(0)
    const delay = React.useRef(0)
    const rootRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!endpoint || isCanvas) return
        let off = false
        fetch(endpoint)
            .then((r) => r.json())
            .then((d) => {
                const arr = Array.isArray(d) ? d : d && Array.isArray(d.items) ? d.items : []
                const valid = arr.filter(isItem)
                if (!off && valid.length) setRemote(valid)
            })
            .catch(() => {})
        return () => {
            off = true
        }
    }, [endpoint])

    const typeExample = React.useCallback(
        (sample: string) => {
            window.clearInterval(typing.current)
            let i = 0
            setText("")
            typing.current = window.setInterval(() => {
                i += 1
                setText(sample.slice(0, i))
                if (i >= sample.length) window.clearInterval(typing.current)
            }, 26)
        },
        []
    )

    React.useEffect(() => {
        if (isCanvas || !autoType) return
        const el = rootRef.current
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduce) {
            setText(EXAMPLES[mode][0])
            return
        }
        let started = false
        const start = () => {
            if (started) return
            started = true
            delay.current = window.setTimeout(() => {
                if (!touchedRef.current) typeExample(EXAMPLES[mode][0])
            }, 700)
        }
        if (!el || typeof IntersectionObserver === "undefined") {
            start()
            return
        }
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    io.disconnect()
                    start()
                }
            },
            { threshold: 0.4 }
        )
        io.observe(el)
        return () => {
            io.disconnect()
            window.clearTimeout(delay.current)
            window.clearInterval(typing.current)
        }
    }, [mode, autoType])

    React.useEffect(
        () => () => {
            window.clearTimeout(delay.current)
            window.clearInterval(typing.current)
        },
        []
    )

    const touchedRef = React.useRef(false)
    touchedRef.current = touched

    const parsed = React.useMemo(() => parse(text), [text])
    const data = remote || (mode === "berater" ? PROJECTS : EXPERTS)
    const hasInput = text.trim().length > 2
    const results = React.useMemo(() => {
        if (!hasInput) return []
        return data
            .map((it) => score(parsed, it, mode))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
    }, [parsed, data, mode, hasInput])

    const chips: { k: string; label: string; strong?: boolean }[] = []
    parsed.modules.forEach((m) => chips.push({ k: "m" + m, label: m, strong: true }))
    if (parsed.level) chips.push({ k: "lvl", label: parsed.level })
    if (parsed.years) chips.push({ k: "yrs", label: parsed.years + " Jahre" })
    if (parsed.rate) chips.push({ k: "rate", label: fmt(parsed.rate) + " €/Tag" })
    if (parsed.remote !== undefined) chips.push({ k: "rem", label: parsed.remote + " % remote" })
    if (parsed.city) chips.push({ k: "city", label: parsed.city })
    if (parsed.industry) chips.push({ k: "ind", label: parsed.industry })
    if (parsed.start) chips.push({ k: "start", label: parsed.start })

    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const mono = "'Geist Mono', ui-monospace, monospace"
    const ink = "#1D2D3E"
    const muted = "#556B82"
    const base = (appUrl || "").replace(new RegExp("/$"), "")
    const ctaUrl =
        base + "/registrieren?typ=" + (mode === "berater" ? "berater" : "unternehmen") + (hasInput ? "&q=" + encodeURIComponent(text.trim()) : "")

    return (
        <div
            ref={rootRef}
            style={{
                ...style,
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 18,
                borderRadius: 22,
                background: "#fff",
                boxShadow: "0 1px 2px rgba(0,20,74,.12), 0 16px 40px rgba(0,20,74,.22), 0 48px 96px rgba(0,20,74,.22)",
                fontFamily: family,
                color: ink,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, font: "500 12px/1 " + mono, letterSpacing: "0.06em", textTransform: "uppercase", color: accent }}>
                    <motion.span
                        animate={{ opacity: [1, 0.35, 1], scale: [1, 0.85, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        style={{ width: 8, height: 8, borderRadius: 99, background: "#30B05A", display: "inline-block" }}
                    />
                    Live-Match
                </div>
                <div style={{ font: "500 12px/1 " + family, color: muted }}>
                    {mode === "berater" ? "Beschreiben Sie sich in einem Satz" : "Beschreiben Sie Ihr Projekt in einem Satz"}
                </div>
            </div>

            <div
                style={{
                    borderRadius: 14,
                    border: "1.5px solid " + (focus ? accent : "#D9DEE4"),
                    boxShadow: focus ? "0 0 0 4px color-mix(in srgb, " + accent + " 14%, transparent)" : "none",
                    transition: "border-color .2s, box-shadow .2s",
                    padding: "12px 14px",
                }}
            >
                <textarea
                    aria-label={mode === "berater" ? "Ihr Profil in einem Satz" : "Ihr Projekt in einem Satz"}
                    value={text}
                    rows={2}
                    onFocus={() => {
                        setFocus(true)
                        if (!touched) {
                            window.clearInterval(typing.current)
                            setTouched(true)
                        }
                    }}
                    onBlur={() => setFocus(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && hasInput) {
                            e.preventDefault()
                            window.location.href = ctaUrl
                        }
                    }}
                    onChange={(e) => {
                        setTouched(true)
                        setText(e.target.value)
                    }}
                    placeholder={EXAMPLES[mode][0]}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "none",
                        border: 0,
                        outline: "none",
                        background: "transparent",
                        font: "500 18px/1.45 " + family,
                        letterSpacing: "-0.01em",
                        color: ink,
                    }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 26 }}>
                    <AnimatePresence initial={false}>
                        {chips.length === 0 && (
                            <motion.span
                                key="hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ font: "500 12px/26px " + family, color: muted }}
                            >
                                Erkannt wird: Module, Jahre, Tagessatz, Remote, Ort, Branche, Start
                            </motion.span>
                        )}
                        {chips.map((c) => (
                            <motion.span
                                key={c.k}
                                layout
                                initial={{ opacity: 0, scale: 0.6, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    height: 26,
                                    padding: "0 10px",
                                    borderRadius: 99,
                                    font: "500 12px/1 " + (c.strong ? mono : family),
                                    color: c.strong ? "#fff" : accent,
                                    background: c.strong ? accent : "#EAF3FF",
                                }}
                            >
                                {c.label}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ font: "500 12px/1 " + family, color: muted, marginRight: 2 }}>Beispiele:</span>
                {EXAMPLES[mode].map((ex, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => {
                            setTouched(true)
                            typeExample(ex)
                        }}
                        style={{
                            border: "1px solid #E1E6EC",
                            background: "#F5F7FA",
                            borderRadius: 99,
                            padding: "6px 10px",
                            cursor: "pointer",
                            font: "500 12px/1 " + family,
                            color: ink,
                            maxWidth: 190,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {ex.split(",")[0]}
                    </button>
                ))}
            </div>

            <div aria-live="polite" aria-atomic="false" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                {results.length > 0 ? (mode === "berater" ? "Bester Treffer: " : "Beste Person: ") + results[0].item.title + ", Score " + results[0].score : ""}
            </div>

            <AnimatePresence initial={false}>
                {results.length > 0 && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 2 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, font: "500 12px/1 " + mono, letterSpacing: "0.06em", textTransform: "uppercase", color: muted, padding: "2px 2px 4px" }}>
                                <span>{mode === "berater" ? "Passende Projekte" : "Passende Expert/innen"}</span>
                                <span>Score · Gründe</span>
                            </div>
                            {results.map((r, idx) => (
                                <motion.div
                                    key={r.item.title}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: idx * 0.05 }}
                                    style={{
                                        display: "flex",
                                        gap: 12,
                                        alignItems: "center",
                                        padding: 12,
                                        borderRadius: 14,
                                        background: idx === 0 ? "#F2F7FF" : "#F7F8FA",
                                        border: "1px solid " + (idx === 0 ? "#CFE3FF" : "#EDF0F3"),
                                    }}
                                >
                                    <Ring value={r.score} color={r.score >= 85 ? accent : r.score >= 70 ? "#5AA2FF" : "#9DB0C4"} track="#E3ECF8" text={ink} />
                                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                                        <div style={{ font: "600 14.5px/1.25 " + family, color: ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.item.title}</div>
                                        <div style={{ font: "400 12.5px/1.3 " + family, color: muted }}>
                                            {[r.item.sub, r.item.city, fmt(r.item.rate) + " €"].filter(Boolean).join(" · ")}
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 10px", font: "500 12px/1.4 " + family }}>
                                            {r.good.slice(0, 3).map((g) => (
                                                <span key={"g" + g} style={{ color: "#188918" }}>{"✓ " + g}</span>
                                            ))}
                                            {r.bad.slice(0, 2).map((b) => (
                                                <span key={"b" + b} style={{ color: "#8A97A6" }}>{"– " + b}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <span style={{ font: "400 12px/1.4 " + family, color: muted }}>Läuft im Browser · Beispieldaten · nichts wird gespeichert</span>
                <a
                    href={ctaUrl}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        height: 44,
                        padding: "0 18px",
                        borderRadius: 12,
                        background: accent,
                        color: "#fff",
                        textDecoration: "none",
                        font: "600 14px/1 " + family,
                    }}
                >
                    {mode === "berater" ? "Alle Treffer ansehen" : "Kandidat/innen ansehen"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </div>
    )
}


addPropertyControls(LiveMatch, {
    mode: {
        type: ControlType.Enum,
        defaultValue: "berater",
        title: "Sicht",
        options: ["berater", "unternehmen"],
        optionTitles: ["Berater/in", "Unternehmen"],
    },
    appUrl: { type: ControlType.String, defaultValue: "https://app.vlori.de", title: "App-URL" },
    endpoint: { type: ControlType.String, defaultValue: "", title: "Live-Daten", placeholder: "https://…/items.json" },
    accent: { type: ControlType.Color, defaultValue: "#0070F2", title: "Akzent" },
    autoType: { type: ControlType.Boolean, defaultValue: true, title: "Auto-Tippen" },
})
