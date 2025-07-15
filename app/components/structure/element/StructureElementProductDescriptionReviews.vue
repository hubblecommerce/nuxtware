<script setup lang="ts">
import type { CmsElementProductDescriptionReviews } from '@shopware/composables'
import { getTranslatedProperty } from '@shopware/helpers'

const props = defineProps<{
    content: CmsElementProductDescriptionReviews
}>()

const { product } = useProduct(props.content.data?.product)
const { sanitizeHtml } = useSanitization()

const description = computed(() =>
    getTranslatedProperty(product.value, 'description'),
)

const sanitizedDescription = computed(() => {
    return sanitizeHtml(description.value)
})
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
            <div class="p-6 prose" v-html="sanitizedDescription" />
        </template>
        
        <template #reviews>
            <div class="py-6">
                <ReviewContainer 
                    v-if="product"
                    :product-id="product.id"
                    :initial-reviews="content.data?.reviews?.elements || []"
                />
            </div>
        </template>
    </ComponentTabs>
</template>
