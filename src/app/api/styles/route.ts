// Proxy GET /styles
import { remote } from "../_utils"

export async function GET() {
  try {
    const r = await fetch(remote("/styles"), { cache: "no-store" })
    if (!r.ok) {
      const text = await r.text()
      return new Response(text || "Upstream error", { status: r.status })
    }
    const json = await r.json()

    // Normalize various possible shapes into an array
    const styles = Array.isArray(json)
      ? json
      : Array.isArray(json?.styles)
        ? json.styles
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.result)
            ? json.result
            : []

    // Always respond with an array
    return Response.json(styles)
  } catch (e) {
    const err = e instanceof Error ? e.message : "Failed to fetch styles"
    return Response.json({ error: err }, { status: 500 })
  }
}
