<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlockImageTextGallery } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageTextGallery
}>()

const { getCmsSlot, getCmsElementName } = useCms()

const leftText = computed(() => getCmsSlot(props.content, 'left-text'))
const leftImage = computed(() => getCmsSlot(props.content, 'left-image'))
const centerText = computed(() => getCmsSlot(props.content, 'center-text'))
const centerImage = computed(() => getCmsSlot(props.content, 'center-image'))
const rightText = computed(() => getCmsSlot(props.content, 'right-text'))
const rightImage = computed(() => getCmsSlot(props.content, 'right-image'))
</script>

<template>
    <article
        class="cms-block-image-text-gallery grid gap-4 md:grid-cols-3 md:gap-8"
        :style="{ backgroundColor: content.backgroundColor || '' }"
    >
        <div class="cms-block-image-text-gallery__column space-y-4">
            <component
                :is="resolveComponent(getCmsElementName(leftImage?.type))"
                v-if="leftImage"
                :content="leftImage"
            />
            <component
                :is="resolveComponent(getCmsElementName(leftText?.type))"
                v-if="leftText"
                :content="leftText"
                class="cms-block-image-text-gallery__text"
            />
        </div>
        <div class="cms-block-image-text-gallery__column space-y-4">
            <component
                :is="resolveComponent(getCmsElementName(centerImage?.type))"
                v-if="centerImage"
                :content="centerImage"
            />
            <component
                :is="resolveComponent(getCmsElementName(centerText?.type))"
                v-if="centerText"
                :content="centerText"
                class="cms-block-image-text-gallery__text"
            />
        </div>
        <div class="cms-block-image-text-gallery__column space-y-4">
            <component
                :is="resolveComponent(getCmsElementName(rightImage?.type))"
                v-if="rightImage"
                :content="rightImage"
            />
            <component
                :is="resolveComponent(getCmsElementName(rightText?.type))"
                v-if="rightText"
                :content="rightText"
                class="cms-block-image-text-gallery__text"
            />
        </div>
    </article>
</template>