<template>
    <div class="bg-border w-full" role="region" aria-labelledby="topbarHeadline">
        <span id="topbarHeadline" class="sr-only">{{ $t('topBar.headline') }}</span>
        <section class="m-auto flex flex-row justify-center gap-4 lg:gap-16 items-center relative px-6 max-w-screen-3xl overflow-hidden h-6">
            <client-only>
                <template v-if="salesChannelCountryId != null && uspsByShippingCountry[salesChannelCountryId] != null">
                    <div
                        v-for="(usp, index) in uspsByShippingCountry[salesChannelCountryId]"
                        :key="index"
                        class="usp-item text-xs leading-6 flex justify-center items-center gap-1"
                    >
                        <FoundationIcon name="check" size="sm" aria-hidden="true" />
                        <template v-if="usp.trim() !== ''">
                            {{ $t(usp) }}
                        </template>
                        <template v-else>
                            {{ $t(uspsByShippingCountry.fallback[index]) }}
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div
                        v-for="(usp, index) in uspsByShippingCountry.fallback"
                        :key="index"
                        class="text-xs leading-6 flex justify-center items-center gap-1"
                    >
                        <FoundationIcon name="check" size="sm" aria-hidden="true" />
                        {{ $t(usp) }}
                    </div>
                </template>
            </client-only>
        </section>
    </div>
</template>

<script setup lang="ts">
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
