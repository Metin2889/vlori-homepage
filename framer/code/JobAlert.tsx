import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { motion, AnimatePresence } from "framer-motion"

/**
 * vlori – Projekt-Alarm
 * Lead-Capture für Besucher/innen, die sich noch nicht registrieren wollen:
 * Module wählen, E-Mail eintragen, Einwilligung geben.
 * Mit `endpoint` wird per POST {email, modules, remote} gesendet,
 * ohne Endpunkt geht es mit den gewählten Modulen in die Registrierung
 * (die E-Mail landet bewusst nicht in der URL).
 */

const DEFAULT_MODULES = ["S/4HANA", "FI", "CO", "SD", "MM", "PP", "EWM", "ABAP", "BTP", "HCM", "Basis", "Ariba"]

interface Props {
    appUrl: string
    endpoint: string
    privacyUrl: string
    modules: string[]
    accent: string
    style?: React.CSSProperties
}

type State = "idle" | "sending" | "done" | "error"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 720
 */
export default function JobAlert(props: Partial<Props>) {
    const {
        appUrl = "https://app.vlori.de",
        endpoint = "",
        privacyUrl = "https://app.vlori.de/info/datenschutz",
        modules = DEFAULT_MODULES,
        accent = "#0070F2",
        style,
    } = props
    const [picked, setPicked] = React.useState<string[]>(["S/4HANA"])
    const [remote, setRemote] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [consent, setConsent] = React.useState(false)
    const [state, setState] = React.useState<State>("idle")
    const [error, setError] = React.useState("")
    const id = React.useId()
    const family = "'Inter', 'Inter Placeholder', system-ui, sans-serif"
    const ink = "#1D2D3E"
    const muted = "#556B82"
    const base = (appUrl || "").replace(new RegExp("/$"), "")

    const toggle = (m: string) => setPicked((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]))

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!picked.length) return setError("Bitte mindestens ein Modul wählen.")
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Bitte eine gültige E-Mail-Adresse eingeben.")
        if (!consent) return setError("Bitte der Benachrichtigung per E-Mail zustimmen.")
        setError("")
        if (!endpoint) {
            const qs = new URLSearchParams({ typ: "berater", suchauftrag: "1", module: picked.join(",") })
            if (remote) qs.set("remote", "1")
            window.location.assign(base + "/registrieren?" + qs.toString())
            return
        }
        setState("sending")
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), modules: picked, remote, consent: true, source: "homepage" }),
            })
            if (!res.ok) throw new Error(String(res.status))
            setState("done")
        } catch {
            setState("error")
            setError("Das hat leider nicht geklappt. Bitte später erneut versuchen.")
        }
    }

    const chip = (m: string) => {
        const on = picked.includes(m)
        return (
            <button
                key={m}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(m)}
                style={{
                    height: 34,
                    padding: "0 13px",
                    borderRadius: 99,
                    border: "1px solid " + (on ? accent : "#D5DDE6"),
                    background: on ? accent : "#fff",
                    color: on ? "#fff" : ink,
                    font: "600 13px/1 " + family,
                    cursor: "pointer",
                    transition: "all .15s",
                }}
            >
                {m}
            </button>
        )
    }

    return (
        <div style={{ ...style, boxSizing: "border-box", width: "100%", padding: 24, borderRadius: 24, background: "#fff", border: "1px solid #E1E6EC", fontFamily: family, color: ink }}>
            <AnimatePresence mode="wait" initial={false}>
                {state === "done" ? (
                    <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 0" }}>
                        <div style={{ font: "600 22px/1.2 'Inter Display', " + family }}>Projekt-Alarm ist aktiv.</div>
                        <div style={{ font: "400 15px/1.5 " + family, color: muted }}>
                            Bitte bestätigen Sie noch den Link in Ihrem Postfach. Danach melden wir passende {picked.join(", ")}-Projekte.
                        </div>
                    </motion.div>
                ) : (
                    <motion.form key="form" aria-label="Projekt-Alarm" onSubmit={submit} noValidate initial={false} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <div style={{ font: "600 20px/1.2 'Inter Display', " + family }}>Neue SAP-Projekte per E-Mail</div>
                            <div style={{ font: "400 14px/1.5 " + family, color: muted, marginTop: 6 }}>Wählen Sie Ihre Module – wir melden uns, sobald ein passendes Projekt online geht.</div>
                        </div>
                        <div role="group" aria-label="SAP-Module" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {modules.map(chip)}
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 10, font: "500 14px/1.3 " + family, cursor: "pointer" }}>
                            <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} style={{ width: 18, height: 18, accentColor: accent }} />
                            Nur Projekte mit überwiegend Remote-Anteil
                        </label>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <label htmlFor={id + "-mail"} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                                E-Mail-Adresse
                            </label>
                            <input
                                id={id + "-mail"}
                                type="email"
                                autoComplete="email"
                                placeholder="name@beispiel.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-invalid={!!error && !email}
                                style={{ flex: "1 1 220px", minWidth: 0, height: 48, padding: "0 14px", borderRadius: 12, border: "1px solid #C9D3DE", font: "400 15px/1 " + family, color: ink, outlineColor: accent }}
                            />
                            <button
                                type="submit"
                                disabled={state === "sending"}
                                style={{ flex: "0 0 auto", height: 48, padding: "0 20px", borderRadius: 12, border: "none", background: accent, color: "#fff", font: "600 15px/1 " + family, cursor: "pointer", opacity: state === "sending" ? 0.7 : 1 }}
                            >
                                {state === "sending" ? "Wird gesendet …" : "Alarm aktivieren"}
                            </button>
                        </div>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "400 12.5px/1.5 " + family, color: muted, cursor: "pointer" }}>
                            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 16, height: 16, marginTop: 2, accentColor: accent, flex: "0 0 auto" }} />
                            <span>
                                Ich möchte passende Projekte per E-Mail erhalten. Abmeldung jederzeit möglich. Details in der{" "}
                                <a href={privacyUrl} style={{ color: accent }}>
                                    Datenschutzerklärung
                                </a>
                                .
                            </span>
                        </label>
                        <div role="alert" style={{ minHeight: 18, font: "500 13px/1.4 " + family, color: "#BB0000" }}>
                            {error}
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}

addPropertyControls(JobAlert, {
    appUrl: { type: ControlType.String, defaultValue: "https://app.vlori.de", title: "App-URL" },
    endpoint: { type: ControlType.String, defaultValue: "", title: "POST-Endpunkt", placeholder: "leer = Weiterleitung zur App" },
    privacyUrl: { type: ControlType.String, defaultValue: "https://app.vlori.de/info/datenschutz", title: "Datenschutz-URL" },
    modules: { type: ControlType.Array, title: "Module", control: { type: ControlType.String }, defaultValue: DEFAULT_MODULES },
    accent: { type: ControlType.Color, defaultValue: "#0070F2", title: "Akzent" },
})
