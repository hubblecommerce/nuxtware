<script setup lang="ts">
import { useNavigation } from "#imports";

const props = withDefaults(
    defineProps<{
        depth?: number;
    }>(),
    {
        depth: 0
    },
)

const { loadNavigationElements } = useNavigation({ type: "service-navigation" })
const serviceNavigation = await loadNavigationElements({ depth: props.depth })
</script>
<template>
    <footer class="px-6 py-5 bg-border-light flex flex-col lg:gap-0">
        <div class="flex flex-wrap justify-start text-sm underline gap-4 pb-4">
            <FooterServiceNavigation :navigation="serviceNavigation" />
        </div>
        <p>{{ $t('layout.footerLight.copyright', { 'year': new Date().getFullYear() }) }}</p>
    </footer>
</template>
