const PETAL = "M0 0 C 16 -26 20 -70 0 -104 C -20 -70 -16 -26 0 0 Z"

/** Statische vlori-Blüte (Logo-Motiv). Dreht sich per CSS, wenn `spin` gesetzt ist. */
export function Bloom({ size = 280, spin = false, id = "bloom" }: { size?: number; spin?: boolean; id?: string }) {
    const outer = Array.from({ length: 12 }, (_, i) => i * 30)
    const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5)
    return (
        <svg width={size} height={size} viewBox="-120 -120 240 240" aria-hidden="true" className={spin ? "bloom-spin" : undefined}>
            <defs>
                <linearGradient id={id + "-o"} x1="0" y1="0" x2="0" y2="-1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#0070F2" />
                    <stop offset="1" stopColor="#D6ECFF" />
                </linearGradient>
                <linearGradient id={id + "-i"} x1="0" y1="0" x2="0" y2="-1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#0057D9" />
                    <stop offset="1" stopColor="#8CCBFF" />
                </linearGradient>
            </defs>
            {outer.map((r) => (
                <path key={"o" + r} d={PETAL} fill={`url(#${id}-o)`} opacity={0.92} transform={`rotate(${r})`} />
            ))}
            {inner.map((r) => (
                <path key={"i" + r} d={PETAL} fill={`url(#${id}-i)`} transform={`rotate(${r}) scale(0.62)`} />
            ))}
            <circle r="20" fill="#fff" />
            <circle cx="-6" cy="-2" r="5" fill="#00144A" />
            <circle cx="7" cy="4" r="3.4" fill="#0070F2" />
        </svg>
    )
}

export function Logo() {
    return (
        <span className="logo">
            <Bloom size={26} id="logo" />
            <span>vlori</span>
        </span>
    )
}
