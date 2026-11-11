import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
    resolve: { alias: { framer: fileURLToPath(new URL("./preview/framer-shim.ts", import.meta.url)) } },
    test: { environment: "jsdom", globals: true, include: ["tests/**/*.test.{ts,tsx}"] },
})
