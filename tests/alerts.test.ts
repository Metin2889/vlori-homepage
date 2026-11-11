// @vitest-environment node
import { parseAlert, confirmMail } from "../lib/alerts"
import { POST } from "../app/api/projekt-alarm/route"
import { GET as raten } from "../app/api/raten/route"

const valid = { email: " Lena@Example.de ", modules: ["FI", "CO", "FI"], remote: true, consent: true, source: "homepage" }

describe("parseAlert", () => {
    it("normalises a valid body", () => {
        const r = parseAlert(valid)
        expect(r).toEqual({ ok: true, data: { email: "lena@example.de", modules: ["FI", "CO"], remote: true, source: "homepage" } })
    })
    it.each([
        [null, "Ungültige Anfrage."],
        [{ ...valid, email: "kein-mail" }, "E-Mail"],
        [{ ...valid, consent: "true" }, "Einwilligung"],
        [{ ...valid, modules: [] }, "Modul"],
        [{ ...valid, modules: [42, ""] }, "Modul"],
    ])("rejects %j", (body, msg) => {
        const r = parseAlert(body)
        expect(r.ok).toBe(false)
        if (!r.ok) expect(r.error).toContain(msg)
    })
    it("caps module count and length", () => {
        const many = Array.from({ length: 30 }, (_, i) => "M" + i).concat("x".repeat(41))
        const r = parseAlert({ ...valid, modules: many })
        expect(r.ok && r.data.modules.length).toBe(20)
    })
})

describe("confirmMail", () => {
    it("contains confirm and unsubscribe links", () => {
        const m = confirmMail("https://x/c", "https://x/u", ["EWM"])
        expect(m.text).toContain("https://x/c")
        expect(m.text).toContain("https://x/u")
        expect(m.text).toContain("EWM")
    })
})

describe("API without database", () => {
    const req = (body: unknown) => new Request("http://localhost/api/projekt-alarm", { method: "POST", body: JSON.stringify(body) })
    it("returns 400 for invalid input", async () => {
        expect((await POST(req({ email: "x" }))).status).toBe(400)
    })
    it("returns 503 for valid input when Supabase is not configured", async () => {
        expect((await POST(req(valid))).status).toBe(503)
    })
    it("rate endpoint returns 404 so the component keeps its sample data", async () => {
        expect((await raten()).status).toBe(404)
    })
})
