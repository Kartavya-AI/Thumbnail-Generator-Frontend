"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetcherJSON } from "@/lib/api"
import type { Style } from "@/lib/types"
import Image from "next/image"

type StylesResponse =
  | Style[]
  | { styles?: Style[]; data?: Style[]; result?: Style[] }

export function StylesPreview() {
  const { data, isLoading, error } = useSWR<StylesResponse>("/api/styles", fetcherJSON)

  // Robust normalization so we never call .map on non-arrays
  const styles = useMemo<Style[]>(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if ("styles" in data && Array.isArray(data.styles)) return data.styles
    if ("data" in data && Array.isArray(data.data)) return data.data
    if ("result" in data && Array.isArray(data.result)) return data.result
    return []
  }, [data])

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-xl bg-zinc-100 border border-zinc-200 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-zinc-500">Failed to load styles.</div>
  }

  if (!styles.length) {
    return <div className="text-sm text-zinc-500">No styles available.</div>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {styles.map((s) => (
        <Card
          key={s.id}
          className="bg-white border-zinc-200 hover:border-cyan-300 transition"
        >
          <CardHeader>
            <CardTitle className="text-lg">{s.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Image
              src={
                "/placeholder.svg?height=180&width=320&query=thumbnail%20style%20example%20with%20cyan%20accents"
              }
              alt={`${s.name} style example`}
              className="w-full h-auto rounded-md ring-1 ring-zinc-200"
              width={320}
              height={180}
            />
            <div className="text-xs text-zinc-500">
              Engine value: {s.ideogram_value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
