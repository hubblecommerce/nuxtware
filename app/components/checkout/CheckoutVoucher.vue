<template>
    <fieldset class="space-y-4 p-6 border border-border rounded-lg bg-surface">
        <legend class="px-4 mb-0 -ml-4">
            <FoundationHeadline level="h3" class="text-lg font-medium text-primary mb-2">
                {{ $t('checkout.voucher.title') }}
            </FoundationHeadline>
            <p class="text-sm">
                {{ $t('checkout.voucher.description') }}
            </p>
        </legend>

        <!-- Voucher Input Form -->
        <form @submit.prevent="handleApplyVoucher">
            <div class="flex gap-3">
                <div class="flex-1">
                    <ComponentTextInput
                        id="voucher-code"
                        v-model="voucherCode"
                        :label="$t('checkout.voucher.placeholder')"
                        :show-label="false"
                        type="text"
                        :placeholder="$t('checkout.voucher.placeholder')"
                        :disabled="isLoading"
                        size="md"
                        bordered
                    />
                </div>
                <FoundationButton
                    type="submit"
                    color="secondary"
                    :loading="isLoading"
                    :disabled="!voucherCode.trim() || isLoading"
                >
                    {{ $t('checkout.voucher.apply') }}
                </FoundationButton>
            </div>
        </form>

        <!-- Applied Vouchers Display -->
        <div v-if="appliedPromotionCodes.length > 0" class="space-y-3">
            <FoundationHeadline level="h4" class="text-base font-medium text-primary">
                {{ $t('checkout.voucher.applied') }}
            </FoundationHeadline>
            
            <div class="space-y-2">
                <div
                    v-for="promotion in appliedPromotionCodes"
                    :key="promotion.id"
                    class="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-md"
                >
                    <div class="flex items-center gap-3">
                        <FoundationIcon name="check-circle" class="w-4 h-4 text-success" />
                        <div>
                            <p class="font-medium text-sm">{{ promotion.label }}</p>
                            <p v-if="promotion.payload?.code" class="text-xs text-secondary">
                                {{ $t('checkout.voucher.code') }}: {{ promotion.payload.code }}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <span v-if="promotion.price?.totalPrice" class="text-sm font-medium text-success">
                            {{ getFormattedPrice(Math.abs(promotion.price.totalPrice)) }}
                        </span>
                        <FoundationButton
                            size="small"
                            variant="ghost"
                            :loading="isRemovingPromotion === promotion.id"
                            :aria-label="$t('checkout.voucher.remove', { code: promotion.label })"
                            @click="handleRemoveVoucher(promotion)"
                        >
                            <FoundationIcon name="x" class="w-4 h-4" />
                        </FoundationButton>
                    </div>
                </div>
            </div>
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import { ApiClientError } from '@shopware/api-client'
import type { Schemas } from '#shopware'

interface ComponentCheckoutVoucherProps {
    disabled?: boolean
}

const props = withDefaults(defineProps<ComponentCheckoutVoucherProps>(), {
    disabled: false
})

// Composables
const { addPromotionCode, removeItem, appliedPromotionCodes } = useCart()
const { getFormattedPrice } = usePrice()
const { resolveApiErrors } = useApiErrorsResolver()
const { success, error } = useGlobalNotifications()
const { t } = useI18n()

// State
const voucherCode = ref('')
const isLoading = ref(false)
const isRemovingPromotion = ref<string | null>(null)

// Methods
const handleApplyVoucher = async () => {
    if (!voucherCode.value.trim() || isLoading.value || props.disabled) return

    isLoading.value = true

    try {
        await addPromotionCode(voucherCode.value.trim())
        success(t('checkout.voucher.success', { code: voucherCode.value.trim() }))
        voucherCode.value = ''
    } catch (apiError) {
        if (apiError instanceof ApiClientError) {
            const errorMessages = resolveApiErrors(apiError.details.errors)
            error(errorMessages.join(', ') || t('checkout.voucher.unknownError'))
        } else {
            error(apiError instanceof Error ? apiError.message : t('checkout.voucher.unknownError'))
        }
    } finally {
        isLoading.value = false
    }
}

const handleRemoveVoucher = async (promotion: Schemas["LineItem"]) => {
    if (isRemovingPromotion.value || props.disabled) return

    isRemovingPromotion.value = promotion.id

    try {
        await removeItem(promotion)
        success(t('checkout.voucher.removed', { code: promotion.label }))
    } catch (apiError) {
        if (apiError instanceof ApiClientError) {
            const errorMessages = resolveApiErrors(apiError.details.errors)
            error(errorMessages.join(', ') || t('checkout.voucher.unknownError'))
        } else {
            error(apiError instanceof Error ? apiError.message : t('checkout.voucher.unknownError'))
        }
    } finally {
        isRemovingPromotion.value = null
    }
}
</script>