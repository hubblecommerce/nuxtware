<script setup lang="ts">
/*
    Option for country-specific messages indexed by sales channel ID.
    If a sales channel should display individual UPSs implement text snippets in i18n JSON language files.
    Create the array that can be accessed via key (sales channel id) with the snippet keys.
 */
interface UspRecord {
    [countryId: string]: string[]
    fallback: string[]
}

const { salesChannelCountryId  } = useSessionContext()
const SWISS_COUNTRY_ID = '123456789'
const uspsByShippingCountry = ref<UspRecord>({
    // example of how to add usps per sales channel
    [SWISS_COUNTRY_ID]: [
        'topBar.benefit1Ch',
        'topBar.benefit2Ch',
        'topBar.benefit3Ch',
    ],
    'fallback': [
        'topBar.benefit1',
        'topBar.benefit2',
        'topBar.benefit3',
    ]
})
</script>
<template>
    <div class="bg-border w-full" role="region" aria-labelledby="topbarHeadline">
        <span id="topbarHeadline" class="sr-only">{{ $t('topBar.headline') }}</span>
        <section class="relative px-6 h-6">
            <client-only>
                <template v-if="salesChannelCountryId != undefined && uspsByShippingCountry[salesChannelCountryId] != undefined">
                    <ComponentBanderole
                        animation="blink"
                        :items="uspsByShippingCountry[salesChannelCountryId]!"
                        :icons="['check']"
                    />
                </template>
                <template v-else>
                    <ComponentBanderole
                        animation="blink"
                        :items="uspsByShippingCountry.fallback"
                    />
                </template>
            </client-only>
        </section>
    </div>
</template>
