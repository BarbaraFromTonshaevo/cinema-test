import type { Genre } from "@/types/metadata/genre"
import type { Label } from "@/types/metadata/label"
import type { Image } from "@/types/metadata/image"

export interface Banner{
    oid: `movie:${string}`
    title: string
    description: string
    image: Image
    url: string
    labels: Label[]
    genres: Genre[]
}