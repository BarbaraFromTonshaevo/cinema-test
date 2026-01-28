<template>
    <div>
        <h1>Main Page</h1>
        <!-- <pre>{{ genres }}</pre> -->
         <pre>{{ labels }}</pre>
    </div>
</template>

<script setup lang="ts">
// import { useGenreStore } from '@/stores/genres';
import { useLabelStore } from '@/stores/labels';

// const { genres } = useGenreStore()
const { labels } = useLabelStore()
</script>