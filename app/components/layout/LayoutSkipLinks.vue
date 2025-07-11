<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface SkipLink {
    id: string;
    text: string;
}

const { t } = useI18n()
const props = defineProps<{
    customLinks?: SkipLink[]
}>()

// Default skip links to important page sections
const defaultLinks: SkipLink[] = [
    { id: 'header', text: t('skipLinks.header') },
    { id: 'main', text: t('skipLinks.main') },
    { id: 'footer', text: t('skipLinks.footer') }
]

// Combine default and custom links
const skipLinks = computed<SkipLink[]>(() => {
    return [...defaultLinks, ...(props.customLinks || [])]
})
const handleSkip = (id: string): void => {
    const target = document.getElementById(id) ||
        document.querySelector(`#${id}, ${id}, [data-skip-id="${id}"]`) as HTMLElement
    if (target) {
        // Ensure the target is focusable
        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1')
        }
        target.focus()
        // Remove tabindex after focus for proper tab order
        setTimeout(() => {
            if (target.getAttribute('tabindex') === '-1') {
                target.removeAttribute('tabindex')
            }
        }, 100)
    }
}
</script>
<template>
    <div
        class="
            w-0 h-0 overflow-hidden absolute flex flex-col items-center justify-center py-1 bg-secondary/15
            focus-within:relative focus-within:w-full focus-within:h-auto focus-within:overflow-visible
            md:flex-row md:items-start md:gap-4
        "
        role="navigation"
        :aria-label="$t('skipLinks.label')"
    >
        <FoundationLink
            v-for="link in skipLinks"
            :key="link.id"
            :to="`#${link.id}`"
            class="btn btn-ghost text-sm border-transparent hover:bg-transparent hover:border-transparent underline"
            @click.prevent="handleSkip(link.id)"
            @keydown.prevent.enter="handleSkip(link.id)"
        >
            {{ link.text }}
        </FoundationLink>
    </div>
</template>