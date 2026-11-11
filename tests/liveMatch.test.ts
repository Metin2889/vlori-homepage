import { parse, score } from "../framer/code/LiveMatch"

describe("LiveMatch.parse", () => {
    it("erkennt alle Kriterien im Beispielsatz", () => {
        expect(parse("Senior FI/CO-Beraterin, 12 Jahre S/4HANA, 1.100 €, 80 % remote, München, ab März")).toEqual({
            modules: ["S/4HANA", "FI", "CO"],
            years: 12,
            rate: 1100,
            remote: 80,
            city: "München",
            level: "Senior",
            start: "ab März",
        })
    })

    it("liest Budget, Branche und Lead-Level", () => {
        const p = parse("S/4HANA Finance-Architekt, mind. 10 Jahre, München, Automotive, Budget 1.300 €")
        expect(p.rate).toBe(1300)
        expect(p.years).toBe(10)
        expect(p.industry).toBe("Automotive")
        expect(p.level).toBe("Lead / Architektur")
    })

    it("ignoriert Nachkommastellen beim Tagessatz", () => {
        expect(parse("1.100,50 € pro Tag, Basis").rate).toBe(1100)
    })

    it("versteht „100 % vor Ort“ als 0 % remote", () => {
        expect(parse("SAP HR Payroll, 100% vor Ort, Frankfurt").remote).toBe(0)
        expect(parse("ABAP, 60 % onsite").remote).toBe(40)
    })

    it("liest „Co-Lead“ nicht als Controlling", () => {
        const p = parse("Co-Lead für PM Instandhaltung, 1100€")
        expect(p.modules).toEqual(["PM"])
        expect(p.level).toBe("Lead / Architektur")
    })

    it("hält Jahreszahlen nicht für Tagessätze", () => {
        expect(parse("S/4HANA 2023 Migration, 90 % remote").rate).toBeUndefined()
    })

    it("erkennt hybrid, sofort und Quartale", () => {
        expect(parse("EWM, hybrid, ab sofort")).toMatchObject({ remote: 50, start: "ab sofort" })
        expect(parse("Tagessatz 1.200, S/4 Brownfield, Q2 2027")).toMatchObject({ rate: 1200, start: "ab Q2" })
    })
})

describe("LiveMatch.score", () => {
    const item = { title: "X", sub: "", modules: ["FI", "CO"], rate: 1200, remote: 80, city: "München", industry: "Pharma", years: 8 }

    it("liegt immer zwischen 38 und 99", () => {
        const best = score(parse("FI CO 1000 € 50 % remote München Pharma 10 Jahre"), item, "berater")
        const worst = score(parse("ABAP 2000 € 100 % remote Hamburg Bank 1 Jahre"), item, "berater")
        expect(best.score).toBeLessThanOrEqual(99)
        expect(worst.score).toBeGreaterThanOrEqual(38)
        expect(best.score).toBeGreaterThan(worst.score)
    })

    it("begründet Treffer und Lücken", () => {
        const r = score(parse("FI, 1.300 €, 100 % remote"), item, "berater")
        expect(r.good).toContain("FI")
        expect(r.bad).toContain("CO gefragt")
        expect(r.bad.some((b) => b.includes("unter Wunsch"))).toBe(true)
    })

    it("stürzt bei Live-Daten ohne Ort nicht ab", () => {
        const noCity = { ...item, city: undefined as unknown as string }
        expect(() => score(parse("FI München"), noCity, "unternehmen")).not.toThrow()
    })
})
