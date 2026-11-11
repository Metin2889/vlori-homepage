const trim = (u: string) => u.replace(/\/+$/, "")

/** Floot-App (Login, Registrierung, Projekte). Auf Vercel per NEXT_PUBLIC_APP_URL überschreiben. */
export const APP_URL = trim(process.env.NEXT_PUBLIC_APP_URL || "https://app.vlori.de")

/** Öffentliche Adresse dieser Website (für SEO, Sitemap, Bestätigungslinks). */
export const SITE_URL = trim(
    process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "http://localhost:3000")
)

export const app = (path: string) => APP_URL + path
