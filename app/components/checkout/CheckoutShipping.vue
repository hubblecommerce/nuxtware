<template>
    <fieldset class="space-y-4 p-6 border border-border rounded-lg bg-surface">
        <legend class="px-4 mb-0 -ml-4">
            <FoundationHeadline tag="h3" class="text-lg font-medium mb-2">
                {{ $t('checkout.shippingMethodLabel') }}
            </FoundationHeadline>
            <p class="text-sm">
                {{ $t('checkout.selectShippingMethod') }}
            </p>
        </legend>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 2" :key="i" class="flex animate-pulse items-center space-x-4">
                <div class="w-4 h-4 bg-border rounded-full"/>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-border rounded w-3/4"/>
                    <div class="h-3 bg-border rounded w-1/2"/>
                </div>
                <div class="h-4 bg-border rounded w-16"/>
            </div>
        </div>

        <!-- Shipping Methods -->
        <div v-else-if="shippingMethods.length > 0" class="space-y-3">
            <div
                v-for="method in shippingMethods"
                :key="method.id"
                class="relative"
            >
                <div class="flex items-center justify-between p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                    <div class="flex items-center space-x-4 flex-1">
                        <!-- Radio Input -->
                        <!-- TODO: Replace with FoundationRadio -->
                        <input
                            :id="`shipping-${method.id}`"
                            v-model="selectedMethodId"
                            type="radio"
                            :value="method.id"
                            name="shipping-method"
                            :disabled="disabled || isUpdating === method.id"
                            @change="handleMethodChange(method.id)"
                        >

                        <!-- Method Info -->
                        <div class="flex-1">
                            <FoundationLabel 
                                :for="`shipping-${method.id}`" 
                                class="cursor-pointer"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">
                                        {{ method.translated?.name }}
                                    </span>
                                    
                                    <!-- Delivery Time -->
                                    <span 
                                        v-if="getShippingMethodDeliveryTime(method)" 
                                        class="text-sm px-2 py-1 bg-surface-secondary rounded"
                                    >
                                        ({{ getShippingMethodDeliveryTime(method) }})
                                    </span>
                                </div>
                                
                                <!-- Description -->
                                <div 
                                    v-if="method.translated?.description" 
                                    class="text-sm mt-1"
                                >
                                    {{ method.translated.description }}
                                </div>
                            </FoundationLabel>
                        </div>

                        <!-- Method Image -->
                        <div v-if="method.media?.url" class="flex-shrink-0">
                            <FoundationImage
                                :src="method.media.url"
                                :alt="method.translated?.name"
                                class="w-12 h-8 object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <!-- Price -->
                    <div class="ml-4 text-right">
                        <span v-if="method.prices?.[0]" class="font-medium text-primary">
                            {{ getFormattedPrice(method.prices[0].unitPrice) }}
                        </span>
                        <span v-else class="text-sm">
                            {{ $t('checkout.shipping.free') }}
                        </span>
                    </div>

                    <!-- Loading indicator -->
                    <div v-if="isUpdating === method.id" class="ml-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Methods Available -->
        <div v-else class="text-center py-8">
            <FoundationIcon name="truck" size="xl" class="block text-secondary mx-auto mb-4" />
            <p>{{ $t('checkout.shipping.noMethodsAvailable') }}</p>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="p-4 border-l-4 border-error bg-error/10 text-error" role="alert">
            <p class="font-medium">{{ $t('checkout.shipping.error') }}</p>
            <p class="text-sm mt-1">{{ error }}</p>
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import { getShippingMethodDeliveryTime } from '@shopware/helpers'

interface ComponentCheckoutShippingProps {
    disabled?: boolean
}

const props = withDefaults(defineProps<ComponentCheckoutShippingProps>(), {
    disabled: false
})

// Composables
const {
    shippingMethods,
    getShippingMethods,
} = useCheckout()
const {
    selectedShippingMethod: contextShippingMethod,
    setShippingMethod,
} = useSessionContext()
const { getFormattedPrice } = usePrice()
const { error: notifyError } = useGlobalNotifications()
const { t } = useI18n()

// State
const isLoading = ref(false)
const isUpdating = ref<string | null>(null)
const error = ref('')

// Computed
const selectedMethodId = computed({
    get(): string {
        return contextShippingMethod.value?.id || ''
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(methodId: string) {
        // This setter is mainly for form binding, actual logic is in handleMethodChange
    }
})

// Methods
const handleMethodChange = async (_methodId: string) => {
    if (props.disabled || isUpdating.value || selectedMethodId.value === _methodId) return

    error.value = ''
    isUpdating.value = _methodId

    try {
        await setShippingMethod({ id: _methodId })
    } catch (err) {
        error.value = err instanceof Error ? err.message : t('checkout.shipping.updateError')
        notifyError(error.value)
    } finally {
        isUpdating.value = null
    }
}

const loadShippingMethods = async () => {
    if (isLoading.value) return

    error.value = ''
    isLoading.value = true

    try {
        await getShippingMethods()
    } catch (err) {
        error.value = err instanceof Error ? err.message : t('checkout.shipping.loadError')
        notifyError(error.value)
    } finally {
        isLoading.value = false
    }
}

// Load shipping methods on mount
onMounted(() => {
    loadShippingMethods()
})
</script>