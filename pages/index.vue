<template>
    <div>
        <h1>{{ data?.title }}</h1>
        <CardBanner v-for="banner of data?.banners" :key="banner.oid" :banner="banner"/>
    </div>
</template>

<script setup lang="ts">
import { mapMainPage } from '@/services/mappers/main-page.mapper';

const { data } = await useAsyncData('maindata', async () => {
    const raw = await $fetch('https://cms.test.ksfr.tech/api/v1/showcases/showcases/mainpage/web/')
    return mapMainPage(raw)
})
</script>