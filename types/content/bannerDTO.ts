import type { Image } from "../metadata/image"

export interface BannerDTO {
    oid: string
    title: {
        oid: string
        title: string
        synopsis: string
        age: number
        genres: string[]
        labels: string[]
        assets: Image[]
        url: string
        air_year: number
        end_year: number | null
    }
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // trailer: any
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // preview: any
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // live_banners: any
}