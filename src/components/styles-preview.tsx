"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const thumbnails = [
  "/abstract-geometric-shapes.png",
  "/clean-thumbnail.png",
  "/ai-generated-8189352_1280.png",
  "/variety-principle-of-design-1.jpg",
  "/thumbnail-preview-grid.png",
  "/anime-style-mythical-dragon-creature_23-2151112867.avif",
]

export function StylesPreview() {
  const styles = [
    { id: "1", name: "Abstract", ideogram_value: "abstract" },
    { id: "2", name: "Clean", ideogram_value: "clean" },
    { id: "3", name: "AI Generated", ideogram_value: "ai" },
    { id: "4", name: "Variety", ideogram_value: "variety" },
    { id: "5", name: "Grid", ideogram_value: "grid" },
    { id: "6", name: "Anime", ideogram_value: "anime" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {styles.map((s, i) => (
        <Card
          key={s.id}
          className="bg-white border-zinc-200 hover:border-cyan-300 transition"
        >
          <CardHeader>
            <CardTitle className="text-lg">{s.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Image
              src={thumbnails[i % thumbnails.length]}
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
