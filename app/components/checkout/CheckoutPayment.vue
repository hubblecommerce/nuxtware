<template>
    <fieldset class="space-y-4 p-6 border border-border rounded-lg bg-surface">
        <legend class="px-4 mb-0 -ml-4">
            <FoundationHeadline level="h3" class="text-lg font-medium text-primary mb-2">
                {{ $t('checkout.paymentMethodLabel') }}
            </FoundationHeadline>
            <p class="text-sm">
                {{ $t('checkout.selectPaymentMethod') }}
            </p>
        </legend>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex animate-pulse items-center space-x-4">
                <div class="w-4 h-4 bg-border rounded-full"/>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-border rounded w-3/4"/>
                    <div class="h-3 bg-border rounded w-1/2"/>
                </div>
                <div class="h-8 bg-border rounded w-16"/>
            </div>
        </div>

        <!-- Payment Methods -->
        <div v-else-if="paymentMethods.length > 0" class="space-y-3">
            <div
                v-for="method in paymentMethods"
                :key="method.id"
                class="relative"
            >
                <div class="flex items-center justify-between p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors">
                    <div class="flex items-center space-x-4 flex-1">
                        <!-- Radio Input -->
                        <!-- TODO: Replace with FoundationRadio -->
                        <input
                            :id="`payment-${method.id}`"
                            v-model="selectedMethodId"
                            type="radio"
                            :value="method.id"
                            name="payment-method"
                            :disabled="disabled || isUpdating === method.id"
                            @change="handleMethodChange(method.id)"
                        >

                        <!-- Method Info -->
                        <div class="flex-1">
                            <FoundationLabel 
                                :for="`payment-${method.id}`" 
                                class="cursor-pointer"
                            >
                                <div class="flex items-center gap-2">
                                    <span class="font-medium text-secondary">
                                        {{ method.translated?.name }}
                                    </span>
                                    
                                    <!-- Payment Method Features -->
                                    <div v-if="method.afterOrderEnabled" class="flex gap-1">
                                        <span class="text-xs text-success px-2 py-1 bg-success/10 rounded">
                                            {{ $t('checkout.payment.afterOrder') }}
                                        </span>
                                    </div>
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

                        <!-- Method Image/Logo -->
                        <div v-if="method.media?.url" class="flex-shrink-0">
                            <img
                                :src="method.media.url"
                                :alt="method.translated?.name"
                                class="w-12 h-8 object-contain"
                                loading="lazy"
                            >
                        </div>
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
            <FoundationIcon name="credit-card" size="xl" class="block text-secondary mx-auto mb-4" />
            <p>{{ $t('checkout.payment.noMethodsAvailable') }}</p>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="p-4 border-l-4 border-error bg-error/10 text-error" role="alert">
            <p class="font-medium">{{ $t('checkout.payment.error') }}</p>
            <p class="text-sm mt-1">{{ error }}</p>
        </div>
    </fieldset>
</template>

<script setup lang="ts">
interface ComponentCheckoutPaymentProps {
    disabled?: boolean
}

const props = withDefaults(defineProps<ComponentCheckoutPaymentProps>(), {
    disabled: false
})

// Composables
const {
    paymentMethods,
    getPaymentMethods,
} = useCheckout()
const {
    selectedPaymentMethod: contextPaymentMethod,
    setPaymentMethod,
} = useSessionContext()
const { error: notifyError } = useGlobalNotifications()
const { t } = useI18n()

// State
const isLoading = ref(false)
const isUpdating = ref<string | null>(null)
const error = ref('')

// Computed
const selectedMethodId = computed({
    get(): string {
        return contextPaymentMethod.value?.id || ''
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
        await setPaymentMethod({ id: _methodId })
    } catch (err) {
        error.value = err instanceof Error ? err.message : t('checkout.payment.updateError')
        notifyError(error.value)
    } finally {
        isUpdating.value = null
    }
}

const loadPaymentMethods = async () => {
    if (isLoading.value) return

    error.value = ''
    isLoading.value = true

    try {
        await getPaymentMethods()
    } catch (err) {
        error.value = err instanceof Error ? err.message : t('checkout.payment.loadError')
        notifyError(error.value)
    } finally {
        isLoading.value = false
    }
}

// Load payment methods on mount
onMounted(() => {
    loadPaymentMethods()
})
</script>