<script setup lang="ts">
import type { CmsElementProductName } from '@shopware/composables'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementProductName
}>()
</script>
<template>
    <div v-if="content.data?.content">
        {{ content.data.content }}
    </div>
</template>
