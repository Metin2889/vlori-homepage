import Link from "next/link"
import { Bloom } from "../../components/Bloom"

export const metadata = { title: "Projekt-Alarm", robots: { index: false } }

const TEXT: Record<string, [string, string]> = {
    bestaetigt: ["Projekt-Alarm bestätigt.", "Ab sofort melden wir Ihnen passende SAP-Projekte per E-Mail. Abmelden können Sie sich jederzeit über den Link in jeder E-Mail."],
    abgemeldet: ["Sie sind abgemeldet.", "Ihr Projekt-Alarm wurde gelöscht. Sie erhalten keine weiteren E-Mails von uns."],
    fehler: ["Dieser Link ist ungültig.", "Der Link ist abgelaufen oder wurde bereits verwendet. Sie können den Projekt-Alarm auf der Startseite neu einrichten."],
}

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const { status } = await searchParams
    const [title, text] = TEXT[status ?? ""] ?? TEXT.fehler
    return (
        <main className="status-page">
            <Bloom size={120} id="status" />
            <h1>{title}</h1>
            <p>{text}</p>
            <Link className="btn btn-primary" href="/">
                Zur Startseite
            </Link>
        </main>
    )
}
