<template>
    <div class="product-price-info flex justify-center items-center min-h-[50px]">
        <!-- Reference/Unit Price Information -->
        <div 
            v-if="referencePrice?.unitName"
            :class="[sizeClasses.referencePrice, 'mb-2']"
            data-testid="product-reference-price"
        >
            <!-- Purchase Unit -->
            <template v-if="referencePrice.purchaseUnit">
                <span class="font-medium mr-1">
                    {{ t('product.price.boxUnitLabel') }}
                </span>
                <span class="mr-2">
                    {{ referencePrice.purchaseUnit }} {{ referencePrice.unitName }}
                </span>
            </template>

            <!-- Reference Unit Price -->
            <span v-if="referencePrice.price">
                ({{ getFormattedPrice(referencePrice.price) }}* {{ t('product.price.referencePrice', { 
                    unit: referencePrice.referenceUnit, 
                    unitName: referencePrice.unitName 
                }) }})
            </span>
        </div>

        <!-- Main Price Container -->
        <div class="product-price-wrapper flex items-center flex-col gap-1">
            <!-- Cheapest Price Display -->
            <div 
                v-if="displayCheapestPrice"
                :class="[sizeClasses.cheapestPrice, 'font-semibold']"
                data-testid="product-cheapest-price"
            >
                {{ t('product.price.cheapestPriceLabel') }} {{ getFormattedPrice(cheapestPrice) }}*
            </div>

            <div class="flex justify-center items-baseline gap-1">
                <!-- "From" Price Indicator -->
                <span 
                    v-if="displayFrom"
                    :class="[sizeClasses.cheapestPrice, '']"
                    data-testid="product-from-indicator"
                >
                    {{ t('product.price.listingTextFrom') }}
                </span>

                <!-- Main Price -->
                <span 
                    :class="[
                        sizeClasses.mainPrice, 
                        'font-semibold',
                        {
                            'text-error': isListPrice && !displayFrom,
                            'text-neutral': !isListPrice || displayFrom
                        }
                    ]"
                    data-testid="product-main-price"
                >
                    {{ getFormattedPrice(unitPrice) }}*
                </span>

                <!-- List Price with Discount -->
                <div 
                    v-if="isListPrice && !displayFrom && price?.listPrice"
                    data-testid="product-list-price"
                >
                    <!-- "Instead of" text and original price -->
                    <span :class="[sizeClasses.cheapestPrice, 'line-through']">
                        {{ getFormattedPrice(price.listPrice.price) }}*
                    </span>
                </div>
            </div>

            <!-- Regulation Price -->
            <div 
                v-if="regulationPrice"
                :class="[sizeClasses.regulationPrice, 'italic']"
                data-testid="product-regulation-price"
            >
                {{ t('product.price.regulationPrice', { price: getFormattedPrice(regulationPrice) }) }}*
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Schemas } from '#shopware'

interface ProductPriceProps {
    product: Schemas['Product']
    size?: 'small' | 'medium' | 'large'
    showReferencePrice?: boolean
}

const props = withDefaults(defineProps<ProductPriceProps>(), {
    size: 'medium',
    showReferencePrice: true
})

const { t } = useI18n()
const { getFormattedPrice } = usePrice()
const productRef = computed(() => props.product)
const {
    price,
    unitPrice,
    referencePrice,
    displayFrom,
    isListPrice,
    regulationPrice,
    displayCheapestPrice,
    cheapestPrice,
} = useProductPriceCustom(productRef)

// Computed classes for responsive sizing
const sizeClasses = computed(() => {
    switch (props.size) {
        case 'small':
            return {
                mainPrice: 'text-md',
                referencePrice: 'text-xs',
                cheapestPrice: 'text-xs',
                regulationPrice: 'text-xs'
            }
        case 'large':
            return {
                mainPrice: 'text-xl',
                referencePrice: 'text-base',
                cheapestPrice: 'text-base',
                regulationPrice: 'text-base'
            }
        default: // medium
            return {
                mainPrice: 'text-lg',
                referencePrice: 'text-sm',
                cheapestPrice: 'text-sm',
                regulationPrice: 'text-sm'
            }
    }
})
</script>
