<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useGenreStore } from '@/stores/genres';
import { useLabelStore } from '@/stores/labels';


const genres = useGenreStore()
await genres.fetchGenres()
const labels = useLabelStore()
await labels.fetchLabels()
</script>
