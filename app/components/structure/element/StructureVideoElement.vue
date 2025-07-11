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
            <img
                v-if="previewImage"
                :src="previewImage"
                :alt="$t(`${i18nNamespace}.previewAlt`)"
                class="w-full h-full absolute top-0 left-0 object-cover"
            >
            <div
                v-else
                class="w-full h-full absolute top-0 left-0 bg-gray-200 flex items-center justify-center"
            >
                <FoundationIcon
                    name="play"
                    class="w-16 h-16 text-gray-400"
                />
            </div>
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div class="text-center text-white">
                    <i18n-t :keypath="`${i18nNamespace}.confirmationText`" tag="p" class="mb-4">
                        <FoundationButton
                            variant="ghost"
                            class="underline text-white hover:text-gray-200 p-0"
                            @click.prevent.stop="showPrivacyModal = true"
                        >
                            {{ $t(`${i18nNamespace}.privacyPolicyLink`) }}
                        </FoundationButton>
                    </i18n-t>
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
        
        <!-- Privacy Policy Modal -->
        <FoundationModal
            v-model="showPrivacyModal"
            :title="$t(`${i18nNamespace}.privacyPolicyTitle`)"
        >
            <p>{{ $t(`${i18nNamespace}.privacyPolicyContent`) }}</p>
        </FoundationModal>
    </div>
</template>

<script setup lang="ts">
interface Props {
    videoId: string | null | undefined
    videoUrl: string
    needsConfirmation: boolean
    previewImage?: string | null | undefined
    allowAttributes: string
    i18nNamespace: string
}

const _props = defineProps<Props>()

const hasConfirmed = ref(false)
const showPrivacyModal = ref(false)

const confirmVideo = () => {
    hasConfirmed.value = true
}
</script>