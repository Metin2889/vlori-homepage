import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, animate, LayoutGroup } from "framer-motion"

/**
 * vlori – Tagessatz-Radar
 * Markttransparenz pro SAP-Modul: Median-Tagessatz, Spanne (P25–P75),
 * Remote-Quote, Nachfrage der letzten 12 Monate, offene Projekte.
 * Standard: Beispieldaten. "endpoint" kann echte Werte im selben Format liefern.
 */

interface Stat {
    code: string
    name: string
    median: number
    p25: number
    p75: number
    remote: number
    open: number
    demand: number[]
}

const DATA: Stat[] = [
    { code: "S/4HANA", name: "S/4HANA Transformation", median: 1180, p25: 1050, p75: 1320, remote: 58, open: 214, demand: [62, 64, 66, 71, 70, 74, 79, 83, 86, 88, 93, 97] },
    { code: "FI", name: "Finanzwesen", median: 1100, p25: 980, p75: 1220, remote: 62, open: 168, demand: [70, 71, 69, 72, 75, 74, 78, 80, 79, 83, 85, 88] },
    { code: "CO", name: "Controlling", median: 1080, p25: 960, p75: 1200, remote: 60, open: 121, demand: [66, 65, 68, 67, 70, 72, 71, 74, 76, 75, 78, 80] },
    { code: "EWM", name: "Extended Warehouse Mgmt.", median: 1090, p25: 980, p75: 1210, remote: 46, open: 87, demand: [48, 52, 55, 54, 60, 63, 66, 70, 74, 77, 82, 86] },
    { code: "BTP", name: "Business Technology Platform", median: 1060, p25: 940, p75: 1190, remote: 78, open: 132, demand: [40, 44, 49, 53, 58, 61, 66, 71, 75, 81, 86, 92] },
    { code: "ABAP", name: "ABAP / ABAP Cloud", median: 950, p25: 840, p75: 1060, remote: 81, open: 176, demand: [80, 79, 81, 82, 80, 83, 84, 83, 86, 87, 86, 89] },
    { code: "MM", name: "Materialwirtschaft", median: 1000, p25: 900, p75: 1110, remote: 55, open: 109, demand: [72, 70, 71, 73, 72, 74, 73, 75, 74, 76, 77, 78] },
    { code: "SD", name: "Vertrieb", median: 1010, p25: 910, p75: 1120, remote: 54, open: 98, demand: [69, 70, 68, 70, 71, 70, 72, 73, 72, 74, 73, 75] },
    { code: "SuccessFactors", name: "SuccessFactors", median: 1020, p25: 920, p75: 1130, remote: 72, open: 94, demand: [58, 60, 61, 63, 62, 65, 67, 66, 69, 71, 72, 74] },
    { code: "Integration", name: "Integration Suite", median: 1050, p25: 950, p75: 1170, remote: 74, open: 83, demand: [42, 45, 47, 52, 55, 59, 62, 66, 70, 73, 78, 84] },
]

const MIN = 800
const MAX = 1450

function isStat(x: any): x is Stat {
    return (
        !!x &&
        typeof x.code === "string" &&
        typeof x.median === "number" &&
        typeof x.p25 === "number" &&
        typeof x.p75 === "number" &&
        typeof x.remote === "number" &&
        typeof x.open === "number" &&
        Array.isArray(x.demand) &&
        x.demand.length > 1
    )
}

function fmt(n: number) {
    return Math.round(n).toLocaleString("de-DE")
}

function Num({ value, suffix = "", style }: { value: number; suffix?: string; style?: React.CSSProperties }) {
    const [v, setV] = React.useState(value)
    const prev = React.useRef(value)
    React.useEffect(() => {
        const c = animate(prev.current, value, {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (x) => setV(x),
        })
        prev.current = value
        return () => c.stop()
    }, [value])
    return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(v) + suffix}</span>
}

interface Props {
    accent: string
    endpoint: string
    appUrl: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1120
 */
export default function RateRadar(props: Partial<Props>) {
    const {
        accent = "#0070F2",
        endpoint = "",
        appUrl = "https://app.vlori.de",
        style,
    } = props
    const [data, setData] = React.useState<Stat[]>(DATA)
    const [sel, setSel] = React.useState(0)
    const [w, setW] = React.useState(1120)
    const [live, setLive] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([e]) => e.contentRect.width > 0 && setW(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    React.useEffect(() => {
        if (!endpoint || RenderTarget.current() === RenderTarget.canvas) return
        let off = false
        fetch(endpoint)
            .then((r) => r.json())
            .then((d) => {
                const arr = Array.isArray(d) ? d : d && Array.isArray(d.modules) ? d.modules : []
                const valid: Stat[] = arr.filter(isStat).map((x: Stat) => ({ ...x, name: x.name || x.code }))
                if (!off && valid.length) {
                    setData(valid)
                    setLive(true)
                }
            })
            .catch(() => {})
        return () => {
            off = true
        }
    }, [endpoint])

    const narrow = w < 820
    const s = data[Math.min(sel, data.length - 1)]
    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const display = "'Inter Display', 'Inter', system-ui, sans-serif"
    const mono = "'Geist Mono', ui-monospace, monospace"
    const pos = (n: number) => Math.max(0, Math.min(100, ((n - MIN) / (MAX - MIN)) * 100))
    const uid = React.useId().replace(/:/g, "")

    const sw = 320
    const sh = 84
    const dmin = Math.min(...s.demand) - 6
    const dmax = Math.max(...s.demand) + 4
    const pts = s.demand.map((d, i) => [(i / (s.demand.length - 1)) * sw, sh - ((d - dmin) / (dmax - dmin)) * sh])
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ")
    const area = line + " L " + sw + " " + sh + " L 0 " + sh + " Z"
    const trend = s.demand[0] ? Math.round(((s.demand[s.demand.length - 1] - s.demand[0]) / s.demand[0]) * 100) : 0
    const sorted = data.map((d, i) => ({ d, i })).sort((a, b) => b.d.median - a.d.median)
    const base = (appUrl || "").replace(new RegExp("/$"), "")

    const card: React.CSSProperties = {
        boxSizing: "border-box",
        borderRadius: 20,
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.1)",
        padding: narrow ? 18 : 24,
    }
    const kicker: React.CSSProperties = {
        font: "500 11.5px/1 " + mono,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,.55)",
    }

    return (
        <div
            ref={ref}
            style={{
                ...style,
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                padding: narrow ? 16 : 28,
                borderRadius: 28,
                background: "radial-gradient(120% 90% at 85% 0%, #0A3A8C 0%, #00144A 55%, #000C30 100%)",
                color: "#fff",
                fontFamily: family,
            }}
        >
            <LayoutGroup id={"radar" + uid}>
            <div role="tablist" aria-label="SAP-Modul" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {data.map((d, i) => {
                    const on = i === sel
                    return (
                        <button
                            key={d.code}
                            role="tab"
                            aria-selected={on}
                            type="button"
                            onClick={() => setSel(i)}
                            style={{
                                position: "relative",
                                flex: "0 0 auto",
                                border: "1px solid " + (on ? "transparent" : "rgba(255,255,255,.14)"),
                                background: "transparent",
                                color: on ? "#00144A" : "#fff",
                                borderRadius: 99,
                                padding: "9px 14px",
                                cursor: "pointer",
                                font: "500 13px/1 " + mono,
                            }}
                        >
                            {on && (
                                <motion.span
                                    layoutId="radar-pill"
                                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                                    style={{ position: "absolute", inset: 0, borderRadius: 99, background: "#fff" }}
                                />
                            )}
                            <span style={{ position: "relative" }}>{d.code}</span>
                        </button>
                    )
                })}
            </div>
            </LayoutGroup>

            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1.25fr 1fr", gap: 16 }}>
                <div style={{ ...card, display: "flex", flexDirection: "column", gap: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div>
                            <div style={kicker}>{"Median-Tagessatz · " + s.name}</div>
                            <div style={{ font: "600 " + (narrow ? 52 : 72) + "px/1 " + display, letterSpacing: "-0.04em", marginTop: 12 }}>
                                <Num value={s.median} suffix=" €" />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 22 }}>
                            <div>
                                <div style={kicker}>Remote</div>
                                <div style={{ font: "600 28px/1 " + display, marginTop: 10, color: "#8CCBFF" }}>
                                    <Num value={s.remote} suffix=" %" />
                                </div>
                            </div>
                            <div>
                                <div style={kicker}>Offen</div>
                                <div style={{ font: "600 28px/1 " + display, marginTop: 10 }}>
                                    <Num value={s.open} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style={{ position: "relative", height: 44 }}>
                            <div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 8, borderRadius: 99, background: "rgba(255,255,255,.1)" }} />
                            <motion.div
                                animate={{ left: pos(s.p25) + "%", width: pos(s.p75) - pos(s.p25) + "%" }}
                                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                                style={{ position: "absolute", top: 18, height: 8, borderRadius: 99, background: "linear-gradient(90deg, " + accent + ", #8CCBFF)" }}
                            />
                            <motion.div
                                animate={{ left: pos(s.median) + "%" }}
                                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                                style={{ position: "absolute", top: 8, width: 3, height: 28, marginLeft: -1.5, borderRadius: 2, background: "#fff", boxShadow: "0 0 0 4px rgba(255,255,255,.15)" }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", font: "500 12px/1 " + mono, color: "rgba(255,255,255,.55)" }}>
                            <span>{fmt(MIN) + " €"}</span>
                            <span style={{ color: "#fff" }}>{"Spanne " + fmt(s.p25) + " – " + fmt(s.p75) + " €"}</span>
                            <span>{fmt(MAX) + " €"}</span>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <div style={kicker}>Nachfrage · 12 Monate</div>
                            <div style={{ font: "600 14px/1 " + mono, color: trend >= 0 ? "#6BE38F" : "#FF8A80" }}>{(trend >= 0 ? "+" : "") + trend + " %"}</div>
                        </div>
                        <svg viewBox={"0 0 " + sw + " " + sh} preserveAspectRatio="none" style={{ width: "100%", height: 84, marginTop: 12, overflow: "visible" }}>
                            <defs>
                                <linearGradient id={"rr-fill" + uid} x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#0070F2" stopOpacity="0.45" />
                                    <stop offset="100%" stopColor="#0070F2" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path key={"a" + s.code} d={area} fill={"url(#rr-fill" + uid + ")"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
                            <motion.path
                                key={"l" + s.code}
                                d={line}
                                fill="none"
                                stroke="#8CCBFF"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </svg>
                    </div>
                </div>

                <div style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ ...kicker, marginBottom: 6 }}>Median im Vergleich</div>
                    {sorted.map(({ d, i }) => {
                        const on = i === sel
                        return (
                            <motion.button
                                key={d.code}
                                layout
                                type="button"
                                onClick={() => setSel(i)}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "96px 1fr 62px",
                                    alignItems: "center",
                                    gap: 10,
                                    border: 0,
                                    padding: "4px 0",
                                    background: "transparent",
                                    color: "#fff",
                                    cursor: "pointer",
                                    textAlign: "left",
                                }}
                            >
                                <span style={{ font: "500 12.5px/1 " + mono, color: on ? "#fff" : "rgba(255,255,255,.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.code}</span>
                                <span style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
                                    <motion.span
                                        initial={{ width: 0 }}
                                        whileInView={{ width: pos(d.median) + "%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 * i }}
                                        style={{ display: "block", height: "100%", borderRadius: 99, background: on ? "#fff" : "rgba(140,203,255,.55)" }}
                                    />
                                </span>
                                <span style={{ font: "600 13px/1 " + mono, textAlign: "right", color: on ? "#fff" : "rgba(255,255,255,.7)" }}>{fmt(d.median)}</span>
                            </motion.button>
                        )
                    })}
                    <a
                        href={base + "/projekte?module=" + encodeURIComponent(s.code)}
                        style={{ marginTop: "auto", paddingTop: 12, display: "inline-flex", alignItems: "center", gap: 8, color: "#8CCBFF", textDecoration: "none", font: "600 14px/1 " + family }}
                    >
                        {s.open + " offene " + s.code + "-Projekte ansehen"}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" stroke="#8CCBFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </div>
            <div style={{ font: "400 12px/1.4 " + family, color: "rgba(255,255,255,.45)", padding: "0 4px" }}>
                {live ? "Live aus der vlori-Projektbörse · Freelance-Tagessätze in EUR, netto" : "Beispieldaten zur Veranschaulichung · Freelance-Tagessätze in EUR, netto · DACH"}
            </div>
        </div>
    )
}


addPropertyControls(RateRadar, {
    accent: { type: ControlType.Color, defaultValue: "#0070F2", title: "Akzent" },
    endpoint: { type: ControlType.String, defaultValue: "", title: "Live-Daten", placeholder: "https://…/rates.json" },
    appUrl: { type: ControlType.String, defaultValue: "https://app.vlori.de", title: "App-URL" },
})
