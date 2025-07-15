<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockImageFourColumn } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageFourColumn
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const centerLeftSlot = computed(() => getCmsSlot(props.content, 'center-left'))
const centerRightSlot = computed(() => getCmsSlot(props.content, 'center-right'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="grid md:grid-cols-4 gap-10">
        <component 
            :is="resolveComponent(getCmsElementName(leftSlot?.type))" 
            v-if="leftSlot" 
            :content="leftSlot" 
        />
        <component 
            :is="resolveComponent(getCmsElementName(centerLeftSlot?.type))" 
            v-if="centerLeftSlot" 
            :content="centerLeftSlot" 
        />
        <component 
            :is="resolveComponent(getCmsElementName(centerRightSlot?.type))" 
            v-if="centerRightSlot" 
            :content="centerRightSlot" 
        />
        <component 
            :is="resolveComponent(getCmsElementName(rightSlot?.type))" 
            v-if="rightSlot" 
            :content="rightSlot" 
        />
    </div>
</template>