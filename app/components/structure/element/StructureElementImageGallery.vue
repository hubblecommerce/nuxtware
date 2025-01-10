<script setup lang="ts">
import type { CmsElementImageGallery } from '@shopware-pwa/composables-next'

const props = defineProps<{
    content: CmsElementImageGallery
}>()
</script>

<template>
    <div>
        <div v-for="(item, index) in content.data.sliderItems" :key="index">
            <img v-if="item.media" :src="item.media.url" :alt="item.media.alt">
        </div>
    </div>
</template>
