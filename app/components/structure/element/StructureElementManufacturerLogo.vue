<script setup lang="ts">
import type { CmsElementManufacturerLogo } from '@shopware-pwa/composables-next'

const props = defineProps<{
    content: CmsElementManufacturerLogo
}>()
</script>
<template>
    <img v-if="content?.data?.media" :src="content.data.media.url" :alt="content.data.media.alt" />
</template>
