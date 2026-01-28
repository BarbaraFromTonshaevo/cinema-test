<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useGenreStore } from '@/stores/genres';

const genres = useGenreStore()
await genres.fetchGenres()
</script>
