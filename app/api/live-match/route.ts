import { db } from "../../../lib/supabase"

export const dynamic = "force-dynamic"

const cache = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" }

/** Aktive Projekte (?typ=projekte) oder Berater/innen (?typ=berater) im LiveMatch-Format. */
export async function GET(req: Request) {
    const typ = new URL(req.url).searchParams.get("typ") === "berater" ? "berater" : "projekt"
    const supabase = db()
    if (!supabase) return Response.json({ items: [] }, { status: 404 })
    const { data, error } = await supabase
        .from("match_items")
        .select("title, sub, modules, rate, remote, city, industry, years, lead")
        .eq("kind", typ)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(200)
    if (error) return Response.json({ items: [] }, { status: 500 })
    return Response.json({ items: data }, { headers: cache })
}
