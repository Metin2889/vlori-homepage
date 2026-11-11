import { fileURLToPath } from "node:url"

const securityHeaders = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    eslint: { ignoreDuringBuilds: true },
    webpack(config) {
        config.resolve.alias.framer = fileURLToPath(new URL("./preview/framer-shim.ts", import.meta.url))
        return config
    },
    async headers() {
        return [{ source: "/(.*)", headers: securityHeaders }]
    },
}

export default nextConfig
