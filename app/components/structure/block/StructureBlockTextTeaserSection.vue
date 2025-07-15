<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { CmsBlockTextTeaserSection } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockTextTeaserSection
}>()

const { getCmsSlot, getCmsElementName } = useCms()
const leftSlot = computed(() => getCmsSlot(props.content, 'left'))
const rightSlot = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <div class="grid md:grid-cols-12 gap-4">
        <div class="md:col-span-4">
            <component
                :is="resolveComponent(getCmsElementName(leftSlot?.type))"
                v-if="leftSlot"
                :content="leftSlot"
            />
        </div>
        <div class="md:col-span-8">
            <component
                :is="resolveComponent(getCmsElementName(rightSlot?.type))"
                v-if="rightSlot"
                :content="rightSlot"
            />
        </div>
    </div>
</template>