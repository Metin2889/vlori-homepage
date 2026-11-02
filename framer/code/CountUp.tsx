import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * vlori – CountUp
 * Zählt beim Hineinscrollen von 0 auf den Zielwert (wie CountUp in pages/_index.tsx).
 * Optional: Live-Wert aus der vlori-App laden (JSON-Endpunkt + Pfad, z. B. "stats.openProjects").
 */

interface Props {
    value: number
    suffix: string
    endpoint: string
    path: string
    color: string
    fontSize: number
    duration: number
    style?: React.CSSProperties
}

function pick(obj: any, path: string): number | undefined {
    const v = path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj)
    return typeof v === "number" ? v : undefined
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CountUp(props: Props) {
    const { value, suffix, endpoint, path, color, fontSize, duration, style } = props
    const ref = React.useRef<HTMLSpanElement>(null)
    const [target, setTarget] = React.useState(value)
    const [shown, setShown] = React.useState(0)

    React.useEffect(() => setTarget(value), [value])

    React.useEffect(() => {
        if (!endpoint) return
        let alive = true
        fetch(endpoint)
            .then((r) => r.json())
            .then((j) => {
                const v = pick(j, path)
                if (alive && v !== undefined) setTarget(v)
            })
            .catch(() => {})
        return () => {
            alive = false
        }
    }, [endpoint, path])

    React.useEffect(() => {
        const el = ref.current
        const reduce =
            typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (!el || reduce || typeof IntersectionObserver === "undefined") {
            setShown(target)
            return
        }
        let frame = 0
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                io.disconnect()
                const start = performance.now()
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / (duration * 1000))
                    setShown(Math.round(target * (1 - Math.pow(1 - t, 3))))
                    if (t < 1) frame = requestAnimationFrame(tick)
                }
                frame = requestAnimationFrame(tick)
            },
            { threshold: 0.4 }
        )
        io.observe(el)
        return () => {
            io.disconnect()
            cancelAnimationFrame(frame)
        }
    }, [target, duration])

    return (
        <span
            ref={ref}
            style={{
                ...style,
                display: "inline-block",
                color,
                fontFamily: "'Inter Display', 'Inter', system-ui, sans-serif",
                fontWeight: 600,
                fontSize,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
            }}
        >
            {shown.toLocaleString("de-DE")}
            {suffix}
        </span>
    )
}

CountUp.defaultProps = {
    value: 128,
    suffix: "",
    endpoint: "",
    path: "stats.openProjects",
    color: "#FFFFFF",
    fontSize: 44,
    duration: 1.1,
}

addPropertyControls(CountUp, {
    value: { type: ControlType.Number, title: "Wert", min: 0, max: 1000000, step: 1 },
    suffix: { type: ControlType.String, title: "Suffix" },
    endpoint: { type: ControlType.String, title: "Live-URL", placeholder: "https://app…/_api/home" },
    path: { type: ControlType.String, title: "JSON-Pfad" },
    color: { type: ControlType.Color, title: "Farbe" },
    fontSize: { type: ControlType.Number, title: "Größe", min: 12, max: 120 },
    duration: { type: ControlType.Number, title: "Dauer (s)", min: 0.2, max: 4, step: 0.1 },
})
