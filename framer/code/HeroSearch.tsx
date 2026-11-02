import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * vlori – Hero-Suche
 * Funktion aus pages/_index.tsx übernommen:
 *  - Umschalter „Projekte“ / „Berater/innen“
 *  - Freitext + SAP-Modul-Auswahl
 *  - „Gefragt“-Chips springen direkt in die gefilterte Suche
 *  - Ziel-URL: {appUrl}/{projekte|berater}?q=…&module=…
 */

const MODULES: [string, string][] = [
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
    ["SuccessFactors", "SuccessFactors"],
    ["Ariba", "Ariba Einkauf"],
    ["BTP", "Business Technology Platform"],
    ["Fiori", "Fiori / UI5"],
    ["ABAP", "ABAP-Entwicklung"],
    ["Basis", "Basis / Betrieb"],
    ["Security", "Security & GRC"],
    ["BW", "BW / BW/4HANA"],
    ["SAC", "Analytics Cloud"],
    ["Integration", "Integration Suite / CPI"],
]

const POPULAR = ["S/4HANA", "FI", "CO", "EWM", "BTP", "ABAP"]

type Mode = "projekte" | "berater"

interface Props {
    appUrl: string
    accent: string
    ink: string
    font: React.CSSProperties
    openInNewTab: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 620
 */
export default function HeroSearch(props: Props) {
    const { appUrl, accent, ink, openInNewTab, style } = props
    const [mode, setMode] = React.useState<Mode>("projekte")
    const [q, setQ] = React.useState("")
    const [module, setModule] = React.useState("")
    const [focus, setFocus] = React.useState(false)

    const go = (m?: string) => {
        const params = new URLSearchParams()
        if (q.trim()) params.set("q", q.trim())
        const mod = m ?? module
        if (mod) params.set("module", mod)
        const base = (appUrl || "").replace(new RegExp("/$"), "")
        const qs = params.toString()
        const url = base + "/" + mode + (qs ? "?" + qs : "")
        if (typeof window === "undefined") return
        if (openInNewTab) window.open(url, "_blank", "noopener")
        else window.location.href = url
    }

    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const muted = "rgba(29,45,62,0.62)"

    const tab = (value: Mode, label: string) => {
        const active = mode === value
        return (
            <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(value)}
                style={{
                    flex: "0 0 auto",
                    border: 0,
                    cursor: "pointer",
                    padding: "8px 14px",
                    borderRadius: 999,
                    font: "600 14px/1 " + family,
                    color: active ? "#fff" : ink,
                    background: active ? ink : "transparent",
                    transition: "background .25s ease, color .25s ease",
                }}
            >
                {label}
            </button>
        )
    }

    return (
        <form
            role="search"
            aria-label="SAP-Suche"
            onSubmit={(e) => {
                e.preventDefault()
                go()
            }}
            style={{
                ...style,
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 16,
                borderRadius: 20,
                background: "#fff",
                boxShadow:
                    "0 1px 2px rgba(0,20,74,.12), 0 12px 32px rgba(0,20,74,.18), 0 40px 80px rgba(0,20,74,.18)",
                fontFamily: family,
            }}
        >
            <div
                role="tablist"
                aria-label="Wonach suchen Sie?"
                style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    gap: 4,
                    padding: 4,
                    borderRadius: 999,
                    background: "#EEF2F7",
                }}
            >
                {tab("projekte", "Projekte")}
                {tab("berater", "Berater/innen")}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <label
                    style={{
                        flex: "1 1 220px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        height: 52,
                        padding: "0 16px",
                        borderRadius: 12,
                        border: "1.5px solid " + (focus ? accent : "#D9DEE4"),
                        boxShadow: focus ? "0 0 0 4px " + accent + "22" : "none",
                        transition: "border-color .2s, box-shadow .2s",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" stroke={muted} strokeWidth="2" />
                        <path d="m20 20-3.5-3.5" stroke={muted} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        aria-label="Suchbegriff"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        placeholder={
                            mode === "projekte"
                                ? "z. B. S/4HANA Conversion, EWM, RAP …"
                                : "z. B. FI/CO Senior, ABAP Cloud …"
                        }
                        style={{
                            flex: 1,
                            minWidth: 0,
                            border: 0,
                            outline: "none",
                            background: "transparent",
                            font: "400 16px/1.2 " + family,
                            color: ink,
                        }}
                    />
                </label>
                <select
                    aria-label="SAP-Modul"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    style={{
                        flex: "0 1 180px",
                        height: 52,
                        padding: "0 14px",
                        borderRadius: 12,
                        border: "1.5px solid #D9DEE4",
                        background: "#fff",
                        font: "500 15px/1 " + family,
                        color: ink,
                        cursor: "pointer",
                    }}
                >
                    <option value="">Alle Module</option>
                    {MODULES.map(([code, name]) => (
                        <option key={code} value={code}>
                            {code === name ? code : code + " – " + name}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    style={{
                        flex: "0 0 auto",
                        height: 52,
                        padding: "0 22px",
                        border: 0,
                        borderRadius: 12,
                        cursor: "pointer",
                        background: accent,
                        color: "#fff",
                        font: "600 15px/1 " + family,
                        transition: "transform .15s ease, filter .2s",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.97)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {mode === "projekte" ? "Projekte finden" : "Experten finden"}
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ font: "500 13px/1 " + family, color: muted, marginRight: 4 }}>Gefragt:</span>
                {POPULAR.map((code) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => go(code)}
                        style={{
                            border: "1px solid #D9DEE4",
                            background: "#F5F7FA",
                            borderRadius: 999,
                            padding: "6px 11px",
                            cursor: "pointer",
                            font: "500 13px/1 'Geist Mono', ui-monospace, monospace",
                            color: ink,
                        }}
                    >
                        {code}
                    </button>
                ))}
            </div>
        </form>
    )
}

HeroSearch.defaultProps = {
    appUrl: "https://app.vlori.de",
    accent: "#0070F2",
    ink: "#1D2D3E",
    openInNewTab: false,
}

addPropertyControls(HeroSearch, {
    appUrl: { type: ControlType.String, title: "App-URL" },
    accent: { type: ControlType.Color, title: "Akzent" },
    ink: { type: ControlType.Color, title: "Text" },
    openInNewTab: { type: ControlType.Boolean, title: "Neuer Tab" },
})
