<script setup lang="ts">
const { currencies, currencyCookie } = useCurrency()
const { currency: sessionCurrency, setCurrency } = useSessionContext()

async function onChangeHandler (option: Event) {
    const selectedCurrencyId = (option.target as HTMLSelectElement).value
    const selectedCurrency = currencies.value.find((currency) => currency.id === selectedCurrencyId)

    if (selectedCurrency == null) {
        return
    }

    // change currency of session / context
    await setCurrency(selectedCurrency);
    // store as cookie, cookie to be used ssr on app launch
    currencyCookie.value = selectedCurrencyId;

    // Reload page to update catalog prices
    window.location.reload();
}

const currencySwitchId = useId()
</script>

<template>
    <div class="flex justify-between items-center gap-3">
        <label :for="currencySwitchId">
            {{ $t('layout.currency') }}:
        </label>
        <select
            :id="currencySwitchId"
            :aria-label="$t('form.aria.selectCurrency')"
            class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-xs focus:ring-brand-light focus:border-light"
            @change="onChangeHandler"
        >
            <option
                v-for="currency in currencies"
                :key="currency.id"
                :value="currency.id"
                :selected="sessionCurrency?.id === currency.id"
                :label="currency.translated?.name"
            >
                {{ currency.translated?.name }}
            </option>
        </select>
    </div>
</template>
