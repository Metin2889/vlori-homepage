import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useScroll, useSpring } from "framer-motion"

/**
 * vlori – Scroll-Blüte
 * Die vlori-Blüte (Geometrie aus components/BloomFlower.tsx) öffnet sich
 * mit dem Scrollfortschritt. Links werden die vier Etappen nacheinander aktiv.
 * Die Komponente braucht eine große Höhe (z. B. 2400 px); der Inhalt bleibt
 * per position: sticky im Bild. Eltern dürfen nicht overflow: hidden sein.
 */

type Mode = "berater" | "unternehmen"

const PETAL = "M0 0 C -15 -16, -15 -44, 0 -58 C 15 -44, 15 -16, 0 0 Z"
const PETAL_IN = "M0 0 C -10 -12, -10 -30, 0 -40 C 10 -30, 10 -12, 0 0 Z"

const STAGES: Record<Mode, { name: string; title: string; text: string; stat: string }[]> = {
    berater: [
        { name: "Saat", title: "Profil in 4 Minuten", text: "Module, Erfahrung, Tagessatz und Verfügbarkeit – mehr braucht es nicht. Kostenlos, ohne Vertrag.", stat: "0 € Basisprofil" },
        { name: "Wachstum", title: "Erklärbare Matches", text: "Sie sehen nicht nur einen Score, sondern warum: welche Module passen, wo der Satz liegt, was fehlt.", stat: "Score + Gründe" },
        { name: "Knospe", title: "Direkter Kontakt", text: "Gespräche laufen direkt mit dem Unternehmen. Keine Vermittler-Kette, keine weitergereichten Profile.", stat: "1 Ansprechpartner" },
        { name: "Blüte", title: "Projektstart ohne Abzug", text: "Ihr Tagessatz bleibt Ihr Tagessatz. vlori nimmt keine Provision auf Ihre Projekte.", stat: "0 % Provision" },
    ],
    unternehmen: [
        { name: "Projekt", title: "Projekt in einem Satz", text: "Module, Budget, Remote-Anteil, Start. vlori versteht SAP-Sprache, ohne Formular-Marathon.", stat: "≈ 3 Minuten" },
        { name: "Ranking", title: "Ranking in Sekunden", text: "Verifizierte Expert/innen, sortiert nach Passung – mit nachvollziehbarer Begründung für jede Position.", stat: "Score + Gründe" },
        { name: "Kontakt", title: "Direkt ins Gespräch", text: "Sie schreiben die Menschen direkt an. Keine Aufschläge, keine Black Box dazwischen.", stat: "0 % Aufschlag" },
        { name: "Besetzt", title: "Projekt besetzt", text: "Im Schnitt dauert es bei vlori wenige Tage statt Wochen, bis das Team steht.", stat: "Tage statt Wochen" },
    ],
}

function Flower({ open, size }: { open: number; size: number }) {
    const outer = Array.from({ length: 8 }, (_, i) => i * 45)
    const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5)
    const o = Math.max(0, Math.min(1, open))
    const so = 0.35 + 0.65 * o
    const si = 0.3 + 0.7 * o
    const twist = (1 - o) * -30
    const uid = React.useId().replace(/:/g, "")
    return (
        <svg viewBox="-80 -80 160 160" width={size} height={size} style={{ overflow: "visible" }} aria-hidden="true">
            <defs>
                <linearGradient id={"sb-outer" + uid} x1="0" y1="0" x2="0" y2="-1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#0057D9" />
                    <stop offset="100%" stopColor="#0070F2" />
                </linearGradient>
                <radialGradient id={"sb-glow" + uid}>
                    <stop offset="0%" stopColor="#8CCBFF" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#8CCBFF" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle r={78} fill={"url(#sb-glow" + uid + ")"} opacity={0.25 + 0.75 * o} />
            {outer.map((a) => (
                <path
                    key={"o" + a}
                    d={PETAL}
                    fill={"url(#sb-outer" + uid + ")"}
                    opacity={0.55 + 0.4 * o}
                    transform={"rotate(" + (a + twist) + ") scale(" + so + ")"}
                />
            ))}
            {inner.map((a) => (
                <path
                    key={"i" + a}
                    d={PETAL_IN}
                    fill="#8CCBFF"
                    opacity={0.75 + 0.25 * o}
                    transform={"rotate(" + (a - twist) + ") scale(" + si + ")"}
                />
            ))}
            <circle r={6 + 5 * o} fill="#fff" />
            <circle r={3 + 2 * o} fill="#00144A" />
        </svg>
    )
}

interface Props {
    mode: Mode
    kicker: string
    title: string
    accent: string
    canvasProgress: number
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 2400
 */
export default function ScrollBloom(props: Partial<Props>) {
    const {
        mode = "berater",
        kicker = "So wächst Ihre Karriere",
        title = "Von der Saat zur Blüte – in vier Etappen.",
        accent = "#0070F2",
        canvasProgress = 0.8,
        style,
    } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const ref = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
    const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })
    const [p, setP] = React.useState(isCanvas ? canvasProgress : 0)
    const [w, setW] = React.useState(1200)

    React.useEffect(() => {
        if (isCanvas) return
        return smooth.on("change", (v) => setP(v))
    }, [smooth, isCanvas])

    React.useEffect(() => {
        if (isCanvas) setP(canvasProgress)
    }, [canvasProgress, isCanvas])

    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(([e]) => e.contentRect.width > 0 && setW(e.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const stages = STAGES[mode]
    const narrow = w < 820
    const active = Math.min(stages.length - 1, Math.floor(p * stages.length * 0.999 + 0.0001))
    const local = Math.max(0, Math.min(1, p * stages.length - active))
    const open = Math.min(1, 0.14 + p * 0.96)
    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const display = "'Inter Display', 'Inter', system-ui, sans-serif"
    const mono = "'Geist Mono', ui-monospace, monospace"
    const flowerSize = Math.max(120, narrow ? Math.min(w - 40, 300) : Math.min(520, w * 0.42))

    return (
        <div ref={ref} style={{ ...style, position: "relative", width: "100%", height: "100%" }}>
            <div
                style={{
                    position: isCanvas ? "relative" : "sticky",
                    top: 0,
                    height: isCanvas ? 860 : "100vh",
                    minHeight: 600,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: narrow ? "column-reverse" : "row",
                    alignItems: "center",
                    justifyContent: narrow ? "center" : "space-between",
                    gap: narrow ? 12 : 48,
                    padding: narrow ? "72px 20px 32px" : "80px 40px",
                    maxWidth: 1280,
                    margin: "0 auto",
                    fontFamily: family,
                    color: "#1D2D3E",
                }}
            >
                <div style={{ flex: narrow ? "0 0 auto" : "0 1 520px", width: narrow ? "100%" : undefined, display: "flex", flexDirection: "column", gap: narrow ? 16 : 28 }}>
                    <div>
                        <div style={{ font: "500 12px/1 " + mono, letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>{kicker}</div>
                        <div style={{ font: "600 " + (narrow ? 30 : 46) + "px/1.08 " + display, letterSpacing: "-0.03em", marginTop: 14, color: "#00144A" }}>{title}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: narrow ? 6 : 10 }}>
                        {stages.map((s, i) => {
                            const on = i === active
                            const done = i < active
                            return (
                                <motion.div
                                    key={s.name}
                                    animate={{ opacity: on ? 1 : done ? 0.6 : 0.38 }}
                                    transition={{ duration: 0.35 }}
                                    style={{ position: "relative", display: "flex", gap: 16, padding: narrow ? "8px 0 8px 18px" : "12px 0 12px 22px" }}
                                >
                                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: 3, background: "#E1E6EC", overflow: "hidden" }}>
                                        <div style={{ width: "100%", height: (done ? 100 : on ? local * 100 : 0) + "%", background: accent, borderRadius: 3 }} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                                            <span style={{ font: "500 12px/1 " + mono, letterSpacing: "0.06em", textTransform: "uppercase", color: accent }}>{"0" + (i + 1) + " · " + s.name}</span>
                                            <span style={{ font: "600 " + (narrow ? 17 : 20) + "px/1.2 " + display, color: "#00144A" }}>{s.title}</span>
                                        </div>
                                        <motion.div
                                            initial={false}
                                            animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div style={{ font: "400 " + (narrow ? 14.5 : 16) + "px/1.55 " + family, color: "#556B82", paddingTop: 2 }}>{s.text}</div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div style={{ position: "relative", flex: "0 0 auto", width: flowerSize, height: flowerSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div
                        style={{
                            position: "absolute",
                            inset: "6%",
                            borderRadius: "50%",
                            border: "1px dashed #CFE3FF",
                            transform: "rotate(" + p * 120 + "deg)",
                        }}
                    />
                    <div style={{ transform: "rotate(" + p * 90 + "deg)" }}>
                        <Flower open={open} size={flowerSize * 0.86} />
                    </div>
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        style={{
                            position: "absolute",
                            right: narrow ? 0 : "2%",
                            bottom: narrow ? "2%" : "8%",
                            padding: "10px 14px",
                            borderRadius: 14,
                            background: "#fff",
                            boxShadow: "0 10px 30px rgba(0,20,74,.14)",
                            border: "1px solid #E1E6EC",
                            font: "600 14px/1.2 " + family,
                            color: "#00144A",
                        }}
                    >
                        <div style={{ font: "500 10.5px/1 " + mono, letterSpacing: "0.06em", textTransform: "uppercase", color: "#556B82", marginBottom: 6 }}>{stages[active].name}</div>
                        {stages[active].stat}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}


addPropertyControls(ScrollBloom, {
    mode: {
        type: ControlType.Enum,
        defaultValue: "berater",
        title: "Sicht",
        options: ["berater", "unternehmen"],
        optionTitles: ["Berater/in", "Unternehmen"],
    },
    kicker: { type: ControlType.String, defaultValue: "So wächst Ihre Karriere", title: "Kicker" },
    title: { type: ControlType.String, defaultValue: "Von der Saat zur Blüte – in vier Etappen.", title: "Titel", displayTextArea: true },
    accent: { type: ControlType.Color, defaultValue: "#0070F2", title: "Akzent" },
    canvasProgress: { type: ControlType.Number, defaultValue: 0.8, title: "Vorschau", min: 0, max: 1, step: 0.05 },
})
