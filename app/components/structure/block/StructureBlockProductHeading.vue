<script setup lang="ts">
import type { CmsBlockProductHeading } from '@shopware-pwa/composables-next'

const props = defineProps<{
    content: CmsBlockProductHeading
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="flex flex-col md:flex-row md:justify-between">
        <component :is="resolveComponent(getCmsElementName(leftSlot?.type))" :content="leftSlot" />
        <component :is="resolveComponent(getCmsElementName(rightSlot?.type))" :content="rightSlot" />
    </div>
</template>
