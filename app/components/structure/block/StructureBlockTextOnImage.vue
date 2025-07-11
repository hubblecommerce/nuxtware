<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlock } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlock
}>()

const { getCmsSlot, getCmsElementName } = useCms()

const backgroundContent = computed(() => getCmsSlot(props.content, 'background'))
const textContent = computed(() => getCmsSlot(props.content, 'text'))
</script>

<template>
    <div class="cms-block-text-on-image relative">
        <component
            :is="resolveComponent(getCmsElementName(backgroundContent?.type))"
            v-if="backgroundContent"
            :content="backgroundContent"
            class="cms-block-text-on-image__background"
        />
        <div class="cms-block-text-on-image__text absolute inset-0 flex items-center justify-center">
            <component
                :is="resolveComponent(getCmsElementName(textContent?.type))"
                v-if="textContent"
                :content="textContent"
                class="text-white text-center"
            />
        </div>
    </div>
</template>