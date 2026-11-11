export interface AlertInput {
    email: string
    modules: string[]
    remote: boolean
    source: string
}

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Prüft den Body von POST /api/projekt-alarm. Gibt entweder die bereinigten Daten oder eine Fehlermeldung zurück. */
export function parseAlert(body: unknown): { ok: true; data: AlertInput } | { ok: false; error: string } {
    if (!body || typeof body !== "object") return { ok: false, error: "Ungültige Anfrage." }
    const b = body as Record<string, unknown>
    const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : ""
    if (!MAIL.test(email) || email.length > 254) return { ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." }
    if (b.consent !== true) return { ok: false, error: "Ohne Einwilligung können wir keine E-Mails senden." }
    const raw = Array.isArray(b.modules) ? b.modules : []
    const modules = Array.from(
        new Set(raw.filter((m): m is string => typeof m === "string").map((m) => m.trim()).filter((m) => m && m.length <= 40))
    ).slice(0, 20)
    if (!modules.length) return { ok: false, error: "Bitte mindestens ein Modul wählen." }
    const source = typeof b.source === "string" ? b.source.slice(0, 40) : "homepage"
    return { ok: true, data: { email, modules, remote: b.remote === true, source } }
}

export function confirmMail(confirmUrl: string, unsubscribeUrl: string, modules: string[]) {
    const list = modules.join(", ")
    return {
        subject: "Bitte bestätigen Sie Ihren vlori Projekt-Alarm",
        text: `Hallo,\n\nSie möchten neue SAP-Projekte für ${list} per E-Mail erhalten. Bitte bestätigen Sie das hier:\n${confirmUrl}\n\nWenn Sie das nicht waren, ignorieren Sie diese E-Mail einfach – ohne Bestätigung senden wir nichts.\n\nAbmelden: ${unsubscribeUrl}\n\nvlori`,
    }
}
