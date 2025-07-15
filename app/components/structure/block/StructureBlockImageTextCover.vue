<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlockImageTextCover } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageTextCover
}>()

const { getCmsSlot, getCmsElementName } = useCms()

const leftContent = computed(() => getCmsSlot(props.content, 'left'))
const rightContent = computed(() => getCmsSlot(props.content, 'right'))
</script>

<template>
    <article class="cms-block-image-text-cover grid gap-4 md:grid-cols-2 md:gap-8">
        <component
            :is="resolveComponent(getCmsElementName(leftContent?.type))"
            v-if="leftContent"
            :content="leftContent"
            class="cms-block-image-text-cover__image"
        />
        <component
            :is="resolveComponent(getCmsElementName(rightContent?.type))"
            v-if="rightContent"
            :content="rightContent"
            class="cms-block-image-text-cover__text"
        />
    </article>
</template>