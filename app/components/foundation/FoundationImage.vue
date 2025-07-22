<template>
    <NuxtImg
        v-if="!intersectionLazy"
        v-bind="$attrs"
    />
    
    <div
        v-else
        ref="container"
        class="inline-block w-full"
    >
        <NuxtImg
            v-if="loaded"
            v-bind="imageAttrs"
        />
        <div
            v-else
            class="flex items-center justify-center bg-gray-100 rounded min-h-[100px] w-full"
            :style="placeholderStyle"
        >
            <slot name="loading-placeholder">
                <div class="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    inheritAttrs: false
})

interface Props {
    intersectionLazy?: boolean
    rootMargin?: string
    threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
    intersectionLazy: false,
    rootMargin: '50px',
    threshold: 0.1
})

const container = ref<HTMLElement>()
const loaded = ref(false)

// Filter out custom props from $attrs manually
const customProps = ['intersectionLazy', 'rootMargin', 'threshold']

const imageAttrs = (() => {
    const attrs = {} as Record<string, unknown>
    const currentAttrs = getCurrentInstance()?.attrs || {}
    
    for (const [key, value] of Object.entries(currentAttrs)) {
        if (!customProps.includes(key)) {
            attrs[key] = value
        }
    }
    return attrs
})()

const placeholderStyle = (() => {
    const attrs = getCurrentInstance()?.attrs || {}
    return {
        width: attrs.width ? `${attrs.width}px` : '100%',
        height: attrs.height ? `${attrs.height}px` : 'auto'
    }
})()

onMounted(() => {
    if (props.intersectionLazy && container.value) {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loaded.value = true
                    observer.disconnect()
                }
            },
            {
                rootMargin: props.rootMargin,
                threshold: props.threshold
            }
        )
        observer.observe(container.value)
    }
})
</script>