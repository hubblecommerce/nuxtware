<script setup lang="ts">
/*
    Accepts arrays of text items and icon names.
    Please provide as many icons as text items if each text item should have a different icon.
    Only provide one icon name if each text should have the same icon.
    Two built in animation types, blink and flow or default no animation.
    If an animation is chosen, this will be used on every device.
 */
const props = withDefaults(
    defineProps<{
        animation?: 'blink' | 'flow' | null,
        items: string[],
        icons?: string[]
    }>(),
    {
        animation: null,
        icons: ['check']
    },
)

const activeUsp = ref(0)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
    if (props.animation != 'flow') {
        interval = setInterval(setActiveUsp, 3000)
    }
})
onUnmounted(() => {
    clearInterval(interval)
})

function setActiveUsp () {
    const length = props.items.length

    if (activeUsp.value < length - 1) {
        activeUsp.value++
    } else {
        activeUsp.value = 0
    }
}

function getIcon(index: number): string {
    if (props.icons) {
        if (props.items.length === props.icons.length) {
            return props.icons[index] ?? ''
        } else return props.icons[0] ?? ''
    } else return ''
}
</script>
<template>
    <div
        class="m-auto text-xs leading-6 flex justify-center items-center gap-4 lg:gap-16 overflow-hidden"
        :class="[props.animation === 'flow' ? 'justify-start' : 'justify-center']"
    >
        <!-- FLOW ANIMATION -->
        <div
            v-if="props.animation === 'flow'"
            class="flex items-center gap-4 lg:gap-16 animate-flow"
        >
        <!-- duplication to fill the banderole while scrolling, adjust dependent on props.items length -->
            <template v-for="i in 3" :key="i">
                <template v-for="(item, index) in props.items" :key="index">
                    <div class="banderole-item text-xs leading-6 flex justify-center items-center gap-1 shrink-0">
                        <template v-if="props.icons != null">
                            <FoundationIcon
                                :name="getIcon(index)"
                                size="sm"
                                aria-hidden="true"
                            />
                        </template>
                        {{ $t(item) }}
                    </div>
                </template>
            </template>
        </div>

        <!-- BLINKING ANIMATION -->
        <template v-else>
            <div
                class="flex items-center gap-4 lg:gap-16"
                :class="{'animate-blink' : props.animation === 'blink'}"
            >
                <div
                    v-for="(item, index) in props.items"
                    :key="index"
                    class="banderole-item text-xs leading-6 flex justify-center items-center gap-1"
                    :class="[
                        index === activeUsp ? 'is-active' : 'hidden md:flex'
                    ]"
                >
                    <template v-if="props.icons != null">
                        <FoundationIcon
                            :name="getIcon(index)"
                            size="sm"
                            aria-hidden="true"
                        />
                    </template>
                    {{ $t(item) }}
                </div>
            </div>
        </template>
    </div>
</template>
