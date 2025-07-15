<script setup lang="ts">
import type { CmsElementVimeoVideo } from '@shopware/composables'
import StructureVideoElement from './StructureVideoElement.vue'

const props = defineProps<{
    content: CmsElementVimeoVideo
}>()

const videoId = computed(() => {
    const configValue = props.content.config?.videoID?.value
    if (!configValue) return null
    
    // Extract video ID from Vimeo URL if full URL is provided
    if (configValue.includes('vimeo.com')) {
        const match = configValue.match(/vimeo\.com\/(\d+)/)
        return match ? match[1] : null
    }
    
    // Return as-is if it's already just the ID
    return configValue
})

const needsConfirmation = computed(() => {
    return props.content.config?.needsConfirmation?.value ?? false
})

const previewImageUrl = computed(() => {
    const media = props.content.data?.media
    if (!media) return null
    
    // Use media URL if available
    return media.url || null
})

// Build Vimeo embed URL with parameters
const videoUrl = computed(() => {
    if (!videoId.value) return ''
    
    const baseUrl = `https://player.vimeo.com/video/${videoId.value}`
    const params = new URLSearchParams()
    
    // Add configuration parameters
    if (props.content.config?.autoplay?.value) {
        params.append('autoplay', '1')
    }
    
    if (props.content.config?.loop?.value) {
        params.append('loop', '1')
    }
    
    if (props.content.config?.color?.value) {
        // Remove # prefix from color value
        const color = props.content.config.color.value.replace('#', '')
        params.append('color', color)
    }
    
    if (props.content.config?.controls?.value === false) {
        params.append('controls', '0')
    }
    
    if (props.content.config?.title?.value === false) {
        params.append('title', '0')
    }
    
    if (props.content.config?.byLine?.value === false) {
        params.append('byline', '0')
    }
    
    if (props.content.config?.portrait?.value === false) {
        params.append('portrait', '0')
    }
    
    if (props.content.config?.doNotTrack?.value) {
        params.append('dnt', '1')
    }
    
    if (props.content.config?.mute?.value) {
        params.append('muted', '1')
    }
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
})
</script>

<template>
    <StructureVideoElement
        :video-id="videoId"
        :video-url="videoUrl"
        :needs-confirmation="needsConfirmation"
        :preview-image="previewImageUrl"
        allow-attributes="autoplay; fullscreen; picture-in-picture"
        i18n-namespace="vimeoVideo"
    />
</template>