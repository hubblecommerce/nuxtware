<template>
    <div
        class="product-price-info flex"
        :class="{
            'justify-center items-center' : props.alignment === 'center',
            'justify-start items-start' : props.alignment === 'start',
            'flex-col items-start' : props.showTierPrices
        }"
    >
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
        <div
            class="product-price-wrapper flex flex-col gap-1"
            :class="{
                'justify-center items-center' : props.alignment === 'center',
                'justify-start items-start' : props.alignment === 'start'
            }"
        >
            <!-- Cheapest Price Display -->
            <div
                v-if="displayCheapestPrice"
                :class="[sizeClasses.cheapestPrice, 'font-semibold']"
                data-testid="product-cheapest-price"
            >
                {{ t('product.price.cheapestPriceLabel') }} {{ getFormattedPrice(cheapestPrice) }}*
            </div>

            <div v-if="!showTierPrices || tierPrices.length <= 0" class="flex items-baseline gap-1">
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

            <!-- Tier Prices -->

            <template v-if="tierPrices.length > 0 && calculatedPrices.length > 0 && props.showTierPrices">
                <div class="grid grid-cols-2 gap-2 text-sm border border-border">
                    <div class="font-semibold p-2">{{ $t('product.price.pieces') }}</div>
                    <div class="font-semibold p-2">{{ $t('product.price.unitPrice') }}</div>

                    <template v-for="(calcPrice, index) in calculatedPrices" :key="index">
                        <template v-if="index === 0">
                            <span class="p-2">{{ $t('product.price.until') }} {{ calcPrice.quantity }} {{ $t('product.price.pcs') }}</span>
                        </template>
                        <template v-else>
                            <span class="p-2">{{ $t('product.price.listingTextFrom') }} {{ tierPrices[index - 1]?.quantity + 1 }}</span>
                        </template>
                        <div class="flex flex-col gap-1 p-2">
                            <span
                                :class="[
                                    sizeClasses.mainPrice,
                                    'font-semibold',
                                    {
                                        'text-error': calcPrice.listPrice?.price,
                                        'text-neutral': !calcPrice.listPrice?.price
                                    }
                                ]"
                            >
                                {{ getFormattedPrice(calcPrice.unitPrice) }}*
                            </span>
                            <!-- List Price with Discount -->
                            <div v-if="calcPrice.listPrice?.percentage && calcPrice.listPrice?.price" class="flex gap-2">
                                <div
                                    v-if="calcPrice.listPrice?.price"
                                >
                                    <span :class="[sizeClasses.cheapestPrice, 'line-through']">
                                        {{ getFormattedPrice(calcPrice.listPrice?.price) }}*
                                    </span>
                                </div>
                                <span
                                    v-if="calcPrice.listPrice?.price && calcPrice.listPrice?.percentage"
                                >
                                -{{ Math.round(calcPrice.listPrice?.percentage) }}%
                            </span>
                            </div>
                        </div>
                    </template>
                </div>
            </template>

            <template v-if="props.showTax">
                <span class="flex flex-col text-xs text-neutral gap-2">
                    {{ $t(taxState === 'gross' ? 'product.price.inclTax' : 'product.price.exclTax') }}
                </span>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Schemas } from '#shopware'

interface ProductPriceProps {
    product: Schemas['Product']
    size?: 'small' | 'medium' | 'large'
    showReferencePrice?: boolean,
    alignment?: 'start' | 'end' | 'center',
    showTierPrices?: boolean,
    showTax?: boolean,
}

const props = withDefaults(defineProps<ProductPriceProps>(), {
    size: 'medium',
    showReferencePrice: true,
    alignment: 'center',
    showTierPrices: false,
    showTax: false
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
    tierPrices,
} = useProductPriceCustom(productRef)

const calculatedPrices = props.product.calculatedPrices
const { taxState } = useSessionContext()

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
