<script setup lang="ts">
import type { Schemas } from '#shopware'
import { getCategoryRoute } from '@shopware/helpers'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const navigationItems = inject('mainNavigation') as Schemas["NavigationRouteResponse"] ?? []
const localePath = useLocalePath()
const { formatLink } = useInternationalization(localePath)
const openedCategory = shallowRef<string | null>(null)
const megaMenuEl = shallowRef()
const megaMenuPopover = shallowRef()
let popoverTimeout: ReturnType<typeof setTimeout> | null = null

const { activate, deactivate } = useFocusTrap(megaMenuPopover, { allowOutsideClick: true })

const activeItem = computed(() =>
    navigationItems.value.find((item: Schemas["Category"]) => item.id === openedCategory.value)
)

async function openPopover (
    id: string,
    { focusTrap = false, delay = 500 }: { focusTrap?: boolean; delay?: number } = {}
) {
    clearPopoverTimeout()

    popoverTimeout = setTimeout(async () => {
        openedCategory.value = id

        if (focusTrap) {
            await nextTick()
            activate()
        }
    }, delay)
}

async function closePopover () {
    clearPopoverTimeout()

    if (openedCategory.value != null) {
        deactivate()
        openedCategory.value = null
    }
}

function clearPopoverTimeout () {
    if (popoverTimeout) {
        clearTimeout(popoverTimeout)
        popoverTimeout = null
    }
}
</script>

<template>
    <nav
        ref="megaMenuEl"
        itemscope
        itemtype="https://schema.org/SiteNavigationElement"
        :aria-label="$t('megaMenu.title')"
        class="w-full relative"
        @mouseleave="closePopover()"
    >
        <ul class="flex justify-start items-center flex-wrap">
            <li
                v-for="item in navigationItems"
                :key="item.id"
                class="btn text-primary-content hover:bg-primary no-animation"
                @mouseenter.passive="item.children.length ? openPopover(item.id) : clearPopoverTimeout()"
            >
                <FoundationLink
                    :href="formatLink(getCategoryRoute(item))"
                    itemprop="url"
                    class="btn hover:bg-primary px-1"
                    @click="closePopover()"
                >
                    <span itemprop="name">{{ item.name }}</span>
                </FoundationLink>

                <FoundationButton
                    v-if="item.children.length"
                    square
                    size="small"
                    class="hover:bg-primary"
                    :aria-expanded="activeItem"
                    :aria-controls="`menu-${item.id}`"
                    @click="openPopover(item.id, { focusTrap: true, delay: 0 })"
                >
                    <span class="sr-only">{{ $t('megaMenu.firstLevel.openChildren', { category: item.name }) }}</span>
                    <FoundationIcon :name="activeItem ? 'chevron-up' : 'chevron-down'" />
                </FoundationButton>
            </li>
        </ul>
        <div
            v-show="openedCategory"
            ref="megaMenuPopover"
            class="container absolute top-full -mt-px left-0 bg-white border p-10 z-50"
            @mouseleave="closePopover()"
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
                    v-show="activeItem?.children?.length"
                    :id="`menu-${item.id}`"
                    class="flex flex-wrap items-start gap-8"
                >
                    <MegaMenuItem
                        v-for="subItem in item.children"
                        v-show="activeItem"
                        :key="subItem.id"
                        :item="subItem"
                        @navigate="closePopover()"
                    />
                </div>
            </template>
        </div>
    </nav>
</template>
