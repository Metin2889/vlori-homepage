import { randomUUID } from "node:crypto"
import { db } from "../../../lib/supabase"
import { parseAlert, confirmMail } from "../../../lib/alerts"
import { SITE_URL } from "../../../lib/config"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const body = await req.json().catch(() => null)
    const parsed = parseAlert(body)
    if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 })

    const supabase = db()
    if (!supabase) return Response.json({ error: "Projekt-Alarm ist noch nicht eingerichtet." }, { status: 503 })

    const { email, modules, remote, source } = parsed.data
    const token = randomUUID()
    const { error } = await supabase.from("job_alerts").upsert(
        { email, modules, remote, source, consent_at: new Date().toISOString(), confirm_token: token, confirmed_at: null },
        { onConflict: "email" }
    )
    if (error) {
        console.error("job_alerts upsert failed", error.message)
        return Response.json({ error: "Speichern fehlgeschlagen." }, { status: 500 })
    }

    const key = process.env.RESEND_API_KEY
    const from = process.env.ALERT_FROM_EMAIL
    if (key && from) {
        const mail = confirmMail(
            `${SITE_URL}/api/projekt-alarm/bestaetigen?token=${token}`,
            `${SITE_URL}/api/projekt-alarm/abmelden?token=${token}`,
            modules
        )
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from, to: email, subject: mail.subject, text: mail.text }),
        }).catch(() => null)
        if (!res?.ok) console.error("confirmation mail failed", res?.status)
    }

    return Response.json({ ok: true })
}
