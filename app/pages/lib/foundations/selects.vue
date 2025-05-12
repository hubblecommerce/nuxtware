<template>
    <div class="container mx-auto py-8 px-4">
        <h1 class="text-3xl font-bold mb-8">Foundation Select Examples</h1>

        <!-- Basic Examples -->
        <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-4">Basic Examples</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-medium mb-2">Default Select</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        placeholder="Select an option"
                    />
                    <p class="mt-2 text-sm text-gray-600">Selected: {{ selectedValue }}</p>
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">With Error</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        placeholder="Select an option"
                        error
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Disabled</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        placeholder="Select an option"
                        disabled
                    />
                </div>
            </div>
        </section>

        <!-- With Icons -->
        <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-4">With Icons</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-medium mb-2">User Icon</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        placeholder="Select a user"
                    >
                        <template #icon>
                            <FoundationIcon name="user" />
                        </template>
                    </FoundationSelect>
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Search Icon</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        placeholder="Search options"
                    >
                        <template #icon>
                            <FoundationIcon name="search" />
                        </template>
                    </FoundationSelect>
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Search Icon with Error</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        placeholder="Search options"
                        error
                    >
                        <template #icon>
                            <FoundationIcon name="search" />
                        </template>
                    </FoundationSelect>
                </div>
            </div>
        </section>

        <!-- Size Variants -->
        <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-4">Size Variants</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-lg font-medium mb-2">Small</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        size="small"
                        placeholder="Small select"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Medium (Default)</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        size="medium"
                        placeholder="Medium select"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Large</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        size="large"
                        placeholder="Large select"
                    />
                </div>
            </div>
        </section>

        <!-- Color Variants -->
        <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-4">Color Variants</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 class="text-lg font-medium mb-2">Default (No Color)</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color=""
                        placeholder="Default color"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Primary</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color="primary"
                        placeholder="Primary color"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Secondary</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color="secondary"
                        placeholder="Secondary color"
                    />
                </div>
            </div>
            <div>
                <h3 class="text-lg font-medium mb-2">Tertiary</h3>
                <FoundationSelect
                    v-model="selectedValue"
                    :options="options"
                    color="tertiary"
                    placeholder="Tertiary color"
                />
            </div>
        </section>

        <!-- Combinations -->
        <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-4">Combinations</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-lg font-medium mb-2">Primary Small</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color="primary"
                        size="small"
                        placeholder="Primary small"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Secondary Large</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color="secondary"
                        size="large"
                        placeholder="Secondary large"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Primary with Error</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color="primary"
                        error
                        placeholder="Primary with error"
                    />
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Tertiary with Icon</h3>
                    <FoundationSelect
                        v-model="selectedValue"
                        :options="options"
                        color="tertiary"
                        placeholder="Tertiary with icon"
                    >
                        <template #icon>
                            <FoundationIcon name="info" />
                        </template>
                    </FoundationSelect>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SelectOption } from '#imports'

const selectedValue = ref<string | number>('')

const options = ref<SelectOption[]>([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' }
])
</script>
