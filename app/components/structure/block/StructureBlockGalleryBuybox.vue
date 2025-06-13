<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlockGalleryBuybox } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockGalleryBuybox
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-12 md:justify-between gap-4 md:gap-8">
        <component :is="resolveComponent(getCmsElementName(leftSlot?.type))" v-if="leftSlot" :content="leftSlot" class="col-span-8" />
        <component :is="resolveComponent(getCmsElementName(rightSlot?.type))" v-if="rightSlot" :content="rightSlot" class="col-span-4" />
    </div>
</template>
