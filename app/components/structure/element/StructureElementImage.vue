<script setup lang="ts">
import type {
    CmsElementImage,
    CmsElementManufacturerLogo,
} from "@shopware/composables"
import { useElementSize } from "@vueuse/core"
import { useCmsElementImage } from "#imports"

const props = defineProps<{
    content: CmsElementImage | CmsElementManufacturerLogo
}>()

const {
    containerStyle,
    displayMode,
    imageAttrs,
    imageLink,
    isVideoElement,
    mimeType,
} = useCmsElementImage(props.content)

const DEFAULT_THUMBNAIL_SIZE = 10
const imageElement = ref(null)
const { width, height } = useElementSize(imageElement)

function roundUp(num: number) {
    return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE
}

const srcPath = computed(() => {
    if (imageAttrs.value.src == null) {
        return null
    }

    const biggestParam =
        width.value > height.value
            ? `width=${roundUp(width.value)}`
            : `height=${roundUp(height.value)}`
    return `${imageAttrs.value.src}?${biggestParam}&fit=crop,smart`
})

// Get configuration values with proper typing
const config = computed(() => {
    const configData = props.content.translated?.config || {}
    return configData as Record<string, { value?: string | boolean, source?: string }>
})

const isCover = computed(() => displayMode.value === 'cover')

// Alignment classes (matching Shopware admin schema: center, flex-start, flex-end)
const alignmentClasses = computed(() => {
    const classes = []
    
    if (config.value.verticalAlign?.value && !isCover.value) {
        classes.push('flex')
        const vAlign = config.value.verticalAlign.value
        if (vAlign === 'center') {
            classes.push('items-center')
        } else if (vAlign === 'flex-end') {
            classes.push('items-end')
        } else if (vAlign === 'flex-start') {
            classes.push('items-start')
        }
    }
    
    if (config.value.horizontalAlign?.value && !isCover.value) {
        const hAlign = config.value.horizontalAlign.value
        if (hAlign === 'center') {
            classes.push('justify-center')
        } else if (hAlign === 'flex-end') {
            classes.push('justify-end')
        } else if (hAlign === 'flex-start') {
            classes.push('justify-start')
        }
    }
    
    return classes
})

// Container style with min-height for cover mode
const imageContainerStyle = computed(() => {
    const styles: Record<string, string> = {}
    
    // Handle containerStyle.value - typically CSSProperties object
    if (containerStyle.value) {
        // Convert CSSProperties to string record
        const cssProps = containerStyle.value as Record<string, string | number | undefined>
        Object.entries(cssProps).forEach(([key, value]) => {
            if (value !== undefined) {
                styles[key] = String(value)
            }
        })
    }
    
    if (config.value.minHeight?.value && isCover.value) {
        const minHeightValue = config.value.minHeight.value
        if (typeof minHeightValue === 'string') {
            styles['min-height'] = minHeightValue
        }
    }
    
    return styles
})

// Image classes based on display mode (matching Shopware admin schema)
const imageClasses = computed(() => {
    const classes = ['cms-image']
    const mode = displayMode.value as string
    
    if (mode === 'cover') {
        classes.push('w-full', 'h-full', 'object-cover')
    } else if (mode === 'stretch') {
        classes.push('w-full', 'h-full', 'object-fill')
    } else if (mode === 'standard') {
        classes.push('max-w-full', 'h-auto')
    }
    
    return classes
})

// Video classes (matching Shopware admin schema)
const videoClasses = computed(() => {
    const classes = ['w-full', 'h-full']
    const mode = displayMode.value as string
    
    if (mode === 'cover') {
        classes.push('object-cover')
    } else if (mode === 'stretch') {
        classes.push('object-fill')
    } else if (mode === 'standard') {
        classes.push('object-contain')
    }
    
    return classes
})

const { formatLink } = useInternationalization(useLocalePath())

// Process link URL for internal/external links
const processedImageLink = computed(() => {
    if (!imageLink.value?.url) return null
    
    const url = formatLink(imageLink.value.url)
    
    return {
        ...imageLink.value,
        url: url as string,
        isExternal: typeof url === 'string' && url.startsWith('http')
    }
})
</script>

<template>
    <div 
        v-if="imageAttrs.src" 
        class="cms-element-image"
        :class="[
            alignmentClasses,
            `is-${displayMode}`
        ]"
    >
        <div
            v-if="config.verticalAlign?.value && !isCover"
            :class="{
                'self-center': config.verticalAlign.value === 'center',
                'self-end': config.verticalAlign.value === 'flex-end',
                'self-start': config.verticalAlign.value === 'flex-start'
            }"
            class="cms-element-alignment"
        >
            <component
                :is="processedImageLink ? 'FoundationLink' : 'div'"
                v-bind="processedImageLink ? {
                    to: processedImageLink.url,
                    external: processedImageLink.isExternal,
                    target: config.newTab?.value ? '_blank' : undefined,
                    rel: processedImageLink.isExternal && config.newTab?.value ? 'noopener noreferrer' : undefined
                } : {}"
                :class="processedImageLink ? 'cms-image-link' : 'cms-image-container'"
                class="w-full"
                :style="imageContainerStyle"
            >
                <video
                    v-if="isVideoElement"
                    controls
                    :class="videoClasses"
                >
                    <source :src="imageAttrs.src" :type="mimeType">
                    Your browser does not support the video tag.
                </video>
                <img
                    v-else
                    ref="imageElement"
                    loading="lazy"
                    :class="imageClasses"
                    :alt="imageAttrs.alt"
                    :title="imageAttrs.title || ''"
                    :src="srcPath || undefined"
                    :srcset="imageAttrs.srcset"
                    :data-object-fit="(['cover', 'stretch'].includes(displayMode.value as string)) ? displayMode.value : undefined"
                >
            </component>
        </div>
        <component
            :is="processedImageLink ? 'FoundationLink' : 'div'"
            v-else
            v-bind="processedImageLink ? {
                to: processedImageLink.url,
                external: processedImageLink.isExternal,
                target: config.newTab?.value ? '_blank' : undefined,
                rel: processedImageLink.isExternal && config.newTab?.value ? 'noopener noreferrer' : undefined
            } : {}"
            :class="processedImageLink ? 'cms-image-link' : 'cms-image-container'"
            class="w-full"
            :style="imageContainerStyle"
        >
            <video
                v-if="isVideoElement"
                controls
                :class="videoClasses"
            >
                <source :src="imageAttrs.src" :type="mimeType">
                Your browser does not support the video tag.
            </video>
            <img
                v-else
                ref="imageElement"
                loading="lazy"
                :class="imageClasses"
                :alt="imageAttrs.alt"
                :title="imageAttrs.title || ''"
                :src="srcPath || undefined"
                :srcset="imageAttrs.srcset"
                :data-object-fit="(['cover', 'stretch'].includes(displayMode.value as string)) ? displayMode.value : undefined"
            >
        </component>
    </div>
</template>
