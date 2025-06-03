<script setup lang="ts">
import type { CmsBlockGalleryBuybox } from '@shopware-pwa/composables-next'

const props = defineProps<{
    content: CmsBlockGalleryBuybox
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 md:col-span-8">
            <component :is="resolveComponent(getCmsElementName(leftSlot?.type))" v-if="leftSlot" :content="leftSlot" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <component :is="resolveComponent(getCmsElementName(rightSlot?.type))" v-if="rightSlot" :content="rightSlot" />
        </div>
    </div>
</template>
