<script setup lang="ts">
import { resolveComponent } from 'vue'
import type { CmsBlockCenterText } from '@shopware/composables'

const props = defineProps<{
    content: CmsBlockCenterText
}>()

const { getCmsSlot, getCmsElementName } = useCms()

const centerContent = computed(() => getCmsSlot(props.content, 'center'))
</script>

<template>
    <div class="cms-block-center-text text-center">
        <component
            :is="resolveComponent(getCmsElementName(centerContent?.type))"
            v-if="centerContent"
            :content="centerContent"
        />
    </div>
</template>