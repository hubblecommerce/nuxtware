<script setup lang="ts">
import type { Schemas } from '#shopware';
import { getTranslatedProperty } from '@shopware/helpers'

interface ListingFilter {
    code: string;
    label: string;
    name: string;
    options: Array<Schemas['PropertyGroupOption'] & { count: number }>;
    entities: Array<Schemas['ProductManufacturer'] & { count: number }>;
}

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
}>();

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();
</script>

<template>
    <div class="flex flex-col">
        <FoundationLabel v-for="option in filter.options || filter.entities" :key="option.id">
            <FoundationCheckbox
                type="checkbox"
                v-model="selectedFilters[filter.options ? 'properties' : 'manufacturer']"
                :value="option.id"
                @change="emits('select-value', {
                  code: props.filter.code,
                  value: option.id,
                })"
            />
            {{ getTranslatedProperty(option, 'name') }}
        </FoundationLabel>
    </div>
</template>