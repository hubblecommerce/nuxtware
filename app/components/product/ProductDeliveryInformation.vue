<script setup lang="ts">
import type { Schemas } from "#shopware"

const sessionContextData = ref<Schemas["SalesChannelContext"]>();
const { languageIdChain } = useSessionContext(sessionContextData.value);
const { getLanguageCodeFromId } = useInternationalization();
const locale = getLanguageCodeFromId(languageIdChain.value)

const props = defineProps<{
    product: Schemas["Product"],
}>()

const isReleaseDateInFuture = computed(() => {
    const releaseDate = props.product?.releaseDate
    return !!releaseDate && new Date(releaseDate).getTime() > Date.now()
})

const formattedReleaseDate = computed(() => {
    if (!props.product.releaseDate) return ''
    return new Date(props.product.releaseDate).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
})
</script>
<template>
    <div class="product-delivery-information flex flex-col gap-1">
        <template v-if="product.shippingFree">
            <div class="flex items-center gap-1 text-sm">
                <div class="w-2 h-2 bg-info rounded-full" />
                <span>{{ $t('productDeliveryInformation.deliveryShippingFree') }}</span>
            </div>
        </template>

        <template v-if="!product.active || !product.available">
            <div class="flex items-center gap-1 text-sm">
                <div class="w-2 h-2 bg-error rounded-full" />
                <span>{{ $t('productDeliveryInformation.unavailable') }}</span>
            </div>
        </template>

        <template v-else-if="product.releaseDate && isReleaseDateInFuture">
            <div class="flex items-center gap-1 text-sm">
                <div class="w-2 h-2 bg-warning rounded-full" />
                <span>{{ $t('productDeliveryInformation.releaseDate', { date: formattedReleaseDate}) }}</span>
            </div>
        </template>

        <template v-else-if="product.stock >= (product.minPurchase || 1) && product.deliveryTime">
            <div class="flex items-center gap-1 text-sm">
                <div class="w-2 h-2 bg-tertiary-shade-light rounded-full" />
                <span>{{ $t('productDeliveryInformation.deliveryTime') }}: {{ product.deliveryTime?.translated?.name }}</span>
            </div>
        </template>
    </div>
</template>