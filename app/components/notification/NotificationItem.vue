<script setup lang="ts">
interface NotificationItemProps {
    id: string
    type: NotificationType
    message: string
    progress: number
    onClose: (id: string) => void
}

const props = defineProps<NotificationItemProps>()
const { registerNotificationElement } = useGlobalNotifications()

const notificationRef = ref<HTMLDivElement | null>(null)

// Handle animation for entering
onMounted(() => {
    if (notificationRef.value) {
        // Register the element for exit animations
        registerNotificationElement(props.id, notificationRef.value)
        
        // Initial state (for enter animation)
        notificationRef.value.style.opacity = '0'
        notificationRef.value.style.transform = 'translateX(20px)'
        
        // Trigger enter animation after a small delay
        setTimeout(() => {
            if (notificationRef.value) {
                notificationRef.value.style.opacity = '1'
                notificationRef.value.style.transform = 'translateX(0)'
            }
        }, 10)
    }
})

const typeClasses = computed(() => {
    switch (props.type) {
        case 'success':
            return {
                bg: 'bg-success-light',
                border: 'border-success',
                text: 'text-success',
                progress: 'bg-success/10',
                icon: 'check'
            }
        case 'error':
            return {
                bg: 'bg-error-light',
                border: 'border-error',
                text: 'text-error',
                progress: 'bg-error/10',
                icon: 'x'
            }
        case 'warning':
            return {
                bg: 'bg-warning-light',
                border: 'border-warning',
                text: 'text-warning',
                progress: 'bg-warning/10',
                icon: 'triangle-alert'
            }
        case 'info':
            return {
                bg: 'bg-info-light',
                border: 'border-info',
                text: 'text-info',
                progress: 'bg-info/30',
                icon: 'info'
            }
        default:
            return {
                bg: 'bg-neutral/10',
                border: 'border-neutral',
                text: 'text-neutral',
                progress: 'bg-neutral/10',
                icon: 'info'
            }
    }
})

// Use the central removeNotification function for consistency
const handleClose = () => {
    props.onClose(props.id)
}
</script>

<template>
    <div
        ref="notificationRef"
        :class="[
            'flex items-center p-4 pr-8 mb-2 border-l-4 rounded shadow-md w-full max-w-sm relative',
            'transition-all duration-300 ease-in-out',
            typeClasses.bg,
            typeClasses.border
        ]"
        role="alert"
        aria-live="polite"
    >
        <!-- Icon -->
        <FoundationIcon 
            :name="typeClasses.icon" 
            :class="['w-4 h-4', typeClasses.text]"
            aria-hidden="true" 
        />
        
        <!-- Message -->
        <div class="ml-3 mr-6 flex-grow">
            <p>{{ message }}</p>
        </div>
        
        <!-- Close button -->
        <FoundationButton
            size="small"
            square
            :aria-label="$t('notification.close')"
            class="absolute top-0 bottom-0 right-2 m-auto"
            @click="handleClose"
        >
            <FoundationIcon 
                name="x" 
                class="w-3 h-3" 
                aria-hidden="true" 
            />
        </FoundationButton>
        
        <!-- Progress bar -->
        <div 
            class="absolute bottom-0 left-0 h-1"
            :class="typeClasses.progress"
            :style="{ width: `${props.progress}%` }"
        />
    </div>
</template>
