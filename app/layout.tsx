import type { Metadata, Viewport } from "next"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "@fontsource/geist-mono/400.css"
import "@fontsource/geist-mono/500.css"
import "./globals.css"
import { SITE_URL } from "../lib/config"

const description =
    "SAP-Projekte und SAP-Expertinnen & Experten im DACH-Raum – mit erklärbarem Match Score, direktem Kontakt und ohne Vermittlungsprovision."

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: "vlori – SAP-Projekte & SAP-Expertinnen im DACH-Raum", template: "%s · vlori" },
    description,
    openGraph: { type: "website", locale: "de_DE", siteName: "vlori", title: "vlori – SAP-Projekte ohne Provision", description },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
}

export const viewport: Viewport = { themeColor: "#00144A", width: "device-width", initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
            <body>{children}</body>
        </html>
    )
}
