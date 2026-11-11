import { db } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

const cache = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" }

/** Tagessatz-Statistiken je Modul für den Tagessatz-Radar. */
export async function GET() {
    const supabase = db()
    if (!supabase) return Response.json({ modules: [] }, { status: 404 })
    const { data, error } = await supabase
        .from("rate_stats")
        .select("code, name, median, p25, p75, remote, open, demand")
        .order("median", { ascending: false })
    if (error) return Response.json({ modules: [] }, { status: 500 })
    return Response.json({ modules: data }, { headers: cache })
}
