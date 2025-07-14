<script setup lang="ts">
import type { SelectOption } from '../../types/foundation-select'

interface ContextCurrencySwitchProps {
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'secondary' | 'tertiary' | ''
}

const props = withDefaults(defineProps<ContextCurrencySwitchProps>(), {
    size: 'medium',
    color: ''
})

const { currencies, currencyCookie } = useCurrency()
const { currency: sessionCurrency, setCurrency } = useSessionContext()

const selectedCurrencyId = ref(sessionCurrency.value?.id || '')

const currencyOptions = computed<SelectOption[]>(() => {
    return currencies.value.map((currency) => ({
        value: currency.id,
        label: currency.translated?.name || currency.name || '',
        disabled: false
    }))
})

const onChangeHandler = async (value: string | number) => {
    const selectedCurrency = currencies.value.find((currency) => currency.id === value)

    if (selectedCurrency == null) {
        return
    }

    await setCurrency(selectedCurrency)
    currencyCookie.value = value as string

    window.location.reload()
}

watch(selectedCurrencyId, onChangeHandler)

const currencySwitchId = useId()
</script>

<template>
    <div class="flex justify-between items-center gap-3">
        <FoundationLabel :for="currencySwitchId">
            {{ $t('layout.currency') }}:
        </FoundationLabel>
        <FoundationSelect
            :id="currencySwitchId"
            v-model="selectedCurrencyId"
            :options="currencyOptions"
            :size="props.size"
            :color="props.color"
            :aria-label="$t('form.aria.selectCurrency')"
            :placeholder="$t('layout.selectCurrency')"
            class="w-full flex-1"
        />
    </div>
</template>
