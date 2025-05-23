# E-Commerce Components Guide

This document provides guidance on implementing e-commerce specific components in the Nuxtware project.

## Cart Components

The cart functionality consists of three main components:

### 1. CartSidenav

The main container component that displays the cart in a side overlay.

**Key Implementation Details:**
- Use the `SidenavOverlay` component as a wrapper
- Leverage the `useCart()` composable for all cart operations
- Handle multiple states gracefully:
  - Loading state
  - Error state (with multiple error messages)
  - Empty cart state
  - Populated cart state
- Include proper keyboard navigation with focus trap

**Example Usage:**
```vue
<CartSidenav v-model="showCartSidenav" />
```

### 2. CartItem

Displays individual items in the cart with quantity controls.

**Key Implementation Details:**
- Display product image, name, and price
- Use `getFormattedPrice()` for all price displays
- Implement quantity adjustment controls
- Include remove functionality
- Show variant options if available
- Use Foundation components for buttons and icons

**Example Usage:**
```vue
<CartItem
  :item="item"
  @update:quantity="(quantity) => changeProductQuantity({ id: item.id, quantity })"
  @remove="removeItem(item)"
/>
```

### 3. CartSummary

Displays the cart totals and checkout button.

**Key Implementation Details:**
- Show subtotal, shipping costs, and total
- Use `getFormattedPrice()` for all price displays
- Include checkout button
- Use proper theme tokens for borders and spacing

**Example Usage:**
```vue
<CartSummary 
  :cart="cart" 
  @checkout="handleCheckout"
/>
```

## Implementation Best Practices

### Cart Data Management

- Use the `useCart()` composable which provides:
  - `cart` - reactive cart data
  - `refreshCart()` - function to update cart data
  - `changeProductQuantity()` - function to update item quantity
  - `removeItem()` - function to remove an item
  - `consumeCartErrors()` - function to handle cart errors

### Internationalization

- Use `useLocalePath()` and `formatLink()` for navigation:
  ```js
  const localePath = useLocalePath()
  const { formatLink } = useInternationalization(localePath)
  
  // Usage:
  navigateTo(formatLink('/checkout'))
  ```

- Ensure all user-facing text uses translation keys:
  ```vue
  <span>{{ $t('cart.quantity') }}: {{ item.quantity }}</span>
  ```

### Foundation Components

- Use `FoundationButton` instead of plain buttons:
  ```vue
  <FoundationButton
    size="small"
    square
    :aria-label="$t('cart.remove')"
    @click="removeItem"
  >
    <FoundationIcon name="trash" class="w-2 h-2" aria-hidden="true" />
  </FoundationButton>
  ```

- Use `FoundationIcon` with proper accessibility:
  ```vue
  <FoundationIcon name="trash" class="w-2 h-2" aria-hidden="true" />
  ```

### Design System Integration

- Use theme tokens for colors and borders:
  ```vue
  <div class="border-t border-border my-2" />
  ```

- Use consistent spacing and sizing:
  ```vue
  <header class="flex items-center justify-between p-2 pr-0 border-b border-border">
  ```

### Error Handling

For cart operations, use the specialized cart error handling composables:

```typescript
// Initialize cart-specific error handling
const { getErrorsCodes } = useCartNotification()
const { resolveCartError } = useCartErrorParamsResolver()

// Handle cart operations
const handleAddToCart = async () => {
    try {
        await addToCart()
        
        // Check for cart-specific errors
        const errors = getErrorsCodes()
        
        if (errors && errors.length > 0) {
            // Process each error with cart-specific resolver
            for (const errorCode of errors) {
                const { messageKey, params } = resolveCartError(errorCode)
                error(t(`errors.${messageKey}`, params as Record<string, unknown>))
            }
        } else {
            // Success case
            success(t('cart.messages.addedToCart', { product: productName }))
        }
    } catch (e) {
        // Fallback for unexpected errors
        console.error('Unexpected error:', e)
        error(t('cart.messages.genericError'))
    }
}
```

For general API error handling (non-cart operations), use the generic error resolver:

```typescript
import { ApiClientError } from '@shopware/api-client'

// Initialize general error handling
const { resolveApiErrors } = useApiErrorsResolver()

// Handle general API operations
const handleApiOperation = async () => {
    try {
        await someApiOperation()
    } catch (e) {
        if (e instanceof ApiClientError && e.details?.errors) {
            const errors = resolveApiErrors(e.details.errors)
            errors.forEach((errorMessage) => {
                error(errorMessage)
            })
        }
    }
}
```

Display errors to users in a clear way:

```vue
<div v-if="errors?.length > 0" class="flex items-center justify-center flex-grow p-8 text-error">
  <template v-for="(error, errorIndex) in errors" :key="errorIndex">
    <p>{{ error }}</p>
  </template>
</div>
```

### Price Formatting

Always use the `getFormattedPrice` function from the `usePrice` composable to format prices properly:

```typescript
// Import the price formatter
const { getFormattedPrice } = usePrice()

// In your template
<span>{{ getFormattedPrice(cart.price?.totalPrice) }}</span>
```

This ensures consistent formatting with proper currency symbols and decimal places across the application.
