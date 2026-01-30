<template>
    <NuxtLink to="/" class="flex flex-col rounded-xl p-5 border border-solid border-blue-200 w-250 h-200 drop-shadow-sm">
        <NuxtImage :src="banner.image.resize_url" class="w-full aspect-video mb-5 rounded-lg bg-blue-900"/>
         <div v-if="banner.labels.length > 0" class="flex items-center gap-2 flex-wrap mb-5">
            <span v-for="label of banner.labels" :key="label.oid" class="border border-solid border-blue-900 py-1 px-2 rounded-sm">
                {{label.name }}
            </span>
        </div>
        <h2 class="text-lg font-bold mb-4 uppercase">{{ banner.title }}</h2>
        <div class="line-clamp-3 overflow-hidden mb-4">{{ banner.description }}</div>
        <div v-if="banner.genres.length > 0"  class="flex items-center gap-2 flex-wrap">
            Жанры: 
            <span v-for="genre of banner.genres" :key="genre.oid" class="text-blue-900">{{ genre.name }}</span>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Banner } from '@/types/content/banner';

const { banner } = defineProps<{
    banner: Banner
}>()
</script>
