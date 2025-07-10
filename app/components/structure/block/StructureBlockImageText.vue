<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockImageText } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageText
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="flex flex-col md:flex-row md:justify-between">
        <component :is="resolveComponent(getCmsElementName(leftSlot?.type))" v-if="leftSlot" :content="leftSlot" />
        <component :is="resolveComponent(getCmsElementName(rightSlot?.type))" v-if="rightSlot" :content="rightSlot" />
    </div>
</template>
