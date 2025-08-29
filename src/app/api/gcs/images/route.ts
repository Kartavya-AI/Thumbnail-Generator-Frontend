// Proxy GET /gcs/images and /gcs/images/{style_name}? via query param
import { remote } from "../../_utils"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const style = searchParams.get("style")
    const upstream = style ? remote(`/gcs/images/${encodeURIComponent(style)}`) : remote("/gcs/images")
    const r = await fetch(upstream, { cache: "no-store" })

    if (!r.ok) {
      const text = await r.text()
      return new Response(text || "Upstream error", { status: r.status })
    }

    const json = await r.json()
    return Response.json(json)
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Failed to load images"
    return Response.json({ success: false, images: [], error: errorMessage }, { status: 500 })
  }
}
