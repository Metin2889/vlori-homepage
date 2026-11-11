import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * vlori – Match Score Ring
 * Visualisiert den Match Score (0–100) aus helpers/matchEngine.tsx.
 * Der Ring zeichnet sich beim Hineinscrollen und zählt die Zahl hoch.
 */

interface Props {
    score: number
    size: number
    stroke: number
    color: string
    track: string
    textColor: string
    showLabel: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 112
 * @framerIntrinsicHeight 112
 */
export default function MatchRing(props: Partial<Props>) {
    const {
        score: rawScore = 96,
        size = 112,
        stroke = 9,
        color = "#0070F2",
        track = "#E3ECF8",
        textColor = "#1D2D3E",
        showLabel = true,
        style,
    } = props
    const ref = React.useRef<HTMLDivElement>(null)
    const [p, setP] = React.useState(0)
    const score = Math.max(0, Math.min(100, Math.round(rawScore)))
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r

    React.useEffect(() => {
        const el = ref.current
        const reduce =
            typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (!el || reduce || typeof IntersectionObserver === "undefined") {
            setP(1)
            return
        }
        let frame = 0
        const io = new IntersectionObserver(
            ([e]) => {
                if (!e.isIntersecting) return
                io.disconnect()
                const start = performance.now()
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / 1200)
                    setP(1 - Math.pow(1 - t, 3))
                    if (t < 1) frame = requestAnimationFrame(tick)
                }
                frame = requestAnimationFrame(tick)
            },
            { threshold: 0.5 }
        )
        io.observe(el)
        return () => {
            io.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [score])

    const value = Math.round(score * p)
    return (
        <div
            ref={ref}
            role="img"
            aria-label={"Match Score " + score + " von 100"}
            style={{ ...style, position: "relative", width: size, height: size }}
        >
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - (score / 100) * p)}
                />
            </svg>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: textColor,
                    fontFamily: "'Inter Display', 'Inter', system-ui, sans-serif",
                }}
            >
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: size * 0.3,
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {value}
                </span>
                {showLabel && (
                    <span style={{ fontSize: Math.max(10, size * 0.1), fontWeight: 500, opacity: 0.65, marginTop: 4 }}>
                        Match
                    </span>
                )}
            </div>
        </div>
    )
}


addPropertyControls(MatchRing, {
    score: { type: ControlType.Number, defaultValue: 96, title: "Score", min: 0, max: 100, step: 1 },
    size: { type: ControlType.Number, defaultValue: 112, title: "Größe", min: 32, max: 320 },
    stroke: { type: ControlType.Number, defaultValue: 9, title: "Linie", min: 2, max: 30 },
    color: { type: ControlType.Color, defaultValue: "#0070F2", title: "Farbe" },
    track: { type: ControlType.Color, defaultValue: "#E3ECF8", title: "Spur" },
    textColor: { type: ControlType.Color, defaultValue: "#1D2D3E", title: "Text" },
    showLabel: { type: ControlType.Boolean, defaultValue: true, title: "Label" },
})
