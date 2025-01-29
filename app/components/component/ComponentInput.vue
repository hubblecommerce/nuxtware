<script setup lang="ts">
import { FoundationInput } from '#components'

withDefaults(defineProps<{
    label: string,
}>(), {

})

const model = defineModel<string>()
const input = ref<InstanceType<typeof FoundationInput>>()

function focus () {
    input?.value?.input?.focus()
}
</script>

<template>
    <div class="form-group">
        <FoundationLabel :for="label">{{ label }}</FoundationLabel>
        <div class="flex items-center input input-bordered" @click="focus()">
            <slot name="input-before" />
            <FoundationInput :id="label" ref="input" v-model="model" class="w-full" />
            <slot name="input-after" />
        </div>
    </div>
</template>
