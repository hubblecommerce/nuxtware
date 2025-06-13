<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from '@shopware/composables'
import { getTranslatedProperty } from '@shopware/helpers'

const props = defineProps<{
    content: CmsElementProductDescriptionReviews
}>()

const { product } = useProduct(props.content.data?.product)
const description = computed(() =>
    getTranslatedProperty(product.value, 'description'),
)
</script>

<template>
    <ComponentTabs 
        :tabs="[ 
            { id: 'description', label: $t('product.detail.tabs.description') }, 
            { id: 'reviews', label: $t('product.detail.tabs.reviews') } 
        ]"
        :enable-hash-navigation="true"
        :show-border=false
    >
        <template #description>
            <div class="p-6">
                <p class="text-black leading-relaxed">
                    {{ description }}
                </p>
            </div>
        </template>
        
        <template #reviews>
            <div class="p-6">
                <div class="space-y-4">
                    <div class="border-l-4 border-primary pl-4">
                        <p class="font-semibold">⭐⭐⭐⭐⭐ Amazing product!</p>
                        <p class="text-muted">Really exceeded my expectations. Highly recommended!</p>
                    </div>
                    <div class="border-l-4 border-primary pl-4">
                        <p class="font-semibold">⭐⭐⭐⭐ Great quality</p>
                        <p class="text-muted">Good build quality and fast shipping.</p>
                    </div>
                </div>
            </div>
        </template>
    </ComponentTabs>
</template>
