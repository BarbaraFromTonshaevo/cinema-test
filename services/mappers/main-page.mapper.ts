import type { MainPage } from '@/types/pages/main-page'
import type { BannerDTO } from '@/types/content/bannerDTO'

import { useLabelStore } from '@/stores/labels'
import { useGenreStore } from '@/stores/genres'

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
            image: slide.title.assets,
            genres: slide.title.genres
                .map(oid => getGenre(oid))
                .filter(Boolean),
            labels: slide.title.labels
                .map(oid => getLabel(oid))
                .filter(Boolean)
        }))
    }
}