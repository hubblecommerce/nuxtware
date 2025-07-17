<script setup lang="ts">
import type { CmsElementProductName } from '@shopware/composables'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
    content: CmsElementProductName
}>()
</script>
<template>
    <FoundationHeadline v-if="content.data?.content" tag="div" class="text-xl sm:text-4xl font-bold mb-2">
        {{ content.data.content }}
    </FoundationHeadline>
</template>
