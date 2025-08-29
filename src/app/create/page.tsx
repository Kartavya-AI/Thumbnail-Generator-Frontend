"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

import { fetcherJSON, postJSON, uploadFormData } from "@/lib/api";
import type { Style, GenerateResponse, GalleryResponse } from "@/lib/types";
import Image from "next/image";

export default function CreatePage() {
    const { data: styles, isLoading: stylesLoading } = useSWR<
        Style[] | { styles?: Style[] }
    >("/api/styles", fetcherJSON);
    const [title, setTitle] = useState("");
    const [styleId, setStyleId] = useState<string>("");
    const [enhance, setEnhance] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<GenerateResponse | null>(null);

    const styleOptions = useMemo<Style[]>(() => {
        if (Array.isArray(styles)) return styles;
        if (styles && "styles" in styles && Array.isArray(styles.styles))
            return styles.styles;
        return [];
    }, [styles]);

    async function handleGenerate() {
        if (!title || !styleId) {
            toast("Missing fields", {
                description: "Please add a title and select a style.",
            });
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                video_title: title,
                style_id: Number(styleId),
                enhance_prompt: enhance,
            };
            const res = await postJSON<GenerateResponse>(
                "/api/generate-thumbnail",
                payload
            );
            setResult(res);
            if (res?.success !== false) {
                toast("Generated", {
                    description: "Thumbnail created and stored in GCS.",
                });
            } else {
                toast("Generation failed", {
                    description: res?.error || "Unknown error",
                });
            }
        } catch (e) {
            const err = e instanceof Error ? e.message : "Something went wrong";
            toast("Error", { description: err });
        } finally {
            setSubmitting(false);
        }
    }

    // Gallery
    const [activeStyle, setActiveStyle] = useState<string>("all");
    const imagesUrl =
        activeStyle === "all"
            ? "/api/gcs/images"
            : `/api/gcs/images?style=${encodeURIComponent(activeStyle)}`;
    const {
        data: gallery,
        isLoading: galleryLoading,
        mutate,
    } = useSWR<GalleryResponse>(imagesUrl, fetcherJSON);

    async function handleDelete(blob: string) {
        try {
            const res = await postJSON<{
                success: boolean;
                message?: string;
                error?: string;
            }>("/api/gcs/delete", {
                blob_name: blob,
            });
            if (res.success) {
                toast("Deleted", {
                    description: res.message || "Image removed from GCS",
                });
                mutate();
            } else {
                toast("Delete failed", {
                    description: res.error || "Could not delete image",
                });
            }
        } catch (e) {
            const err =
                e instanceof Error ? e.message : "Failed to delete image";
            toast("Error", { description: err });
        }
    }

    // Upload
    const [uploading, setUploading] = useState(false);
    const [uploadStyle, setUploadStyle] = useState<string>("design");
    const [file, setFile] = useState<File | null>(null);

    async function handleUpload() {
        if (!file) {
            toast("No file selected", {
                description: "Choose a PNG or JPG to upload.",
            });
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("style", uploadStyle || "design");
            const text = await uploadFormData("/api/gcs/upload", fd);
            toast("Uploaded", { description: text || "Image uploaded to GCS" });
            setFile(null);
            mutate();
        } catch (e) {
            const err =
                e instanceof Error ? e.message : "Could not upload file";
            toast("Upload failed", { description: err });
        } finally {
            setUploading(false);
        }
    }

    return (
        <main className="min-h-screen bg-white text-zinc-900 font-sans">
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-semibold text-pretty">
                            Create a Thumbnail
                        </h1>
                        <p className="text-zinc-600 mt-2">
                            Generate a thumbnail from your prompt and save to
                            Google Cloud Storage.
                        </p>
                    </div>
                    <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200">
                        Generator
                    </Badge>
                </div>

                <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] mt-10">
                    {/* Generator Form */}
                    <Card className="bg-white border-zinc-200">
                        <CardHeader>
                            <CardTitle>Prompt & Style</CardTitle>
                            <CardDescription>
                                Use prompt enhancement to add cinematic details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Video title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., feed street dogs"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-white border-zinc-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Style</Label>
                                <Select
                                    value={styleId}
                                    onValueChange={setStyleId}
                                    disabled={stylesLoading}
                                >
                                    <SelectTrigger className="bg-white border-zinc-200">
                                        <SelectValue
                                            placeholder={
                                                stylesLoading
                                                    ? "Loading styles..."
                                                    : "Select a style"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-zinc-200">
                                        {styleOptions.map((s) => (
                                            <SelectItem
                                                key={s.id}
                                                value={String(s.id)}
                                            >
                                                {s.name}{" "}
                                                <span className="text-zinc-500 text-xs">
                                                    ({s.ideogram_value})
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enhance">
                                        Enhance prompt
                                    </Label>
                                    <p className="text-zinc-500 text-sm">
                                        Adds clarity, mood, and composition
                                        hints.
                                    </p>
                                </div>
                                <Switch
                                    id="enhance"
                                    checked={enhance}
                                    onCheckedChange={setEnhance}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={submitting}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                >
                                    {submitting ? "Generating..." : "Generate"}
                                </Button>
                            </div>

                            {result && (
                                <div className="grid gap-4 mt-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <Card className="bg-white border-zinc-200">
                                            <CardHeader>
                                                <CardTitle className="text-base">
                                                    Preview
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {result?.image_url ? (
                                                    <Image
                                                        src={
                                                            result.image_url ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt="Generated thumbnail preview"
                                                        className="w-full h-auto rounded-md ring-1 ring-zinc-200"
                                                        width={480}
                                                        height={270}
                                                    />
                                                ) : (
                                                    <div className="text-sm text-zinc-500">
                                                        No image URL returned.
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-white border-zinc-200">
                                            <CardHeader>
                                                <CardTitle className="text-base">
                                                    Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {result?.gcs_url && (
                                                    <div className="text-sm">
                                                        <span className="text-zinc-600">
                                                            GCS URL:{" "}
                                                        </span>
                                                        <a
                                                            href={
                                                                result.gcs_url
                                                            }
                                                            target="_blank"
                                                            className="text-cyan-700 hover:text-cyan-800 underline"
                                                            rel="noreferrer"
                                                        >
                                                            {result.gcs_url}
                                                        </a>
                                                    </div>
                                                )}
                                                {result?.enhanced_prompt && (
                                                    <details className="text-sm">
                                                        <summary className="cursor-pointer text-zinc-700">
                                                            Enhanced prompt
                                                        </summary>
                                                        <pre className="whitespace-pre-wrap text-zinc-600 mt-2">
                                                            {
                                                                result.enhanced_prompt
                                                            }
                                                        </pre>
                                                    </details>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Gallery / Upload */}
                    <div className="grid gap-8">
                        <Card className="bg-white border-zinc-200">
                            <CardHeader>
                                <CardTitle>Recent Images</CardTitle>
                                <CardDescription>
                                    Filter by style and manage your library.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={activeStyle}
                                        onValueChange={setActiveStyle}
                                    >
                                        <SelectTrigger className="bg-white border-zinc-200">
                                            <SelectValue placeholder="Filter by style" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-zinc-200">
                                            <SelectItem value="all">
                                                All styles
                                            </SelectItem>
                                            {styleOptions.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={s.name.toLowerCase()}
                                                >
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        className="border-zinc-300 bg-white hover:bg-zinc-50"
                                        onClick={() => mutate()}
                                    >
                                        Refresh
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {galleryLoading &&
                                        Array.from({ length: 8 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="aspect-square rounded-md bg-zinc-100 border border-zinc-200 animate-pulse"
                                                />
                                            )
                                        )}
                                    {!galleryLoading &&
                                        (gallery?.images?.length ?? 0) ===
                                            0 && (
                                            <div className="col-span-full text-sm text-zinc-500">
                                                No images yet.
                                            </div>
                                        )}
                                    {!galleryLoading &&
                                        (gallery?.images ?? []).map(
                                            (img, index) => (
                                                <figure
                                                    key={`${img.blob_name}-${index}`}
                                                    className="group relative"
                                                >
                                                    <Image
                                                        src={
                                                            img.url ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={`Thumbnail ${
                                                            img.style || ""
                                                        }`}
                                                        className="w-full h-auto rounded-md ring-1 ring-zinc-200"
                                                        width={300}
                                                        height={300}
                                                    />
                                                    <figcaption className="mt-1 flex items-center justify-between">
                                                        <span className="text-xs text-zinc-600 truncate">
                                                            {img.style ||
                                                                "unknown"}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    img.blob_name
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </figcaption>
                                                </figure>
                                            )
                                        )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-zinc-200">
                            <CardHeader>
                                <CardTitle>Upload to GCS</CardTitle>
                                <CardDescription>
                                    Upload an existing image to a style folder.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Choose file</Label>
                                        <Input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={(e) =>
                                                setFile(
                                                    e.target.files?.[0] ?? null
                                                )
                                            }
                                            className="bg-white border-zinc-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Style folder</Label>
                                        <Select
                                            value={uploadStyle}
                                            onValueChange={setUploadStyle}
                                        >
                                            <SelectTrigger className="bg-white border-zinc-200">
                                                <SelectValue placeholder="Select style folder" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-zinc-200">
                                                {/* map style names; fallback defaults */}
                                                {(styleOptions.length
                                                    ? styleOptions.map((s) =>
                                                          s.name.toLowerCase()
                                                      )
                                                    : [
                                                          "general",
                                                          "realistic",
                                                          "design",
                                                          "render_3d",
                                                          "anime",
                                                      ]
                                                ).map((name) => (
                                                    <SelectItem
                                                        key={name}
                                                        value={name}
                                                    >
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                >
                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Image"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
}
