import { db } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

const cache = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" }

/** Zähler für die Kennzahlen-Leiste (CountUp liest z. B. "stats.openProjects"). */
export async function GET() {
    const supabase = db()
    if (!supabase) return Response.json({ stats: {} }, { status: 404 })
    const count = async (kind: string) => {
        const { count } = await supabase.from("match_items").select("*", { count: "exact", head: true }).eq("kind", kind).eq("active", true)
        return count ?? undefined
    }
    const [openProjects, experts] = await Promise.all([count("projekt"), count("berater")])
    return Response.json({ stats: { openProjects, experts } }, { headers: cache })
}
