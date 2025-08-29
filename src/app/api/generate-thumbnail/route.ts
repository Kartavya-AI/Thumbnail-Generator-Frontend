// Proxy POST /generate-thumbnail
import { remote } from "../_utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const r = await fetch(remote("/generate-thumbnail"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!r.ok) {
      const text = await r.text()
      return new Response(text || "Upstream error", { status: r.status })
    }
    const json = await r.json()
    return Response.json(json)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to generate thumbnail"
    return Response.json({ error: message }, { status: 500 })
  }
}
