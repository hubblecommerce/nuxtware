<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockImageThreeCover } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageThreeCover
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const centerSlot = computed(() => getCmsSlot(props.content, 'center'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="cms-block-cover grid md:grid-cols-3 gap-0">
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