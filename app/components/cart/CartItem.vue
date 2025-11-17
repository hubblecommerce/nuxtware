<script setup lang="ts">
import type { Schemas } from '#shopware'

interface CartItemProps {
    item: Schemas['LineItem']
    showControls?: boolean
}

const props = withDefaults(defineProps<CartItemProps>(), {
    showControls: true
})

const emit = defineEmits<{
    'update:quantity': [quantity: number]
    'remove': []
}>()

const { getFormattedPrice } = usePrice()

const itemPrice = computed(() => {
    return props.item.price?.totalPrice || 0
})

// Method to handle quantity updates
const updateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
        emit('remove')
        return
    }
    
    emit('update:quantity', newQuantity)
}

// Method to handle item removal
const removeItem = () => {
    emit('remove')
}
</script>

<template>
    <div class="flex gap-4 py-4 border-b border-border last:border-b-0">
        <!-- Product image -->
        <div class="relative w-20 h-20 flex-shrink-0 rounded">
            <FoundationImage
                v-if="item.cover?.media?.url"
                :src="item.cover.media.url"
                :alt="item.label || ''"
                class="w-full h-full object-cover rounded"
            />
            <div v-else class="w-full h-full flex items-center justify-center ">
                <FoundationIcon name="image" class="w-6 h-6" aria-hidden="true" />
            </div>
        </div>

        <!-- Product details -->
        <div class="flex-1 min-w-0">
            <div class="flex justify-between">
                <h3 class="text-sm font-medium" :title="item.label">
                    {{ item.label }}
                </h3>
                <p class="text-sm font-medium  ml-4">
                    {{ getFormattedPrice(itemPrice) }}
                </p>
            </div>

            <!-- Product variant details if available -->
            <div v-if="item.payload?.options?.length" class="mt-1">
                <p v-for="(option, index) in item.payload.options" :key="index" class="text-xs">
                    {{ option.group }}: {{ option.option }}
                </p>
            </div>
            
            <div class="mt-2 flex items-center justify-between">
                <!-- Quantity control -->
                <div v-if="showControls" class="flex items-center border rounded">
                    <FoundationButton
                        aria-label="Decrease quantity"
                        size="small"
                        @click="updateQuantity(item.quantity - 1)"
                >
                        <FoundationIcon name="minus" class="w-2 h-2" aria-hidden="true" />
                    </FoundationButton>
                    <span class="px-2 text-sm">{{ item.quantity }}</span>
                    <FoundationButton
                        aria-label="Increase quantity"
                        size="small"
                        @click="updateQuantity(item.quantity + 1)"
                    >
                        <FoundationIcon name="plus" class="w-2 h-2" aria-hidden="true" />
                    </FoundationButton>
                </div>
                <div v-else class="text-sm ">
                    {{ $t('cart.quantity') }}: {{ item.quantity }}
                </div>

                <!-- Remove button -->
                <FoundationButton
                    v-if="showControls"
                    class="text-sm"
                    size="small"
                    square
                    :aria-label="$t('cart.remove')"
                    @click="removeItem"
                >
                    <FoundationIcon name="trash" class="w-2 h-2" aria-hidden="true" />
                </FoundationButton>
            </div>
        </div>
    </div>
</template>
