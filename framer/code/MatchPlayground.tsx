import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

/**
 * vlori – Matching-Spielwiese
 * Regler drehen, Ranking sortiert sich live um. Zeigt, wie das erklärbare
 * Matching gewichtet: Module, Tagessatz, Remote-Anteil, Branche, Verfügbarkeit.
 */

type Mode = "berater" | "unternehmen"

interface Row {
    name: string
    sub: string
    modules: string[]
    rate: number
    remote: number
    industry: string
    weeks: number
}

const MODULES = ["S/4HANA", "FI", "CO", "MM", "SD", "EWM", "BTP", "ABAP"]
const INDUSTRIES = ["Alle", "Automotive", "Handel", "Pharma", "Chemie", "Maschinenbau", "Logistik"]

const ROWS: Record<Mode, Row[]> = {
    berater: [
        { name: "S/4HANA Conversion – Finance", sub: "Automobilzulieferer · Stuttgart", modules: ["S/4HANA", "FI", "CO"], rate: 1150, remote: 60, industry: "Automotive", weeks: 0 },
        { name: "EWM-Rollout 3 Standorte", sub: "Handelskonzern · Hamburg", modules: ["EWM", "MM", "SD"], rate: 1050, remote: 40, industry: "Handel", weeks: 2 },
        { name: "BTP Extensions mit CAP", sub: "Maschinenbauer · remote", modules: ["BTP", "ABAP"], rate: 1000, remote: 100, industry: "Maschinenbau", weeks: 1 },
        { name: "FI/CO Group Reporting", sub: "Pharma · Basel", modules: ["FI", "CO"], rate: 1220, remote: 50, industry: "Pharma", weeks: 4 },
        { name: "MM/SD Template-Rollout", sub: "Chemie · Frankfurt", modules: ["MM", "SD", "S/4HANA"], rate: 1080, remote: 50, industry: "Chemie", weeks: 3 },
        { name: "ABAP Cloud / RAP", sub: "Logistik · Düsseldorf", modules: ["ABAP", "S/4HANA"], rate: 950, remote: 90, industry: "Logistik", weeks: 0 },
    ],
    unternehmen: [
        { name: "Katrin M.", sub: "S/4HANA Finance-Architektin · 14 J.", modules: ["S/4HANA", "FI", "CO"], rate: 1250, remote: 60, industry: "Automotive", weeks: 2 },
        { name: "Deniz A.", sub: "EWM Lead · 11 J.", modules: ["EWM", "MM"], rate: 1100, remote: 50, industry: "Handel", weeks: 0 },
        { name: "Jonas W.", sub: "ABAP Cloud & BTP · 8 J.", modules: ["ABAP", "BTP"], rate: 950, remote: 100, industry: "Maschinenbau", weeks: 1 },
        { name: "Marco R.", sub: "FI/CO Reporting · 16 J.", modules: ["FI", "CO"], rate: 1150, remote: 40, industry: "Pharma", weeks: 6 },
        { name: "Thomas B.", sub: "MM/SD Rollouts · 18 J.", modules: ["MM", "SD", "S/4HANA"], rate: 1080, remote: 50, industry: "Chemie", weeks: 3 },
        { name: "Aylin T.", sub: "BTP & Integration · 10 J.", modules: ["BTP", "S/4HANA"], rate: 1050, remote: 100, industry: "Logistik", weeks: 0 },
    ],
}

function fmt(n: number) {
    return n.toLocaleString("de-DE")
}

interface Props {
    mode: Mode
    accent: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1120
 */
export default function MatchPlayground(props: Partial<Props>) {
    const {
        mode = "berater",
        accent = "#0070F2",
        style,
    } = props
    const ber = mode === "berater"
    const [mods, setMods] = React.useState<string[]>(["S/4HANA", "FI", "CO"])
    const [rate, setRate] = React.useState(ber ? 1050 : 1150)
    const [remote, setRemote] = React.useState(50)
    const [industry, setIndustry] = React.useState("Alle")
    const [soon, setSoon] = React.useState(false)
    const [w, setW] = React.useState(1120)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setRate(ber ? 1050 : 1150)
    }, [ber])

    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const narrow = w < 820
    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const mono = "'Geist Mono', ui-monospace, monospace"
    const ink = "#1D2D3E"
    const muted = "#556B82"

    const ranked = React.useMemo(() => {
        return ROWS[mode]
            .map((r) => {
                const hit = r.modules.filter((m) => mods.indexOf(m) >= 0)
                const mScore = mods.length ? (hit.length / r.modules.length) * 0.6 + (hit.length / mods.length) * 0.4 : 0.4
                const rDiff = ber ? r.rate - rate : rate - r.rate
                const rScore = rDiff >= 0 ? 1 : Math.max(0, 1 + rDiff / 300)
                const remDiff = ber ? r.remote - remote : remote - r.remote
                const remScore = remDiff >= 0 ? 1 : Math.max(0, 1 + remDiff / 70)
                const iScore = industry === "Alle" ? 0.8 : r.industry === industry ? 1 : 0.4
                const aScore = soon ? (r.weeks <= 1 ? 1 : Math.max(0, 1 - r.weeks / 6)) : 0.85
                const total = mScore * 0.45 + rScore * 0.2 + remScore * 0.15 + iScore * 0.1 + aScore * 0.1
                const why: string[] = []
                if (hit.length) why.push(hit.join(" · "))
                why.push(rDiff >= 0 ? (ber ? "Satz passt" : "im Budget") : (ber ? fmt(-rDiff) + " € darunter" : fmt(-rDiff) + " € drüber"))
                why.push(remDiff >= 0 ? r.remote + " % remote" : "nur " + r.remote + " % remote")
                if (industry !== "Alle" && r.industry === industry) why.push(industry)
                if (soon && r.weeks <= 1) why.push(ber ? "Start sofort" : "sofort verfügbar")
                return { r, hit, score: Math.round(30 + 69 * total), why }
            })
            .sort((a, b) => b.score - a.score)
    }, [mode, mods, rate, remote, industry, soon])

    const toggle = (m: string) => setMods((cur) => (cur.indexOf(m) >= 0 ? cur.filter((x) => x !== m) : cur.concat([m])))

    const label = (t: string, v?: string) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", font: "600 13px/1 " + family, color: ink, marginBottom: 10 }}>
            <span>{t}</span>
            {v && <span style={{ font: "500 13px/1 " + mono, color: accent }}>{v}</span>}
        </div>
    )

    const slider = (value: number, min: number, max: number, step: number, set: (n: number) => void, aria: string) => {
        const pct = ((value - min) / (max - min)) * 100
        return (
            <input
                type="range"
                aria-label={aria}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                style={{
                    width: "100%",
                    height: 6,
                    appearance: "none",
                    WebkitAppearance: "none",
                    borderRadius: 99,
                    outline: "none",
                    cursor: "pointer",
                    accentColor: accent,
                    background: "linear-gradient(90deg, " + accent + " " + pct + "%, #DCE3EB " + pct + "%)",
                }}
            />
        )
    }

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
            <div
                style={{
                    flex: narrow ? "0 0 auto" : "0 0 360px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    padding: 24,
                    borderRadius: 24,
                    background: "#fff",
                    border: "1px solid #E1E6EC",
                }}
            >
                <div>
                    {label(ber ? "Ihre Module" : "Gesuchte Module")}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {MODULES.map((m) => {
                            const on = mods.indexOf(m) >= 0
                            return (
                                <motion.button
                                    key={m}
                                    type="button"
                                    aria-pressed={on}
                                    whileTap={{ scale: 0.94 }}
                                    onClick={() => toggle(m)}
                                    style={{
                                        border: "1px solid " + (on ? accent : "#D9DEE4"),
                                        background: on ? accent : "#fff",
                                        color: on ? "#fff" : ink,
                                        borderRadius: 99,
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        font: "500 13px/1 " + mono,
                                        transition: "background .2s, color .2s, border-color .2s",
                                    }}
                                >
                                    {m}
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
                <div>
                    {label(ber ? "Mindest-Tagessatz" : "Budget pro Tag", fmt(rate) + " €")}
                    {slider(rate, 800, 1400, 10, setRate, ber ? "Mindest-Tagessatz" : "Budget pro Tag")}
                </div>
                <div>
                    {label(ber ? "Mindestens remote" : "Remote möglich", remote + " %")}
                    {slider(remote, 0, 100, 10, setRemote, "Remote-Anteil")}
                </div>
                <div>
                    {label("Branche")}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {INDUSTRIES.map((i) => {
                            const on = industry === i
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => setIndustry(i)}
                                    style={{
                                        border: 0,
                                        background: on ? "#00144A" : "#F0F3F6",
                                        color: on ? "#fff" : ink,
                                        borderRadius: 99,
                                        padding: "7px 11px",
                                        cursor: "pointer",
                                        font: "500 12.5px/1 " + family,
                                        transition: "background .2s, color .2s",
                                    }}
                                >
                                    {i}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={soon}
                    onClick={() => setSoon(!soon)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", padding: 0, border: 0, background: "transparent", color: ink, textAlign: "left", cursor: "pointer", font: "600 13px/1.3 " + family }}
                >
                    <span>{ber ? "Nur Projekte mit Start in 1 Woche" : "Nur sofort verfügbar"}</span>
                    <span
                        aria-hidden="true"
                        style={{ position: "relative", flex: "0 0 auto", width: 42, height: 24, borderRadius: 99, background: soon ? accent : "#D2DAE3", transition: "background .2s" }}
                    >
                        <motion.span
                            animate={{ x: soon ? 20 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{ position: "absolute", top: 2, left: 0, width: 20, height: 20, borderRadius: 99, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}
                        />
                    </span>
                </button>
            </div>

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: narrow ? 16 : 24,
                    borderRadius: 24,
                    background: "#00144A",
                    color: "#fff",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px 8px", font: "500 12px/1 " + mono, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8CCBFF" }}>
                    <span>{ber ? "Ihr Projekt-Ranking" : "Ihr Kandidaten-Ranking"}</span>
                    <span style={{ color: "rgba(255,255,255,.55)" }}>live</span>
                </div>
                {ranked.map((x, i) => (
                    <motion.div
                        key={x.r.name}
                        layout
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: narrow ? "12px" : "14px 16px",
                            borderRadius: 16,
                            background: i === 0 ? "rgba(0,112,242,.28)" : "rgba(255,255,255,.06)",
                            border: "1px solid " + (i === 0 ? "rgba(140,203,255,.5)" : "rgba(255,255,255,.08)"),
                        }}
                    >
                        <div style={{ width: 22, font: "600 15px/1 " + mono, color: i === 0 ? "#8CCBFF" : "rgba(255,255,255,.45)" }}>{i + 1}</div>
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ font: "600 15px/1.2 " + family }}>{x.r.name}</span>
                                <span style={{ font: "400 12.5px/1.2 " + family, color: "rgba(255,255,255,.6)" }}>{x.r.sub}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                                <motion.div
                                    animate={{ width: x.score + "%" }}
                                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                    style={{ height: "100%", borderRadius: 99, background: i === 0 ? "linear-gradient(90deg, #0070F2, #8CCBFF)" : "rgba(140,203,255,.6)" }}
                                />
                            </div>
                            {!narrow && <div style={{ font: "400 12px/1.3 " + family, color: "rgba(255,255,255,.6)" }}>{x.why.join("  ·  ")}</div>}
                        </div>
                        <div style={{ textAlign: "right", minWidth: 54 }}>
                            <div style={{ font: "600 22px/1 'Inter Display', 'Inter', sans-serif", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{x.score}</div>
                            <div style={{ font: "500 11px/1.4 " + family, color: "rgba(255,255,255,.55)" }}>{fmt(x.r.rate) + " €"}</div>
                        </div>
                    </motion.div>
                ))}
                <div style={{ padding: "8px 4px 0", font: "400 12px/1.4 " + family, color: "rgba(255,255,255,.5)" }}>
                    Gewichtung: Module 45 % · Tagessatz 20 % · Remote 15 % · Branche 10 % · Verfügbarkeit 10 % · Beispieldaten
                </div>
            </div>
        </div>
    )
}


addPropertyControls(MatchPlayground, {
    mode: {
        type: ControlType.Enum,
        defaultValue: "berater",
        title: "Sicht",
        options: ["berater", "unternehmen"],
        optionTitles: ["Berater/in", "Unternehmen"],
    },
    accent: { type: ControlType.Color, defaultValue: "#0070F2", title: "Akzent" },
})
