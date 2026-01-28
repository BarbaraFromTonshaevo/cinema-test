<template>
    <div>
        <h1>Main Page</h1>
        <pre>{{ genres.genres }}</pre>
    </div>
</template>

<script setup lang="ts">
import { useGenreStore } from '@/stores/genres';

const genres = useGenreStore()
</script>