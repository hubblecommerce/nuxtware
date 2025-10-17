<script setup lang="ts">
const banderoleItems = [
    'Gratis Versand ab 75€',
    '30 Tage Rückgaberecht',
    'Kostenlose Rücksendung'
]
</script>
<template>
    <div class="mx-auto w-full max-w-8xl p-2">
        <h1 class="text-2xl font-bold mb-6">Skeleton Banderole Examples</h1>

        <h2 class="text-xl font-bold mb-3">Default blinking animation mobile</h2>
        <h3 class="text-lg font-bold mb-2">No icons</h3>
        <div class="bg-border w-full">
            <div class="relative px-6 h-6">
                <ComponentBanderole
                    :items="banderoleItems"
                    :icons="null"
                />
            </div>
        </div>

        <h3 class="text-lg font-bold mb-2">Different icons</h3>
        <div class="bg-border w-full">
            <div class="relative px-6 h-6">
                <ComponentBanderole
                    :items="banderoleItems"
                    :icons="['check', 'plus', 'cart']"
                />
            </div>
        </div>

        <h3 class="text-lg font-bold mb-2">All the same icons</h3>
        <div class="bg-border w-full">
            <div class="relative px-6 h-6">
                <ComponentBanderole
                    :items="banderoleItems"
                    :icons="['check']"
                />
            </div>
        </div>

        <h2 class="text-xl font-bold mb-3">Flow animation</h2>
        <div class="bg-border w-full">
            <div class="relative px-4 h-6">
                <ComponentBanderole
                    animation="flow"
                    :items="banderoleItems"
                    :icons="['check']"
                />
            </div>
        </div>
    </div>
</template>