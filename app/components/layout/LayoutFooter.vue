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
    <footer>
        <fieldset class="container m-auto p-2">
            <FormsNewsletter />
        </fieldset>
        <div class="border-border border-t">
            <div class="container m-auto px-2">
                <section class="flex flex-col sm:flex-row sm:gap-6 m-auto py-6">
                    <FooterNavigation :navigation="footerNavigation" />
                </section>
            </div>
        </div>
        <div class="bg-border-light flex flex-col lg:gap-0 py-6">
            <div class="container m-auto px-2">
                <section class="flex flex-wrap justify-start text-sm underline gap-4 pb-4">
                    <FooterServiceNavigation :navigation="serviceNavigation" />
                </section>
                <p>{{ $t('layout.footerLight.copyright', { 'year': new Date().getFullYear() }) }}</p>
            </div>
        </div>
    </footer>
</template>
