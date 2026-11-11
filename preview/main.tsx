import * as React from "react"
import { createRoot } from "react-dom/client"
import HeroSearch from "../framer/code/HeroSearch"
import CountUp from "../framer/code/CountUp"
import MatchRing from "../framer/code/MatchRing"
import LiveMatch from "../framer/code/LiveMatch"
import LiveFeed from "../framer/code/LiveFeed"
import MatchPlayground from "../framer/code/MatchPlayground"
import ScrollBloom from "../framer/code/ScrollBloom"
import RateRadar from "../framer/code/RateRadar"
import EarningsCalculator from "../framer/code/EarningsCalculator"
import JobAlert from "../framer/code/JobAlert"
import SeoSchema from "../framer/code/SeoSchema"

function withDefaults(C: any, props: Record<string, unknown> = {}) {
    return <C {...props} />
}

const mode = new URLSearchParams(location.search).get("sicht") === "unternehmen" ? "unternehmen" : "berater"

function App() {
    return (
        <>
            <div className="navy">
                <section className="sec" id="hero">
                    <h2 style={{ color: "#8CCBFF" }}>LiveMatch · LiveFeed · HeroSearch</h2>
                    <div className="row" style={{ alignItems: "flex-start" }}>
                        <div style={{ flex: "1 1 520px", minWidth: 0, maxWidth: 600 }}>{withDefaults(LiveMatch, { mode })}</div>
                        <div style={{ flex: "1 1 320px", minWidth: 0, maxWidth: 420 }}>{withDefaults(LiveFeed)}</div>
                    </div>
                    <div style={{ maxWidth: 620, marginTop: 32 }}>{withDefaults(HeroSearch)}</div>
                    <div className="row" style={{ marginTop: 32 }}>
                        {withDefaults(CountUp, { value: 1284 })}
                        {withDefaults(CountUp, { value: 23, suffix: " Module" })}
                    </div>
                </section>
            </div>
            <section className="sec" id="playground">
                <h2>MatchPlayground</h2>
                {withDefaults(MatchPlayground, { mode })}
            </section>
            <section className="sec" id="ring">
                <h2>MatchRing</h2>
                {withDefaults(MatchRing)}
            </section>
            <section id="bloom" style={{ height: 2400 }}>
                {withDefaults(ScrollBloom, { mode })}
            </section>
            <section className="sec" id="radar">
                <h2>RateRadar</h2>
                {withDefaults(RateRadar)}
            </section>
            <section className="sec" id="rechner">
                <h2>EarningsCalculator</h2>
                {withDefaults(EarningsCalculator, { mode })}
            </section>
            <section className="sec" id="alarm">
                <h2>JobAlert</h2>
                <div style={{ maxWidth: 720 }}>{withDefaults(JobAlert)}</div>
            </section>
            {withDefaults(SeoSchema)}
        </>
    )
}

createRoot(document.getElementById("root")!).render(<App />)
