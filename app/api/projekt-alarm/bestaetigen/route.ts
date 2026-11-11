import { db } from "../../../../lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    const token = new URL(req.url).searchParams.get("token") || ""
    const supabase = db()
    let status = "fehler"
    if (supabase && /^[0-9a-f-]{36}$/i.test(token)) {
        const { data } = await supabase
            .from("job_alerts")
            .update({ confirmed_at: new Date().toISOString() })
            .eq("confirm_token", token)
            .select("email")
        if (data?.length) status = "bestaetigt"
    }
    return Response.redirect(new URL(`/projekt-alarm?status=${status}`, req.url), 303)
}
