import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

export default defineConfig({
    root: fileURLToPath(new URL(".", import.meta.url)),
    plugins: [react()],
    resolve: { alias: { framer: fileURLToPath(new URL("./framer-shim.ts", import.meta.url)) } },
    server: { host: true, port: 5173 },
})
