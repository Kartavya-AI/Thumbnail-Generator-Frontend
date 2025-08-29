// Proxy POST /gcs/upload (multipart/form-data)
import { remote } from "../../_utils"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    const style = form.get("style") || "design"

    if (!(file instanceof Blob)) {
      return new Response("Missing file", { status: 400 })
    }

    const upstreamForm = new FormData()
    upstreamForm.append("file", file)
    upstreamForm.append("style", String(style))

    const r = await fetch(remote("/gcs/upload"), {
      method: "POST",
      body: upstreamForm,
    })

    const text = await r.text()
    return new Response(text, { status: r.status })
  } catch (e: unknown) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 500 })
    }
    return new Response("Upload failed", { status: 500 })
  }
}
