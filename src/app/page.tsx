import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StylesPreview } from "@/components/styles-preview"
import { GalleryPreview } from "@/components/gallery-preview"
import Image from "next/image"

// Home: high-contrast black theme with cyan accent and modern sections
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200">New</Badge>
            <h1 className="text-pretty text-4xl md:text-6xl font-semibold leading-tight">
              Thumbnail Generator
              <span className="block text-cyan-600">Create click‑worthy visuals in seconds</span>
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Turn a simple prompt into a high‑impact YouTube/shorts thumbnail. Choose a style, enhance the prompt, and
              auto‑save to Google Cloud Storage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium">
                <Link href="/create">Generate a Thumbnail</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-neutral-300 text-neutral-900 hover:bg-neutral-50 bg-transparent"
              >
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="text-sm text-neutral-500">Backed by GCS • Fast • Style‑aware</div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/abstract-editorial-collage-thumbnail-grid-with-bol.png"
              alt="A collage of thumbnails and device mockups"
              className="rounded-xl ring-1 ring-neutral-200 shadow-xl"
              width={300}
              height={300}
            />
            <div className="absolute -bottom-4 -right-4 hidden md:block">
              <Card className="bg-white/80 backdrop-blur border-neutral-200">
                <CardContent className="p-4">
                  <div className="text-xs text-neutral-500">Recent</div>
                  <div className="text-sm text-neutral-900">feed street dogs</div>
                  <div className="text-xs text-neutral-500">Saved to GCS</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Highlights */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 md:grid-cols-3">
          <Highlight
            title="Prompt → Thumbnail"
            desc="Describe your video, pick a style, and generate. Enhanced prompts craft compelling visuals."
          />
          <Highlight
            title="Google Cloud Storage"
            desc="Every generated thumbnail is stored in GCS and accessible by style or blob path."
          />
          <Highlight
            title="Fast & Modern"
            desc="Clean API integration with responsive UI. Designed for creators and teams."
          />
        </div>
      </section>

      {/* Styles */}
      <section className="mx-auto max-w-6xl px-6 py-16" id="styles">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-pretty">Curated Styles</h2>
          <Button asChild variant="link" className="text-cyan-600 hover:text-cyan-700 p-0">
            <Link href="/create">Try now</Link>
          </Button>
        </div>
        <p className="text-neutral-600 mt-2 max-w-2xl">
          Explore flexible looks like General, Realistic, Design, 3D Render, and Anime. Mix with prompt enhancement for
          best results.
        </p>
        <div className="mt-8">
          <StylesPreview />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16" id="how-it-works">
        <div className="grid gap-6 md:grid-cols-3">
          <Step
            number="1"
            title="Describe your video"
            desc="Provide a short, clear title or idea (e.g., “feed street dogs”)."
          />
          <Step
            number="2"
            title="Pick a style"
            desc="Choose from curated styles. Optionally enhance the prompt to add cinematic detail."
          />
          <Step
            number="3"
            title="Generate & save"
            desc="Create your thumbnail. It’s automatically uploaded to Google Cloud Storage for reuse."
          />
        </div>
      </section>

      {/* Gallery preview */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Recent Gallery</h2>
          <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Link href="/create">Open Generator</Link>
          </Button>
        </div>
        <p className="text-neutral-600 mt-2">A snapshot of the latest saved images from GCS.</p>
        <div className="mt-8">
          <GalleryPreview />
        </div>
      </section>

      <Footer />
    </main>
  )
}

function Highlight({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-6 w-6 rounded-full bg-cyan-50 ring-1 ring-cyan-200 mt-1.5" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-neutral-600 text-sm">{desc}</div>
      </div>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <Card className="bg-white border-neutral-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-sm">
            {number}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600 text-sm">{desc}</p>
      </CardContent>
    </Card>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-600">© {new Date().getFullYear()} Thumbnail Generator</div>
        <div className="flex gap-4 text-sm">
          <Link className="text-neutral-600 hover:text-neutral-900" href="/create">
            Create
          </Link>
          <a className="text-neutral-600 hover:text-neutral-900" href="#how-it-works">
            How it works
          </a>
          <a className="text-neutral-600 hover:text-neutral-900" href="#styles">
            Styles
          </a>
        </div>
      </div>
    </footer>
  )
}
