import * as React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import HeroSearch from "../framer/code/HeroSearch"
import CountUp from "../framer/code/CountUp"
import MatchRing from "../framer/code/MatchRing"
import LiveMatch from "../framer/code/LiveMatch"
import LiveFeed from "../framer/code/LiveFeed"
import MatchPlayground from "../framer/code/MatchPlayground"
import ScrollBloom from "../framer/code/ScrollBloom"
import RateRadar from "../framer/code/RateRadar"
import EarningsCalculator, { calc } from "../framer/code/EarningsCalculator"
import JobAlert from "../framer/code/JobAlert"
import SeoSchema from "../framer/code/SeoSchema"

beforeAll(() => {
    ;(globalThis as any).IntersectionObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    ;(globalThis as any).ResizeObserver ??= class {
        observe() {}
        disconnect() {}
    }
    window.matchMedia ??= ((q: string) => ({
        matches: false,
        media: q,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
    })) as any
})
afterEach(cleanup)

const ALL: [string, React.ComponentType<any>][] = [
    ["HeroSearch", HeroSearch],
    ["CountUp", CountUp],
    ["MatchRing", MatchRing],
    ["LiveMatch", LiveMatch],
    ["LiveFeed", LiveFeed],
    ["MatchPlayground", MatchPlayground],
    ["ScrollBloom", ScrollBloom],
    ["RateRadar", RateRadar],
    ["EarningsCalculator", EarningsCalculator],
    ["JobAlert", JobAlert],
    ["SeoSchema", SeoSchema],
]

describe.each(ALL)("%s", (_name, C) => {
    it("rendert ohne Props (Standardwerte greifen)", () => {
        expect(() => render(<C />)).not.toThrow()
    })
    it("rendert in der Unternehmens-Sicht", () => {
        expect(() => render(<C mode="unternehmen" />)).not.toThrow()
    })
})

describe("MatchPlayground", () => {
    it("Schalter ist per Tastatur bedienbar und ändert den Zustand", () => {
        render(<MatchPlayground />)
        const sw = screen.getByRole("switch")
        expect(sw.getAttribute("aria-checked")).toBe("false")
        fireEvent.click(sw)
        expect(sw.getAttribute("aria-checked")).toBe("true")
        expect(sw.tagName).toBe("BUTTON")
    })
})

describe("MatchRing", () => {
    it("begrenzt den Score auf 0–100", () => {
        render(<MatchRing score={140} />)
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Match Score 100 von 100")
    })
})

describe("LiveMatch", () => {
    it("verlinkt die Registrierung mit typ= wie der Rest der Seite", () => {
        render(<LiveMatch autoType={false} />)
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "FI/CO, 1.100 €" } })
        const href = screen.getByRole("link").getAttribute("href")!
        expect(href).toContain("/registrieren?typ=berater")
        expect(href).toContain("q=FI%2FCO")
    })
})

describe("EarningsCalculator.calc", () => {
    it("rechnet Provision und Mehrverdienst korrekt", () => {
        expect(calc(1000, 200, 20)).toEqual({ gross: 200000, agency: 160000, diff: 40000 })
    })
})

describe("SeoSchema", () => {
    it("gibt gültiges JSON-LD mit FAQPage aus", () => {
        const { container } = render(<SeoSchema />)
        const json = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!)
        const types = json["@graph"].map((n: any) => n["@type"])
        expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "FAQPage"]))
    })
})

describe("JobAlert", () => {
    it("ohne Endpunkt leitet es mit den gewählten Modulen in die App", () => {
        const assign = vi.fn()
        Object.defineProperty(window, "location", { value: { ...window.location, assign }, writable: true })
        render(<JobAlert />)
        fireEvent.click(screen.getByRole("button", { name: "EWM" }))
        fireEvent.change(screen.getByLabelText("E-Mail-Adresse"), { target: { value: "a@b.de" } })
        fireEvent.click(screen.getByLabelText(/Projekte per E-Mail erhalten/))
        fireEvent.submit(screen.getByRole("form"))
        expect(assign).toHaveBeenCalledWith(expect.stringContaining("https://app.vlori.de/registrieren?typ=berater&suchauftrag=1&module="))
        expect(assign.mock.calls[0][0]).toContain("EWM")
        expect(assign.mock.calls[0][0]).not.toContain("a%40b.de")
    })
})
