<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlockImageTextBubble } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockImageTextBubble
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
    <div class="cms-block-image-text-bubble grid gap-4 md:grid-cols-3 md:gap-8">
        <div class="cms-element-column space-y-4 text-center">
            <div class="flex justify-center">
                <component
                    :is="resolveComponent(getCmsElementName(leftImage?.type))"
                    v-if="leftImage"
                    :content="leftImage"
                    class="w-20 h-20 rounded-full object-cover md:w-24 md:h-24"
                />
            </div>
            <component
                :is="resolveComponent(getCmsElementName(leftText?.type))"
                v-if="leftText"
                :content="leftText"
            />
        </div>
        <div class="cms-element-column space-y-4 text-center">
            <div class="flex justify-center">
                <component
                    :is="resolveComponent(getCmsElementName(centerImage?.type))"
                    v-if="centerImage"
                    :content="centerImage"
                    class="w-20 h-20 rounded-full object-cover md:w-24 md:h-24"
                />
            </div>
            <component
                :is="resolveComponent(getCmsElementName(centerText?.type))"
                v-if="centerText"
                :content="centerText"
            />
        </div>
        <div class="cms-element-column space-y-4 text-center">
            <div class="flex justify-center">
                <component
                    :is="resolveComponent(getCmsElementName(rightImage?.type))"
                    v-if="rightImage"
                    :content="rightImage"
                    class="w-20 h-20 rounded-full object-cover md:w-24 md:h-24"
                />
            </div>
            <component
                :is="resolveComponent(getCmsElementName(rightText?.type))"
                v-if="rightText"
                :content="rightText"
            />
        </div>
    </div>
</template>