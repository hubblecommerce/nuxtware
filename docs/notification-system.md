# Notification System

This document provides detailed information about the global notification system in Nuxtware.

## Overview

The Nuxtware notification system provides a flexible way to display contextual messages to users. It supports different notification types, configurable positioning, auto-dismissal with progress indicators, and ensures accessibility.

## Components

### NotificationContainer

The main container component that positions and displays notifications.

**Key Features:**
- Responsive positioning for desktop and mobile
- Automatically adapts to screen size
- Configurable positioning (top/bottom, left/center/right)
- Manages stacking and overflow behavior

**Usage:**
```vue
<!-- Already included in default layout -->
<NotificationContainer />

<!-- Custom positioning -->
<NotificationContainer 
  position="bottom-right"
  mobilePosition="bottom"
/>
```

### NotificationItem

Displays individual notifications with type-specific styling.

**Key Features:**
- Type-specific styling (success, error, warning, info)
- Progress indicator for auto-dismissal
- Accessible close button
- Smooth entrance and exit animations

## Composable: useGlobalNotifications

The `useGlobalNotifications` composable provides methods to create, manage, and configure notifications.

### Basic Usage

```typescript
import { useGlobalNotifications } from '~/composables/useGlobalNotifications'

// In your component
const { success, error, warning, info } = useGlobalNotifications()

// Show a success notification
success('Operation completed successfully')

// Show an error notification
error('An error occurred while saving data')

// Show a warning notification with custom duration
warning('Your session will expire soon', { duration: 10000 })

// Show an info notification that won't auto-dismiss
info('New features available', { keepAlive: true })
```

### Configuration

```typescript
const { updateConfig } = useGlobalNotifications()

// Update global notification settings
updateConfig({
  defaultDuration: 8000,         // Duration in milliseconds
  defaultPosition: 'top-center', // Desktop position
  defaultMobilePosition: 'top',  // Mobile position
  maxNotifications: 3            // Maximum visible notifications
})
```

### Advanced Usage

```typescript
const { 
  addNotification, 
  removeNotification, 
  clearNotifications 
} = useGlobalNotifications()

// Create a custom notification
const id = addNotification({
  type: 'success',
  message: 'Custom notification',
  duration: 5000,
  keepAlive: false
})

// Remove a specific notification
removeNotification(id)

// Clear all notifications
clearNotifications()
```

## Theme Integration

The notification system utilizes the following theme colors:

```css
--color-success: /* Primary success color */
--color-success-light: /* Light background for success */
--color-error: /* Primary error color */
--color-error-light: /* Light background for error */
--color-warning: /* Primary warning color */
--color-warning-light: /* Light background for warning */
--color-info: /* Primary info color */
--color-info-light: /* Light background for info */
```

## Accessibility

The notification system follows accessibility best practices:

- Uses `aria-live="polite"` to announce notifications to screen readers
- Provides sufficient color contrast between text and background
- Includes keyboard-accessible close buttons
- Associates visual cues (icons) with notification types
- Ensures notifications are dismissible by users

## Best Practices

1. **Be concise:** Keep notification messages brief and focused
2. **Use appropriate types:** Match notification type to the context
   - Success: Completed actions, saved data
   - Error: Failed operations, validation problems
   - Warning: Important alerts, potential issues
   - Info: Neutral information, new features
3. **Set appropriate durations:** Balance visibility with intrusiveness
4. **Keep important notifications:** Use `keepAlive: true` for critical messages
5. **Provide actionable information:** Include clear next steps when appropriate
