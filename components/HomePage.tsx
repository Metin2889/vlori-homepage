import Link from "next/link"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { Bloom } from "./Bloom"
import { LiveMatch, LiveFeed, HeroSearch, CountUp, MatchRing, MatchPlayground, ScrollBloom, RateRadar, EarningsCalculator, JobAlert } from "./framer"
import { buildSchema } from "../framer/code/SeoSchema"
import { CALC, EVENTS, EXPERTS, FAQ, HERO, MODULES, PACKAGES, PLAYGROUND, POSTS, PROJECTS, RADAR, TRUST, type Mode } from "../lib/content"
import { APP_URL, SITE_URL, app } from "../lib/config"
import { hasDb } from "../lib/supabase"

function Arrow() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function SectionHead({ kicker, title, lead, center, dark }: { kicker: string; title: string; lead?: string; center?: boolean; dark?: boolean }) {
    return (
        <div className={"head" + (center ? " head-center" : "")}>
            <div className={"kicker" + (dark ? " kicker-sky" : "")}>{kicker}</div>
            <h2>{title}</h2>
            {lead && <p className="lead">{lead}</p>}
        </div>
    )
}

export function HomePage({ mode }: { mode: Mode }) {
    const hero = HERO[mode]
    const live = hasDb()
    const schema = JSON.stringify(
        buildSchema({
            siteUrl: SITE_URL,
            name: "vlori",
            description: "Das deutschsprachige Netzwerk für SAP-Projekte und SAP-Expertinnen & Experten. Erklärbares Matching, ohne Vermittlungsprovision.",
            logo: SITE_URL + "/icon.svg",
            appUrl: APP_URL,
            sameAs: [],
            faq: FAQ,
        })
    ).replace(/</g, "\\u003c")

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <a className="skip" href="#main">
                Zum Inhalt springen
            </a>
            <Header mode={mode} />
            <main id="main">
                <section className="hero">
                    <div className="wrap hero-grid">
                        <div className="hero-copy">
                            <nav className="switch" aria-label="Zielgruppe">
                                <Link href="/" aria-current={mode === "berater" ? "page" : undefined}>
                                    Für SAP-Berater/innen
                                </Link>
                                <Link href="/unternehmen" aria-current={mode === "unternehmen" ? "page" : undefined}>
                                    Für Unternehmen
                                </Link>
                            </nav>
                            <div className="badge">
                                <span className="dot" aria-hidden="true" /> {hero.badge}
                            </div>
                            <h1>
                                {hero.title[0]} <span>{hero.title[1]}</span>
                            </h1>
                            <p className="lead">{hero.lead}</p>
                            <LiveMatch mode={mode} appUrl={APP_URL} endpoint={live ? `/api/live-match?typ=${mode === "berater" ? "projekte" : "berater"}` : ""} />
                            <div className="hero-ctas">
                                <a className="btn btn-white" href={app("/registrieren?typ=berater")}>
                                    Kostenloses Expertenprofil <Arrow />
                                </a>
                                <a className="btn btn-ghost" href={app("/projekte/neu")}>
                                    Projekt kostenlos veröffentlichen
                                </a>
                            </div>
                        </div>
                        <div className="hero-side">
                            <div className="topmatch">
                                <MatchRing score={hero.topMatch.score} size={64} stroke={6} showLabel={false} />
                                <div>
                                    <div className="kicker">Top-Match</div>
                                    <strong>{hero.topMatch.title}</strong>
                                    <span>{hero.topMatch.meta}</span>
                                </div>
                            </div>
                            <div className="hero-bloom">
                                <Bloom size={300} spin id="hero-bloom" />
                            </div>
                            <LiveFeed dark />
                        </div>
                    </div>
                    <div className="wrap stats">
                        <div>
                            <CountUp value={128} endpoint={live ? "/api/kennzahlen" : ""} path="stats.openProjects" />
                            <span>offene SAP-Projekte</span>
                        </div>
                        <div>
                            <CountUp value={1240} endpoint={live ? "/api/kennzahlen" : ""} path="stats.experts" />
                            <span>SAP-Expertinnen &amp; Experten</span>
                        </div>
                        <div>
                            <CountUp value={MODULES.length} />
                            <span>SAP-Module &amp; Technologien</span>
                        </div>
                        <div>
                            <CountUp value={0} suffix=" %" />
                            <span>Provision &amp; Aufschlag</span>
                        </div>
                    </div>
                </section>

                <section className="sec" id="module">
                    <div className="wrap">
                        <SectionHead kicker="SAP-Module" title="Projekte in allen SAP-Modulen" lead="Suchen Sie direkt nach Stichwort oder springen Sie in ein Modul." />
                        <div className="search">
                            <HeroSearch appUrl={APP_URL} />
                        </div>
                        <ul className="modules">
                            {MODULES.map(([code, name]) => (
                                <li key={code}>
                                    <a href={app(`/${mode === "berater" ? "projekte" : "berater"}?module=${encodeURIComponent(code)}`)}>
                                        <strong>{code}</strong>
                                        <span>{name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="sec sec-gray" id="matching">
                    <div className="wrap">
                        <SectionHead
                            kicker="Matching-Spielwiese"
                            title={PLAYGROUND[mode]}
                            lead="Module, Tagessatz, Remote-Anteil, Branche, Verfügbarkeit: Jede Änderung sortiert die Treffer live neu – mit Begründung für jede Position. Genau so gewichtet die vlori-Matching-Engine."
                        />
                        <MatchPlayground mode={mode} />
                    </div>
                </section>

                <section className="bloom-sec" aria-label="So funktioniert vlori">
                    <ScrollBloom
                        mode={mode}
                        kicker={mode === "berater" ? "So wächst Ihre Karriere" : "So besetzen Sie Projekte"}
                        title={mode === "berater" ? "Von der Saat zur Blüte – in vier Etappen." : "Vom Projekt zum Team – in vier Schritten."}
                    />
                </section>

                <section className="sec sec-navy" id="radar">
                    <div className="wrap">
                        <SectionHead dark kicker="Tagessatz-Radar" title="Was SAP-Wissen gerade wert ist." lead={RADAR[mode]} />
                        <RateRadar appUrl={APP_URL} endpoint={live ? "/api/raten" : ""} />
                    </div>
                </section>

                <section className="sec" id="rechner">
                    <div className="wrap split">
                        <SectionHead kicker={CALC[mode].kicker} title={CALC[mode].title} lead={CALC[mode].lead} />
                        <EarningsCalculator mode={mode} appUrl={APP_URL} />
                    </div>
                </section>

                {mode === "berater" ? (
                    <section className="sec sec-gray" id="projekte">
                        <div className="wrap">
                            <div className="head-row">
                                <SectionHead kicker="Projektbörse" title="Frisch erblühte SAP-Projekte" lead="Die neuesten Ausschreibungen von Unternehmen und Beratungshäusern – mit Tagessatz, Remote-Anteil und Startdatum auf einen Blick." />
                                <a className="more" href={app("/projekte")}>
                                    Alle Projekte <Arrow />
                                </a>
                            </div>
                            <div className="cards4">
                                {PROJECTS.map((p) => (
                                    <a key={p.title} className="card project" href={app(`/projekte?module=${encodeURIComponent(p.module)}`)}>
                                        <div className="card-top">
                                            <span className="mono">{p.tags}</span>
                                            <span className="pill">{p.badge}</span>
                                        </div>
                                        <h3>{p.title}</h3>
                                        <p>{p.org}</p>
                                        <ul>
                                            <li>{p.city}</li>
                                            <li>{p.remote}</li>
                                            <li>
                                                <strong>{p.rate}</strong>
                                            </li>
                                            <li>{p.start}</li>
                                        </ul>
                                    </a>
                                ))}
                            </div>
                            <div className="alert-box" id="projekt-alarm">
                                <div>
                                    <div className="kicker">Projekt-Alarm</div>
                                    <h3>Nie wieder ein passendes Projekt verpassen.</h3>
                                    <p>Neue SAP-Projekte für Ihre Module landen automatisch in Ihrem Postfach – kostenlos und jederzeit abbestellbar.</p>
                                </div>
                                <JobAlert appUrl={APP_URL} endpoint={live ? "/api/projekt-alarm" : ""} privacyUrl={app("/info/datenschutz")} />
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="sec sec-gray" id="experten">
                        <div className="wrap">
                            <div className="head-row">
                                <SectionHead kicker="Expertennetzwerk" title="Karrieren in voller Blüte" lead="Verifizierte SAP-Expertinnen und -Experten mit den besten Bewertungen im Netzwerk." />
                                <a className="more" href={app("/berater")}>
                                    Beratersuche <Arrow />
                                </a>
                            </div>
                            <div className="cards4">
                                {EXPERTS.map((x) => (
                                    <a key={x.name} className="card expert" href={app("/berater")}>
                                        <div className="card-top">
                                            <span className="avatar" aria-hidden="true">
                                                {x.initials}
                                            </span>
                                            <span className="pill">★ {x.rating}</span>
                                        </div>
                                        <h3>{x.name}</h3>
                                        <p>{x.role}</p>
                                        <span className="mono">{x.tags}</span>
                                        <small>{x.meta}</small>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="sec" id="community">
                    <div className="wrap two">
                        <div>
                            <SectionHead kicker="Community & Wissen" title="Wissen, das weiterwächst" />
                            <ul className="list">
                                {POSTS.map((p) => (
                                    <li key={p.title}>
                                        <a href={app("/community")}>
                                            <span className="mono accent">{p.kind}</span>
                                            <strong>{p.title}</strong>
                                            <small>{p.meta}</small>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <a className="more" href={app("/community")}>
                                Zur Community <Arrow />
                            </a>
                        </div>
                        <div>
                            <SectionHead kicker="Events" title="Webinare & Stammtische" />
                            <ul className="list">
                                {EVENTS.map((e) => (
                                    <li key={e.title}>
                                        <a href={app("/wissen")} className="event">
                                            <span className="date">
                                                <strong>{e.day}</strong>
                                                {e.month}
                                            </span>
                                            <span>
                                                <strong>{e.title}</strong>
                                                <small>{e.meta}</small>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <a className="more" href={app("/wissen")}>
                                Alle Events &amp; News <Arrow />
                            </a>
                        </div>
                    </div>
                </section>

                <section className="sec sec-gray" id="vertrauen">
                    <div className="wrap">
                        <SectionHead kicker="Vertrauen & Qualität" title="Gesundes Wachstum braucht guten Boden." />
                        <div className="cards4">
                            {TRUST.map((t) => (
                                <div key={t.title} className="card trust">
                                    <h3>{t.title}</h3>
                                    <p>{t.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="sec" id="faq">
                    <div className="wrap faq-grid">
                        <div className="head">
                            <div className="kicker">FAQ</div>
                            <h2>Häufige Fragen</h2>
                            <p className="lead">
                                Noch etwas offen? <a href={app("/info/kontakt")}>Schreiben Sie uns</a> – wir antworten in der Regel am selben Tag.
                            </p>
                        </div>
                        <div className="faq">
                            {FAQ.map((f, i) => (
                                <details key={f.question} open={i === 0}>
                                    <summary>{f.question}</summary>
                                    <p>{f.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="sec sec-gray" id="pakete">
                    <div className="wrap">
                        <SectionHead
                            center
                            kicker="Pakete"
                            title="Kostenlos starten. Ohne Vermittlungsprovision."
                            lead="Alle Kernfunktionen sind in der Startphase kostenlos. Optionale Zusatzpakete folgen – die kostenlose Nutzung bleibt uneingeschränkt."
                        />
                        <div className="packages">
                            {PACKAGES.map((p) => (
                                <div key={p.name} className={"package" + (p.featured ? " package-featured" : "")}>
                                    <div className="card-top">
                                        <h3>{p.name}</h3>
                                        <span className="pill">{p.badge}</span>
                                    </div>
                                    <div className="price">{p.price}</div>
                                    <small>{p.note}</small>
                                    <ul>
                                        {p.items.map((it) => (
                                            <li key={it}>{it}</li>
                                        ))}
                                    </ul>
                                    <a className={"btn " + (p.featured ? "btn-primary" : "btn-outline")} href={app(p.href === "/registrieren" ? `/registrieren?typ=${mode}` : p.href)}>
                                        {p.cta}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="sec">
                    <div className="wrap">
                        <div className="cta">
                            <Bloom size={170} spin id="cta-bloom" />
                            <div>
                                <h2>Pflanzen Sie heute den Samen für Ihr nächstes Projekt.</h2>
                                <p>Kostenlos registrieren – als Beraterin, Berater oder Unternehmen. In zwei Minuten startklar.</p>
                                <div className="hero-ctas">
                                    <a className="btn btn-white" href={app("/registrieren?typ=berater")}>
                                        Als SAP-Berater/in starten <Arrow />
                                    </a>
                                    <a className="btn btn-navy" href={app("/registrieren?typ=unternehmen")}>
                                        Als Unternehmen starten
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
