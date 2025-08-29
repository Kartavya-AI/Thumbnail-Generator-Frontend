export type Style = {
  id: number
  name: string
  ideogram_value: string
}

export type GenerateResponse = {
  success?: boolean
  image_url?: string
  gcs_url?: string
  enhanced_prompt?: string
  error?: string | null
}

export type GalleryImage = {
  url: string
  blob_name: string
  style?: string | null
}

export type GalleryResponse = {
  success: boolean
  images: GalleryImage[]
  error?: string | null
}
