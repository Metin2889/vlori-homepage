import type { MetadataRoute } from "next"
import { SITE_URL } from "../lib/config"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: SITE_URL + "/", changeFrequency: "daily", priority: 1 },
        { url: SITE_URL + "/unternehmen", changeFrequency: "daily", priority: 0.9 },
    ]
}
