<script setup lang="ts">
import { computed, ref, shallowRef, defineAsyncComponent, resolveComponent, onMounted } from 'vue'
import type { Schemas } from "#shopware";

const props = defineProps<{
    content: Schemas["CmsBlock"];
    count?: number;
}>()

const { backgroundStyles } = useCmsBackgroundStyles(props.content)
const { marginStyles } = useCmsMarginStyles(props.content)
const { getCmsBlockName, getCmsElementName } = useCms()

const component = shallowRef()
// If block contains exactly one slot, directly load Element. If more than one slots then load Block
const compName = computed(() => {
    let name = getCmsBlockName(props.content.type)

    if (props.content.slots.length === 1 && props.content.slots[0]?.type) {
        name = getCmsElementName(props.content.slots[0].type)
    }

    return name
})


// Render first two section server side (SEO relevant hero elements)
const staticSections = 2
if (props.count != null && props.count <= staticSections) {
    component.value = resolveComponent(`${compName.value}`)
}

// Lazy load other sections via intersection observer
const blockWrapper = ref()
onMounted(() => {
    if (props.count && props.count > staticSections) {
        useIntersectionObserver(blockWrapper.value, loadComponent)
    }
})

// For lazy loaded components
const loadComponent = function () {
    component.value = defineAsyncComponent({
        // the loader function
        loader: () => import(`${props.content.slots.length === 1 ? '../element' : '.'}/${compName.value}.vue`),
    })
}
</script>

<template>
    <div ref="blockWrapper" class="cms-block" :class="content.cssClass" :style="[marginStyles, backgroundStyles]">
        <component :is="component" :content="content.slots.length === 1 ? content.slots[0] : content" />
    </div>
</template>
