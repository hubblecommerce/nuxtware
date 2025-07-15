<script setup lang="ts">
import type { Schemas } from '#shopware'
import { getCategoryRoute } from '@shopware/helpers'

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

defineProps<{
    item: Schemas["Category"]
}>()

defineEmits(['navigate'])
</script>

<template>
    <FoundationLink
        v-if="!item.children.length"
        :href="formatLink(getCategoryRoute(item))"
        itemprop="url"
        @click="$emit('navigate')"
    >
        {{ item.name }}
    </FoundationLink>

    <div v-else class="flex flex-col gap-2">
        <FoundationLink :href="formatLink(getCategoryRoute(item))" class="font-semibold text-neutral">
            {{ item.name }}
        </FoundationLink>

        <div v-if="item.children.length" class="flex flex-col">
            <MegaMenuItem
                v-for="childItem in item.children"
                :key="childItem.id"
                :item="childItem"
                class="font-normal text-neutral text-sm"
                itemprop="url"
                @click="$emit('navigate')"
                @navigate="$emit('navigate')"
            />
        </div>
    </div>
</template>
