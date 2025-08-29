// Proxy DELETE /gcs/images/{blob_name}
// We accept POST { blob_name } to avoid issues passing slashes in dynamic route segments.
import { remote } from "../../_utils"

export async function POST(req: Request): Promise<Response> {
  try {
    const { blob_name }: { blob_name?: string } = await req.json()

    if (!blob_name) {
      return Response.json(
        { success: false, error: "Missing blob_name" },
        { status: 400 }
      )
    }

    const url = remote(
      `/gcs/images/${blob_name.split("/").map(encodeURIComponent).join("/")}`
    )

    const r = await fetch(url, { method: "DELETE" })
    const text = await r.text()

    try {
      const json = JSON.parse(text) as Record<string, unknown>
      return Response.json(json, { status: r.status })
    } catch {
      // Fallback to normalized shape
      return Response.json(
        { success: r.ok, message: text, error: r.ok ? null : text },
        { status: r.status }
      )
    }
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to delete image"
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
