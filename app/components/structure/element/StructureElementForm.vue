<script setup lang="ts">
import type { CmsElementForm } from '@shopware/composables'

const props = defineProps<{
    content: CmsElementForm
}>()

const formType = computed(() => {
    return props.content.config.type.value
})
</script>
<template>
    <div>
        <!-- Other form type components here -->
        <LazyFormsNewsletter
            v-if="formType === 'newsletter'"
            :content="props.content"
        />
    </div>

</template>