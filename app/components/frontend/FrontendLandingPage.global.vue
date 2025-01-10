<script setup lang="ts">
const props = defineProps<{
    navigationId: string;
}>();
</script>

<template>
    <div>
        Landing: {{ navigationId }}
    </div>
</template>
