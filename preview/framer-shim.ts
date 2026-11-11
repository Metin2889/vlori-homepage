// Minimal stand-in for the "framer" package so the code components run outside Framer.
export const ControlType = {
    String: "string",
    Number: "number",
    Boolean: "boolean",
    Color: "color",
    Enum: "enum",
    Array: "array",
    Object: "object",
    Link: "link",
    Font: "font",
} as const

export const RenderTarget = {
    canvas: "CANVAS",
    export: "EXPORT",
    thumbnail: "THUMBNAIL",
    preview: "PREVIEW",
    current: () => ((globalThis as any).__FRAMER_RENDER_TARGET__ ?? "PREVIEW") as string,
}

export const propertyControls = new Map<unknown, Record<string, any>>()

export function addPropertyControls(component: unknown, controls: Record<string, any>) {
    propertyControls.set(component, controls)
}
