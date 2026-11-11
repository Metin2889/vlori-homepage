import Link from "next/link"
import { Logo } from "./Bloom"
import { NAV, type Mode } from "../lib/content"
import { app } from "../lib/config"

export function Header({ mode }: { mode: Mode }) {
    const other = mode === "berater" ? { href: "/unternehmen", label: "Für Unternehmen" } : { href: "/", label: "Für SAP-Berater/innen" }
    const signup = app(`/registrieren?typ=${mode}`)
    return (
        <>
            <div className="utility">
                <div className="wrap utility-in">
                    <span>
                        <span className="utility-dot" aria-hidden="true" /> Neu: Suchaufträge melden passende SAP-Projekte jeden Morgen um 07:00
                    </span>
                    <nav aria-label="Service" className="utility-links">
                        <Link href={other.href}>{other.label}</Link>
                        <a href={app("/info/kontakt")}>Hilfe &amp; Kontakt</a>
                        <span>DE</span>
                    </nav>
                </div>
            </div>
            <header className="header">
                <div className="wrap header-in">
                    <Link href={mode === "berater" ? "/" : "/unternehmen"} aria-label="vlori Startseite">
                        <Logo />
                    </Link>
                    <nav aria-label="Hauptnavigation" className="nav">
                        {NAV.map(([label, path]) => (
                            <a key={path} href={app(path)}>
                                {label}
                            </a>
                        ))}
                    </nav>
                    <div className="header-cta">
                        <a className="link-strong" href={app("/login")}>
                            Anmelden
                        </a>
                        <a className="btn btn-primary" href={signup}>
                            Kostenlos starten
                        </a>
                    </div>
                    <details className="burger">
                        <summary aria-label="Menü öffnen">
                            <span />
                            <span />
                            <span />
                        </summary>
                        <nav aria-label="Mobile Navigation" className="burger-menu">
                            {NAV.map(([label, path]) => (
                                <a key={path} href={app(path)}>
                                    {label}
                                </a>
                            ))}
                            <Link href={other.href}>{other.label}</Link>
                            <a href={app("/login")}>Anmelden</a>
                            <a className="btn btn-primary" href={signup}>
                                Kostenlos starten
                            </a>
                        </nav>
                    </details>
                </div>
            </header>
        </>
    )
}
