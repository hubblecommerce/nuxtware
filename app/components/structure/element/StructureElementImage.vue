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

const displayModeValue = computed(() => String(displayMode.value))

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
    const configData = props.content?.config || {}
    return configData as Record<string, { value?: string | boolean, source?: string }>
})

// Get translated config for links (links need translated config)
const translatedConfig = computed(() => {
    const configData = props.content?.translated?.config || {}
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

// Image classes based on display mode (matching Shopware reference)
const imageClasses = computed(() => {
    const classes = []
    const mode = displayMode.value as string
    
    if (mode === 'cover') {
        classes.push('w-full', 'h-full', 'absolute', 'inset-0', 'object-cover')
    } else if (mode === 'stretch') {
        classes.push('w-full', 'h-full', 'absolute', 'inset-0', 'object-fill')
    } else {
        classes.push('w-full', 'h-full')
    }
    
    return classes
})

// Video classes (matching Shopware reference)
const videoClasses = computed(() => {
    const classes = []
    const mode = displayMode.value as string
    
    if (mode === 'cover') {
        classes.push('h-full', 'w-full', 'absolute', 'inset-0', 'object-cover')
    } else if (mode === 'stretch') {
        classes.push('h-full', 'w-full', 'absolute', 'inset-0', 'object-fill')
    } else {
        classes.push('h-full', 'w-full')
    }
    
    return classes
})

const { formatLink } = useInternationalization(useLocalePath())

// Process link URL for internal/external links using translated config
const processedImageLink = computed(() => {
    // Check for URL in translated config first, then regular config
    const urlValue = translatedConfig.value.url?.value || config.value.url?.value
    if (!urlValue) return null
    
    const url = formatLink(urlValue as string)
    
    return {
        url: url as string,
        isExternal: typeof url === 'string' && url.startsWith('http'),
        newTab: config.value.newTab?.value === true
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
            class="cms-element-alignment w-full"
        >
            <component
                :is="processedImageLink ? 'FoundationLink' : 'div'"
                v-bind="processedImageLink ? {
                    to: processedImageLink.url,
                    external: processedImageLink.isExternal,
                    target: processedImageLink.newTab ? '_blank' : undefined,
                    rel: processedImageLink.isExternal && processedImageLink.newTab ? 'noopener noreferrer' : undefined
                } : {}"
                :class="[
                    processedImageLink ? 'cms-image-link' : 'cms-image-container',
                    { 
                        'relative': ['cover', 'stretch'].includes(displayModeValue),
                        'flex-shrink-0': displayModeValue === 'stretch'
                    }
                ]"
                class="w-full"
                :style="imageContainerStyle"
            >
                <video
                    v-if="isVideoElement"
                    controls
                    :class="videoClasses"
                >
                    <source :src="imageAttrs.src" :type="mimeType">
                    {{ $t('misc.videoNotSupported') }}
                </video>
                <FoundationImage
                    v-else
                    ref="imageElement"
                    loading="lazy"
                    :class="imageClasses"
                    :alt="imageAttrs.alt"
                    :title="imageAttrs.title || ''"
                    :src="srcPath || undefined"
                    :srcset="imageAttrs.srcset"
                    :data-object-fit="(['cover', 'stretch'].includes(displayModeValue)) ? displayModeValue : undefined"
                />
            </component>
        </div>
        <component
            :is="processedImageLink ? 'FoundationLink' : 'div'"
            v-else
            v-bind="processedImageLink ? {
                to: processedImageLink.url,
                external: processedImageLink.isExternal,
                target: processedImageLink.newTab ? '_blank' : undefined,
                rel: processedImageLink.isExternal && processedImageLink.newTab ? 'noopener noreferrer' : undefined
            } : {}"
            :class="[
                processedImageLink ? 'cms-image-link' : 'cms-image-container',
                { 
                    'relative': ['cover', 'stretch'].includes(displayModeValue),
                    'flex-shrink-0': displayModeValue === 'stretch'
                }
            ]"
            class="w-full"
            :style="imageContainerStyle"
        >
            <video
                v-if="isVideoElement"
                controls
                :class="videoClasses"
            >
                <source :src="imageAttrs.src" :type="mimeType">
                {{ $t('misc.videoNotSupported') }}
            </video>
            <FoundationImage
                v-else
                ref="imageElement"
                loading="lazy"
                :class="imageClasses"
                :alt="imageAttrs.alt"
                :title="imageAttrs.title || ''"
                :src="srcPath || undefined"
                :srcset="imageAttrs.srcset"
                :data-object-fit="(['cover', 'stretch'].includes(displayModeValue)) ? displayModeValue : undefined"
            />
        </component>
    </div>
</template>
