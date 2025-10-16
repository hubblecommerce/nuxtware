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
        <div class="mx-auto w-full max-w-8xl px-2">
            <ul class="flex justify-center items-center flex-wrap">
                <li
                    v-for="item in navigationItems"
                    :key="item.id"
                    class="btn btn-no-animation"
                    @mouseenter.passive="item.children.length ? openPopover(item.id) : clearPopoverTimeout()"
                >
                    <FoundationLink
                        :href="formatLink(getCategoryRoute(item))"
                        itemprop="url"
                        class="btn px-0 hover:underline"
                        @click="closePopover()"
                    >
                        <span itemprop="name">{{ item.name }}</span>
                    </FoundationLink>

                    <FoundationButton
                        v-if="item.children.length"
                        square
                        size="small"
                        :aria-expanded="activeItem"
                        :aria-controls="`menu-${item.id}`"
                        @click="openPopover(item.id, { focusTrap: true, delay: 0 })"
                    >
                        <span class="sr-only">{{ $t('megaMenu.firstLevel.openChildren', { category: item.name }) }}</span>
                        <FoundationIcon :name="activeItem ? 'chevron-up' : 'chevron-down'" />
                    </FoundationButton>
                </li>
            </ul>
        </div>
        <div
            v-show="openedCategory"
            ref="megaMenuPopover"
            class="absolute top-full -mt-px left-0 bg-white shadow-lg border-t border-border p-10 z-50 w-full"
            @mouseleave="closePopover()"
        >
            <div class="mx-auto w-full max-w-8xl px-2 relative">
                <FoundationButton
                    size="small"
                    square
                    class="absolute top-0 right-0"
                    @click="closePopover()"
                >
                    <span class="sr-only">{{ $t('megaMenu.popOver.close') }}</span>
                    <FoundationIcon name="x" />
                </FoundationButton>
                <template v-for="item in navigationItems" :key="item.id">
                    <div
                        v-show="openedCategory === item.id && activeItem?.children?.length"
                        :id="`menu-${item.id}`"
                        class="flex flex-wrap items-start gap-8"
                    >
                        <MegaMenuItem
                            v-for="subItem in item.children"
                            v-show="activeItem"
                            :key="subItem.id"
                            class="font-semibold text-neutral"
                            :item="subItem"
                            @navigate="closePopover()"
                        />
                    </div>
                </template>
            </div>
        </div>
    </nav>
</template>
