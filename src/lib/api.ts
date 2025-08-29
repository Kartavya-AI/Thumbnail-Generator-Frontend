// Simple helpers for SWR and fetch calls

export const fetcherJSON = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: "same-origin" })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export const postJSON = async <TResponse, TBody = unknown>(
  url: string,
  body: TBody
): Promise<TResponse> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<TResponse>
}

export const uploadFormData = async (url: string, formData: FormData): Promise<string> => {
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Upload failed: ${res.status}`)
  }
  return res.text()
}
