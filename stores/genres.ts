import { defineStore } from 'pinia'
import type { Genre } from '@/types/metadata/genre'
import { fetchApi } from '@/services/api'

export const useGenreStore = defineStore('genres', () => {
  
  const genres = reactive<Record<string, Genre>>({})
  const loaded = ref(false)
  const loading = ref(false)

  async function fetchGenres() {
    if (loaded.value || loading.value) return

    loading.value = true

    const data = await fetchApi<Genre[]>('metadata/genres/')

    for (const genre of data) {
      genres[genre.oid] = genre
    }

    loaded.value = true
    loading.value = false
  }

  function getGenre(oid: string): Genre | null {
    return genres[oid] ?? null
  }

  function getGenreName(oid: string): string {
    return genres[oid]?.name ?? ''
  }

  return {
    genres,
    fetchGenres,
    getGenre,
    getGenreName,
    loaded
  }
})