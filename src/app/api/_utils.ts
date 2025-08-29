// Utilities for proxying to the remote API
const BASE = "https://thumbnail-generator-977121587860.asia-south2.run.app"

export function remote(path: string) {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`
}
