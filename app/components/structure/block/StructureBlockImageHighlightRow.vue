<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockImageHighlightRow } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageHighlightRow
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const centerSlot = computed(() => getCmsSlot(props.content, 'center'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="cms-block-highlight-row grid md:grid-cols-3 gap-10">
        <component 
            :is="resolveComponent(getCmsElementName(leftSlot?.type))" 
            v-if="leftSlot" 
            :content="leftSlot" 
        />
        <component 
            :is="resolveComponent(getCmsElementName(centerSlot?.type))" 
            v-if="centerSlot" 
            :content="centerSlot" 
        />
        <component 
            :is="resolveComponent(getCmsElementName(rightSlot?.type))" 
            v-if="rightSlot" 
            :content="rightSlot" 
        />
    </div>
</template>