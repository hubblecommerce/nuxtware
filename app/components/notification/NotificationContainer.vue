<script setup lang="ts">
interface NotificationContainerProps {
    position?: NotificationPosition
    mobilePosition?: MobilePosition
}

const props = withDefaults(defineProps<NotificationContainerProps>(), {
    position: undefined,
    mobilePosition: undefined
})

const {
    notifications,
    removeNotification,
    config
} = useGlobalNotifications()

// Get position from config if not provided in props
const position = computed(() => {
    return props.position || config.value.defaultPosition
})

// Get mobile position from config if not provided in props
const mobilePosition = computed(() => {
    return props.mobilePosition || config.value.defaultMobilePosition
})

const mobilePositionClass = computed(() => {
    return mobilePosition.value === 'top'
        ? 'top-4 left-4 right-4'
        : 'bottom-4 left-4 right-4'
})

const desktopPositionClass = computed(() => {
    switch (position.value) {
        case 'top-left':
            return 'md:top-[140px] md:left-4 md:right-auto md:items-start'
        case 'top-center':
            return 'md:top-[140px] md:left-1/2 md:-translate-x-1/2 md:right-auto md:items-center'
        case 'top-right':
            return 'md:top-[140px] md:right-4 md:left-auto md:items-end'
        case 'bottom-left':
            return 'md:bottom-4 md:left-4 md:right-auto md:items-start'
        case 'bottom-center':
            return 'md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:items-center'
        case 'bottom-right':
            return 'md:bottom-4 md:right-4 md:left-auto md:items-end'
        default:
            return 'md:top-[140px] md:right-4 md:left-auto md:items-end'
    }
})
</script>

<template>
    <div
        :class="[
            'fixed z-50 flex flex-col gap-2 max-h-screen overflow-hidden pointer-events-none',
            mobilePositionClass,
            desktopPositionClass
        ]"
    >
        <NotificationItem
            v-for="notification in notifications"
            :id="notification.id"
            :key="notification.id"
            :type="notification.type"
            :message="notification.message"
            :progress="notification.progress"
            :on-close="removeNotification"
            class="pointer-events-auto"
        />
    </div>
</template>
