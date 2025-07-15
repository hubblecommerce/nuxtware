<script setup lang="ts">
import { getLanguageName } from '@shopware/helpers'
import type { SelectOption } from '../../types/foundation-select'

interface ContextLanguageSwitchProps {
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'secondary' | 'tertiary' | ''
}

const props = withDefaults(defineProps<ContextLanguageSwitchProps>(), {
    size: 'medium',
    color: ''
})

const { languages, changeLanguage, replaceToDevStorefront } = useInternationalization()
const { languageIdChain } = useSessionContext()

const selectedLanguageId = ref(languageIdChain.value || '')

const languageOptions = computed<SelectOption[]>(() => {
    return languages.value.map((language) => ({
        value: language.id,
        label: getLanguageName(language) || language.name || '',
        disabled: false
    }))
})

const onChangeHandler = async (value: string | number) => {
    const data = await changeLanguage(value as string)

    if (data.redirectUrl) {
        window.location.replace(replaceToDevStorefront(data.redirectUrl))
    } else {
        window.location.reload()
    }
}

watch(selectedLanguageId, onChangeHandler)

const languageSwitchId = useId()
</script>

<template>
    <div class="flex justify-between items-center gap-3">
        <FoundationLabel :for="languageSwitchId" class="sr-only">
            {{ $t('layout.language') }}:
        </FoundationLabel>
        <FoundationSelect
            :id="languageSwitchId"
            v-model="selectedLanguageId"
            :options="languageOptions"
            :size="props.size"
            :color="props.color"
            :aria-label="$t('form.aria.selectLanguage')"
            :placeholder="$t('layout.selectLanguage')"
            class="w-full flex-1"
        />
    </div>
</template>
