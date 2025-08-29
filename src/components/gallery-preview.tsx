"use client";

import useSWR from "swr";
import { fetcherJSON } from "@/lib/api";
import type { GalleryResponse } from "@/lib/types";
import Image from "next/image";

export function GalleryPreview() {
    const { data, isLoading } = useSWR<GalleryResponse>(
        "/api/gcs/images",
        fetcherJSON
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[16/10] rounded-md bg-zinc-900 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    const previews = (data?.images ?? []).slice(0, 8);
    if (previews.length === 0) {
        return (
            <div className="text-sm text-zinc-400">
                No images yet. Generate one to see it here.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previews.map((img, i) => (
                <Image
                    key={img.blob_name || `${img.url}-${i}`}
                    src={img.url || "/placeholder.svg"}
                    alt={`Thumbnail ${img.style || ""}`}
                    className="w-full h-auto rounded-md ring-1 ring-zinc-800"
                    width={300}
                    height={300}
                />
            ))}
        </div>
    );
}
