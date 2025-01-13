<script setup lang="ts">
import type { CmsElementText } from "@shopware-pwa/composables-next";

const props = defineProps<{
    content: CmsElementText;
}>();
</script>

<template>
    <div>
        {{ props.content.data.content }}
    </div>
</template>
