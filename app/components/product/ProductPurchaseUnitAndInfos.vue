<script setup lang="ts">
import type { Schemas } from "#shopware"
import {getTranslatedProperty} from "@shopware/helpers";
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

const uniqueId = useId()
const infoSectionId = computed(() => `product-info-${uniqueId}`)
const isInfoExpanded = ref(false)

function toggleInfo() {
    isInfoExpanded.value = !isInfoExpanded.value
}
</script>
<template>
    <div class="product-info flex flex-col gap-1 text-xs" aria-labelledby="product-info-heading">
        <h3 id="product-info-heading" class="sr-only">{{ t('productPurchaseUnitAndInfos.info') }}</h3>

        <!-- Purchase unit information -->
        <div v-if="props.product.purchaseUnit" class="purchase-unit">
            <span>
                {{ t('productPurchaseUnitAndInfos.unit') }}: {{ props.product.purchaseUnit }}
                <span v-if="props.product.unit">{{ props.product.unit }}</span>
            </span>
        </div>

        <!-- Product info collapsible section -->
        <div v-if="props.showProductInfo" class="product-additional-info">
            <FoundationButton
                size="small"
                variant="outline"
                :aria-expanded="isInfoExpanded"
                :aria-controls="infoSectionId"
                @click="toggleInfo"
            >
                {{ $t('productPurchaseUnitAndInfos.info') }}
                <FoundationIcon :name="isInfoExpanded ? 'chevron-up' : 'chevron-down'" aria-hidden="true" />
            </FoundationButton>

            <div 
                v-if="isInfoExpanded && (props.product.weight || props.product.width || props.product.length || props.product.height)"
                :id="infoSectionId"
                class="product-dimensions mt-2"
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
        </div>
    </div>
</template>