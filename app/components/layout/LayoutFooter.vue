<script setup lang="ts">
import { useNavigation } from "#imports";

const props = withDefaults(
    defineProps<{
        depthFooterNavigation?: number;
        depthServiceNavigation?: number;
    }>(),
    {
        depthFooterNavigation: 0,
        depthServiceNavigation: 0
    },
)
const footerNavigationComposable = useNavigation({ type: "footer-navigation" })
const serviceNavigationComposable = useNavigation({ type: "service-navigation" })
const footerNavigation = await footerNavigationComposable.loadNavigationElements({ depth: props.depthFooterNavigation })
const serviceNavigation = await serviceNavigationComposable.loadNavigationElements({ depth: props.depthServiceNavigation })
</script>
<template>
    <footer class="mt-2 lg:mt-8">
        <div class="border-primary border-t">
            <section class="flex flex-col sm:flex-row sm:gap-6 m-auto p-6">
                <FooterNavigation :navigation="footerNavigation" />
            </section>
        </div>
        <div class="px-6 py-5 bg-border-light flex flex-col lg:gap-0">
            <section class="flex flex-wrap justify-start text-sm underline gap-4 pb-4">
                <FooterServiceNavigation :navigation="serviceNavigation" />
            </section>
            <p>{{ $t('layout.footerLight.copyright', { 'year': new Date().getFullYear() }) }}</p>
        </div>
    </footer>
</template>
