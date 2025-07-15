<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockTextTwoColumn } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockTextTwoColumn
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="grid md:grid-cols-2 gap-10">
        <component 
            :is="resolveComponent(getCmsElementName(leftSlot?.type))" 
            v-if="leftSlot" 
            :content="leftSlot" 
        />
        <component 
            :is="resolveComponent(getCmsElementName(rightSlot?.type))" 
            v-if="rightSlot" 
            :content="rightSlot" 
        />
    </div>
</template>