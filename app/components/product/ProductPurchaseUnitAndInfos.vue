<script setup lang="ts">
import type { Schemas } from "#shopware"

const { t } = useI18n()

const props = withDefaults(
    defineProps<{
        product: Schemas["Product"],
        showProductInfo?: boolean
    }>(),
    {
        showProductInfo: false,
    },
)

const productInfoItems = computed(() => {
    return props.showProductInfo ? [props.product] : []
})
</script>
<template>
    <div class="product-info flex flex-col gap-1 text-sm" aria-labelledby="product-info-heading">
        <h3 id="product-info-heading" class="sr-only">{{ t('productPurchaseUnitAndInfos.info') }}</h3>

        <!-- Purchase unit information -->
        <div v-if="props.product.purchaseUnit" class="purchase-unit">
            <span>
                {{ t('productPurchaseUnitAndInfos.unit') }}: {{ props.product.purchaseUnit }}
                <span v-if="props.product.unit">{{ props.product.unit }}</span>
            </span>
        </div>

        <ComponentCollapsible 
            v-if="props.showProductInfo && (props.product.weight || props.product.width || props.product.length || props.product.height)"
            :items="productInfoItems"
            :show-more-text="$t('productPurchaseUnitAndInfos.info')"
            :show-less-text="$t('productPurchaseUnitAndInfos.info')"
            class="product-additional-info flex flex-col items-start"
        >

            <!-- Customize toggle button -->
            <template #toggle-button="{ toggle, isExpanded }">
                <FoundationButton
                    size="small"
                    color="secondary"
                    variant="outline"
                    class="lg:flex items-center justify-evenly order-1"
                    @click="toggle"
                >
                    {{ $t('productPurchaseUnitAndInfos.info') }}
                    <FoundationIcon :name="isExpanded ? 'chevron-up' : 'chevron-down'" aria-hidden="true" />
                </FoundationButton>
            </template>

            <template #default="{ isExpanded }">
                <div 
                    v-if="isExpanded"
                    class="product-dimensions mt-2 order-2 w-full"
                    role="region"
                    :aria-label="t('productPurchaseUnitAndInfos.productInfo')"
                >
                    <dl class="product-specs grid grid-cols-2 gap-2">
                        <div v-if="props.product.weight">
                            <dt class="inline">{{ t('productPurchaseUnitAndInfos.weight') }}: </dt>
                            <dd class="inline">{{ props.product.weight }}{{ t('productPurchaseUnitAndInfos.kg') }}</dd>
                        </div>

                        <div v-if="props.product.width">
                            <dt class="inline">{{ t('productPurchaseUnitAndInfos.width') }}: </dt>
                            <dd class="inline">{{ props.product.width }}{{ t('productPurchaseUnitAndInfos.mm') }}</dd>
                        </div>

                        <div v-if="props.product.length">
                            <dt class="inline">{{ t('productPurchaseUnitAndInfos.length') }}: </dt>
                            <dd class="inline">{{ props.product.length }}{{ t('productPurchaseUnitAndInfos.mm') }}</dd>
                        </div>

                        <div v-if="props.product.height">
                            <dt class="inline">{{ t('productPurchaseUnitAndInfos.height') }}: </dt>
                            <dd class="inline">{{ props.product.height }}{{ t('productPurchaseUnitAndInfos.mm') }}</dd>
                        </div>
                    </dl>
                </div>
            </template>
        </ComponentCollapsible>
    </div>
</template>