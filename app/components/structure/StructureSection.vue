<script setup lang="ts">
import { computed, type Ref } from 'vue'
import type { CmsSection, CmsBlock } from "@shopware-pwa/types";

const props = defineProps<{
    content: CmsSection;
    count?: number;
}>()

const { backgroundStyles } = useCmsBackgroundStyles(props.content)

const mainBlocks: Ref<CmsBlock[]> = computed(() => {
    return props.content.blocks.filter((block: CmsBlock) => block.sectionPosition === 'main')
})

const sidebarBlocks: Ref<CmsBlock[]> = computed(() => {
    return props.content.blocks.filter((block: CmsBlock) => block.sectionPosition === 'sidebar')
})
</script>

<template>
    <div
        class="cms-section"
        :class="{
            [content.cssClass as string]: content.cssClass,
            'container m-auto p-6': content.sizingMode === 'boxed',
            'w-full': content.sizingMode === 'fullwidth'
        }"
        :style="backgroundStyles"
    >
        <div class="grid grid-cols-12 gap-4">
            <div
                v-if="content.type === 'sidebar'"
                :class="{ 'col-span-12': content.mobileBehavior === 'wrap','hidden': content.mobileBehavior === 'hidden' }"
                class="md:flex md:flex-col md:gap-4 md:col-span-3"
            >
                <StructureBlock v-for="(sidebarBlock) in sidebarBlocks" :key="sidebarBlock.id" :content="sidebarBlock" :count="count" />
            </div>
            <div :class="{ 'md:col-span-9': content.type === 'sidebar' }" class="flex flex-col gap-4 col-span-12">
                <StructureBlock v-for="(mainBlock) in mainBlocks" :key="mainBlock.id" :content="mainBlock" :count="count" />
            </div>
        </div>
    </div>
</template>
