<script setup lang="ts">
interface ProductQtySelectorProps {
    min: number
    max: number
    inputDisabled: boolean,
}

const props = defineProps<ProductQtySelectorProps>()
const qty = defineModel<number>('qty', { required: true })

const emit = defineEmits<{
    increase: []
    decrease: []
}>()

const uniqueInputId = computed(() => {
    return `quantity-selector-${(Math.random() * 10000).toString()}`
})
function decrement() {
    if (qty.value > props.min) {
        qty.value--
        emit('decrease')
    }
}

function increment() {
    if (qty.value < props.max) {
        qty.value++
        emit('increase')
    }
}
</script>
<template>
    <div class="quantity-selector-container flex justify-evenly items-center border rounded">
        <span class="sr-only">{{ $t('productQtySelector.label') }}</span>

        <FoundationButton
            size="small"
            square
            :disabled="qty === min || inputDisabled"
            :aria-label="$t('productQtySelector.decrease')"
            @click="decrement()"
        >
            <FoundationIcon name="minus" aria-hidden="true" />
        </FoundationButton>

        <div class="quantity-input-container">
            <FoundationLabel
                :id="uniqueInputId"
                class="sr-only"
            >
                {{ $t('productQtySelector.labelInput') }}
            </FoundationLabel>

            <FoundationInput
                :id="uniqueInputId"
                v-model="qty"
                type="number"
                :min="min"
                :max="max"
                :disabled="inputDisabled"
                class="input text-center input-no-spinner p-0"
            />
        </div>

        <FoundationButton
            size="small"
            square
            :disabled="qty === max || inputDisabled"
            :aria-label="$t('productQtySelector.increase')"
            @click="increment()"
        >
            <FoundationIcon name="plus" aria-hidden="true" />
        </FoundationButton>
    </div>
</template>