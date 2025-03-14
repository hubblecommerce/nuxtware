<script setup lang="ts">
import { getCategoryRoute } from '@shopware/helpers'
import type { Schemas } from '#shopware'

const props = withDefaults(defineProps<{
    items: Schemas["Category"][],
    currentCategory?: Schemas["Category"] | null,
    level?: number
}>(), {
    currentCategory: null,
    level: 0
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['back', 'navigate'])

const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)

const activeSubcategory = ref<Schemas["Category"] | null>(null)
const showMenu = computed(() => props.currentCategory || props.level === 0)

const categoryButtons = shallowRef([])
const backButton = shallowRef()
const subcategoryItems = shallowRef<Record<string, Element | ComponentPublicInstance | null>>({})

defineExpose({ backButton })

function navigateToSubcategory (category: Schemas["Category"]) {
    // open subcategory
    activeSubcategory.value = category

    // focus "back" button of child component instance by ref
    setTimeout(() => {
        if (activeSubcategory?.value?.id != null) {
            subcategoryItems?.value?.[activeSubcategory?.value?.id]?.backButton.button.focus()
        }
    }, 200)
}

function navigateBack () {
    const parentId = activeSubcategory?.value?.id
    // close subcategory
    activeSubcategory.value = null
    // focus "category" button of this component instance by ref and button id
    nextTick(() => {
        categoryButtons.value.find(item => item.button.id === parentId)?.button?.focus()
    })
}
</script>

<template>
    <div
        class="absolute top-0 left-0 w-full h-full overflow-y-scroll overflow-x-hidden bg-white no-scrollbar transition-transform duration-300"
        :class="showMenu ? 'translate-x-0' : 'translate-x-full'"
        :inert="!!(activeSubcategory || !showMenu)"
        v-bind="$attrs"
    >
        <template v-if="level > 0">
            <FoundationButton
                ref="backButton"
                class="w-full flex justify-start items-center gap-2 p-4 h-14 border-b rounded-none"
                :aria-label="$t('sidenav.menu.mobile.backDescription')"
                @click="$emit('back')"
            >
                <FoundationIcon name="chevron-left" /> {{ $t('sidenav.menu.mobile.back') }}
            </FoundationButton>
        </template>
        <ul>
            <template v-if="level > 0">
                <li>
                    <FoundationLink
                        v-if="currentCategory"
                        :href="formatLink(getCategoryRoute(currentCategory))"
                        class="block p-4 border-b rounded-none"
                        @click="$emit('navigate')"
                    >
                        {{ currentCategory.name }} {{ $t('sidenav.menu.mobile.allOfCategory') }}
                    </FoundationLink>
                </li>
            </template>
            <li v-for="item in items" :key="item.id">
                <template v-if="item.children && item.children.length">
                    <FoundationButton
                        :id="item.id"
                        ref="categoryButtons"
                        class="w-full flex justify-between items-center gap-2 p-4 h-14 border-b rounded-none"
                        :aria-label="`${$t('sidenav.menu.mobile.openSubCategory')}: ${item.name}`"
                        @click="navigateToSubcategory(item)"
                    >
                        {{ item.name }}
                        <FoundationIcon name="chevron-right" />
                    </FoundationButton>
                </template>
                <template v-else>
                    <FoundationLink :href="formatLink(getCategoryRoute(item))" class="block p-4 border-b rounded-none" @click="$emit('navigate')">
                        {{ item.name }}
                    </FoundationLink>
                </template>
            </li>
        </ul>
    </div>

    <div v-for="item in items" :key="`subcategory-${item.id}`">
        <SidenavMenuRecursive
            v-if="item.children && item.children.length"
            :ref="(el) => (subcategoryItems[item.id] = el)"
            :items="item.children"
            :current-category="activeSubcategory"
            :level="level + 1"
            @back="navigateBack"
            @navigate="$emit('navigate')"
        />
    </div>
</template>
