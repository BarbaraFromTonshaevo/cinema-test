<template>
    <div class="container mx-auto py-10 px-10 md:px-0">
        <h1 class="text-2xl font-bold mb-10 uppercase">{{ data?.title }}</h1>
        <div class="grid grid-cols gap-5 xl:grid-cols-3 md:grid-cols-2">
            <CardBanner 
                v-for="banner of data?.banners" 
                :key="banner.oid" 
                :banner="banner"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { mapMainPage } from '@/services/mappers/main-page.mapper';

const { data } = await useAsyncData('maindata', async () => {
    const raw = await $fetch('https://cms.test.ksfr.tech/api/v1/showcases/showcases/mainpage/web/')
    return mapMainPage(raw)
})
</script>