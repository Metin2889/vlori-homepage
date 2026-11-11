import { HomePage } from "../../components/HomePage"

export const revalidate = 300

export const metadata = {
    title: "SAP-Expertinnen & Experten direkt finden – ohne Aufschlag",
    description: "Beschreiben Sie Ihr SAP-Projekt in einem Satz und erhalten Sie verifizierte Expert/innen mit nachvollziehbarem Match Score. Ohne Vermittler-Aufschlag.",
    alternates: { canonical: "/unternehmen" },
}

export default function Page() {
    return <HomePage mode="unternehmen" />
}
