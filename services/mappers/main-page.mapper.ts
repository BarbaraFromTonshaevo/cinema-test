import type { MainPage } from '@/types/pages/main-page'
import type { BannerDTO } from '@/types/content/bannerDTO'
import type { Image } from '@/types/metadata/image'

import { useLabelStore } from '@/stores/labels'
import { useGenreStore } from '@/stores/genres'

// Исправлено после собеседования: берём ассет типа Banner (16:9)
// и подставляем размер в шаблон {w}x{h} из resize_url
function mapBannerImage(assets: Image[]): Image {
    const image = assets.find(asset => asset.asset_type === 'Banner') ?? assets[0]!
    return { ...image, resize_url: image.resize_url.replace('{w}x{h}', '800x450') }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapMainPage(dto: any): MainPage {
    const { getLabel } = useLabelStore()
    const { getGenre } = useGenreStore()

    return {
        title: dto.name,
        banners: dto.slides.map((slide: BannerDTO) => ({
            oid: slide.oid,
            title: slide.title?.title ?? '',
            description: slide.title?.synopsis ?? '',
            image: mapBannerImage(slide.title.assets),
            genres: slide.title.genres
                .map(oid => getGenre(oid))
                .filter(Boolean),
            labels: slide.title.labels
                .map(oid => getLabel(oid))
                .filter(Boolean)
        }))
    }
}