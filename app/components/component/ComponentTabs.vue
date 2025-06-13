<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import type { ComponentTabsProps, ComponentTabsEmits, ComponentTabsSize, ComponentTabsColor } from '../../types/component-tabs'

const props = withDefaults(defineProps<ComponentTabsProps>(), {
    modelValue: '',
    enableHashNavigation: true,
    defaultTab: '',
    size: 'md',
    color: '',
    scrollable: true,
    showBorder: true
})

const emit = defineEmits<ComponentTabsEmits>()

const tabsContainer = ref<HTMLElement>()
const activeTabId = ref<string>('')

const tabsSizes = reactive<Record<ComponentTabsSize, string>>({
    sm: 'tabs-sm',
    md: 'tabs-md',
    lg: 'tabs-lg'
})

const tabsColors = reactive<Record<ComponentTabsColor, string>>({
    '': '',
    primary: 'tabs-primary',
    secondary: 'tabs-secondary',
    tertiary: 'tabs-tertiary'
})

const getActiveTabFromHash = (): string => {
    if (!props.enableHashNavigation) return ''
    const hash = window.location.hash.slice(1)
    return props.tabs.find(tab => tab.id === hash)?.id || ''
}

const updateHash = (tabId: string): void => {
    if (!props.enableHashNavigation) return
    const newUrl = new URL(window.location.href)
    newUrl.hash = tabId
    window.history.replaceState(null, '', newUrl.toString())
}

const setActiveTab = (tabId: string): void => {
    const tab = props.tabs.find(t => t.id === tabId)
    if (!tab || tab.disabled) return

    activeTabId.value = tabId
    updateHash(tabId)
    emit('update:modelValue', tabId)
    emit('tab-change', tabId, tab)
}

const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId)
}

const handleKeydown = (event: KeyboardEvent, tabId: string): void => {
    const currentIndex = props.tabs.findIndex(tab => tab.id === tabId)
    let newIndex = currentIndex

    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault()
            newIndex = currentIndex > 0 ? currentIndex - 1 : props.tabs.length - 1
            break
        case 'ArrowRight':
            event.preventDefault()
            newIndex = currentIndex < props.tabs.length - 1 ? currentIndex + 1 : 0
            break
        case 'Home':
            event.preventDefault()
            newIndex = 0
            break
        case 'End':
            event.preventDefault()
            newIndex = props.tabs.length - 1
            break
        case 'Enter':
        case ' ':
            event.preventDefault()
            setActiveTab(tabId)
            return
        default:
            return
    }

    const newTab = props.tabs[newIndex]
    if (newTab && !newTab.disabled) {
        const tabButton = tabsContainer.value?.querySelector(`[data-tab-id="${newTab.id}"]`) as HTMLElement
        tabButton?.focus()
    }
}

const scrollToTab = (tabId: string): void => {
    if (!props.scrollable || !tabsContainer.value) return
    
    nextTick(() => {
        const tabButton = tabsContainer.value?.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement
        if (tabButton) {
            tabButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    })
}

const initializeActiveTab = (): void => {
    let initialTab = ''
    let hasHashInUrl = false

    if (props.modelValue) {
        initialTab = props.modelValue
    } else if (props.enableHashNavigation) {
        initialTab = getActiveTabFromHash()
        hasHashInUrl = !!window.location.hash
    }

    if (!initialTab || !props.tabs.find(tab => tab.id === initialTab)) {
        initialTab = props.defaultTab || props.tabs[0]?.id || ''
    }

    if (initialTab) {
        activeTabId.value = initialTab
        // Only scroll to tab if there was a hash in the URL or if explicitly set via modelValue
        if (hasHashInUrl || props.modelValue) {
            scrollToTab(initialTab)
        }
    }
}

onMounted(() => {
    initializeActiveTab()

    if (props.enableHashNavigation) {
        const handleHashChange = () => {
            const hashTab = getActiveTabFromHash()
            if (hashTab && hashTab !== activeTabId.value) {
                setActiveTab(hashTab)
                scrollToTab(hashTab)
            }
        }

        window.addEventListener('hashchange', handleHashChange)

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }
})

watch(() => props.modelValue, (newValue) => {
    if (newValue && newValue !== activeTabId.value) {
        setActiveTab(newValue)
        scrollToTab(newValue)
    }
})
</script>

<template>
    <div class="tabs-container">
        <div 
            ref="tabsContainer"
            class="tabs-list"
            :class="[
                'tabs',
                tabsSizes[size],
                tabsColors[color],
                {
                    'tabs-scrollable': scrollable,
                    'tabs-bordered': showBorder
                }
            ]"
            role="tablist"
            :aria-label="$t('tabs.navigation')"
        >
            <FoundationButton
                v-for="tab in tabs"
                :id="`tab-${tab.id}`"
                :key="tab.id"
                :data-tab-id="tab.id"
                variant="ghost"
                :disabled="tab.disabled"
                :un-styled="true"
                class="tab rounded-none"
                :class="{
                    'tab-active': activeTabId === tab.id,
                    'tab-disabled': tab.disabled
                }"
                role="tab"
                :aria-selected="activeTabId === tab.id"
                :aria-controls="`tabpanel-${tab.id}`"
                :tabindex="activeTabId === tab.id ? 0 : -1"
                :aria-disabled="tab.disabled"
                @click="handleTabClick(tab.id)"
                @keydown="handleKeydown($event, tab.id)"
            >
                <slot :name="`tab-${tab.id}`" :tab="tab" :is-active="activeTabId === tab.id">
                    {{ tab.label }}
                </slot>
            </FoundationButton>
        </div>

        <div class="tabs-content">
            <div
                v-for="tab in tabs"
                :id="`tabpanel-${tab.id}`"
                :key="`content-${tab.id}`"
                class="tab-panel"
                :class="{
                    'tab-panel-active': activeTabId === tab.id,
                    'tab-panel-hidden': activeTabId !== tab.id
                }"
                role="tabpanel"
                :aria-labelledby="`tab-${tab.id}`"
                :tabindex="0"
            >
                <slot :name="tab.id" :tab="tab" :is-active="activeTabId === tab.id">
                    <div class="p-4 text-neutral">
                        {{ $t('tabs.noContent', { tabName: tab.label }) }}
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>