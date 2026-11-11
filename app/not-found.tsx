import Link from "next/link"
import { Bloom } from "../components/Bloom"

export default function NotFound() {
    return (
        <main className="status-page">
            <Bloom size={120} id="nf" />
            <h1>Seite nicht gefunden.</h1>
            <p>Diese Seite ist (noch) nicht erblüht.</p>
            <Link className="btn btn-primary" href="/">
                Zur Startseite
            </Link>
        </main>
    )
}
