<script setup lang="ts">
import type { Schemas } from '#shopware'
import { getCategoryRoute } from '@shopware-pwa/helpers-next'
import { onClickOutside } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const navigationItems = inject('mainNavigation') as Schemas["NavigationRouteResponse"]
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
const openedCategory = ref<string | null>(null)
const megaMenuEl = shallowRef()
const megaMenuPopover = shallowRef()

onClickOutside(megaMenuEl, () => openedCategory.value = null)
const { activate, deactivate } = useFocusTrap(megaMenuPopover, { allowOutsideClick: true })

async function openPopover (id: string) {
    openedCategory.value = id
    await nextTick()
    activate()
}

async function closePopover () {
    deactivate()
    openedCategory.value = null
}

// Lazy Execution with Hover Validation
function delayedHover (e: MouseEvent, item: Schemas["Category"]) {
    setTimeout(() => (e?.target as HTMLElement | null)?.matches(':hover') ? openPopover(item.id) : null, 300)
}
</script>

<template>
    <nav
        ref="megaMenuEl"
        itemscope
        itemtype="https://schema.org/SiteNavigationElement"
        :aria-label="$t('megaMenu.title')"
        class="w-full relative"
    >
        <ul class="flex justify-start items-center flex-wrap">
            <li
                v-for="item in navigationItems"
                :key="item.id"
                class="btn text-primary-content"
                @mouseenter="item.children.length ? delayedHover($event, item) : null"
            >
                <FoundationLink
                    :href="formatLink(getCategoryRoute(item))"
                    itemprop="url"
                    class="btn px-1"
                    @click="closePopover()"
                >
                    <span itemprop="name">{{ item.name }}</span>
                </FoundationLink>

                <FoundationButton
                    v-if="item.children.length"
                    square
                    size="small"
                    :aria-expanded="item.children.length && openedCategory === item.id"
                    :aria-controls="`menu-${item.id}`"
                    @click="openPopover(item.id)"
                >
                    <span class="sr-only">{{ $t('megaMenu.firstLevel.openChildren', { category: item.name }) }}</span>
                    <FoundationIcon v-show="openedCategory === item.id" name="chevron-up" />
                    <FoundationIcon v-show="openedCategory !== item.id" name="chevron-down" />
                </FoundationButton>
            </li>
        </ul>
        <div
            v-show="openedCategory"
            ref="megaMenuPopover"
            class="container absolute top-full left-0 bg-white border p-10"
        >
            <FoundationButton
                size="small"
                square
                class="absolute top-2 right-2"
                @click="closePopover()"
            >
                <span class="sr-only">{{ $t('megaMenu.popOver.close') }}</span>
                <FoundationIcon name="x" />
            </FoundationButton>
            <template v-for="item in navigationItems" :key="item.id">
                <div
                    v-show="item.children.length && openedCategory === item.id"
                    :id="`menu-${item.id}`"
                    class="flex flex-wrap items-start gap-8"
                >
                    <LayoutNavigationMegaMenuItem
                        v-for="subItem in item.children"
                        v-show="openedCategory === item.id"
                        :key="subItem.id"
                        :item="subItem"
                        @navigate="closePopover()"
                    />
                </div>
            </template>
        </div>
    </nav>
</template>
