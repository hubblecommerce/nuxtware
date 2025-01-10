<script setup lang="ts">
const props = defineProps<{
    navigationId: string;
}>();
</script>

<template>
    <div>
        Detail: {{ navigationId }}
    </div>
</template>
