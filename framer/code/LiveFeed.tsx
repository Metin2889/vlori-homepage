import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

/**
 * vlori – Live-Feed
 * Rotierende Aktivitäten aus dem Netzwerk (neue Projekte, Matches,
 * Verfügbarkeiten, Events). Zeigt, dass auf der Plattform etwas passiert.
 */

type Kind = "projekt" | "match" | "verfuegbar" | "event" | "besetzt"

interface Ev {
    kind: Kind
    text: string
    meta: string
}

const EVENTS: Ev[] = [
    { kind: "projekt", text: "Neues Projekt: S/4HANA Finance Stream", meta: "Stuttgart · 60 % remote" },
    { kind: "match", text: "Match 94 – ABAP Cloud ↔ Maschinenbauer", meta: "vor 2 Min." },
    { kind: "verfuegbar", text: "Katrin M. ist ab März verfügbar", meta: "FI/CO · 14 Jahre" },
    { kind: "besetzt", text: "EWM-Rollout besetzt in 9 Tagen", meta: "Hamburg · Handel" },
    { kind: "projekt", text: "Neues Projekt: BTP Integration Suite", meta: "100 % remote" },
    { kind: "event", text: "Webinar: Clean Core mit BTP", meta: "Do · 18:00 Uhr" },
    { kind: "match", text: "Match 91 – SuccessFactors ↔ Versicherer", meta: "vor 6 Min." },
    { kind: "verfuegbar", text: "Deniz A. ist sofort verfügbar", meta: "EWM Lead · 11 Jahre" },
    { kind: "projekt", text: "Neues Projekt: MM/SD Template-Rollout", meta: "Frankfurt · Chemie" },
    { kind: "event", text: "SAP-Stammtisch München", meta: "Di · 19:00 Uhr" },
]

const COLORS: Record<Kind, string> = {
    projekt: "#5AA2FF",
    match: "#4CD07D",
    verfuegbar: "#8CCBFF",
    event: "#F0AB00",
    besetzt: "#B57CFF",
}

const LABELS: Record<Kind, string> = {
    projekt: "Projekt",
    match: "Match",
    verfuegbar: "Verfügbar",
    event: "Event",
    besetzt: "Besetzt",
}

interface Props {
    dark: boolean
    layout: "stack" | "line"
    visible: number
    interval: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 420
 */
export default function LiveFeed(props: Partial<Props>) {
    const {
        dark = true,
        layout = "stack",
        visible = 3,
        interval = 2.8,
        style,
    } = props
    const [start, setStart] = React.useState(0)
    const [paused, setPaused] = React.useState(false)

    React.useEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas || paused) return
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduce) return
        const id = window.setInterval(() => {
            if (document.hidden) return
            setStart((s) => (s + 1) % EVENTS.length)
        }, Math.max(1200, interval * 1000))
        return () => window.clearInterval(id)
    }, [interval, paused])

    const n = layout === "line" ? 1 : Math.max(1, visible)
    const items: { ev: Ev; key: number }[] = []
    for (let i = 0; i < n; i++) {
        const idx = (start - i + EVENTS.length * 10) % EVENTS.length
        items.push({ ev: EVENTS[idx], key: start - i })
    }

    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const mono = "'Geist Mono', ui-monospace, monospace"
    const fg = dark ? "#fff" : "#1D2D3E"
    const sub = dark ? "rgba(255,255,255,.6)" : "#556B82"
    const bg = dark ? "rgba(255,255,255,.07)" : "#fff"
    const bd = dark ? "rgba(255,255,255,.12)" : "#E1E6EC"

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            role="region"
            aria-label="Aktivitäten im vlori-Netzwerk"
            style={{
                ...style,
                boxSizing: "border-box",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontFamily: family,
                color: fg,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "500 11.5px/1 " + mono, letterSpacing: "0.07em", textTransform: "uppercase", color: sub }}>
                <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 7, height: 7, borderRadius: 99, background: "#30B05A", display: "inline-block" }}
                />
                Gerade im Netzwerk
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
                <AnimatePresence initial={false} mode="popLayout">
                    {items.map(({ ev, key }, i) => (
                        <motion.div
                            key={key}
                            layout
                            initial={{ opacity: 0, y: -16, scale: 0.96 }}
                            animate={{ opacity: 1 - i * (0.7 / Math.max(1, n)), y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "11px 14px",
                                borderRadius: 14,
                                background: bg,
                                border: "1px solid " + bd,
                                backdropFilter: dark ? "blur(12px)" : undefined,
                                WebkitBackdropFilter: dark ? "blur(12px)" : undefined,
                            }}
                        >
                            <span
                                style={{
                                    flex: "0 0 auto",
                                    font: "600 10.5px/1 " + mono,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    color: COLORS[ev.kind],
                                    padding: "5px 7px",
                                    borderRadius: 6,
                                    background: COLORS[ev.kind] + "22",
                                }}
                            >
                                {LABELS[ev.kind]}
                            </span>
                            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                                <span style={{ font: "600 13.5px/1.25 " + family, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.text}</span>
                                <span style={{ font: "400 12px/1.2 " + family, color: sub }}>{ev.meta}</span>
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}


addPropertyControls(LiveFeed, {
    dark: { type: ControlType.Boolean, defaultValue: true, title: "Dunkel" },
    layout: { type: ControlType.Enum, defaultValue: "stack", title: "Layout", options: ["stack", "line"], optionTitles: ["Stapel", "Zeile"] },
    visible: { type: ControlType.Number, defaultValue: 3, title: "Anzahl", min: 1, max: 5, step: 1 },
    interval: { type: ControlType.Number, defaultValue: 2.8, title: "Takt (s)", min: 1.2, max: 8, step: 0.1 },
})
