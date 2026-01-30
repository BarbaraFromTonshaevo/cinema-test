<template>
    <NuxtLink to="/" class="banner">
        <!-- <NuxtImage src=""></NuxtImage> -->
        <h2>{{ banner.title }}</h2>
        <div>{{ banner.description }}</div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Banner } from '@/types/content/banner';

const { banner } = defineProps<{
    banner: Banner
}>()
</script>
