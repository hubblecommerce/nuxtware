<script setup lang="ts">
import type { CmsElementYoutubeVideo } from '@shopware/composables'
import { getBiggestThumbnailUrl } from '@shopware/helpers'
import StructureVideoElement from './StructureVideoElement.vue'

const props = defineProps<{
    content: CmsElementYoutubeVideo
}>()

const videoId = computed(() => {
    const configVideoId = props.content.config?.videoID?.value
    const url = props.content.config?.url?.value
    
    if (configVideoId) {
        return extractVideoIdFromUrl(configVideoId) || configVideoId
    }
    
    if (url) {
        return extractVideoIdFromUrl(url)
    }
    
    return null
})

const needsConfirmation = computed(() => {
    return props.content.config?.needsConfirmation?.value ?? false
})

const previewImage = computed(() => {
    if (props.content.data?.media) {
        return getBiggestThumbnailUrl(props.content.data.media)
    }
    return null
})

const videoUrl = computed(() => {
    if (!videoId.value) return ''
    
    const config = props.content.config
    const advancedPrivacyMode = config?.advancePrivacyMode?.value ?? false
    const baseUrl = advancedPrivacyMode 
        ? 'https://www.youtube-nocookie.com/embed/' 
        : 'https://www.youtube.com/embed/'
    
    const params = new URLSearchParams()
    
    // Related videos
    params.append('rel', '0')
    
    // Loop
    if (config?.loop?.value) {
        params.append('loop', '1')
        params.append('playlist', videoId.value)
    }
    
    // Controls
    if (config?.showControls?.value !== undefined) {
        params.append('controls', config.showControls.value ? '1' : '0')
    }
    
    // Start time
    const startTime = config?.start?.value
    if (startTime && Number.parseInt(startTime) > 0) {
        params.append('start', startTime)
    }
    
    // End time
    const endTime = config?.end?.value
    if (endTime && Number.parseInt(endTime) > 0) {
        params.append('end', endTime)
    }
    
    // Disable keyboard
    params.append('disablekb', '1')
    
    // Autoplay
    if (config?.autoPlay?.value) {
        params.append('autoplay', '1')
    }
    
    return `${baseUrl}${videoId.value}?${params.toString()}`
})

function extractVideoIdFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url)
        
        switch (urlObj.hostname) {
            case 'www.youtu.be':
            case 'youtu.be':
                return urlObj.pathname.substring(1)
            case 'www.youtube.com':
            case 'youtube.com':
                return urlObj.searchParams.get('v')
            default:
                return null
        }
    } catch {
        // If URL parsing fails, assume it's already a video ID
        return url
    }
}
</script>

<template>
    <StructureVideoElement
        :video-id="videoId"
        :video-url="videoUrl"
        :needs-confirmation="needsConfirmation"
        :preview-image="previewImage"
        allow-attributes="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        i18n-namespace="youtubeVideo"
    />
</template>