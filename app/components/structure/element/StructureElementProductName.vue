<script setup lang="ts">
import type { CmsElementProductName } from '@shopware-pwa/composables-next'

const props = defineProps<{
    content: CmsElementProductName
}>()
</script>
<template>
    <div v-if="content.data?.content">
        {{ content.data.content }}
    </div>
</template>
