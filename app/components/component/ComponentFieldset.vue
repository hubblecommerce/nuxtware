<script setup lang="ts">
interface ComponentFieldsetProps {
    /**
     * Headline text for the legend
     * @default undefined
     */
    headline?: string
    /**
     * Description text for the legend
     * @default undefined
     */
    description?: string
    /**
     * Whether to show the legend
     * Set to false to hide the legend completely
     * @default true
     */
    legend?: boolean
}

withDefaults(defineProps<ComponentFieldsetProps>(), {
    headline: undefined,
    description: undefined,
    legend: true
})
</script>

<template>
    <fieldset class="space-y-6 p-6 border border-border rounded-lg bg-surface">
        <legend
            v-if="legend && (headline || description)"
            class="px-4 mb-0 -ml-4"
        >
            <FoundationHeadline
                v-if="headline"
                tag="h3"
                class="text-lg font-medium mb-2"
            >
                {{ headline }}
            </FoundationHeadline>
            <span v-if="description" class="block text-sm">
                {{ description }}
            </span>
        </legend>

        <slot />
    </fieldset>
</template>
