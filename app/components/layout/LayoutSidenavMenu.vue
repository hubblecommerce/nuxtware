<script setup lang="ts">
const mobileMenuOpen = ref(false)
const sidenavMenuOpenButton = shallowRef()
const sidenavMenuCloseButton = shallowRef()

watch(mobileMenuOpen, (value) => {
    if (value === true) {
        nextTick(() => {
            sidenavMenuCloseButton?.value?.button?.focus()
        })
    }

    if (value === false) {
        sidenavMenuOpenButton?.value?.button?.focus()
    }
})

function closeNavigation () {
    mobileMenuOpen.value = false
    sidenavMenuOpenButton?.value?.button?.focus()
}
</script>

<template>
    <FoundationButton
        ref="sidenavMenuOpenButton"
        size="medium"
        variant="ghost"
        class="flex-shrink-0 w-12 order-[10] lg:hidden"
        square
        :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
        @click="mobileMenuOpen = true"
    >
        <span class="sr-only">{{ $t('sidenav.menu.open') }}</span><FoundationIcon name="menu" />
    </FoundationButton>

    <LayoutSidenavOverlay v-model="mobileMenuOpen" class="bg-white" width-class="w-[90%] lg:w-[400px]">
        <nav class="min-w-[300px] p-2">
            <div class="flex justify-between items-center">
                <h2>{{ $t('sidenav.menu.title') }}</h2>
                <FoundationButton
                    ref="sidenavMenuCloseButton"
                    size="medium"
                    variant="ghost"
                    square
                    @click="closeNavigation()"
                >
                    <span class="sr-only">{{ $t('sidenav.menu.close') }}</span>
                    <FoundationIcon name="x" />
                </FoundationButton>

                
            </div>
        </nav>
    </LayoutSidenavOverlay>
</template>
