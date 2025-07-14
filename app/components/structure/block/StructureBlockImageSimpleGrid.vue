<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockImageSimpleGrid } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageSimpleGrid
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftTopSlot = computed(() => getCmsSlot(props.content, 'left-top'))
const leftBottomSlot = computed(() => getCmsSlot(props.content, 'left-bottom'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="cms-block-image-simple-grid flex flex-col md:flex-row gap-10">
        <div class="flex-1 grid gap-10">
            <component 
                :is="resolveComponent(getCmsElementName(leftTopSlot?.type))" 
                v-if="leftTopSlot" 
                :content="leftTopSlot" 
            />
            <component 
                :is="resolveComponent(getCmsElementName(leftBottomSlot?.type))" 
                v-if="leftBottomSlot" 
                :content="leftBottomSlot" 
            />
        </div>
        <div class="flex-1">
            <component 
                :is="resolveComponent(getCmsElementName(rightSlot?.type))" 
                v-if="rightSlot" 
                :content="rightSlot"
                class="h-full"
            />
        </div>
    </div>
</template>