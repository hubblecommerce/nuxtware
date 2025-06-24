<script setup lang="ts">
import type { CmsElementCrossSelling } from '@shopware/composables'
import type { TabItem } from '../../../types/component-tabs'

const props = defineProps<{
    content: CmsElementCrossSelling
}>()

// Filter cross-selling collections to only show those with products
const crossSellCollections = computed(() => {
    return props.content?.data?.crossSellings?.filter(
        (collection) => collection.products && collection.products.length > 0 && collection.crossSelling?.active
    ) || []
})

// Transform collections into tab items
const tabItems = computed((): TabItem[] => {
    return crossSellCollections.value.map((collection) => ({
        id: collection.crossSelling.id,
        label: collection.crossSelling.translated?.name || collection.crossSelling.name || '',
        disabled: false
    }))
})

// Current active tab
const activeTabId = ref<string>('')

// Initialize with first tab
onMounted(() => {
    const firstTab = tabItems.value[0]
    if (firstTab) {
        activeTabId.value = firstTab.id
    }
})
</script>

<template>
    <div 
        v-if="crossSellCollections.length > 0"
        class="structure-element-cross-selling"
    >
        <!-- Single collection without tabs -->
        <div v-if="crossSellCollections.length === 1 && crossSellCollections[0]">
            <ComponentProductCarousel
                :products="crossSellCollections[0].products"
                :title="crossSellCollections[0].crossSelling.translated?.name || crossSellCollections[0].crossSelling.name"
                :show-title="true"
                layout-type="minimal"
                :items-per-slide="{ default: 2, md: 3, lg: 4, xl: 6 }"
                :gap="20"
                :show-navigation="true"
                :show-indicators="false"
                :auto-play="false"
                :loop="true"
                class="cross-selling-carousel"
            />
        </div>

        <!-- Multiple collections with tabs -->
        <div v-else>
            <ComponentTabs
                v-model="activeTabId"
                :tabs="tabItems"
                :enable-hash-navigation="false"
                size="md"
                color="primary"
                :scrollable="true"
                :show-border="true"
                class="cross-selling-tabs"
            >
                <!-- Tab content for each collection -->
                <template 
                    v-for="collection in crossSellCollections"
                    :key="collection.crossSelling.id"
                    #[collection.crossSelling.id]
                >
                    <div class="py-6">
                        <ComponentProductCarousel
                            :products="collection.products"
                            :title="''"
                            :show-title="false"
                            layout-type="minimal"
                            :items-per-slide="{ default: 2, md: 3, lg: 4, xl: 6 }"
                            :gap="20"
                            :show-navigation="true"
                            :show-indicators="false"
                            :auto-play="false"
                            :loop="true"
                            class="cross-selling-carousel"
                        />
                    </div>
                </template>

                <!-- Custom tab labels with icons -->
                <template 
                    v-for="collection in crossSellCollections"
                    :key="`tab-${collection.crossSelling.id}`"
                    #[`tab-${collection.crossSelling.id}`]="{ tab, isActive }"
                >
                    <span class="flex items-center gap-2">
                        {{ tab.label }}
                        <FoundationIcon 
                            name="chevron-right" 
                            class="w-4 h-4 transition-transform duration-200"
                            :class="{ 'rotate-90': isActive }"
                            aria-hidden="true"
                        />
                    </span>
                </template>
            </ComponentTabs>
        </div>
    </div>
</template>
