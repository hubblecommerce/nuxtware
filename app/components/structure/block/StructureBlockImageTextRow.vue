<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlockImageTextRow } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageTextRow
}>()

const { getCmsSlot, getCmsElementName } = useCms()

const leftImage = computed(() => getCmsSlot(props.content, 'left-image'))
const leftText = computed(() => getCmsSlot(props.content, 'left-text'))
const centerImage = computed(() => getCmsSlot(props.content, 'center-image'))
const centerText = computed(() => getCmsSlot(props.content, 'center-text'))
const rightImage = computed(() => getCmsSlot(props.content, 'right-image'))
const rightText = computed(() => getCmsSlot(props.content, 'right-text'))
</script>

<template>
    <div class="cms-block-image-text-row grid gap-4 md:grid-cols-3 md:gap-8">
        <div class="cms-block-image-text-row__column space-y-4">
            <component
                :is="resolveComponent(getCmsElementName(leftImage?.type))"
                v-if="leftImage"
                :content="leftImage"
                class="cms-element-image object-cover"
            />
            <component
                :is="resolveComponent(getCmsElementName(leftText?.type))"
                v-if="leftText"
                :content="leftText"
            />
        </div>
        <div class="cms-block-image-text-row__column space-y-4">
            <component
                :is="resolveComponent(getCmsElementName(centerImage?.type))"
                v-if="centerImage"
                :content="centerImage"
                class="cms-element-image object-cover"
            />
            <component
                :is="resolveComponent(getCmsElementName(centerText?.type))"
                v-if="centerText"
                :content="centerText"
            />
        </div>
        <div class="cms-block-image-text-row__column space-y-4">
            <component
                :is="resolveComponent(getCmsElementName(rightImage?.type))"
                v-if="rightImage"
                :content="rightImage"
                class="cms-element-image object-cover"
            />
            <component
                :is="resolveComponent(getCmsElementName(rightText?.type))"
                v-if="rightText"
                :content="rightText"
            />
        </div>
    </div>
</template>