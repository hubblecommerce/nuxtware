<script setup lang="ts">
interface Props {
    videoId: string | null | undefined
    videoUrl: string
    needsConfirmation: boolean
    previewImage?: string | null | undefined
    allowAttributes: string
    i18nNamespace: string
}

defineProps<Props>()

const hasConfirmed = ref(false)
// TODO: Add privacy policy modal state management

const confirmVideo = () => {
    hasConfirmed.value = true
}
</script>

<template>
    <div 
        v-if="videoId" 
        class="cms-element-video relative before:block before:content-[''] before:w-full before:pt-[56.25%]"
    >
        <iframe
            v-if="!needsConfirmation || hasConfirmed"
            :src="videoUrl"
            class="w-full h-full absolute top-0 left-0"
            frameborder="0"
            :allow="allowAttributes"
            allowfullscreen
            :title="$t(`${i18nNamespace}.title`)"
        />
        <div
            v-else
            class="w-full h-full absolute top-0 left-0 flex items-center justify-center"
        >
            <FoundationImage
                v-if="previewImage"
                :src="previewImage"
                :alt="$t(`${i18nNamespace}.previewAlt`)"
                class="w-full h-full absolute top-0 left-0 object-cover"
            />
            <div
                v-else
                class="w-full h-full absolute top-0 left-0 bg-gray-200 flex items-center justify-center"
            >
                <FoundationIcon
                    name="play"
                    class="w-16 h-16 text-gray-400"
                />
            </div>
            <div class="absolute inset-0 bg-black/25 flex items-center justify-center">
                <div class="text-center p-6 bg-white/75">
                    <!-- TODO: Implement privacy policy modal/link functionality -->
                    <p class="mb-4">
                        {{ $t(`${i18nNamespace}.confirmationText`) }}
                    </p>
                    <FoundationButton
                        variant="default"
                        color="primary"
                        @click="confirmVideo"
                    >
                        {{ $t(`${i18nNamespace}.confirmButton`) }}
                    </FoundationButton>
                </div>
            </div>
        </div>
        
        <!-- TODO: Add privacy policy modal component -->
    </div>
</template>