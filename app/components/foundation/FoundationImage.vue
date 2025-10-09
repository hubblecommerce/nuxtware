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
    aspectRatio?: string
}

const props = withDefaults(defineProps<Props>(), {
    intersectionLazy: false,
    rootMargin: '50px',
    threshold: 0.1,
    aspectRatio: undefined
})

const container = ref<HTMLElement>()
const loaded = ref(false)

// Filter out custom props using useAttrs
const customProps = ['intersectionLazy', 'rootMargin', 'threshold', 'aspectRatio']

const imageAttrs = computed(() => {
    const attrs = useAttrs()
    const filteredAttrs = {} as Record<string, unknown>
    
    for (const [key, value] of Object.entries(attrs)) {
        if (!customProps.includes(key)) {
            filteredAttrs[key] = value
        }
    }
    return filteredAttrs
})

const placeholderStyle = computed(() => {
    const attrs = useAttrs()
    const styles: Record<string, string> = {}
    
    if (attrs.width) {
        styles.width = `${attrs.width}px`
    } else {
        styles.width = '100%'
    }
    
    if (attrs.height) {
        styles.height = `${attrs.height}px`
    }
    
    // Use aspectRatio prop or calculate from width/height
    if (props.aspectRatio) {
        styles.aspectRatio = props.aspectRatio
    } else if (attrs.width && attrs.height) {
        styles.aspectRatio = `${attrs.width} / ${attrs.height}`
    }
    
    return styles
})

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