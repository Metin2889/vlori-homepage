import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, animate } from "framer-motion"

/**
 * vlori – Provisions-Rechner
 * Macht das Kernversprechen „0 % Provision“ greifbar:
 * Berater/innen sehen, was ihnen bei einem Vermittler pro Jahr entgeht,
 * Unternehmen sehen, was sie an Aufschlag pro Projekt sparen.
 */

type Mode = "berater" | "unternehmen"

export function calc(rate: number, days: number, percent: number) {
    const gross = Math.round(rate * days)
    const agency = Math.round(gross * (1 - percent / 100))
    return { gross, agency, diff: gross - agency }
}

function fmt(n: number) {
    return Math.round(n).toLocaleString("de-DE")
}

function Num({ value }: { value: number }) {
    const [v, setV] = React.useState(value)
    const prev = React.useRef(value)
    React.useEffect(() => {
        const c = animate(prev.current, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1], onUpdate: setV })
        prev.current = value
        return () => c.stop()
    }, [value])
    return <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(v) + " €"}</span>
}

interface Props {
    mode: Mode
    appUrl: string
    accent: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1120
 */
export default function EarningsCalculator(props: Partial<Props>) {
    const { mode = "berater", appUrl = "https://app.vlori.de", accent = "#0070F2", style } = props
    const ber = mode === "berater"
    const [rate, setRate] = React.useState(1100)
    const [days, setDays] = React.useState(ber ? 200 : 120)
    const [percent, setPercent] = React.useState(ber ? 20 : 25)
    const [w, setW] = React.useState(1120)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setDays(ber ? 200 : 120)
        setPercent(ber ? 20 : 25)
    }, [ber])

    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([e]) => e.contentRect.width > 0 && setW(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Unternehmen: Vermittler schlagen auf den Satz der Expert/innen auf
    const r = ber ? calc(rate, days, percent) : { gross: Math.round(rate * days * (1 + percent / 100)), agency: 0, diff: 0 }
    const vlori = ber ? r.gross : Math.round(rate * days)
    const other = ber ? r.agency : r.gross
    const diff = Math.abs(vlori - other)
    const narrow = w < 820
    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const display = "'Inter Display', 'Inter', system-ui, sans-serif"
    const mono = "'Geist Mono', ui-monospace, monospace"
    const ink = "#1D2D3E"
    const muted = "#556B82"
    const base = (appUrl || "").replace(new RegExp("/$"), "")
    const max = Math.max(vlori, other) || 1

    const slider = (label: string, value: string, v: number, min: number, max: number, step: number, set: (n: number) => void) => {
        const pct = ((v - min) / (max - min)) * 100
        return (
            <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ display: "flex", justifyContent: "space-between", font: "600 13px/1 " + family, color: ink }}>
                    <span>{label}</span>
                    <span style={{ font: "500 13px/1 " + mono, color: accent }}>{value}</span>
                </span>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={v}
                    onChange={(e) => set(Number(e.target.value))}
                    style={{
                        width: "100%",
                        height: 6,
                        appearance: "none",
                        WebkitAppearance: "none",
                        borderRadius: 99,
                        cursor: "pointer",
                        accentColor: accent,
                        background: "linear-gradient(90deg, " + accent + " " + pct + "%, #DCE3EB " + pct + "%)",
                    }}
                />
            </label>
        )
    }

    const bar = (label: string, value: number, strong: boolean) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span style={{ font: "500 13px/1.2 " + family, color: strong ? "#fff" : "rgba(255,255,255,.65)" }}>{label}</span>
                <span style={{ whiteSpace: "nowrap", font: "600 " + (strong ? 22 : 18) + "px/1 " + display, color: strong ? "#fff" : "rgba(255,255,255,.75)" }}>
                    <Num value={value} />
                </span>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                <motion.div
                    animate={{ width: (value / max) * 100 + "%" }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    style={{ height: "100%", borderRadius: 99, background: strong ? "linear-gradient(90deg, " + accent + ", #8CCBFF)" : "rgba(255,255,255,.35)" }}
                />
            </div>
        </div>
    )

    return (
        <div
            ref={ref}
            style={{
                ...style,
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: narrow ? "column" : "row",
                gap: narrow ? 16 : 24,
                fontFamily: family,
                color: ink,
            }}
        >
            <div style={{ flex: narrow ? "0 0 auto" : "0 0 380px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 26, padding: 24, borderRadius: 24, background: "#fff", border: "1px solid #E1E6EC" }}>
                {slider(ber ? "Ihr Tagessatz" : "Tagessatz der Expert/in", fmt(rate) + " €", rate, 600, 1800, 10, setRate)}
                {slider(ber ? "Projekttage pro Jahr" : "Projekttage", days + " Tage", days, 20, 230, 5, setDays)}
                {slider(ber ? "Übliche Vermittler-Marge" : "Üblicher Vermittler-Aufschlag", percent + " %", percent, 5, 35, 1, setPercent)}
                <div style={{ font: "400 12px/1.5 " + family, color: muted }}>
                    {ber
                        ? "Vermittler behalten typischerweise 15–30 % des Kundensatzes ein. Bei vlori sprechen Sie direkt mit dem Unternehmen."
                        : "Vermittler schlagen typischerweise 20–35 % auf den Satz der Expert/innen auf. Bei vlori schreiben Sie die Menschen direkt an."}
                </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22, padding: narrow ? 20 : 28, borderRadius: 24, background: "radial-gradient(120% 90% at 85% 0%, #0A3A8C 0%, #00144A 55%, #000C30 100%)", color: "#fff" }}>
                <div>
                    <div style={{ font: "500 11.5px/1 " + mono, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8CCBFF" }}>
                        {ber ? "Ihr Plus pro Jahr mit vlori" : "Ihre Ersparnis pro Projekt"}
                    </div>
                    <div aria-live="polite" style={{ font: "600 " + (narrow ? 48 : 68) + "px/1 " + display, letterSpacing: "-0.04em", marginTop: 14 }}>
                        <span style={{ color: "#6BE38F" }}>+</span>
                        <Num value={diff} />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {bar(ber ? "Umsatz über vlori (0 % Provision)" : "Kosten über vlori (0 % Aufschlag)", vlori, true)}
                    {bar(ber ? "Umsatz über Vermittler" : "Kosten über Vermittler", other, false)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: "auto" }}>
                    <span style={{ font: "400 12px/1.4 " + family, color: "rgba(255,255,255,.5)" }}>Beispielrechnung · netto · ohne Gewähr</span>
                    <a
                        href={base + "/registrieren?typ=" + (ber ? "berater" : "unternehmen")}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px", borderRadius: 12, background: accent, color: "#fff", textDecoration: "none", font: "600 14px/1 " + family }}
                    >
                        {ber ? "Kostenloses Profil anlegen" : "Projekt kostenlos veröffentlichen"}
                    </a>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(EarningsCalculator, {
    mode: {
        type: ControlType.Enum,
        defaultValue: "berater",
        title: "Sicht",
        options: ["berater", "unternehmen"],
        optionTitles: ["Berater/in", "Unternehmen"],
    },
    appUrl: { type: ControlType.String, defaultValue: "https://app.vlori.de", title: "App-URL" },
    accent: { type: ControlType.Color, defaultValue: "#0070F2", title: "Akzent" },
})
