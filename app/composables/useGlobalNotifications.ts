export type NotificationType = 'success' | 'error' | 'warning' | 'info'
export type NotificationPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
export type MobilePosition = 'top' | 'bottom'

export interface Notification {
    id: string
    type: NotificationType
    message: string
    duration: number
    keepAlive: boolean
    createdAt: number
    progress: number
}

export interface NotificationOptions {
    type: NotificationType
    message: string
    duration?: number
    keepAlive?: boolean
}

export interface NotificationConfig {
    defaultDuration: number
    defaultPosition: NotificationPosition
    defaultMobilePosition: MobilePosition
    maxNotifications: number
}

// Create a global state that persists between component instances
const notifications = ref<Notification[]>([])
const config = ref<NotificationConfig>({
    defaultDuration: 5000, // 5 seconds default
    defaultPosition: 'top-right',
    defaultMobilePosition: 'top',
    maxNotifications: 5
})

// Create a map to track notification elements for animation
const notificationElements = new Map<string, HTMLElement>()

// Module-level function to remove a notification by ID
const removeNotification = (id: string) => {
    const element = notificationElements.get(id)
    
    if (element) {
        // Apply exit animation
        element.style.opacity = '0'
        element.style.transform = 'translateX(20px)'
        
        // Remove after animation completes
        setTimeout(() => {
            notifications.value = notifications.value.filter(notification => notification.id !== id)
            notificationElements.delete(id)
        }, 300)
    } else {
        // Fallback if element reference isn't available
        notifications.value = notifications.value.filter(notification => notification.id !== id)
    }
}

// Update progress of notifications
if (import.meta.client) {
    let lastTimestamp = 0
    
    const updateProgress = (timestamp: number) => {
        const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 0
        lastTimestamp = timestamp
        
        notifications.value = notifications.value.map(notification => {
            // Skip processing for keepAlive notifications or those that are already complete
            if (notification.keepAlive || notification.progress >= 100) {
                return notification
            }
            
            // Calculate progress increment based on elapsed time and duration
            const progressIncrement = (deltaTime / notification.duration) * 100
            const newProgress = Math.min(notification.progress + progressIncrement, 100)
            
            // If notification has reached 100%, schedule its removal
            if (newProgress >= 100) {
                setTimeout(() => {
                    removeNotification(notification.id)
                }, 100) // Short delay before triggering exit animation
            }
            
            return {
                ...notification,
                progress: newProgress
            }
        })
        
        // Continue the animation loop
        requestAnimationFrame(updateProgress)
    }
    
    // Start the animation loop
    requestAnimationFrame(updateProgress)
}

export function useGlobalNotifications() {
    /**
     * Add a new notification
     */
    const addNotification = (options: NotificationOptions) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        const notification: Notification = {
            id,
            type: options.type,
            message: options.message,
            duration: options.duration || config.value.defaultDuration,
            keepAlive: options.keepAlive || false,
            createdAt: Date.now(),
            progress: 0
        }
        
        notifications.value.push(notification)
        
        // If we have more notifications than maxNotifications, remove the oldest
        if (notifications.value.length > config.value.maxNotifications) {
            const sortedNotifications = [...notifications.value].sort((a, b) => a.createdAt - b.createdAt)
            // Find oldest notification that is not keepAlive
            const oldestRemovable = sortedNotifications.find(n => !n.keepAlive)
            
            if (oldestRemovable) {
                removeNotification(oldestRemovable.id)
            }
        }
        
        return id
    }
    
    /**
     * Clear all notifications
     */
    const clearNotifications = () => {
        notifications.value = []
    }
    
    /**
     * Update global notification configuration
     */
    const updateConfig = (newConfig: Partial<NotificationConfig>) => {
        config.value = {
            ...config.value,
            ...newConfig
        }
    }
    
    /**
     * Convenience methods for different notification types
     */
    const success = (message: string, options?: Omit<NotificationOptions, 'type' | 'message'>) => {
        return addNotification({ type: 'success', message, ...options })
    }
    
    const error = (message: string, options?: Omit<NotificationOptions, 'type' | 'message'>) => {
        return addNotification({ type: 'error', message, ...options })
    }
    
    const warning = (message: string, options?: Omit<NotificationOptions, 'type' | 'message'>) => {
        return addNotification({ type: 'warning', message, ...options })
    }
    
    const info = (message: string, options?: Omit<NotificationOptions, 'type' | 'message'>) => {
        return addNotification({ type: 'info', message, ...options })
    }
    
    return {
        // State (readonly to prevent direct mutation)
        notifications: readonly(notifications),
        config: readonly(config),
        
        // Methods
        addNotification,
        removeNotification,
        clearNotifications,
        updateConfig,
        
        // Element registration for animations
        registerNotificationElement: (id: string, element: HTMLElement) => {
            notificationElements.set(id, element)
        },
        
        // Convenience methods
        success,
        error,
        warning,
        info
    }
}
