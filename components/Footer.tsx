import { Logo } from "./Bloom"
import { FOOTER } from "../lib/content"
import { app } from "../lib/config"

export function Footer() {
    return (
        <footer className="footer">
            <div className="wrap">
                <div className="footer-grid">
                    <div>
                        <Logo />
                        <p>Das deutschsprachige Netzwerk für SAP-Projekte und SAP-Expertinnen &amp; Experten. Erklärbares Matching, ohne Vermittlungsprovision.</p>
                    </div>
                    {FOOTER.map(([title, links]) => (
                        <nav key={title} aria-label={title}>
                            <div className="kicker kicker-sky">{title}</div>
                            {links.map(([label, path]) => (
                                <a key={path} href={app(path)}>
                                    {label}
                                </a>
                            ))}
                        </nav>
                    ))}
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} vlori · Made in Köln</span>
                    <span>vlori ist eine unabhängige Plattform und wird nicht von der SAP SE betrieben, gesponsert oder offiziell unterstützt.</span>
                </div>
            </div>
        </footer>
    )
}
